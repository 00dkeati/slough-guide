/**
 * Fix Restaurant Images
 * Downloads fresh photos from Google Places and updates the businesses JSON
 * 
 * Usage: GOOGLE_PLACES_API_KEY=xxx npx tsx scripts/fixRestaurantImages.ts
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error('❌ GOOGLE_PLACES_API_KEY not set!');
  process.exit(1);
}

const OUTPUT_DIR = path.join(process.cwd(), 'public/images/restaurants');
const BUSINESSES_FILE = path.join(process.cwd(), 'public/data/businesses-lightweight.json');
const FULL_BUSINESSES_FILE = path.join(process.cwd(), 'public/data/businesses.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created: ${OUTPUT_DIR}`);
}

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  google_place_id?: string;
  images?: string[];
  [key: string]: any;
}

// Download photo following redirects
function downloadPhoto(photoRef: string, filename: string): Promise<string | null> {
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${API_KEY}`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  // Skip if exists and valid
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    if (stats.size > 5000) {
      console.log(`⏭️  ${filename} exists`);
      return Promise.resolve(`/images/restaurants/${filename}`);
    }
  }
  
  return new Promise((resolve) => {
    const follow = (url: string, redirects = 0) => {
      if (redirects > 5) {
        resolve(null);
        return;
      }
      
      const proto = url.startsWith('https') ? https : http;
      proto.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          if (res.headers.location) {
            follow(res.headers.location, redirects + 1);
          } else {
            resolve(null);
          }
          return;
        }
        
        if (res.statusCode !== 200) {
          console.log(`❌ HTTP ${res.statusCode} for ${filename}`);
          resolve(null);
          return;
        }
        
        const stream = fs.createWriteStream(filepath);
        res.pipe(stream);
        stream.on('finish', () => {
          stream.close();
          console.log(`✅ ${filename}`);
          resolve(`/images/restaurants/${filename}`);
        });
        stream.on('error', () => resolve(null));
      }).on('error', () => resolve(null));
    };
    
    follow(photoUrl);
  });
}

// Search for a business and get fresh photo reference
async function getPlacePhoto(name: string, address?: string): Promise<string | null> {
  const query = `${name} ${address || 'Slough'}`;
  const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,photos&key=${API_KEY}`;
  
  try {
    const res = await fetch(searchUrl);
    const data = await res.json();
    
    if (data.status === 'OK' && data.candidates?.[0]?.photos?.[0]) {
      return data.candidates[0].photos[0].photo_reference;
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  console.log('🍽️  Fixing restaurant images...\n');
  
  // Load businesses
  const businesses: Business[] = JSON.parse(fs.readFileSync(BUSINESSES_FILE, 'utf-8'));
  const fullBusinesses: Business[] = JSON.parse(fs.readFileSync(FULL_BUSINESSES_FILE, 'utf-8'));
  
  // Filter restaurants
  const restaurants = businesses.filter(b => b.category === 'restaurants');
  console.log(`Found ${restaurants.length} restaurants\n`);
  
  let updated = 0;
  
  for (const biz of restaurants) {
    console.log(`\n🔍 ${biz.name}`);
    
    // Get fresh photo reference
    const photoRef = await getPlacePhoto(biz.name, biz.address);
    
    if (!photoRef) {
      console.log(`   No photo found`);
      continue;
    }
    
    // Download it
    const filename = `${biz.slug}.jpg`;
    const localPath = await downloadPhoto(photoRef, filename);
    
    if (localPath) {
      // Update both JSON files
      const lightIdx = businesses.findIndex(b => b.id === biz.id);
      const fullIdx = fullBusinesses.findIndex(b => b.id === biz.id);
      
      if (lightIdx >= 0) {
        businesses[lightIdx].images = [localPath];
      }
      if (fullIdx >= 0) {
        fullBusinesses[fullIdx].images = [localPath];
      }
      updated++;
    }
    
    // Rate limit
    await new Promise(r => setTimeout(r, 250));
  }
  
  // Save updated JSON
  fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(businesses, null, 2));
  fs.writeFileSync(FULL_BUSINESSES_FILE, JSON.stringify(fullBusinesses, null, 2));
  
  console.log(`\n\n✅ Done! Updated ${updated}/${restaurants.length} restaurants`);
  console.log(`\nNow run: npx vercel --prod --yes`);
}

main().catch(console.error);
