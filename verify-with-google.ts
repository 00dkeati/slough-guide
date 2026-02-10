import { Client } from '@googlemaps/google-maps-services-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new Client({});

async function verifyBusinesses() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('No API key found. Cannot verify businesses.');
    return;
  }
  
  // Read current businesses from db.ts
  const dbContent = fs.readFileSync('./lib/db.ts', 'utf8');
  const match = dbContent.match(/export const businesses: Business\[\] = \[(.*?)\];/s);
  
  if (!match) {
    console.error('Could not find businesses in db.ts');
    return;
  }
  
  // List of business names to verify
  const businessesToVerify = [
    'ASDA Slough',
    'Tesco Express',
    'Costa Coffee',
    'The Wellington',
    'Boots Pharmacy',
    'Specsavers',
    'NatWest'
  ];
  
  console.log('Verifying businesses with Google Places API...');
  console.log('============================================');
  
  for (const businessName of businessesToVerify) {
    try {
      // Search for the business
      const searchResponse = await client.textSearch({
        params: {
          query: `\${businessName} Slough Berkshire UK`,
          key: apiKey
        }
      });
      
      if (searchResponse.data.results && searchResponse.data.results.length > 0) {
        const place = searchResponse.data.results[0];
        
        // Get detailed information
        const detailsResponse = await client.placeDetails({
          params: {
            place_id: place.place_id!,
            fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 'rating', 'user_ratings_total', 'opening_hours', 'geometry'],
            key: apiKey
          }
        });
        
        const details = detailsResponse.data.result;
        
        console.log(`\n✓ VERIFIED: \${details.name}`);
        console.log(`  Address: \${details.formatted_address}`);
        console.log(`  Phone: \${details.formatted_phone_number || 'Not available'}`);
        console.log(`  Website: \${details.website || 'Not available'}`);
        console.log(`  Rating: \${details.rating} (\${details.user_ratings_total} reviews)`);
        console.log(`  Currently Open: \${details.opening_hours?.open_now ? 'Yes' : 'No'}`);
        console.log(`  Google Place ID: \${place.place_id}`);
      } else {
        console.log(`\n✗ NOT FOUND: \${businessName}`);
      }
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error verifying \${businessName}:`, error);
    }
  }
  
  console.log('\n============================================');
  console.log('Verification complete.');
  console.log('');
  console.log('Next steps:');
  console.log('1. Update incorrect information in lib/db.ts');
  console.log('2. Add Google Place IDs for verified businesses');
  console.log('3. Use real phone numbers and addresses from Google');
}

verifyBusinesses().catch(console.error);
