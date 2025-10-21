import { placesTextSearch, placeDetails } from './src/lib/google';
import { CATEGORIES } from './src/config/categories';

// Simple script to fetch businesses and output them as JSON
async function fetchBusinesses() {
  console.log('Starting business fetch...');
  
  const businesses = [];
  
  // Test with restaurants first
  try {
    console.log('Fetching restaurants...');
    const searchResults = await placesTextSearch('restaurants in Slough');
    console.log(`Found ${searchResults.results.length} restaurant results`);
    
    // Get details for first 5 restaurants
    const firstFive = searchResults.results.slice(0, 5);
    
    for (const result of firstFive) {
      try {
        const placeId = result.place_id;
        console.log(`Fetching details for: ${placeId}`);
        
        const details = await placeDetails(placeId);
        console.log(`Got details for: ${details.name}`);
        
        const business = {
          place_id: details.place_id,
          name: details.name,
          formatted_address: details.formatted_address,
          rating: details.rating,
          user_ratings_total: details.user_ratings_total,
          types: details.types,
          slug: details.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          categories: ['restaurants'],
          neighbourhood: 'Slough',
          photos: details.photos || [],
          opening_hours: details.opening_hours,
          website: details.website,
          international_phone_number: details.international_phone_number
        };
        
        businesses.push(business);
        console.log(`Added: ${business.name}`);
        
      } catch (error) {
        console.error(`Error processing place:`, error);
      }
    }
    
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
  
  // Test with takeaways
  try {
    console.log('Fetching takeaways...');
    const searchResults = await placesTextSearch('takeaways in Slough');
    console.log(`Found ${searchResults.results.length} takeaway results`);
    
    const firstThree = searchResults.results.slice(0, 3);
    
    for (const result of firstThree) {
      try {
        const placeId = result.place_id;
        const details = await placeDetails(placeId);
        
        const business = {
          place_id: details.place_id,
          name: details.name,
          formatted_address: details.formatted_address,
          rating: details.rating,
          user_ratings_total: details.user_ratings_total,
          types: details.types,
          slug: details.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          categories: ['takeaways'],
          neighbourhood: 'Slough',
          photos: details.photos || [],
          opening_hours: details.opening_hours,
          website: details.website,
          international_phone_number: details.international_phone_number
        };
        
        businesses.push(business);
        console.log(`Added: ${business.name}`);
        
      } catch (error) {
        console.error(`Error processing takeaway:`, error);
      }
    }
    
  } catch (error) {
    console.error('Error fetching takeaways:', error);
  }
  
  console.log(`\nTotal businesses fetched: ${businesses.length}`);
  console.log('\nBusinesses:');
  businesses.forEach((business, index) => {
    console.log(`${index + 1}. ${business.name} - ${business.formatted_address} (${business.rating || 'No rating'})`);
  });
  
  // Output as JSON for easy copying
  console.log('\n=== JSON OUTPUT ===');
  console.log(JSON.stringify(businesses, null, 2));
  
  return businesses;
}

// Run the script
fetchBusinesses().catch(console.error);
