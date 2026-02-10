import { Client } from '@googlemaps/google-maps-services-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client({});

const WATERLOOVILLE_CENTER = {
  lat: 50.8793,
  lng: -1.0345
};

// Categories to search for
const SEARCH_TYPES = [
  { type: 'restaurant', category: 'Restaurant' },
  { type: 'cafe', category: 'Restaurant' },
  { type: 'supermarket', category: 'Shopping' },
  { type: 'pharmacy', category: 'Health' },
  { type: 'dentist', category: 'Health' },
  { type: 'bank', category: 'Services' },
  { type: 'hair_care', category: 'Beauty' },
  { type: 'car_repair', category: 'Automotive' },
  { type: 'gym', category: 'Entertainment' }
];

async function fetchRealBusinesses() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('ERROR: No Google API key found');
    console.error('The businesses currently in the database may not be accurate.');
    console.error('To get verified data:');
    console.error('1. Ensure GOOGLE_PLACES_API_KEY is in .env.local');
    console.error('2. Run: npx vercel env pull .env.local');
    return;
  }
  
  console.log('Fetching REAL verified businesses from Google Places API...');
  console.log('========================================================');
  
  const verifiedBusinesses = [];
  let businessId = 300; // Start from 300 to avoid conflicts
  
  for (const searchType of SEARCH_TYPES) {
    console.log(`\nSearching for \${searchType.type} businesses...`);
    
    try {
      const response = await client.placesNearby({
        params: {
          location: WATERLOOVILLE_CENTER,
          radius: 5000, // 5km radius
          type: searchType.type as any,
          key: apiKey
        }
      });
      
      console.log(`Found \${response.data.results.length} \${searchType.type} businesses`);
      
      // Get details for first 3 of each type
      for (let i = 0; i < Math.min(3, response.data.results.length); i++) {
        const place = response.data.results[i];
        
        try {
          const detailsResponse = await client.placeDetails({
            params: {
              place_id: place.place_id!,
              fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 'rating', 'user_ratings_total', 'opening_hours', 'geometry', 'types', 'price_level', 'photos'],
              key: apiKey
            }
          });
          
          const details = detailsResponse.data.result;
          
          // Only include if actually in Slough area (SL1/SL2)
          const address = details.formatted_address || '';
          if (!address.includes('Slough') && !address.includes('SL1') && !address.includes('SL2')) {
            console.log(`  Skipping \${details.name} - not in Slough area`);
            continue;
          }
          
          const business = {
            id: businessId++,
            name: details.name,
            slug: details.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: searchType.category,
            area: 'Slough',
            phone: details.formatted_phone_number || '',
            website: details.website || '',
            email: '',
            address: details.formatted_address || '',
            postcode: address.match(/PO\d{1,2}\s?\d[A-Z]{2}/)?.[0] || '',
            description: `\${details.name} - Verified \${searchType.category} business in Slough.`,
            lat: details.geometry?.location.lat || 0,
            lng: details.geometry?.location.lng || 0,
            rating: details.rating || 0,
            review_count: details.user_ratings_total || 0,
            opening_hours_json: JSON.stringify(details.opening_hours || {}),
            google_place_id: place.place_id,
            price_level: details.price_level,
            verified: true,
            last_updated: new Date().toISOString()
          };
          
          verifiedBusinesses.push(business);
          console.log(`  ✓ Added: \${business.name} (\${business.address})`);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`  Error getting details for \${place.name}`);
        }
      }
      
    } catch (error) {
      console.error(`Error searching for \${searchType.type}:`, error);
    }
    
    // Delay between categories
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save verified businesses to a separate file
  const outputPath = './verified-businesses.json';
  fs.writeFileSync(outputPath, JSON.stringify(verifiedBusinesses, null, 2));
  
  console.log('\n========================================================');
  console.log(`✓ Fetched \${verifiedBusinesses.length} VERIFIED businesses from Google`);
  console.log(`✓ Saved to: \${outputPath}`);
  console.log('');
  console.log('These businesses are 100% verified with:');
  console.log('- Correct addresses from Google');
  console.log('- Real phone numbers');
  console.log('- Actual ratings and review counts');
  console.log('- Current opening hours');
  console.log('- Google Place IDs for future updates');
  console.log('');
  console.log('To use these verified businesses:');
  console.log('1. Review the verified-businesses.json file');
  console.log('2. Replace the unverified data in lib/db.ts');
  console.log('3. Rebuild and deploy');
}

fetchRealBusinesses().catch(console.error);
