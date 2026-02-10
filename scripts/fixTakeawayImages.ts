/**
 * Fix Takeaway Images
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) { console.error('❌ GOOGLE_PLACES_API_KEY not set!'); process.exit(1); }

const OUTPUT_DIR = path.join(process.cwd(), 'public/images/takeaways');
const BUSINESSES_FILE = path.join(process.cwd(), 'public/data/businesses-lightweight.json');
const FULL_BUSINESSES_FILE = path.join(process.cwd(), 'public/data/businesses.json');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created: ${OUTPUT_DIR}`);
}

interface Business { id: string; name: string; slug: string; category: string; images?: string[]; [key: string]: any; }

function downloadPhoto(photoRef: string, filename: string): Promise<string | null> {
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${API_KEY}`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  if (fs.existsSync(filepath) && fs.statSync(filepath).size > 5000) {
    console.log(`⏭️  ${filename} exists`);
    return Promise.resolve(`/images/takeaways/${filename}`);
  }
  
  return new Promise((resolve) => {
    const follow = (url: string, redirects = 0) => {
      if (redirects > 5) { resolve(null); return; }
      const proto = url.startsWith('https') ? https : http;
      proto.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          if (res.headers.location) follow(res.headers.location, redirects + 1);
          else resolve(null);
          return;
        }
        if (res.statusCode !== 200) { console.log(`❌ HTTP ${res.statusCode}`); resolve(null); return; }
        const stream = fs.createWriteStream(filepath);
        res.pipe(stream);
        stream.on('finish', () => { stream.close(); console.log(`✅ ${filename}`); resolve(`/images/takeaways/${filename}`); });
        stream.on('error', () => resolve(null));
      }).on('error', () => resolve(null));
    };
    follow(photoUrl);
  });
}

async function getPlacePhoto(name: string, address?: string): Promise<string | null> {
  const query = `${name} ${address || 'Slough Berkshire'}`;
  const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,photos&key=${API_KEY}`;
  try {
    const res = await fetch(searchUrl);
    const data = await res.json();
    if (data.status === 'OK' && data.candidates?.[0]?.photos?.[0]) return data.candidates[0].photos[0].photo_reference;
    return null;
  } catch { return null; }
}

async function main() {
  console.log('🥡 Fixing takeaway images...\n');
  
  const businesses: Business[] = JSON.parse(fs.readFileSync(BUSINESSES_FILE, 'utf-8'));
  const fullBusinesses: Business[] = JSON.parse(fs.readFileSync(FULL_BUSINESSES_FILE, 'utf-8'));
  
  // Keywords for takeaway-style businesses
  const takeawayRegex = /chinese|dragon|oriental|wok|peking|palace|express|indian|cottage|shalimar|mela|kassia|tandoori|curry|kebab|pizza|fish|chip|fry|takeaway|grill/i;
  
  const takeaways = businesses.filter(b => 
    b.category === 'takeaways' || 
    b.category === 'fish-chips' || 
    (b.category === 'restaurants' && takeawayRegex.test(b.name))
  );
  
  console.log(`Found ${takeaways.length} takeaways\n`);
  
  let updated = 0;
  const seen = new Set<string>();
  
  for (const biz of takeaways) {
    const key = biz.name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    
    // Skip if already has local image
    if (biz.images?.[0]?.startsWith('/images/')) continue;
    
    console.log(`\n🔍 ${biz.name}`);
    
    const photoRef = await getPlacePhoto(biz.name, biz.address);
    if (!photoRef) { console.log(`   No photo found`); continue; }
    
    const filename = `${biz.slug}.jpg`;
    const localPath = await downloadPhoto(photoRef, filename);
    
    if (localPath) {
      businesses.forEach((b, idx) => { if (b.name === biz.name) businesses[idx].images = [localPath]; });
      fullBusinesses.forEach((b, idx) => { if (b.name === biz.name) fullBusinesses[idx].images = [localPath]; });
      updated++;
    }
    
    await new Promise(r => setTimeout(r, 250));
  }
  
  fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(businesses, null, 2));
  fs.writeFileSync(FULL_BUSINESSES_FILE, JSON.stringify(fullBusinesses, null, 2));
  
  console.log(`\n\n✅ Done! Updated ${updated} takeaways`);
}

main().catch(console.error);
