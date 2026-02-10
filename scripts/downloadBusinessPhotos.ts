/**
 * Download Business Photos from Google Places API
 * 
 * This script:
 * 1. Reads businesses from the database/JSON
 * 2. Fetches photos from Google Places API using place_id
 * 3. Downloads and saves them to /public/images/businesses/
 * 4. Updates the business records with local image paths
 * 
 * Usage: npx tsx scripts/downloadBusinessPhotos.ts
 * 
 * Requires: GOOGLE_PLACES_API_KEY in environment
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!API_KEY) {
  console.error('❌ Error: GOOGLE_PLACES_API_KEY not set!');
  console.log('Set it with: export GOOGLE_PLACES_API_KEY=your_key');
  process.exit(1);
}

const OUTPUT_DIR = path.join(process.cwd(), 'public/images/businesses');
const EDITORIAL_FILE = path.join(process.cwd(), 'data/editorial-articles.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created directory: ${OUTPUT_DIR}`);
}

interface PlacePhoto {
  photo_reference: string;
  height: number;
  width: number;
}

interface PlaceDetails {
  name: string;
  photos?: PlacePhoto[];
}

// Get place details including photos
async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,photos&key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      return data.result;
    }
    console.log(`⚠️ No details for place ${placeId}: ${data.status}`);
    return null;
  } catch (error) {
    console.error(`❌ Error fetching place ${placeId}:`, error);
    return null;
  }
}

// Download a photo from Google Places
async function downloadPhoto(photoReference: string, filename: string, maxWidth = 800): Promise<string | null> {
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  // Skip if already exists
  if (fs.existsSync(filepath)) {
    const stats = fs.statSync(filepath);
    if (stats.size > 1000) { // More than 1KB = probably valid
      console.log(`⏭️ Skipping ${filename} (already exists)`);
      return `/images/businesses/${filename}`;
    }
  }
  
  return new Promise((resolve) => {
    const makeRequest = (url: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        console.error(`❌ Too many redirects for ${filename}`);
        resolve(null);
        return;
      }

      const protocol = url.startsWith('https') ? https : http;
      
      protocol.get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 302 || response.statusCode === 301) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            makeRequest(redirectUrl, redirectCount + 1);
            return;
          }
        }
        
        if (response.statusCode !== 200) {
          console.error(`❌ HTTP ${response.statusCode} for ${filename}`);
          resolve(null);
          return;
        }
        
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve(`/images/businesses/${filename}`);
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete failed file
          console.error(`❌ Write error for ${filename}:`, err);
          resolve(null);
        });
      }).on('error', (err) => {
        console.error(`❌ Download error for ${filename}:`, err);
        resolve(null);
      });
    };
    
    makeRequest(photoUrl);
  });
}

// Create a slug from business name
function createSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// Main function to download photos for editorial article businesses
async function downloadEditorialPhotos() {
  console.log('🚀 Starting photo download for editorial articles...\n');
  
  // Read editorial articles
  const articles = JSON.parse(fs.readFileSync(EDITORIAL_FILE, 'utf-8'));
  
  // Collect all unique business references
  const businessSlugs = new Set<string>();
  for (const article of articles) {
    if (article.relatedBusinesses && Array.isArray(article.relatedBusinesses)) {
      article.relatedBusinesses.forEach((slug: string) => businessSlugs.add(slug));
    }
  }
  
  console.log(`📋 Found ${businessSlugs.size} unique businesses in editorial articles\n`);
  
  // For now, let's create a mapping file that you can fill in with place_ids
  const mappingFile = path.join(process.cwd(), 'data/business-place-ids.json');
  
  let placeIdMapping: Record<string, string> = {};
  if (fs.existsSync(mappingFile)) {
    placeIdMapping = JSON.parse(fs.readFileSync(mappingFile, 'utf-8'));
  } else {
    // Create template
    const template: Record<string, string> = {};
    businessSlugs.forEach(slug => {
      template[slug] = ''; // Fill in Google Place IDs
    });
    fs.writeFileSync(mappingFile, JSON.stringify(template, null, 2));
    console.log(`📝 Created template file: ${mappingFile}`);
    console.log('   Fill in Google Place IDs and run again.\n');
  }
  
  // Download photos for businesses with place_ids
  const downloaded: Record<string, string> = {};
  
  for (const [slug, placeId] of Object.entries(placeIdMapping)) {
    if (!placeId) continue;
    
    console.log(`\n🔍 Fetching photos for: ${slug}`);
    
    const details = await getPlaceDetails(placeId);
    if (!details || !details.photos || details.photos.length === 0) {
      console.log(`   No photos available`);
      continue;
    }
    
    // Download the first (best) photo
    const photo = details.photos[0];
    const filename = `${slug}.jpg`;
    const localPath = await downloadPhoto(photo.photo_reference, filename);
    
    if (localPath) {
      downloaded[slug] = localPath;
    }
    
    // Rate limiting - Google has quotas
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log('\n✅ Photo download complete!');
  console.log(`   Downloaded: ${Object.keys(downloaded).length} photos`);
  
  // Save the mapping of business slug -> local image path
  const imageMapping = path.join(process.cwd(), 'data/business-images.json');
  fs.writeFileSync(imageMapping, JSON.stringify(downloaded, null, 2));
  console.log(`\n📁 Image mapping saved to: ${imageMapping}`);
}

// Alternative: Download photos by searching for businesses
async function searchAndDownloadPhoto(businessName: string, area = 'Slough'): Promise<string | null> {
  const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(businessName + ' ' + area)}&inputtype=textquery&fields=place_id,name,photos&key=${API_KEY}`;
  
  try {
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    if (data.status === 'OK' && data.candidates && data.candidates[0]) {
      const place = data.candidates[0];
      
      if (place.photos && place.photos[0]) {
        const slug = createSlug(businessName);
        const filename = `${slug}.jpg`;
        return await downloadPhoto(place.photos[0].photo_reference, filename);
      }
    }
    return null;
  } catch (error) {
    console.error(`Error searching for ${businessName}:`, error);
    return null;
  }
}

// Run with search mode (searches by name, no place_id needed)
async function downloadBySearch() {
  console.log('🔍 Downloading photos by business name search...\n');
  
  const articles = JSON.parse(fs.readFileSync(EDITORIAL_FILE, 'utf-8'));
  const downloaded: Record<string, string> = {};
  
  for (const article of articles) {
    if (!article.relatedBusinesses) continue;
    
    console.log(`\n📰 Article: ${article.title}`);
    
    for (const slug of article.relatedBusinesses) {
      // Convert slug back to name
      const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      
      if (downloaded[slug]) {
        console.log(`   ⏭️ ${name} (already done)`);
        continue;
      }
      
      console.log(`   🔍 Searching: ${name}`);
      const localPath = await searchAndDownloadPhoto(name);
      
      if (localPath) {
        downloaded[slug] = localPath;
      }
      
      // Rate limiting
      await new Promise(r => setTimeout(r, 300));
    }
  }
  
  const imageMapping = path.join(process.cwd(), 'data/business-images.json');
  fs.writeFileSync(imageMapping, JSON.stringify(downloaded, null, 2));
  console.log(`\n✅ Done! Mapping saved to: ${imageMapping}`);
}

// Check command line args
const args = process.argv.slice(2);
if (args.includes('--search')) {
  downloadBySearch();
} else {
  downloadEditorialPhotos();
}
