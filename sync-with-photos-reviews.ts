import { Client } from '@googlemaps/google-maps-services-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = new Client({});

const WATERLOOVILLE_CENTER = {
  lat: 50.8793,
  lng: -1.0345
};

// Business types to search
const BUSINESS_TYPES = [
  'restaurant', 'cafe', 'bakery', 'bar', 'pub',
  'supermarket', 'convenience_store', 'clothing_store', 'hardware_store',
  'pharmacy', 'doctor', 'dentist', 'veterinary_care',
  'bank', 'post_office', 'library', 'gym',
  'hair_care', 'beauty_salon', 'spa',
  'car_repair', 'gas_station', 'car_dealer',
  'school', 'real_estate_agency', 'lawyer'
];

async function syncWithPhotosAndReviews() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey) {
    console.error('ERROR: No Google API key found');
    process.exit(1);
  }
  
  console.log('Starting enhanced Google Places sync for Slough...');
  console.log('This will include photos and reviews for each business.');
  console.log('=========================================================\n');
  
  const verifiedBusinesses = [];
  let businessId = 100;
  let totalAdded = 0;
  
  for (const type of BUSINESS_TYPES) {
    console.log(`\nSearching for ${type} businesses...`);
    
    try {
      const response = await client.placesNearby({
        params: {
          location: WATERLOOVILLE_CENTER,
          radius: 5000,
          type: type as any,
          key: apiKey
        }
      });
      
      console.log(`Found ${response.data.results.length} ${type} listings`);
      
      // Get detailed info for each place
      for (const place of response.data.results.slice(0, 5)) { // Limit to 5 per type to avoid quota
        try {
          const detailsResponse = await client.placeDetails({
            params: {
              place_id: place.place_id!,
              fields: [
                'name',
                'formatted_address',
                'formatted_phone_number',
                'website',
                'rating',
                'user_ratings_total',
                'opening_hours',
                'geometry',
                'types',
                'price_level',
                'photos',      // Add photos
                'reviews',     // Add reviews
                'editorial_summary',
                'business_status'
              ],
              key: apiKey
            }
          });
          
          const details = detailsResponse.data.result;
          const address = details.formatted_address || '';
          
          // Check if in Slough area
          const postcodeMatch = address.match(/PO[78]\s?\d[A-Z]{2}/);
          if (!address.includes('Slough') && 
              !address.includes('Langley') && 
              !address.includes('Horndean') && 
              !address.includes('Chalvey') && 
              !postcodeMatch) {
            continue;
          }
          
          // Process photos - get photo URLs
          const photos = [];
          if (details.photos && details.photos.length > 0) {
            for (let i = 0; i < Math.min(5, details.photos.length); i++) {
              const photo = details.photos[i];
              photos.push({
                reference: photo.photo_reference,
                width: photo.width,
                height: photo.height,
                attributions: photo.html_attributions || [],
                // Photo URL will be: /api/photo?ref=${photo.photo_reference}&maxwidth=800
              });
            }
          }
          
          // Process reviews - make them readable
          const reviews = [];
          if (details.reviews && details.reviews.length > 0) {
            for (const review of details.reviews.slice(0, 5)) { // Top 5 reviews
              reviews.push({
                author_name: review.author_name,
                rating: review.rating,
                relative_time_description: review.relative_time_description,
                text: review.text,
                time: review.time,
                author_url: review.author_url || '',
                language: review.language || 'en'
              });
            }
          }
          
          // Determine area
          let area = 'Slough';
          if (address.includes('Langley')) area = 'Langley';
          else if (address.includes('Horndean')) area = 'Horndean';
          else if (address.includes('Chalvey')) area = 'Chalvey';
          else if (address.includes('Stakes')) area = 'Stakes';
          
          // Create enhanced business object
          const business = {
            id: businessId++,
            name: details.name,
            slug: details.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
            category: mapTypeToCategory(type),
            area: area,
            phone: details.formatted_phone_number || '',
            website: details.website || '',
            email: '',
            address: address,
            postcode: postcodeMatch ? postcodeMatch[0] : '',
            description: details.editorial_summary?.overview || 
                        `${details.name} - ${mapTypeToCategory(type)} in ${area}. ${
                          details.rating ? `Rated ${details.rating}/5 stars with ${details.user_ratings_total} reviews.` : ''
                        }`,
            lat: details.geometry?.location.lat || 0,
            lng: details.geometry?.location.lng || 0,
            rating: details.rating || 0,
            review_count: details.user_ratings_total || 0,
            opening_hours_json: JSON.stringify(details.opening_hours || {}),
            google_place_id: place.place_id,
            price_level: details.price_level,
            business_status: details.business_status || 'OPERATIONAL',
            photos: photos,          // Array of photo objects
            reviews: reviews,        // Array of review objects
            types: details.types || [type],
            verified: true,
            last_verified: new Date().toISOString()
          };
          
          verifiedBusinesses.push(business);
          totalAdded++;
          
          console.log(`  ✓ Added: ${business.name}`);
          console.log(`    • ${photos.length} photos`);
          console.log(`    • ${reviews.length} reviews`);
          console.log(`    • Rating: ${business.rating}/5 (${business.review_count} reviews)`);
          
          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`  Error getting details: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      // Delay between types
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error searching ${type}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  if (verifiedBusinesses.length > 0) {
    // Update database
    updateDatabase(verifiedBusinesses);
    
    // Save detailed JSON backup
    fs.writeFileSync(
      'businesses-with-photos-reviews.json',
      JSON.stringify(verifiedBusinesses, null, 2)
    );
    
    console.log('\n=========================================================');
    console.log(`✓ SYNC COMPLETE WITH PHOTOS & REVIEWS`);
    console.log(`  Total businesses added: ${totalAdded}`);
    console.log(`  Data saved to: lib/db.ts`);
    console.log(`  Backup saved to: businesses-with-photos-reviews.json`);
    console.log('\nAll data includes:');
    console.log('  • Business photos (up to 5 per business)');
    console.log('  • Customer reviews (up to 5 per business)');
    console.log('  • Verified contact information');
    console.log('  • Current ratings and opening hours');
  } else {
    console.error('No businesses found. Check your API key and billing.');
  }
}

function mapTypeToCategory(type: string): string {
  const categoryMap: { [key: string]: string } = {
    restaurant: 'Restaurant',
    cafe: 'Restaurant',
    bakery: 'Restaurant',
    bar: 'Restaurant',
    pub: 'Restaurant',
    supermarket: 'Shopping',
    convenience_store: 'Shopping',
    clothing_store: 'Shopping',
    hardware_store: 'Shopping',
    pharmacy: 'Health',
    doctor: 'Health',
    dentist: 'Health',
    veterinary_care: 'Health',
    bank: 'Services',
    post_office: 'Services',
    library: 'Services',
    lawyer: 'Services',
    real_estate_agency: 'Services',
    hair_care: 'Beauty',
    beauty_salon: 'Beauty',
    spa: 'Beauty',
    gym: 'Entertainment',
    car_repair: 'Automotive',
    gas_station: 'Automotive',
    car_dealer: 'Automotive',
    school: 'Education'
  };
  
  return categoryMap[type] || 'Services';
}

function updateDatabase(businesses: any[]) {
  const dbPath = './lib/db.ts';
  let dbContent = fs.readFileSync(dbPath, 'utf8');
  
  // Add photos and reviews fields to Business type if not present
  if (!dbContent.includes('photos?:')) {
    dbContent = dbContent.replace(
      'opening_hours_json: string',
      'opening_hours_json: string\n  photos?: any[]\n  reviews?: any[]'
    );
  }
  
  // Convert to TypeScript format
  const businessesString = JSON.stringify(businesses, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'");
  
  // Replace businesses array
  const newContent = dbContent.replace(
    /export const businesses: Business\[\] = \[.*?\];/s,
    `export const businesses: Business[] = ${businessesString};`
  );
  
  fs.writeFileSync(dbPath, newContent);
}

syncWithPhotosAndReviews().catch(console.error);
