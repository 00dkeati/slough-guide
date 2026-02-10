const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Plumber businesses with their expected image filenames
const plumbers = [
  { name: 'Kingston Plumbing & Heating', location: 'Slough', filename: 'kingston-plumbing-heating.jpg' },
  { name: 'HW Heating', location: 'Slough', filename: 'hw-heating.jpg' },
  { name: 'H G Plumbing and Heating', location: 'Denmead', filename: 'hg-plumbing-heating.jpg' },
  { name: 'MacAulay Plumbing', location: 'Slough', filename: 'macaulay-plumbing.jpg' },
  { name: 'A.M.K. Boiler Service', location: 'Purbrook', filename: 'amk-boiler-service-slough.jpg' },
  { name: 'Panda Gas Services', location: 'Slough', filename: 'panda-gas-services.jpg' },
  { name: 'DM Gas And Heating LTD', location: 'Havant', filename: 'dm-gas-heating.jpg' },
  { name: 'JML Plumbing & Heating', location: 'Havant', filename: 'jml-plumbing-heating.jpg' },
  { name: 'Pompey Plumb Ltd', location: 'Portsmouth', filename: 'pompey-plumb.jpg' },
  { name: 'RMWS Plumbing & Heating', location: 'Portsmouth', filename: 'rmws-plumbing-heating.jpg' }
];

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function downloadImageWithRedirect(url, filepath, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const download = (currentUrl, redirectCount) => {
      const parsedUrl = new URL(currentUrl);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const request = protocol.get(currentUrl, (response) => {
        // Handle redirects
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          if (redirectCount >= maxRedirects) {
            reject(new Error('Too many redirects'));
            return;
          }
          
          const redirectUrl = response.headers.location.startsWith('http') 
            ? response.headers.location 
            : new URL(response.headers.location, currentUrl).href;
          
          console.log(`   ↪️  Following redirect to: ${redirectUrl.substring(0, 60)}...`);
          download(redirectUrl, redirectCount + 1);
          return;
        }
        
        // Download the actual image
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(filepath);
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(filepath);
          });
        } else {
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      });
      
      request.on('error', reject);
    };
    
    download(url, 0);
  });
}

async function fixPlumberImage(plumber) {
  console.log(`\n🔍 Searching for: ${plumber.name} in ${plumber.location}...`);
  
  try {
    // Search for the business
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(plumber.name + ' ' + plumber.location)}&key=${API_KEY}`;
    const searchResult = await httpsGet(searchUrl);
    
    if (!searchResult.results || searchResult.results.length === 0) {
      console.log(`❌ No results found for ${plumber.name}`);
      return { success: false, name: plumber.name, error: 'No results' };
    }
    
    const place = searchResult.results[0];
    console.log(`✅ Found: ${place.name}`);
    console.log(`   📍 ${place.formatted_address}`);
    
    // Get place details to get photos
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos&key=${API_KEY}`;
    const detailsResult = await httpsGet(detailsUrl);
    
    if (!detailsResult.result || !detailsResult.result.photos || detailsResult.result.photos.length === 0) {
      console.log(`❌ No photos found for ${plumber.name}`);
      return { success: false, name: plumber.name, error: 'No photos' };
    }
    
    const photoReference = detailsResult.result.photos[0].photo_reference;
    console.log(`📸 Got photo reference`);
    
    // Download the photo (with redirect following)
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoReference}&key=${API_KEY}`;
    const outputPath = path.join(__dirname, 'public/images/businesses', plumber.filename);
    
    await downloadImageWithRedirect(photoUrl, outputPath);
    
    // Verify it's a real JPEG
    const stats = fs.statSync(outputPath);
    const fileSize = stats.size;
    
    if (fileSize < 5000) {
      console.log(`⚠️  Warning: File size is only ${fileSize} bytes - might still be broken`);
      return { success: false, name: plumber.name, error: 'File too small', size: fileSize };
    }
    
    console.log(`✅ Downloaded: ${plumber.filename} (${Math.round(fileSize / 1024)}KB)`);
    return { success: true, name: plumber.name, filename: plumber.filename, size: fileSize };
    
  } catch (error) {
    console.log(`❌ Error processing ${plumber.name}: ${error.message}`);
    return { success: false, name: plumber.name, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting plumber image fix (with redirect handling)...\n');
  console.log('='.repeat(70));
  
  const results = [];
  
  for (const plumber of plumbers) {
    const result = await fixPlumberImage(plumber);
    results.push(result);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 FINAL REPORT\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successfully fixed: ${successful.length}/10`);
  successful.forEach(r => {
    console.log(`   - ${r.name}: ${r.filename} (${Math.round(r.size / 1024)}KB)`);
  });
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}/10`);
    failed.forEach(r => {
      console.log(`   - ${r.name}: ${r.error}${r.size ? ` (${r.size} bytes)` : ''}`);
    });
  }
  
  console.log('\n' + '='.repeat(70));
}

main();
