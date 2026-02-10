import { Client } from '@googlemaps/google-maps-services-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = new Client({});

// Slough coordinates
const WATERLOOVILLE_CENTER = {
  lat: 50.8793,
  lng: -1.0345
};

async function testGoogleAPI() {
  console.log('🔍 Testing Google Places API for Slough businesses...\n');
  
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: GOOGLE_PLACES_API_KEY not found in .env.local');
    process.exit(1);
  }
  
  console.log('✅ API Key found\n');
  
  try {
    // Test: Search for restaurants in Slough
    console.log('📍 Searching for restaurants near Slough center...');
    
    const nearbySearch = await client.placesNearby({
      params: {
        location: WATERLOOVILLE_CENTER,
        radius: 3000, // 3km radius
        type: 'restaurant',
        key: apiKey
      }
    });
    
    console.log(`Found \${nearbySearch.data.results.length} restaurants\n`);
    
    // Display first 3 results
    console.log('Top 3 Restaurants:');
    console.log('================');
    
    for (let i = 0; i < Math.min(3, nearbySearch.data.results.length); i++) {
      const place = nearbySearch.data.results[i];
      console.log(`\n\${i + 1}. \${place.name}`);
      console.log(`   📍 \${place.vicinity}`);
      console.log(`   ⭐ Rating: \${place.rating || 'N/A'} (\${place.user_ratings_total || 0} reviews)`);
    }
    
    console.log('\n✅ API test completed successfully!');
    console.log('You can now sync businesses to your directory.');
    
  } catch (error: any) {
    console.error('\n❌ Error testing API:', error.response?.data || error.message);
    
    if (error.response?.data?.error_message) {
      console.error('API Error Message:', error.response.data.error_message);
      
      if (error.response.data.error_message.includes('API key')) {
        console.error('\n⚠️  Check that your API key has the following APIs enabled:');
        console.error('   - Places API');
        console.error('   - Maps JavaScript API');
      }
    }
  }
}

// Run the test
testGoogleAPI();
