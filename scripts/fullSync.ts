import { Client } from '@googlemaps/google-maps-services-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = new Client({});

const WATERLOOVILLE_CENTER = {
  lat: 50.8793,
  lng: -1.0345
};

const BUSINESS_TYPES = [
  'restaurant',
  'cafe', 
  'supermarket',
  'pharmacy',
  'dentist',
  'doctor',
  'hair_care',
  'car_repair',
  'gas_station',
  'bank'
];

async function fullSync() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('ERROR: No API key found. Please add GOOGLE_PLACES_API_KEY to .env.local');
    process.exit(1);
  }
  
  console.log('Starting full Slough business sync...');
  
  const allBusinesses: any[] = [];
  let businessId = 100;
  
  for (const type of BUSINESS_TYPES) {
    console.log(`\nFetching \${type} businesses...`);
    
    try {
      const response = await client.placesNearby({
        params: {
          location: WATERLOOVILLE_CENTER,
          radius: 4000,
          type: type as any,
          key: apiKey
        }
      });
      
      console.log(`Found \${response.data.results.length} \${type} businesses`);
      
      for (const place of response.data.results.slice(0, 3)) {
        try {
          const details = await client.placeDetails({
            params: {
              place_id: place.place_id!,
              fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 'rating', 'user_ratings_total', 'geometry', 'photos', 'opening_hours', 'price_level'],
              key: apiKey
            }
          });
          
          const result = details.data.result;
          
          // Check if actually in Slough area
          const address = result.formatted_address || '';
          if (!address.includes('Slough') && !address.includes('SL1') && !address.includes('SL2')) {
            continue;
          }
          
          const business = {
            id: businessId++,
            name: result.name,
            slug: result.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            category: type,
            area: 'Slough',
            phone: result.formatted_phone_number || '',
            website: result.website || '',
            email: '',
            address: address,
            postcode: address.match(/PO\d{1,2}\s?\d[A-Z]{2}/)?.[0] || '',
            description: `\${result.name} - \${type} in Slough`,
            lat: result.geometry?.location.lat || 0,
            lng: result.geometry?.location.lng || 0,
            rating: result.rating || 0,
            review_count: result.user_ratings_total || 0,
            opening_hours_json: JSON.stringify(result.opening_hours || {}),
            google_place_id: place.place_id,
            photo_references: result.photos?.slice(0, 3).map((p: any) => p.photo_reference) || [],
            price_level: result.price_level
          };
          
          allBusinesses.push(business);
          console.log(`  Added: \${business.name}`);
          
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (err) {
          console.error(`  Error getting details: \${err}`);
        }
      }
    } catch (error) {
      console.error(`Error fetching \${type}: \${error}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save to JSON
  fs.writeFileSync(
    'slough-businesses.json',
    JSON.stringify(allBusinesses, null, 2)
  );
  
  console.log(`\n✅ Synced \${allBusinesses.length} businesses to slough-businesses.json`);
  
  // Also create a TypeScript file ready to paste into lib/db.ts
  const tsContent = `// Add these to your businesses array in lib/db.ts
export const googleBusinesses = \${JSON.stringify(allBusinesses, null, 2)};`;
  
  fs.writeFileSync('businesses-to-add.ts', tsContent);
  console.log('✅ Created businesses-to-add.ts - review and add to lib/db.ts');
}

fullSync().catch(console.error);
