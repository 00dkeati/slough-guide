/**
 * Refresh Electrician Photos
 * Downloads fresh photos from Google Places API for electricians
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: GOOGLE_PLACES_API_KEY not set!');
  process.exit(1);
}

const OUTPUT_DIR = path.join(process.cwd(), 'public/images/electricians');
const BUSINESSES_FILE = path.join(process.cwd(), 'public/data/businesses.json');
const LIGHTWEIGHT_FILE = path.join(process.cwd(), 'public/data/businesses-lightweight.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created directory: ${OUTPUT_DIR}`);
}

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  google_place_id?: string;
  images?: string[];
}

// Download a photo from URL following redirects
async function downloadPhoto(photoUrl: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const makeRequest = (url: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        console.error(`❌ Too many redirects`);
        resolve(false);
        return;
      }

      const protocol = url.startsWith('https') ? https : http;
      
      protocol.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            makeRequest(redirectUrl, redirectCount + 1);
            return;
          }
        }
        
        if (response.statusCode !== 200) {
          console.error(`❌ HTTP ${response.statusCode}`);
          resolve(false);
          return;
        }
        
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
        
        fileStream.on('error', () => {
          fs.unlink(filepath, () => {});
          resolve(false);
        });
      }).on('error', () => {
        resolve(false);
      });
    };
    
    makeRequest(photoUrl);
  });
}

// Get fresh photo from Google Places
async function getFreshPhoto(placeId: string): Promise<string | null> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result?.photos?.[0]) {
      const photoRef = data.result.photos[0].photo_reference;
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${API_KEY}`;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function main() {
  console.log('🔌 Refreshing electrician photos...\n');
  
  const businesses: Business[] = JSON.parse(fs.readFileSync(BUSINESSES_FILE, 'utf8'));
  const lightweight: Business[] = JSON.parse(fs.readFileSync(LIGHTWEIGHT_FILE, 'utf8'));
  
  const electricians = businesses.filter(b => b.category === 'electricians');
  console.log(`Found ${electricians.length} electricians\n`);
  
  let downloaded = 0;
  let failed = 0;
  
  for (const biz of electricians) {
    console.log(`📷 ${biz.name}...`);
    
    const filename = `${biz.slug}.jpg`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const localPath = `/images/electricians/${filename}`;
    
    // Skip if already downloaded
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 1000) {
        console.log(`   ⏭️ Already exists`);
        // Update reference
        biz.images = [localPath];
        downloaded++;
        continue;
      }
    }
    
    // Try to get fresh photo
    if (biz.google_place_id) {
      const photoUrl = await getFreshPhoto(biz.google_place_id);
      if (photoUrl) {
        const success = await downloadPhoto(photoUrl, filepath);
        if (success) {
          console.log(`   ✅ Downloaded`);
          biz.images = [localPath];
          downloaded++;
        } else {
          console.log(`   ⚠️ Download failed`);
          biz.images = null; // Clear broken URL
          failed++;
        }
      } else {
        console.log(`   ⚠️ No photos available`);
        biz.images = null;
        failed++;
      }
    } else {
      console.log(`   ⚠️ No place_id`);
      biz.images = null;
      failed++;
    }
    
    // Rate limit
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Update lightweight file too
  for (const biz of lightweight) {
    if (biz.category === 'electricians') {
      const fullBiz = businesses.find(b => b.id === biz.id);
      if (fullBiz) {
        biz.images = fullBiz.images;
      }
    }
  }
  
  // Save updated files
  fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(businesses, null, 2));
  fs.writeFileSync(LIGHTWEIGHT_FILE, JSON.stringify(lightweight, null, 2));
  
  console.log(`\n✅ Done!`);
  console.log(`   Downloaded: ${downloaded}`);
  console.log(`   Failed/No photos: ${failed}`);
}

main();
