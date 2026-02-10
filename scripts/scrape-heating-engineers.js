#!/usr/bin/env node
/**
 * Expand plumber search with heating/gas engineer keywords
 */

require('dotenv').config({ path: require('path').join(process.env.HOME, '.clawdbot/.env') });

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const SEARCH_AREAS = [
  { name: 'Slough', lat: 50.8803, lng: -1.0306 },
  { name: 'Horndean', lat: 50.9167, lng: -0.9833 },
  { name: 'Havant', lat: 50.8517, lng: -0.9833 },
  { name: 'Cosham', lat: 50.8417, lng: -1.0667 },
  { name: 'Fareham', lat: 50.8517, lng: -1.1833 },
  { name: 'Petersfield', lat: 51.0000, lng: -0.9333 },
  { name: 'Chichester', lat: 50.8365, lng: -0.7792 },
  { name: 'Portsmouth', lat: 50.8198, lng: -1.0880 }
];

const KEYWORDS = ['heating engineer', 'gas engineer', 'boiler repair', 'boiler service'];

// Load existing plumbers to avoid duplicates
const existingPath = path.join(__dirname, '../data/plumbers-all.json');
const existing = fs.existsSync(existingPath) ? JSON.parse(fs.readFileSync(existingPath, 'utf8')) : [];
const existingIds = new Set(existing.map(p => p.place_id));

const newPlumbers = new Map();

async function searchPlaces(location, keyword, radius = 10000) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('location', `${location.lat},${location.lng}`);
  url.searchParams.set('radius', radius);
  url.searchParams.set('keyword', keyword);
  
  let allResults = [];
  let pageToken = null;
  
  do {
    if (pageToken) {
      url.searchParams.set('pagetoken', pageToken);
      await new Promise(r => setTimeout(r, 2000));
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.results) {
      allResults = allResults.concat(data.results);
    }
    
    pageToken = data.next_page_token;
  } while (pageToken);
  
  return allResults;
}

async function getPlaceDetails(placeId) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/details/json');
  url.searchParams.set('key', API_KEY);
  url.searchParams.set('place_id', placeId);
  url.searchParams.set('fields', 'name,formatted_phone_number,formatted_address,rating,user_ratings_total,website,reviews,url');
  
  const response = await fetch(url);
  const data = await response.json();
  return data.status === 'OK' ? data.result : null;
}

function isMobileNumber(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\s+/g, '');
  return cleaned.startsWith('07') || cleaned.startsWith('+447');
}

function createSlug(name, area) {
  return (name + ' ' + area).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log('🔥 HEATING ENGINEER EXPANSION SCRAPE\n');
  
  for (const keyword of KEYWORDS) {
    console.log(`\n🔍 Keyword: "${keyword}"`);
    
    for (const area of SEARCH_AREAS) {
      const results = await searchPlaces(area, keyword);
      
      for (const place of results) {
        if (!existingIds.has(place.place_id) && !newPlumbers.has(place.place_id)) {
          newPlumbers.set(place.place_id, {
            place_id: place.place_id,
            name: place.name,
            rating: place.rating,
            reviews: place.user_ratings_total,
            vicinity: place.vicinity,
            keyword: keyword
          });
        }
      }
      
      console.log(`  ${area.name}: ${results.length} results, ${newPlumbers.size} new total`);
      await new Promise(r => setTimeout(r, 300));
    }
  }
  
  console.log(`\n✅ Found ${newPlumbers.size} NEW businesses not in plumber list\n`);
  
  if (newPlumbers.size === 0) {
    console.log('No new businesses to process.');
    return;
  }
  
  // Get details for new businesses
  console.log('📞 Getting contact details...\n');
  
  const withMobile = [];
  const withLandline = [];
  
  for (const [placeId, basic] of newPlumbers) {
    if (basic.reviews < 3) {
      console.log(`⏭️  ${basic.name} - ${basic.reviews || 0} reviews, skipping`);
      continue;
    }
    
    const details = await getPlaceDetails(placeId);
    if (!details) continue;
    
    const phone = details.formatted_phone_number;
    const area = basic.vicinity?.split(',')[0] || 'Slough area';
    
    const business = {
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
      review3: details.reviews?.[2]?.text?.substring(0, 300) || '',
      sourceKeyword: basic.keyword
    };
    
    if (isMobileNumber(phone)) {
      withMobile.push(business);
      console.log(`📱 ${basic.name} - ${phone} ✅`);
    } else if (phone) {
      withLandline.push(business);
      console.log(`☎️  ${basic.name} - ${phone}`);
    }
    
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Save additional businesses
  fs.writeFileSync(
    path.join(__dirname, '../data/heating-engineers-mobile.json'),
    JSON.stringify(withMobile, null, 2)
  );
  
  fs.writeFileSync(
    path.join(__dirname, '../data/heating-engineers-landline.json'),
    JSON.stringify(withLandline, null, 2)
  );
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 ADDITIONAL BUSINESSES FOUND');
  console.log('='.repeat(50));
  console.log(`📱 With mobile: ${withMobile.length}`);
  console.log(`☎️  With landline: ${withLandline.length}`);
  console.log('='.repeat(50));
}

main().catch(console.error);
