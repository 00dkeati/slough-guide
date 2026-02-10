import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

function httpGet(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
    }).on('error', reject);
  });
}

async function searchNearby(query: string): Promise<any[]> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=50.8833,-1.0333&radius=8000&key=${API_KEY}`;
  const data = await httpGet(url);
  return data.results || [];
}

async function getPlaceDetails(placeId: string) {
  const fields = 'name,rating,user_ratings_total,reviews,photos,formatted_address,formatted_phone_number,website,opening_hours';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`;
  const data = await httpGet(url);
  return data.result || null;
}

async function downloadPhoto(photoRef: string, filename: string): Promise<string> {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${API_KEY}`;
  const outputDir = path.join(process.cwd(), 'public/images/pubs');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const filepath = path.join(outputDir, filename);
  
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const loc = response.headers.location;
      if (loc) {
        https.get(loc, (res) => {
          const fileStream = fs.createWriteStream(filepath);
          res.pipe(fileStream);
          fileStream.on('finish', () => { fileStream.close(); resolve(`/images/pubs/${filename}`); });
        }).on('error', reject);
      } else {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => { fileStream.close(); resolve(`/images/pubs/${filename}`); });
      }
    }).on('error', reject);
  });
}

const positivePatterns = [/great (pub|atmosphere|beer|food|roast|garden)/gi, /friendly|welcoming/gi, /lovely|cosy|cozy/gi, /fantastic|excellent|amazing|brilliant/gi, /best pub/gi, /good (beer|selection|food)/gi, /real ale/gi, /dog friendly/gi, /nice garden/gi];
const negativePatterns = [/disappointing/gi, /expensive|overpriced/gi, /rude|unfriendly/gi, /slow service/gi, /cold food/gi, /avoid/gi, /worst/gi, /noisy|loud/gi];

function analyzeReviews(reviews: any[]) {
  const highlights: any[] = [];
  const lowlights: any[] = [];
  
  for (const review of reviews) {
    const text = review.text || '';
    for (const p of positivePatterns) {
      const m = text.match(p);
      if (m) m.forEach((match: string) => {
        const existing = highlights.find(h => h.phrase === match.toLowerCase());
        if (existing) existing.count++;
        else highlights.push({ phrase: match.toLowerCase(), count: 1, example: text.slice(0, 120) });
      });
    }
    for (const p of negativePatterns) {
      const m = text.match(p);
      if (m) m.forEach((match: string) => {
        const existing = lowlights.find(h => h.phrase === match.toLowerCase());
        if (existing) existing.count++;
        else lowlights.push({ phrase: match.toLowerCase(), count: 1, example: text.slice(0, 120) });
      });
    }
  }
  
  return {
    highlights: highlights.sort((a, b) => b.count - a.count).slice(0, 6),
    lowlights: lowlights.sort((a, b) => b.count - a.count).slice(0, 4),
    bestReviews: reviews.filter(r => r.rating === 5).sort((a, b) => (b.text?.length || 0) - (a.text?.length || 0)).slice(0, 2),
    worstReviews: reviews.filter(r => r.rating <= 2).slice(0, 2)
  };
}

async function main() {
  if (!API_KEY) { console.error('No API key'); process.exit(1); }
  
  console.log('=== Searching for pubs near Slough ===\n');
  
  const results = await searchNearby('pub Slough Berkshire');
  console.log(`Found ${results.length} results\n`);
  
  const localPostcodes = ['SL1', 'SL2', 'PO9'];
  const localResults = results.filter((r: any) => {
    const addr = r.formatted_address || '';
    return localPostcodes.some(pc => addr.includes(pc));
  });
  
  console.log(`${localResults.length} are in local area\n`);
  
  const analyzed = [];
  
  for (const place of localResults.slice(0, 12)) {
    console.log(`Analyzing ${place.name}...`);
    const details = await getPlaceDetails(place.place_id);
    if (!details || !details.rating) { console.log('  Skipped'); continue; }
    
    console.log(`  ${details.rating}⭐ (${details.user_ratings_total} reviews)`);
    
    const photos: string[] = [];
    if (details.photos?.length > 0) {
      const slug = place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 25);
      for (let i = 0; i < Math.min(2, details.photos.length); i++) {
        try {
          const p = await downloadPhoto(details.photos[i].photo_reference, `${slug}-${i + 1}.jpg`);
          photos.push(p);
        } catch (e) {}
      }
    }
    
    const analysis = analyzeReviews(details.reviews || []);
    
    analyzed.push({
      name: details.name,
      rating: details.rating,
      totalReviews: details.user_ratings_total,
      address: details.formatted_address,
      phone: details.formatted_phone_number,
      website: details.website,
      hours: details.opening_hours?.weekday_text,
      photos,
      ...analysis
    });
    
    await new Promise(r => setTimeout(r, 300));
  }
  
  analyzed.sort((a, b) => b.rating - a.rating || b.totalReviews - a.totalReviews);
  
  fs.writeFileSync('data/pubs-analysis.json', JSON.stringify(analyzed, null, 2));
  console.log('\n✅ Saved to data/pubs-analysis.json');
  console.log('\n=== Rankings ===\n');
  analyzed.forEach((r, i) => console.log(`${i + 1}. ${r.name} — ${r.rating}⭐ (${r.totalReviews})`));
}

main();
