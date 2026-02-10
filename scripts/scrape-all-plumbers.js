#!/usr/bin/env node
/**
 * Comprehensive Plumber Scraper for Slough.co
 * Scrapes plumbers from all surrounding areas
 */

require('dotenv').config({ path: require('path').join(process.env.HOME, '.clawdbot/.env') });

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error('❌ GOOGLE_PLACES_API_KEY not set');
  process.exit(1);
}

// All areas to search - comprehensive coverage
const SEARCH_AREAS = [
  { name: 'Slough', lat: 50.8803, lng: -1.0306 },
  { name: 'Horndean', lat: 50.9167, lng: -0.9833 },
  { name: 'Cowplain', lat: 50.8967, lng: -1.0167 },
  { name: 'Denmead', lat: 50.9083, lng: -1.0833 },
  { name: 'Purbrook', lat: 50.8667, lng: -1.0333 },
  { name: 'Havant', lat: 50.8517, lng: -0.9833 },
  { name: 'Leigh Park', lat: 50.8617, lng: -0.9667 },
  { name: 'Emsworth', lat: 50.8467, lng: -0.9367 },
  { name: 'Clanfield', lat: 50.9333, lng: -1.0167 },
  { name: 'Lovedean', lat: 50.9083, lng: -1.0083 },
  { name: 'Cosham', lat: 50.8417, lng: -1.0667 },
  { name: 'Drayton', lat: 50.8583, lng: -1.0167 },
  { name: 'Farlington', lat: 50.8450, lng: -1.0333 },
  { name: 'Portchester', lat: 50.8417, lng: -1.1167 },
  { name: 'Fareham', lat: 50.8517, lng: -1.1833 },
  { name: 'Bedhampton', lat: 50.8550, lng: -0.9917 },
  { name: 'Rowlands Castle', lat: 50.8917, lng: -0.9583 },
  { name: 'Petersfield', lat: 51.0000, lng: -0.9333 }
];

const allPlumbers = new Map(); // Using Map to dedupe by place_id

async function searchPlumbers(location, radius = 8000) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('location', `${location.lat},${location.lng}`);
  url.searchParams.set('radius', radius);
  url.searchParams.set('keyword', 'plumber');
  url.searchParams.set('type', 'plumber');
  
  let allResults = [];
  let pageToken = null;
  let page = 1;
  
  do {
    if (pageToken) {
      url.searchParams.set('pagetoken', pageToken);
      // Google requires delay between pagination requests
      await new Promise(r => setTimeout(r, 2000));
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error(`  ⚠️ API error for ${location.name}: ${data.status}`);
      break;
    }
    
    if (data.results) {
      allResults = allResults.concat(data.results);
      console.log(`  Page ${page}: ${data.results.length} results`);
    }
    
    pageToken = data.next_page_token;
    page++;
  } while (pageToken && page <= 3); // Max 3 pages (60 results per location)
  
  return allResults;
}

async function getPlaceDetails(placeId) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,formatted_phone_number,international_phone_number,formatted_address,rating,user_ratings_total,website,reviews,url,types,opening_hours');
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status === 'OK') {
    return data.result;
  }
  return null;
}

function isMobileNumber(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\s+/g, '');
  return cleaned.startsWith('07') || cleaned.startsWith('+447');
}

function createSlug(name, area) {
  return (name + ' ' + area)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('🔧 PLUMBER FACTORY - Scraping all local plumbers\n');
  console.log(`Searching ${SEARCH_AREAS.length} areas...\n`);
  
  // Phase 1: Search all areas
  for (const area of SEARCH_AREAS) {
    console.log(`📍 ${area.name}:`);
    const results = await searchPlumbers(area);
    
    for (const place of results) {
      if (!allPlumbers.has(place.place_id)) {
        allPlumbers.set(place.place_id, {
          place_id: place.place_id,
          name: place.name,
          rating: place.rating,
          reviews: place.user_ratings_total,
          vicinity: place.vicinity,
          foundIn: area.name
        });
      }
    }
    
    console.log(`  Total unique: ${allPlumbers.size}\n`);
    
    // Small delay between area searches
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n✅ Found ${allPlumbers.size} unique plumbers\n`);
  
  // Phase 2: Get details for each (with mobile filter)
  console.log('📞 Getting contact details...\n');
  
  const plumbersWithMobile = [];
  const plumbersWithLandline = [];
  const plumbersNoPhone = [];
  
  let processed = 0;
  for (const [placeId, basic] of allPlumbers) {
    processed++;
    
    // Skip if too few reviews
    if (basic.reviews < 3) {
      console.log(`⏭️  ${basic.name} - Only ${basic.reviews || 0} reviews, skipping`);
      continue;
    }
    
    const details = await getPlaceDetails(placeId);
    if (!details) {
      console.log(`❌ ${basic.name} - Failed to get details`);
      continue;
    }
    
    const phone = details.formatted_phone_number;
    const area = basic.vicinity?.split(',')[0] || basic.foundIn;
    
    const plumber = {
      place_id: placeId,
      slug: createSlug(basic.name, area),
      name: basic.name,
      phone: phone || null,
      area: area,
      fullAddress: details.formatted_address,
      rating: details.rating,
      reviews: details.user_ratings_total,
      website: details.website || null,
      googleUrl: details.url,
      review1: details.reviews?.[0]?.text?.substring(0, 300) || '',
      review2: details.reviews?.[1]?.text?.substring(0, 300) || '',
      review3: details.reviews?.[2]?.text?.substring(0, 300) || ''
    };
    
    if (isMobileNumber(phone)) {
      plumbersWithMobile.push(plumber);
      console.log(`📱 ${basic.name} - ${phone} ✅`);
    } else if (phone) {
      plumbersWithLandline.push(plumber);
      console.log(`☎️  ${basic.name} - ${phone} (landline)`);
    } else {
      plumbersNoPhone.push(plumber);
      console.log(`❓ ${basic.name} - No phone`);
    }
    
    // Rate limiting
    if (processed % 10 === 0) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  // Save all data
  const outputDir = path.join(__dirname, '../data');
  
  fs.writeFileSync(
    path.join(outputDir, 'plumbers-with-mobile.json'),
    JSON.stringify(plumbersWithMobile, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'plumbers-with-landline.json'),
    JSON.stringify(plumbersWithLandline, null, 2)
  );
  
  fs.writeFileSync(
    path.join(outputDir, 'plumbers-all.json'),
    JSON.stringify([...plumbersWithMobile, ...plumbersWithLandline, ...plumbersNoPhone], null, 2)
  );
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`📱 Plumbers with mobile: ${plumbersWithMobile.length}`);
  console.log(`☎️  Plumbers with landline: ${plumbersWithLandline.length}`);
  console.log(`❓ Plumbers without phone: ${plumbersNoPhone.length}`);
  console.log(`📁 Total: ${plumbersWithMobile.length + plumbersWithLandline.length + plumbersNoPhone.length}`);
  console.log('='.repeat(60));
  console.log('\nFiles saved:');
  console.log('  • data/plumbers-with-mobile.json');
  console.log('  • data/plumbers-with-landline.json');
  console.log('  • data/plumbers-all.json');
}

main().catch(console.error);
