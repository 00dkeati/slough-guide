import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

interface Review {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description: string;
}

interface PlaceDetails {
  name: string;
  rating: number;
  user_ratings_total: number;
  reviews: Review[];
  photos: { photo_reference: string; height: number; width: number }[];
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: { weekday_text: string[] };
}

interface BarberAnalysis {
  name: string;
  placeId: string;
  rating: number;
  totalReviews: number;
  address: string;
  phone?: string;
  website?: string;
  hours?: string[];
  photos: string[];
  highlights: { phrase: string; count: number; examples: string[] }[];
  lowlights: { phrase: string; count: number; examples: string[] }[];
  bestReviews: Review[];
  worstReviews: Review[];
  commonPraise: string[];
  commonCriticism: string[];
}

const barbers = [
  { name: "Studio H", query: "Studio H Horndean barber" },
  { name: "JC Barbering", query: "JC Barbering Slough" },
  { name: "The Langley Barber Shop", query: "The Langley Barber Shop" },
  { name: "L.A. Barbers", query: "L.A. Barbers Widley Slough" },
  { name: "Jay's Barbers", query: "Jay's Barbers Langley" },
  { name: "Gino's", query: "Gino's Barbers Langley Slough" },
  { name: "Uppercutz", query: "Uppercutz Barbers Chalvey" }
];

// Common positive phrases to look for
const positivePatterns = [
  /always (happy|satisfied|pleased)/gi,
  /best (barber|haircut|cut|fade)/gi,
  /highly recommend/gi,
  /won't go anywhere else/gi,
  /fantastic|excellent|amazing|brilliant|superb/gi,
  /friendly|welcoming|professional/gi,
  /great (atmosphere|service|chat|price|value)/gi,
  /perfect (every time|cut|fade)/gi,
  /attention to detail/gi,
  /listens? (to what|carefully)/gi,
  /exactly what (I|you) want/gi,
  /knows? (what|how)/gi,
  /patient|patience/gi,
  /clean|hygienic/gi,
  /on time|punctual/gi,
  /easy (to book|booking)/gi,
  /reasonable (price|prices)/gi,
  /skilled|talented/gi,
  /comfortable|relaxed/gi,
  /modern|trendy|stylish/gi
];

// Common negative phrases to look for
const negativePatterns = [
  /long wait|waiting (too|for ages)/gi,
  /rushed|hurried/gi,
  /didn't listen/gi,
  /not what I (asked|wanted)/gi,
  /expensive|overpriced/gi,
  /rude|unfriendly|attitude/gi,
  /won't (be )?return/gi,
  /disappointed|disappointing/gi,
  /messy|unclean|dirty/gi,
  /inconsistent/gi,
  /different every time/gi,
  /had to go back|fix/gi,
  /wouldn't recommend/gi,
  /not great|not good|mediocre/gi,
  /avoid/gi,
  /worst/gi
];

function fetch(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function searchPlace(query: string): Promise<string | null> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
  const data = await fetch(url);
  if (data.results && data.results.length > 0) {
    return data.results[0].place_id;
  }
  return null;
}

async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const fields = 'name,rating,user_ratings_total,reviews,photos,formatted_address,formatted_phone_number,website,opening_hours';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
  const data = await fetch(url);
  if (data.result) {
    return data.result as PlaceDetails;
  }
  return null;
}

async function downloadPhoto(photoRef: string, filename: string): Promise<string> {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}`;
  const outputDir = path.join(process.cwd(), 'public/images/barbers');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const filepath = path.join(outputDir, filename);
  
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      // Follow redirect
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location!, (res) => {
          const fileStream = fs.createWriteStream(filepath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(`/images/barbers/${filename}`);
          });
        }).on('error', reject);
      } else {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(`/images/barbers/${filename}`);
        });
      }
    });
    request.on('error', reject);
  });
}

function analyzeReviews(reviews: Review[]): {
  highlights: { phrase: string; count: number; examples: string[] }[];
  lowlights: { phrase: string; count: number; examples: string[] }[];
  commonPraise: string[];
  commonCriticism: string[];
  bestReviews: Review[];
  worstReviews: Review[];
} {
  const highlightCounts: Map<string, { count: number; examples: string[] }> = new Map();
  const lowlightCounts: Map<string, { count: number; examples: string[] }> = new Map();
  
  // Word frequency for natural language extraction
  const positiveWords: Map<string, number> = new Map();
  const negativeWords: Map<string, number> = new Map();
  
  for (const review of reviews) {
    const text = review.text;
    const isPositive = review.rating >= 4;
    const isNegative = review.rating <= 2;
    
    // Check for pattern matches
    for (const pattern of positivePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          const key = match.toLowerCase();
          if (!highlightCounts.has(key)) {
            highlightCounts.set(key, { count: 0, examples: [] });
          }
          const entry = highlightCounts.get(key)!;
          entry.count++;
          if (entry.examples.length < 3) {
            // Get surrounding context
            const idx = text.toLowerCase().indexOf(key);
            const start = Math.max(0, idx - 50);
            const end = Math.min(text.length, idx + key.length + 50);
            entry.examples.push('...' + text.slice(start, end) + '...');
          }
        }
      }
    }
    
    for (const pattern of negativePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          const key = match.toLowerCase();
          if (!lowlightCounts.has(key)) {
            lowlightCounts.set(key, { count: 0, examples: [] });
          }
          const entry = lowlightCounts.get(key)!;
          entry.count++;
          if (entry.examples.length < 3) {
            const idx = text.toLowerCase().indexOf(key);
            const start = Math.max(0, idx - 50);
            const end = Math.min(text.length, idx + key.length + 50);
            entry.examples.push('...' + text.slice(start, end) + '...');
          }
        }
      }
    }
    
    // Extract key phrases based on rating
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 4);
    for (const word of words) {
      if (isPositive) {
        positiveWords.set(word, (positiveWords.get(word) || 0) + 1);
      }
      if (isNegative) {
        negativeWords.set(word, (negativeWords.get(word) || 0) + 1);
      }
    }
  }
  
  // Sort and format results
  const highlights = Array.from(highlightCounts.entries())
    .map(([phrase, data]) => ({ phrase, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const lowlights = Array.from(lowlightCounts.entries())
    .map(([phrase, data]) => ({ phrase, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  // Get most common positive/negative words
  const stopWords = new Set(['really', 'always', 'would', 'could', 'there', 'their', 'about', 'which', 'these', 'other', 'after', 'before', 'being', 'where', 'having', 'going', 'first', 'every', 'years', 'place']);
  
  const commonPraise = Array.from(positiveWords.entries())
    .filter(([w, _]) => !stopWords.has(w))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w, _]) => w);
  
  const commonCriticism = Array.from(negativeWords.entries())
    .filter(([w, _]) => !stopWords.has(w))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w, _]) => w);
  
  // Best and worst reviews
  const sortedReviews = [...reviews].sort((a, b) => b.text.length - a.text.length);
  const bestReviews = sortedReviews.filter(r => r.rating === 5).slice(0, 3);
  const worstReviews = sortedReviews.filter(r => r.rating <= 2).slice(0, 3);
  
  return { highlights, lowlights, commonPraise, commonCriticism, bestReviews, worstReviews };
}

async function analyzeBarber(barber: typeof barbers[0]): Promise<BarberAnalysis | null> {
  console.log(`\nAnalyzing ${barber.name}...`);
  
  const placeId = await searchPlace(barber.query);
  if (!placeId) {
    console.log(`  Could not find place for ${barber.name}`);
    return null;
  }
  console.log(`  Found place ID: ${placeId}`);
  
  const details = await getPlaceDetails(placeId);
  if (!details) {
    console.log(`  Could not get details for ${barber.name}`);
    return null;
  }
  console.log(`  Rating: ${details.rating}/5 (${details.user_ratings_total} reviews)`);
  
  // Download photos
  const photos: string[] = [];
  if (details.photos && details.photos.length > 0) {
    const photoCount = Math.min(3, details.photos.length);
    console.log(`  Downloading ${photoCount} photos...`);
    for (let i = 0; i < photoCount; i++) {
      const slug = barber.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const filename = `${slug}-${i + 1}.jpg`;
      try {
        const photoPath = await downloadPhoto(details.photos[i].photo_reference, filename);
        photos.push(photoPath);
        console.log(`    Downloaded: ${filename}`);
      } catch (e) {
        console.log(`    Failed to download photo ${i + 1}`);
      }
    }
  }
  
  // Analyze reviews
  const reviews = details.reviews || [];
  console.log(`  Analyzing ${reviews.length} reviews...`);
  const analysis = analyzeReviews(reviews);
  
  return {
    name: barber.name,
    placeId,
    rating: details.rating,
    totalReviews: details.user_ratings_total,
    address: details.formatted_address,
    phone: details.formatted_phone_number,
    website: details.website,
    hours: details.opening_hours?.weekday_text,
    photos,
    ...analysis
  };
}

async function main() {
  if (!API_KEY) {
    console.error('GOOGLE_PLACES_API_KEY not set');
    process.exit(1);
  }
  
  console.log('=== Barber Review Analysis ===\n');
  
  const results: BarberAnalysis[] = [];
  
  for (const barber of barbers) {
    try {
      const analysis = await analyzeBarber(barber);
      if (analysis) {
        results.push(analysis);
      }
      // Rate limiting
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`Error analyzing ${barber.name}:`, e);
    }
  }
  
  // Save results
  const outputPath = path.join(process.cwd(), 'data/barber-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Analysis saved to ${outputPath}`);
  
  // Print summary
  console.log('\n=== Summary ===\n');
  for (const result of results) {
    console.log(`${result.name}`);
    console.log(`  Rating: ${result.rating}/5 (${result.totalReviews} reviews)`);
    console.log(`  Photos: ${result.photos.length}`);
    console.log(`  Top highlights: ${result.highlights.slice(0, 3).map(h => h.phrase).join(', ')}`);
    if (result.lowlights.length > 0) {
      console.log(`  Concerns: ${result.lowlights.slice(0, 3).map(l => l.phrase).join(', ')}`);
    }
    console.log();
  }
}

main();
