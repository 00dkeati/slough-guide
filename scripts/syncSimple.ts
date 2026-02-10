import { Client } from '@googlemaps/google-maps-services-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = new Client({});

const WATERLOOVILLE_CENTER = {
  lat: 50.8793,
  lng: -1.0345
};

// Quick sync for testing
async function quickSync() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: GOOGLE_PLACES_API_KEY not found');
    process.exit(1);
  }
  
  console.log('🔍 Quick sync of Slough businesses...\n');
  
  const businesses: any[] = [];
  
  // Search for restaurants
  const response = await client.placesNearby({
    params: {
      location: WATERLOOVILLE_CENTER,
      radius: 3000,
      type: 'restaurant',
      key: apiKey
    }
  });
  
  console.log(`Found \${response.data.results.length} restaurants`);
  
  // Get details for first 5
  for (let i = 0; i < Math.min(5, response.data.results.length); i++) {
    const place = response.data.results[i];
    
    // Get detailed info
    const details = await client.placeDetails({
      params: {
        place_id: place.place_id!,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 'rating', 'user_ratings_total', 'geometry'],
        key: apiKey
      }
    });
    
    const biz = {
      id: i + 100, // Start at 100 to avoid conflicts
      name: details.data.result.name,
      address: details.data.result.formatted_address,
      phone: details.data.result.formatted_phone_number || '',
      website: details.data.result.website || '',
      rating: details.data.result.rating || 0,
      review_count: details.data.result.user_ratings_total || 0,
      lat: details.data.result.geometry?.location.lat,
      lng: details.data.result.geometry?.location.lng,
      google_place_id: place.place_id
    };
    
    businesses.push(biz);
    console.log(`Added: \${biz.name}`);
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Save to a JSON file for review
  fs.writeFileSync(
    'google-businesses.json',
    JSON.stringify(businesses, null, 2)
  );
  
  console.log('\n✅ Saved to google-businesses.json');
  console.log('Review the file and manually add to your lib/db.ts');
}

quickSync().catch(console.error);
