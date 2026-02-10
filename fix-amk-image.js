const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

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
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          if (redirectCount >= maxRedirects) {
            reject(new Error('Too many redirects'));
            return;
          }
          
          const redirectUrl = response.headers.location.startsWith('http') 
            ? response.headers.location 
            : new URL(response.headers.location, currentUrl).href;
          
          download(redirectUrl, redirectCount + 1);
          return;
        }
        
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

async function main() {
  console.log('🔍 Attempting to find A.M.K. Boiler Service with alternative search...\n');
  
  // Try different search queries
  const searches = [
    'AMK Boiler Service Purbrook',
    'A M K Boiler Service Slough',
    'AMK plumbing heating Purbrook'
  ];
  
  for (const query of searches) {
    console.log(`Trying: "${query}"`);
    
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;
    const searchResult = await httpsGet(searchUrl);
    
    if (searchResult.results && searchResult.results.length > 0) {
      for (let i = 0; i < Math.min(3, searchResult.results.length); i++) {
        const place = searchResult.results[i];
        console.log(`  Found: ${place.name} - ${place.formatted_address}`);
        
        // Get details
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos,website&key=${API_KEY}`;
        const detailsResult = await httpsGet(detailsUrl);
        
        if (detailsResult.result && detailsResult.result.photos && detailsResult.result.photos.length > 0) {
          console.log(`  ✅ Has ${detailsResult.result.photos.length} photos!`);
          
          // Get the first photo
          const photoReference = detailsResult.result.photos[0].photo_reference;
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoReference}&key=${API_KEY}`;
          const outputPath = path.join(__dirname, 'public/images/businesses', 'amk-boiler-service-slough.jpg');
          
          await downloadImageWithRedirect(photoUrl, outputPath);
          
          const stats = fs.statSync(outputPath);
          console.log(`  ✅ Downloaded: ${Math.round(stats.size / 1024)}KB\n`);
          
          return;
        }
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n❌ Could not find photos for A.M.K. Boiler Service');
  console.log('Will create a generic plumbing image placeholder...\n');
  
  // Create a generic plumbing image search
  const genericSearch = 'plumber tools work professional Slough UK';
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(genericSearch)}&key=${API_KEY}`;
  const searchResult = await httpsGet(searchUrl);
  
  if (searchResult.results && searchResult.results.length > 0) {
    // Find a plumber with photos
    for (const place of searchResult.results.slice(0, 10)) {
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=photos,types&key=${API_KEY}`;
      const detailsResult = await httpsGet(detailsUrl);
      
      if (detailsResult.result && detailsResult.result.photos && detailsResult.result.photos.length > 0) {
        // Check if it's a plumber
        if (detailsResult.result.types && detailsResult.result.types.includes('plumber')) {
          console.log(`Using photo from: ${place.name}`);
          
          const photoReference = detailsResult.result.photos[0].photo_reference;
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoReference}&key=${API_KEY}`;
          const outputPath = path.join(__dirname, 'public/images/businesses', 'amk-boiler-service-slough.jpg');
          
          await downloadImageWithRedirect(photoUrl, outputPath);
          
          const stats = fs.statSync(outputPath);
          console.log(`✅ Downloaded generic plumbing image: ${Math.round(stats.size / 1024)}KB\n`);
          
          return;
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

main().catch(console.error);
