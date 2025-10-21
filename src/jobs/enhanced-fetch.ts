import { aiEnrichment, EnrichedPlace } from '../lib/ai-enrichment';
import { cache } from '../lib/cache';
import { fetchCategoryPlaces } from './fetch-category';
import { CATEGORIES } from '../config/categories';
import { CITY } from '../config/city';

// Enhanced data fetching with AI enrichment
export async function fetchAndEnrichAllData(options: {
  includeNeighbourhoods?: boolean;
  concurrency?: number;
  clearExisting?: boolean;
  enrichWithAI?: boolean;
} = {}) {
  const {
    includeNeighbourhoods = true,
    concurrency = 2,
    clearExisting = false,
    enrichWithAI = true
  } = options;

  console.log('🚀 Starting enhanced data fetch with AI enrichment...');
  console.log(`Options: neighbourhoods=${includeNeighbourhoods}, concurrency=${concurrency}, clearExisting=${clearExisting}, enrichWithAI=${enrichWithAI}`);

  const startTime = Date.now();
  let totalPlacesAdded = 0;
  let totalPlacesUpdated = 0;
  let totalErrors = 0;

  try {
    // Clear existing data if requested
    if (clearExisting) {
      console.log('🧹 Clearing existing data...');
      await cache.clearAllData();
    }

    // Fetch basic data first
    console.log('📡 Fetching basic business data...');
    const basicResults = await fetchAllCategories(concurrency);
    totalPlacesAdded += basicResults.added;
    totalPlacesUpdated += basicResults.updated;
    totalErrors += basicResults.errors;

    if (enrichWithAI) {
      console.log('🤖 Starting AI enrichment process...');
      const enrichmentResults = await enrichAllPlaces(concurrency);
      totalPlacesAdded += enrichmentResults.added;
      totalPlacesUpdated += enrichmentResults.updated;
      totalErrors += enrichmentResults.errors;
    }

    // Fetch neighbourhood-specific data if requested
    if (includeNeighbourhoods) {
      console.log('🏘️ Fetching neighbourhood-specific data...');
      const neighbourhoodResults = await fetchNeighbourhoodCategories(concurrency, enrichWithAI);
      totalPlacesAdded += neighbourhoodResults.added;
      totalPlacesUpdated += neighbourhoodResults.updated;
      totalErrors += neighbourhoodResults.errors;
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    
    console.log('✅ Enhanced data fetch completed!');
    console.log(`📊 Summary:`);
    console.log(`   Places added: ${totalPlacesAdded}`);
    console.log(`   Places updated: ${totalPlacesUpdated}`);
    console.log(`   Categories processed: ${CATEGORIES.length}`);
    console.log(`   Neighbourhoods processed: ${includeNeighbourhoods ? CITY.neighbourhoods.length : 0}`);
    console.log(`   Duration: ${duration}s`);
    console.log(`   Errors: ${totalErrors}`);

    return {
      success: true,
      summary: {
        totalPlacesAdded,
        totalPlacesUpdated,
        totalErrors,
        categoriesProcessed: CATEGORIES.length,
        neighbourhoodsProcessed: includeNeighbourhoods ? CITY.neighbourhoods.length : 0,
        duration
      }
    };

  } catch (error) {
    console.error('❌ Enhanced data fetch failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      summary: {
        totalPlacesAdded,
        totalPlacesUpdated,
        totalErrors,
        categoriesProcessed: 0,
        neighbourhoodsProcessed: 0,
        duration: Math.round((Date.now() - startTime) / 1000)
      }
    };
  }
}

// Fetch all categories with basic data
async function fetchAllCategories(concurrency: number) {
  console.log('Starting fetch for all categories...');
  let added = 0;
  let updated = 0;
  let errors = 0;

  for (const category of CATEGORIES) {
    try {
      console.log(`Fetching places for category: ${category.label}`);
      const result = await fetchCategoryPlaces({
        categoryId: category.id,
        concurrency: 1
      });
      added += result.placesAdded;
      updated += result.placesUpdated;
      errors += result.errors.length;
    } catch (error) {
      console.error(`Error fetching ${category.id}:`, error);
      errors++;
    }
  }

  return { added, updated, errors };
}

// Enrich all existing places with AI
async function enrichAllPlaces(concurrency: number) {
  console.log('🤖 Starting AI enrichment for all places...');
  let added = 0;
  let updated = 0;
  let errors = 0;

  try {
    const allPlaces = await cache.getAllPlaces();
    console.log(`Found ${allPlaces.length} places to enrich`);

    // Process places in batches
    const batchSize = Math.max(1, Math.floor(allPlaces.length / concurrency));
    const batches: any[][] = [];
    
    for (let i = 0; i < allPlaces.length; i += batchSize) {
      batches.push(allPlaces.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const promises = batch.map(async (place) => {
        try {
          console.log(`🤖 Enriching: ${place.name}`);
          const enrichedPlace = await aiEnrichment.enrichBusiness(place);
          
          // Save enriched place
          await cache.savePlace(enrichedPlace);
          
          // Update category and neighbourhood mappings
          for (const type of enrichedPlace.types) {
            await cache.addPlaceToCategory(type, enrichedPlace.place_id);
          }
          
          // Add to neighbourhood if we can determine it
          const neighbourhood = determineNeighbourhood(enrichedPlace);
          if (neighbourhood) {
            await cache.addPlaceToNeighbourhood(neighbourhood, enrichedPlace.place_id);
          }
          
          return { added: 1, updated: 0, errors: 0 };
        } catch (error) {
          console.error(`Error enriching ${place.name}:`, error);
          return { added: 0, updated: 0, errors: 1 };
        }
      });

      const results = await Promise.all(promises);
      results.forEach(result => {
        added += result.added;
        updated += result.updated;
        errors += result.errors;
      });

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

  } catch (error) {
    console.error('Error in AI enrichment process:', error);
    errors++;
  }

  return { added, updated, errors };
}

// Fetch neighbourhood-specific categories
async function fetchNeighbourhoodCategories(concurrency: number, enrichWithAI: boolean) {
  console.log('Starting fetch for neighbourhood-specific categories...');
  let added = 0;
  let updated = 0;
  let errors = 0;

  for (const neighbourhood of CITY.neighbourhoods) {
    console.log(`Processing neighbourhood: ${neighbourhood}`);
    
    for (const category of CATEGORIES) {
      try {
        console.log(`Fetching places for category: ${category.label} in ${neighbourhood}`);
        const result = await fetchCategoryPlaces({
          categoryId: category.id,
          neighbourhood: neighbourhood,
          concurrency: 1
        });
        added += result.placesAdded;
        updated += result.placesUpdated;
        errors += result.errors.length;

        // Enrich with AI if requested
        if (enrichWithAI && result.placesAdded > 0) {
          console.log(`🤖 Enriching ${result.placesAdded} new places in ${neighbourhood}`);
          // Get the newly added places and enrich them
          const neighbourhoodPlaces = await cache.getNeighbourhoodPlaces(neighbourhood);
          const recentPlaces = neighbourhoodPlaces.slice(-result.placesAdded);
          
          for (const place of recentPlaces) {
            try {
              const enrichedPlace = await aiEnrichment.enrichBusiness(place);
              await cache.savePlace(enrichedPlace);
            } catch (error) {
              console.error(`Error enriching ${place.name}:`, error);
              errors++;
            }
          }
        }

      } catch (error) {
        console.error(`Error fetching ${category.id} in ${neighbourhood}:`, error);
        errors++;
      }
    }
  }

  return { added, updated, errors };
}

// Determine neighbourhood from place data
function determineNeighbourhood(place: any): string | null {
  if (!place.vicinity && !place.formatted_address) return null;
  
  const address = (place.vicinity || place.formatted_address || '').toLowerCase();
  
  for (const neighbourhood of CITY.neighbourhoods) {
    if (address.includes(neighbourhood.toLowerCase())) {
      return neighbourhood;
    }
  }
  
  return null;
}

// Export for use in API routes
// fetchAndEnrichAllData is already exported above
