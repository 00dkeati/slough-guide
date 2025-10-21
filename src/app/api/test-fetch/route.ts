import { NextResponse } from 'next/server';
import { placesTextSearch, placeDetails } from '@/lib/google';
import { cache } from '@/lib/cache';

export async function GET() {
  try {
    console.log('Starting test fetch...');
    
    // Test with just restaurants in Slough
    const searchQuery = 'restaurants in Slough';
    console.log(`Searching for: ${searchQuery}`);
    
    const searchResults = await placesTextSearch(searchQuery);
    console.log(`Found ${searchResults.results.length} results`);
    
    if (searchResults.results.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No restaurants found',
        results: []
      });
    }
    
    // Get details for first 3 restaurants
    const firstThree = searchResults.results.slice(0, 3);
    const places = [];
    
    for (const result of firstThree) {
      try {
        const placeId = (result as { place_id: string }).place_id;
        console.log(`Fetching details for place_id: ${placeId}`);
        
        const details = await placeDetails(placeId);
        console.log(`Got details for: ${details.name}`);
        
        // Create a simple place object
        const place = {
          place_id: details.place_id,
          name: details.name,
          slug: details.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          types: details.types,
          lat: details.geometry?.location?.lat || 51.5105,
          lng: details.geometry?.location?.lng || -0.5950,
          last_fetched: new Date().toISOString(),
          categories: ['restaurants'],
          formatted_address: details.formatted_address,
          rating: details.rating,
          user_ratings_total: details.user_ratings_total,
          neighbourhood: 'Slough',
          photos: details.photos || [],
          opening_hours: details.opening_hours,
          website: details.website,
          phone: details.international_phone_number
        };
        
        // Save to cache
        await cache.savePlace(place);
        await cache.addPlaceToCategory(place.place_id, 'restaurants');
        await cache.addPlaceToNeighbourhood(place.place_id, 'Slough');
        
        places.push(place);
        console.log(`Saved: ${place.name}`);
        
      } catch (error) {
        console.error(`Error processing place:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully fetched and saved ${places.length} restaurants`,
      places: places.map(p => ({
        name: p.name,
        address: p.formatted_address,
        rating: p.rating,
        reviews: p.user_ratings_total
      }))
    });
    
  } catch (error) {
    console.error('Test fetch failed:', error);
    return NextResponse.json({
      success: false,
      message: 'Test fetch failed',
      error: String(error)
    }, { status: 500 });
  }
}
