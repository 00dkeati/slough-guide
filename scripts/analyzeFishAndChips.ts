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
  photos: { photo_reference: string }[];
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: { weekday_text: string[] };
}

const chipShops = [
  { name: "Ossie's Fish Bar", query: "Ossie's Fish Bar Slough" },
  { name: "Fishcoteque", query: "Fishcoteque Slough" },
  { name: "Tasty Plaice", query: "Tasty Plaice Langley" },
  { name: "Harbourside Fish & Chips", query: "Harbourside Fish Chips Slough" },
  { name: "Ocean Blue", query: "Ocean Blue Fish Chips Slough" },
  { name: "Langley Fish Bar", query: "Langley Fish Bar" },
  { name: "Chalvey Fish Bar", query: "Chalvey Fish Bar" },
  { name: "Captain Cod", query: "Captain Cod Slough fish chips" },
  { name: "Horndean Fish Bar", query: "Horndean Fish Bar" },
  { name: "Golden Fry", query: "Golden Fry Slough fish chips" }
];

const positivePatterns = [
  /best (fish|chips|chippy)/gi,
  /highly recommend/gi,
  /fantastic|excellent|amazing|brilliant|delicious/gi,
  /friendly|welcoming/gi,
  /great (value|portions?|chips|fish|batter)/gi,
  /crispy|fresh|hot/gi,
  /generous (portions?)/gi,
  /traditional/gi,
  /always (good|great|fresh)/gi,
  /favourite|favorite/gi,
  /perfect/gi,
  /lovely/gi,
  /queue|busy/gi,
];

const negativePatterns = [
  /cold|soggy|greasy/gi,
  /disappointing|disappointed/gi,
  /expensive|overpriced/gi,
  /rude|unfriendly/gi,
  /small portions?/gi,
  /long wait/gi,
  /stale/gi,
  /avoid/gi,
  /worst/gi,
  /burnt/gi,
];

function fetch(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function searchPlace(query: string): Promise<string | null> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
  const data = await fetch(url);
  return data.results?.[0]?.place_id || null;
}

async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const fields = 'name,rating,user_ratings_total,reviews,photos,formatted_address,formatted_phone_number,website,opening_hours';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
  const data = await fetch(url);
  return data.result || null;
}

async function downloadPhoto(photoRef: string, filename: string): Promise<string> {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}`;
  const outputDir = path.join(process.cwd(), 'public/images/fish-chips');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const filepath = path.join(outputDir, filename);
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location!, (res) => {
          const fileStream = fs.createWriteStream(filepath);
          res.pipe(fileStream);
          fileStream.on('finish', () => { fileStream.close(); resolve(`/images/fish-chips/${filename}`); });
        }).on('error', reject);
      } else {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(); resolve(`/images/fish-chips/${filename}`); });
      }
    }).on('error', reject);
  });
}

function analyzeReviews(reviews: Review[]) {
  const highlightCounts = new Map<string, { count: number; examples: string[] }>();
  const lowlightCounts = new Map<string, { count: number; examples: string[] }>();
  
  for (const review of reviews) {
    const text = review.text;
    
    for (const pattern of positivePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          const key = match.toLowerCase();
          if (!highlightCounts.has(key)) highlightCounts.set(key, { count: 0, examples: [] });
          const entry = highlightCounts.get(key)!;
          entry.count++;
          if (entry.examples.length < 2) {
            const idx = text.toLowerCase().indexOf(key);
            entry.examples.push('...' + text.slice(Math.max(0, idx - 40), Math.min(text.length, idx + key.length + 40)) + '...');
          }
        }
      }
    }
    
    for (const pattern of negativePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches) {
          const key = match.toLowerCase();
          if (!lowlightCounts.has(key)) lowlightCounts.set(key, { count: 0, examples: [] });
          const entry = lowlightCounts.get(key)!;
          entry.count++;
          if (entry.examples.length < 2) {
            const idx = text.toLowerCase().indexOf(key);
            entry.examples.push('...' + text.slice(Math.max(0, idx - 40), Math.min(text.length, idx + key.length + 40)) + '...');
          }
        }
      }
    }
  }
  
  return {
    highlights: Array.from(highlightCounts.entries()).map(([phrase, data]) => ({ phrase, ...data })).sort((a, b) => b.count - a.count).slice(0, 8),
    lowlights: Array.from(lowlightCounts.entries()).map(([phrase, data]) => ({ phrase, ...data })).sort((a, b) => b.count - a.count).slice(0, 5),
    bestReviews: [...reviews].filter(r => r.rating === 5).sort((a, b) => b.text.length - a.text.length).slice(0, 2),
    worstReviews: [...reviews].filter(r => r.rating <= 2).sort((a, b) => b.text.length - a.text.length).slice(0, 2),
  };
}

async function analyzeShop(shop: typeof chipShops[0]) {
  console.log(`\nAnalyzing ${shop.name}...`);
  
  const placeId = await searchPlace(shop.query);
  if (!placeId) { console.log(`  Not found`); return null; }
  
  const details = await getPlaceDetails(placeId);
  if (!details) { console.log(`  No details`); return null; }
  
  console.log(`  Rating: ${details.rating}/5 (${details.user_ratings_total} reviews)`);
  
  const photos: string[] = [];
  if (details.photos?.length > 0) {
    const slug = shop.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    for (let i = 0; i < Math.min(2, details.photos.length); i++) {
      try {
        const photoPath = await downloadPhoto(details.photos[i].photo_reference, `${slug}-${i + 1}.jpg`);
        photos.push(photoPath);
        console.log(`  Downloaded photo ${i + 1}`);
      } catch (e) { console.log(`  Photo ${i + 1} failed`); }
    }
  }
  
  const analysis = analyzeReviews(details.reviews || []);
  
  return {
    name: shop.name,
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
  if (!API_KEY) { console.error('GOOGLE_PLACES_API_KEY not set'); process.exit(1); }
  
  console.log('=== Fish & Chips Analysis ===\n');
  const results = [];
  
  for (const shop of chipShops) {
    try {
      const analysis = await analyzeShop(shop);
      if (analysis) results.push(analysis);
      await new Promise(r => setTimeout(r, 500));
    } catch (e) { console.error(`Error: ${shop.name}`, e); }
  }
  
  // Sort by rating then reviews
  results.sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews);
  
  const outputPath = path.join(process.cwd(), 'data/fish-chips-analysis.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Saved to ${outputPath}`);
  
  console.log('\n=== Results ===\n');
  results.forEach((r, i) => {
    console.log(`${i + 1}. ${r.name} — ${r.rating}⭐ (${r.totalReviews} reviews)`);
  });
}

main();
