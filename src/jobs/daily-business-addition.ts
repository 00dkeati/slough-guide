#!/usr/bin/env tsx

import { businessGenerator } from '../lib/business-generator';
import { cache } from '../lib/cache';
import { CATEGORIES } from '../config/categories';

interface DailyAdditionResult {
  success: boolean;
  businessesAdded: number;
  businessesUpdated: number;
  errors: string[];
  summary: {
    totalBusinesses: number;
    categoriesUpdated: string[];
    neighbourhoodsUpdated: string[];
  };
}

export async function addDailyBusinesses(count: number = 100): Promise<DailyAdditionResult> {
  console.log(`🌅 Starting daily business addition: ${count} businesses`);
  
  const result: DailyAdditionResult = {
    success: false,
    businessesAdded: 0,
    businessesUpdated: 0,
    errors: [],
    summary: {
      totalBusinesses: 0,
      categoriesUpdated: [],
      neighbourhoodsUpdated: []
    }
  };

  try {
    // Generate new businesses
    console.log('🏭 Generating new businesses...');
    const newBusinesses = await businessGenerator.generateDailyBusinesses(count);
    
    if (newBusinesses.length === 0) {
      throw new Error('No businesses were generated');
    }

    console.log(`📊 Generated ${newBusinesses.length} businesses`);

    // Add businesses to cache
    console.log('💾 Adding businesses to cache...');
    const categoriesUpdated = new Set<string>();
    const neighbourhoodsUpdated = new Set<string>();

    for (const business of newBusinesses) {
      try {
        // Save the business
        await cache.savePlace(business);
        result.businessesAdded++;

        // Add to categories
        for (const type of business.types) {
          const category = CATEGORIES.find(c => c.id === type);
          if (category) {
            await cache.addPlaceToCategory(business.place_id, category.id);
            categoriesUpdated.add(category.label);
          }
        }

        // Add to neighbourhood
        if (business.neighbourhood) {
          await cache.addPlaceToNeighbourhood(business.place_id, business.neighbourhood);
          neighbourhoodsUpdated.add(business.neighbourhood);
        }

        console.log(`✅ Added: ${business.name} (${business.types[0]}) in ${business.neighbourhood}`);

      } catch (error) {
        const errorMsg = `Failed to add business ${business.name}: ${error.message}`;
        console.error(`❌ ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    // Get final counts
    const allPlaces = await cache.getAllPlaces();
    result.summary.totalBusinesses = allPlaces.length;
    result.summary.categoriesUpdated = Array.from(categoriesUpdated);
    result.summary.neighbourhoodsUpdated = Array.from(neighbourhoodsUpdated);

    result.success = true;

    console.log('🎉 Daily business addition completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Businesses added: ${result.businessesAdded}`);
    console.log(`   - Total businesses: ${result.summary.totalBusinesses}`);
    console.log(`   - Categories updated: ${result.summary.categoriesUpdated.length}`);
    console.log(`   - Neighbourhoods updated: ${result.summary.neighbourhoodsUpdated.length}`);
    console.log(`   - Errors: ${result.errors.length}`);

    return result;

  } catch (error) {
    console.error('❌ Daily business addition failed:', error);
    result.errors.push(`Daily addition failed: ${error.message}`);
    return result;
  }
}

// CLI execution
if (require.main === module) {
  const count = parseInt(process.argv[2]) || 100;
  
  addDailyBusinesses(count)
    .then(result => {
      if (result.success) {
        console.log('✅ Daily business addition completed successfully!');
        process.exit(0);
      } else {
        console.error('❌ Daily business addition failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}
