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

interface RestaurantAnalysis {
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

const restaurants = [
  { name: "Kassia Lounge", query: "Kassia Lounge Cippenham Indian" },
  { name: "Cardamom", query: "Cardamom Clanfield Indian restaurant" },
  { name: "Red Rose Lounge", query: "Red Rose Lounge Slough Indian" },
  { name: "Lovedean Tandoori", query: "Lovedean Tandoori" },
  { name: "Shalimar", query: "Shalimar Slough Indian" },
  { name: "Milton Tandoori", query: "Milton Tandoori Slough" },
  { name: "Paprika", query: "Paprika Horndean Indian restaurant" },
  { name: "Massalla Hut", query: "Massalla Hut Slough" },
  { name: "Pasha Restaurant", query: "Pasha Restaurant Slough Indian" },
  { name: "Flavour Fiesta", query: "Flavour Fiesta Slough" }
];

// Food-specific positive patterns
const positivePatterns = [
  /best (indian|curry|food|meal|takeaway|restaurant)/gi,
  /highly recommend/gi,
  /won't go anywhere else/gi,
  /fantastic|excellent|amazing|brilliant|superb|delicious/gi,
  /friendly|welcoming|professional/gi,
  /great (atmosphere|service|food|value|portions?)/gi,
  /perfect (every time|meal|curry)/gi,
  /authentic|genuine|traditional/gi,
  /generous (portions?)/gi,
  /fresh (ingredients?|food)/gi,
  /flavour|flavorful|tasty/gi,
  /never disappoints?/gi,
  /always (good|great|excellent|perfect)/gi,
  /love (this|the|their)/gi,
  /favourite|favorite/gi,
  /consistent(ly)?/gi,
  /reasonable (price|prices|priced)/gi,
  /good value/gi,
  /quick (delivery|service)/gi,
  /hot (food|when arrived)/gi,
  /special (dish|meal)/gi,
  /lamb|chicken|tikka|korma|biryani|naan|samosa/gi,
];

// Food-specific negative patterns
const negativePatterns = [
  /long wait|waiting (too|for ages)/gi,
  /cold (food|when arrived)/gi,
  /disappointing|disappointed/gi,
  /expensive|overpriced/gi,
  /rude|unfriendly|attitude/gi,
  /won't (be )?return/gi,
  /bland|tasteless|no flavour/gi,
  /greasy|oily/gi,
  /small portions?/gi,
  /wrong order/gi,
  /slow (service|delivery)/gi,
  /wouldn't recommend/gi,
  /not (great|good|what expected)/gi,
  /avoid/gi,
  /worst/gi,
  /food poisoning|ill|sick after/gi,
  /stale/gi,
  /reheated/gi,
  /undercooked|overcooked/gi,
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
  const outputDir = path.join(process.cwd(), 'public/images/indian');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const filepath = path.join(outputDir, filename);
  
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location!, (res) => {
          const fileStream = fs.createWriteStream(filepath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve(`/images/indian/${filename}`);
          });
        }).on('error', reject);
      } else {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(`/images/indian/${filename}`);
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
  const highlightCounts = new Map<string, { count: number; examples: string[] }>();
  const lowlightCounts = new Map<string, { count: number; examples: string[] }>();
  const positiveWords = new Map<string, number>();
  const negativeWords = new Map<string, number>();
  
  for (const review of reviews) {
    const text = review.text;
    const isPositive = review.rating >= 4;
    const isNegative = review.rating <= 2;
    
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
    
    const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 4);
    for (const word of words) {
      if (isPositive) positiveWords.set(word, (positiveWords.get(word) || 0) + 1);
      if (isNegative) negativeWords.set(word, (negativeWords.get(word) || 0) + 1);
    }
  }
  
  const stopWords = new Set(['really', 'always', 'would', 'could', 'there', 'their', 'about', 'which', 'these', 'other', 'after', 'before', 'being', 'where', 'having', 'going', 'first', 'every', 'years', 'place', 'order', 'ordered', 'indian', 'restaurant', 'takeaway']);
  
  return {
    highlights: Array.from(highlightCounts.entries())
      .map(([phrase, data]) => ({ phrase, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    lowlights: Array.from(lowlightCounts.entries())
      .map(([phrase, data]) => ({ phrase, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    commonPraise: Array.from(positiveWords.entries())
      .filter(([w]) => !stopWords.has(w))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([w]) => w),
    commonCriticism: Array.from(negativeWords.entries())
      .filter(([w]) => !stopWords.has(w))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([w]) => w),
    bestReviews: [...reviews].filter(r => r.rating === 5).sort((a, b) => b.text.length - a.text.length).slice(0, 3),
    worstReviews: [...reviews].filter(r => r.rating <= 2).sort((a, b) => b.text.length - a.text.length).slice(0, 3),
  };
}

async function analyzeRestaurant(restaurant: typeof restaurants[0]): Promise<RestaurantAnalysis | null> {
  console.log(`\nAnalyzing ${restaurant.name}...`);
  
  const placeId = await searchPlace(restaurant.query);
  if (!placeId) {
    console.log(`  Could not find place for ${restaurant.name}`);
    return null;
  }
  console.log(`  Found place ID: ${placeId}`);
  
  const details = await getPlaceDetails(placeId);
  if (!details) {
    console.log(`  Could not get details for ${restaurant.name}`);
    return null;
  }
  console.log(`  Rating: ${details.rating}/5 (${details.user_ratings_total} reviews)`);
  
  const photos: string[] = [];
  if (details.photos && details.photos.length > 0) {
    const photoCount = Math.min(3, details.photos.length);
    console.log(`  Downloading ${photoCount} photos...`);
    for (let i = 0; i < photoCount; i++) {
      const slug = restaurant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
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
  
  const reviews = details.reviews || [];
  console.log(`  Analyzing ${reviews.length} reviews...`);
  const analysis = analyzeReviews(reviews);
  
  return {
    name: restaurant.name,
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
  
  console.log('=== Indian Restaurant Analysis ===\n');
  
  const results: RestaurantAnalysis[] = [];
  
  for (const restaurant of restaurants) {
    try {
      const analysis = await analyzeRestaurant(restaurant);
      if (analysis) {
        results.push(analysis);
      }
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`Error analyzing ${restaurant.name}:`, e);
    }
  }
  
  const outputPath = path.join(process.cwd(), 'data/indian-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Analysis saved to ${outputPath}`);
  
  console.log('\n=== Summary ===\n');
  for (const result of results) {
    console.log(`${result.name}`);
    console.log(`  Rating: ${result.rating}/5 (${result.totalReviews} reviews)`);
    console.log(`  Photos: ${result.photos.length}`);
    if (result.highlights.length > 0) {
      console.log(`  Highlights: ${result.highlights.slice(0, 3).map(h => h.phrase).join(', ')}`);
    }
    if (result.lowlights.length > 0) {
      console.log(`  Concerns: ${result.lowlights.slice(0, 3).map(l => l.phrase).join(', ')}`);
    }
    console.log();
  }
}

main();
