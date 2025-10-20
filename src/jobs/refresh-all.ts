import { fetchAllCategories, fetchNeighbourhoodCategories } from './fetch-category';
import { KVStore } from '@/lib/kv';

interface RefreshOptions {
  includeNeighbourhoods?: boolean;
  concurrency?: number;
  clearExisting?: boolean;
}

export async function refreshAllData(options: RefreshOptions = {}): Promise<{
  success: boolean;
  summary: {
    totalPlacesAdded: number;
    totalPlacesUpdated: number;
    totalErrors: number;
    categoriesProcessed: number;
    neighbourhoodsProcessed: number;
    duration: number;
  };
  errors: string[];
}> {
  const startTime = Date.now();
  const {
    includeNeighbourhoods = true,
    concurrency = 3,
    clearExisting = false
  } = options;

  console.log('Starting full data refresh...');
  console.log(`Options: neighbourhoods=${includeNeighbourhoods}, concurrency=${concurrency}, clearExisting=${clearExisting}`);

  const allErrors: string[] = [];
  let totalPlacesAdded = 0;
  let totalPlacesUpdated = 0;

  try {
    // Clear existing data if requested
    if (clearExisting) {
      console.log('Clearing existing data...');
      await KVStore.clearAllData();
    }

    // Fetch all categories
    console.log('Fetching all categories...');
    const categoryResults = await fetchAllCategories(concurrency);
    
    totalPlacesAdded += categoryResults.totalAdded;
    totalPlacesUpdated += categoryResults.totalUpdated;
    allErrors.push(...categoryResults.allErrors);

    // Fetch neighbourhood-specific data if requested
    if (includeNeighbourhoods) {
      console.log('Fetching neighbourhood-specific data...');
      const neighbourhoodResults = await fetchNeighbourhoodCategories(concurrency);
      
      totalPlacesAdded += neighbourhoodResults.totalAdded;
      totalPlacesUpdated += neighbourhoodResults.totalUpdated;
      allErrors.push(...neighbourhoodResults.allErrors);
    }

    const duration = Date.now() - startTime;
    
    console.log('Data refresh completed!');
    console.log(`Duration: ${Math.round(duration / 1000)}s`);
    console.log(`Places added: ${totalPlacesAdded}`);
    console.log(`Places updated: ${totalPlacesUpdated}`);
    console.log(`Errors: ${allErrors.length}`);

    return {
      success: true,
      summary: {
        totalPlacesAdded,
        totalPlacesUpdated,
        totalErrors: allErrors.length,
        categoriesProcessed: categoryResults.categoryResults ? Object.keys(categoryResults.categoryResults).length : 0,
        neighbourhoodsProcessed: includeNeighbourhoods ? 10 : 0, // CITY.neighbourhoods.length
        duration,
      },
      errors: allErrors,
    };

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMsg = `Fatal error during refresh: ${error}`;
    console.error(errorMsg);
    
    return {
      success: false,
      summary: {
        totalPlacesAdded,
        totalPlacesUpdated,
        totalErrors: allErrors.length + 1,
        categoriesProcessed: 0,
        neighbourhoodsProcessed: 0,
        duration,
      },
      errors: [...allErrors, errorMsg],
    };
  }
}

// Main execution function for CLI usage
async function main() {
  try {
    const result = await refreshAllData({
      includeNeighbourhoods: true,
      concurrency: 3,
      clearExisting: false,
    });

    if (result.success) {
      console.log('\n✅ Refresh completed successfully!');
      console.log(`📊 Summary:`);
      console.log(`   Places added: ${result.summary.totalPlacesAdded}`);
      console.log(`   Places updated: ${result.summary.totalPlacesUpdated}`);
      console.log(`   Categories processed: ${result.summary.categoriesProcessed}`);
      console.log(`   Neighbourhoods processed: ${result.summary.neighbourhoodsProcessed}`);
      console.log(`   Duration: ${Math.round(result.summary.duration / 1000)}s`);
      
      if (result.errors.length > 0) {
        console.log(`⚠️  ${result.errors.length} errors occurred:`);
        result.errors.slice(0, 10).forEach(error => console.log(`   - ${error}`));
        if (result.errors.length > 10) {
          console.log(`   ... and ${result.errors.length - 10} more errors`);
        }
      }
    } else {
      console.log('\n❌ Refresh failed!');
      console.log('Errors:');
      result.errors.forEach(error => console.log(`  - ${error}`));
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
