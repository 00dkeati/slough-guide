/**
 * Download business photos from Google Places API
 * Run with: npx tsx scripts/download-business-photos.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

interface Business {
  id: string;
  name: string;
  slug: string;
  placeId: string;
  category: string;
  photos?: string[];
}

async function getPlaceDetails(placeId: string): Promise<string[]> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.result?.photos) {
      return data.result.photos.slice(0, 3).map((p: any) => p.photo_reference);
    }
    return [];
  } catch (error) {
    console.error(`Error fetching details for ${placeId}:`, error);
    return [];
  }
}

async function downloadPhoto(photoRef: string, outputPath: string): Promise<boolean> {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`;
  
  return new Promise((resolve) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      // Follow redirect
      if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          https.get(redirectUrl, (res) => {
            res.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve(true);
            });
          }).on('error', () => resolve(false));
        } else {
          resolve(false);
        }
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      }
    }).on('error', () => resolve(false));
  });
}

async function main() {
  if (!GOOGLE_API_KEY) {
    console.error('GOOGLE_PLACES_API_KEY not set!');
    process.exit(1);
  }
  
  // Load businesses
  const businessesPath = path.join(process.cwd(), 'data', 'slough-businesses.json');
  const businesses: Business[] = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'));
  
  console.log(`Processing ${businesses.length} businesses...`);
  
  // Create images directory
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'businesses');
  fs.mkdirSync(imagesDir, { recursive: true });
  
  let processed = 0;
  let downloaded = 0;
  
  for (const biz of businesses) {
    if (!biz.placeId) continue;
    
    // Get photo references
    const photoRefs = await getPlaceDetails(biz.placeId);
    
    if (photoRefs.length > 0) {
      const photos: string[] = [];
      
      for (let i = 0; i < photoRefs.length; i++) {
        const filename = `${biz.slug}-${i + 1}.jpg`;
        const outputPath = path.join(imagesDir, filename);
        
        // Skip if already exists
        if (fs.existsSync(outputPath)) {
          photos.push(`/images/businesses/${filename}`);
          continue;
        }
        
        const success = await downloadPhoto(photoRefs[i], outputPath);
        if (success) {
          photos.push(`/images/businesses/${filename}`);
          downloaded++;
        }
        
        // Rate limit
        await new Promise(r => setTimeout(r, 100));
      }
      
      biz.photos = photos;
    }
    
    processed++;
    if (processed % 50 === 0) {
      console.log(`Processed ${processed}/${businesses.length}, downloaded ${downloaded} photos`);
    }
    
    // Rate limit between businesses
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Save updated businesses
  fs.writeFileSync(businessesPath, JSON.stringify(businesses, null, 2));
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'data', 'businesses.json'),
    JSON.stringify(businesses, null, 2)
  );
  
  console.log(`\nDone! Processed ${processed} businesses, downloaded ${downloaded} new photos`);
}

main().catch(console.error);
