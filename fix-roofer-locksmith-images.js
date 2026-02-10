const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Roofer businesses
const roofers = [
  { name: 'D C Roofing & Sons LTD', location: 'Slough', filename: 'd-c-roofing-sons-ltd.jpg' },
  { name: 'J P Williams Roofing', location: 'Slough', filename: 'j-p-williams-roofing.jpg' },
  { name: 'Bakes Roofing', location: 'Portsmouth', filename: 'bakes-roofing.jpg' },
  { name: 'G&T Roofing & Building Specialist Ltd', location: 'Portsmouth', filename: 'g-t-roofing-building-specialist-ltd.jpg' },
  { name: 'Meter Squared Roofing & Guttering Ltd', location: 'Portsmouth', filename: 'meter-squared-roofing-guttering-ltd.jpg' },
  { name: 'K & S Roofing Ltd', location: 'Portsmouth', filename: 'k-s-roofing-ltd.jpg' },
  { name: 'J and A Roofing Specialists', location: 'Portsmouth', filename: 'j-and-a-roofing-specialists.jpg' },
  { name: 'DL Roofing Specialists', location: 'Portsmouth', filename: 'dl-roofing-specialists.jpg' },
  { name: 'OC Roofing Contractors', location: 'Portsmouth', filename: 'oc-roofing-contractors.jpg' },
  { name: 'JH Roofing', location: 'Portsmouth', filename: 'jh-roofing.jpg' }
];

// Locksmith businesses
const locksmiths = [
  { name: 'Lock-on Security', location: 'Slough', filename: 'lock-on-security.jpg' },
  { name: 'Britannia Master Locksmiths', location: 'Slough', filename: 'britannia-master-locksmiths.jpg' },
  { name: 'EA Locksmiths Portsmouth', location: 'Portsmouth', filename: 'ea-locksmiths-portsmouth.jpg' },
  { name: 'Southern Auto Locks', location: 'Portsmouth', filename: 'southern-auto-locks.jpg' },
  { name: 'Auto Locksmith Rescue', location: 'Portsmouth', filename: 'auto-locksmith-rescue.jpg' },
  { name: 'SO Locksmiths Ltd', location: 'Portsmouth', filename: 'so-locksmiths.jpg' },
  { name: 'All Keyed Up Automotive', location: 'Portsmouth', filename: 'all-keyed-up-locksmith.jpg' },
  { name: 'Sameday Locksmiths', location: 'Portsmouth', filename: 'sameday-locksmiths.jpg' },
  { name: 'Solent Mobile Locksmiths', location: 'Portsmouth', filename: 'solent-mobile-locksmiths.jpg' },
  { name: 'Lockbusters Locksmiths', location: 'Portsmouth', filename: 'lockbusters-locksmiths.jpg' }
];

const allBusinesses = [
  ...roofers.map(b => ({ ...b, category: 'ROOFER' })),
  ...locksmiths.map(b => ({ ...b, category: 'LOCKSMITH' }))
];

function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse JSON response'));
        }
      });
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

async function fixBusinessImage(business) {
  console.log(`\n🔍 [${business.category}] Searching for: ${business.name} in ${business.location}...`);
  
  try {
    // Search for the business
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(business.name + ' ' + business.location)}&key=${API_KEY}`;
    const searchResult = await httpsGet(searchUrl);
    
    if (!searchResult.results || searchResult.results.length === 0) {
      console.log(`❌ No results found for ${business.name}`);
      return { success: false, name: business.name, category: business.category, error: 'No results' };
    }
    
    const place = searchResult.results[0];
    console.log(`✅ Found: ${place.name}`);
    console.log(`   📍 ${place.formatted_address}`);
    
    // Get place details to get photos
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos&key=${API_KEY}`;
    const detailsResult = await httpsGet(detailsUrl);
    
    if (!detailsResult.result || !detailsResult.result.photos || detailsResult.result.photos.length === 0) {
      console.log(`❌ No photos found for ${business.name}`);
      return { success: false, name: business.name, category: business.category, error: 'No photos' };
    }
    
    const photoReference = detailsResult.result.photos[0].photo_reference;
    console.log(`📸 Got photo reference`);
    
    // Download the photo (with redirect following)
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoReference}&key=${API_KEY}`;
    const outputPath = path.join(__dirname, 'public/images/businesses', business.filename);
    
    await downloadImageWithRedirect(photoUrl, outputPath);
    
    // Verify it's a real JPEG
    const stats = fs.statSync(outputPath);
    const fileSize = stats.size;
    
    if (fileSize < 5000) {
      console.log(`⚠️  Warning: File size is only ${fileSize} bytes - might still be broken`);
      return { success: false, name: business.name, category: business.category, error: 'File too small', size: fileSize };
    }
    
    console.log(`✅ Downloaded: ${business.filename} (${Math.round(fileSize / 1024)}KB)`);
    return { success: true, name: business.name, category: business.category, filename: business.filename, size: fileSize };
    
  } catch (error) {
    console.log(`❌ Error processing ${business.name}: ${error.message}`);
    return { success: false, name: business.name, category: business.category, error: error.message };
  }
}

async function main() {
  console.log('🚀 Starting ROOFER & LOCKSMITH image fix...\n');
  console.log('='.repeat(70));
  console.log(`Total businesses to fix: ${allBusinesses.length}`);
  console.log(`   - Roofers: ${roofers.length}`);
  console.log(`   - Locksmiths: ${locksmiths.length}`);
  console.log('='.repeat(70));
  
  const results = [];
  
  for (const business of allBusinesses) {
    const result = await fixBusinessImage(business);
    results.push(result);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n📊 FINAL REPORT\n');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  // Group by category
  const rooferResults = results.filter(r => r.category === 'ROOFER');
  const locksmithResults = results.filter(r => r.category === 'LOCKSMITH');
  
  const successfulRoofers = rooferResults.filter(r => r.success);
  const successfulLocksmiths = locksmithResults.filter(r => r.success);
  
  console.log(`✅ Successfully fixed: ${successful.length}/20`);
  console.log(`   - Roofers: ${successfulRoofers.length}/10`);
  console.log(`   - Locksmiths: ${successfulLocksmiths.length}/10`);
  
  console.log('\n🏗️  ROOFERS:');
  rooferResults.forEach(r => {
    if (r.success) {
      console.log(`   ✅ ${r.name}: ${r.filename} (${Math.round(r.size / 1024)}KB)`);
    } else {
      console.log(`   ❌ ${r.name}: ${r.error}${r.size ? ` (${r.size} bytes)` : ''}`);
    }
  });
  
  console.log('\n🔐 LOCKSMITHS:');
  locksmithResults.forEach(r => {
    if (r.success) {
      console.log(`   ✅ ${r.name}: ${r.filename} (${Math.round(r.size / 1024)}KB)`);
    } else {
      console.log(`   ❌ ${r.name}: ${r.error}${r.size ? ` (${r.size} bytes)` : ''}`);
    }
  });
  
  if (failed.length > 0) {
    console.log(`\n⚠️  Failed businesses: ${failed.length}`);
  }
  
  console.log('\n' + '='.repeat(70));
  
  // Return exit code based on success
  process.exit(failed.length > 0 ? 1 : 0);
}

main();
