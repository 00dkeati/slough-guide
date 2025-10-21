import pMap from 'p-map';
import { placesTextSearch, placesNearby, batchPlaceDetails, getAllPlaces } from '@/lib/google';
import { KVStore } from '@/lib/kv';
import { convertGooglePlaceToPlace } from '@/lib/place-utils';
import { CATEGORIES, getCategoryById } from '@/config/categories';
import { CITY } from '@/config/city';

interface FetchCategoryOptions {
  categoryId: string;
  neighbourhood?: string;
  concurrency?: number;
}

export async function fetchCategoryPlaces({
  categoryId,
  neighbourhood,
  concurrency = 3
}: FetchCategoryOptions): Promise<{ 
  placesAdded: number; 
  placesUpdated: number; 
  errors: string[] 
}> {
  const category = getCategoryById(categoryId);
  if (!category) {
    throw new Error(`Category ${categoryId} not found`);
  }

  console.log(`Fetching places for category: ${category.label}${neighbourhood ? ` in ${neighbourhood}` : ''}`);
  
  const errors: string[] = [];
  let placesAdded = 0;
  let placesUpdated = 0;
  const uniquePlaceIds = new Set<string>();

  // Fetch places for each Google type in this category
  for (const googleType of category.googleTypes) {
    try {
      console.log(`  Fetching ${googleType} places...`);
      
      // Text search for the category in Slough
      const textSearchQuery = neighbourhood 
        ? `${googleType} in ${neighbourhood}, Slough`
        : `${googleType} in Slough`;
      
      const textSearchResults = await getAllPlaces((pageToken) => 
        placesTextSearch(textSearchQuery, pageToken)
      );
      
      // Nearby search centered on Slough
      const nearbyResults = await getAllPlaces((pageToken) =>
        placesNearby(
          CITY.lat,
          CITY.lng,
          googleType,
          CITY.radiusMetersDefault,
          pageToken
        )
      );
      
      // Combine and deduplicate results
      const allResults = [...textSearchResults, ...nearbyResults];
      const uniqueResults = allResults.filter((place, index, self) => 
        index === self.findIndex((p: unknown) => (p as { place_id: string }).place_id === (place as { place_id: string }).place_id)
      );
      
      console.log(`    Found ${uniqueResults.length} unique ${googleType} places`);
      
      // Add place IDs to our set
      for (const result of uniqueResults) {
        uniquePlaceIds.add((result as { place_id: string }).place_id);
      }
      
    } catch (error) {
      const errorMsg = `Error fetching ${googleType}: ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
  }

  console.log(`  Total unique places found: ${uniquePlaceIds.size}`);

  // Batch fetch detailed information for all places
  const placeIds = Array.from(uniquePlaceIds);
  const placeDetails = await batchPlaceDetails(placeIds, concurrency);
  
  console.log(`  Fetched details for ${placeDetails.length} places`);

  // Process each place
  for (const googlePlace of placeDetails) {
    try {
      const place = convertGooglePlaceToPlace(googlePlace);
      
      // Check if place already exists
      const existingPlace = await KVStore.getPlace(place.place_id);
      
      if (existingPlace) {
        // Update existing place
        const updatedPlace = {
          ...existingPlace,
          ...place,
          last_fetched: new Date().toISOString(),
        };
        
        await KVStore.savePlace(updatedPlace);
        placesUpdated++;
      } else {
        // Add new place
        await KVStore.savePlace(place);
        placesAdded++;
      }
      
      // Add to category
      await KVStore.addPlaceToCategory(place.place_id, categoryId);
      
      // Add to neighbourhood if applicable
      if (place.neighbourhood) {
        await KVStore.addPlaceToNeighbourhood(place.place_id, place.neighbourhood);
      }
      
      // Update rankings
      await KVStore.updatePlaceRanking(place);
      
    } catch (error) {
      const errorMsg = `Error processing place ${googlePlace.place_id}: ${error}`;
      console.error(errorMsg);
      errors.push(errorMsg);
    }
  }

  // Update category metadata
  const totalPlaces = await KVStore.getCategoryPlaceIds(categoryId);
  await KVStore.updateCategoryMeta(categoryId, {
    count: totalPlaces.length,
    lastUpdated: new Date().toISOString(),
  });

  console.log(`  Category ${categoryId}: ${placesAdded} added, ${placesUpdated} updated, ${errors.length} errors`);
  
  return { placesAdded, placesUpdated, errors };
}

export async function fetchAllCategories(concurrency: number = 3): Promise<{
  totalAdded: number;
  totalUpdated: number;
  allErrors: string[];
  categoryResults: Record<string, { placesAdded: number; placesUpdated: number; errors: string[] }>;
}> {
  console.log('Starting fetch for all categories...');
  
  const allErrors: string[] = [];
  let totalAdded = 0;
  let totalUpdated = 0;
  const categoryResults: Record<string, { placesAdded: number; placesUpdated: number; errors: string[] }> = {};

  // Process categories with concurrency control
  await pMap(
    CATEGORIES,
    async (category) => {
      try {
        const result = await fetchCategoryPlaces({
          categoryId: category.id,
          concurrency,
        });
        
        categoryResults[category.id] = result;
        totalAdded += result.placesAdded;
        totalUpdated += result.placesUpdated;
        allErrors.push(...result.errors);
        
      } catch (error) {
        const errorMsg = `Error fetching category ${category.id}: ${error}`;
        console.error(errorMsg);
        allErrors.push(errorMsg);
        categoryResults[category.id] = { placesAdded: 0, placesUpdated: 0, errors: [errorMsg] };
      }
    },
    { concurrency }
  );

  console.log(`Fetch complete: ${totalAdded} added, ${totalUpdated} updated, ${allErrors.length} total errors`);
  
  return {
    totalAdded,
    totalUpdated,
    allErrors,
    categoryResults,
  };
}

export async function fetchNeighbourhoodCategories(concurrency: number = 2): Promise<{
  totalAdded: number;
  totalUpdated: number;
  allErrors: string[];
}> {
  console.log('Starting fetch for neighbourhood-specific categories...');
  
  const allErrors: string[] = [];
  let totalAdded = 0;
  let totalUpdated = 0;

  // Process each neighbourhood × category combination
  const neighbourhoodCategoryPairs = [];
  for (const neighbourhood of CITY.neighbourhoods) {
    for (const category of CATEGORIES) {
      neighbourhoodCategoryPairs.push({ neighbourhood, categoryId: category.id });
    }
  }

  await pMap(
    neighbourhoodCategoryPairs,
    async ({ neighbourhood, categoryId }) => {
      try {
        const result = await fetchCategoryPlaces({
          categoryId,
          neighbourhood,
          concurrency: 1, // Lower concurrency for neighbourhood searches
        });
        
        totalAdded += result.placesAdded;
        totalUpdated += result.placesUpdated;
        allErrors.push(...result.errors);
        
      } catch (error) {
        const errorMsg = `Error fetching ${categoryId} in ${neighbourhood}: ${error}`;
        console.error(errorMsg);
        allErrors.push(errorMsg);
      }
    },
    { concurrency }
  );

  console.log(`Neighbourhood fetch complete: ${totalAdded} added, ${totalUpdated} updated, ${allErrors.length} total errors`);
  
  return {
    totalAdded,
    totalUpdated,
    allErrors,
  };
}
