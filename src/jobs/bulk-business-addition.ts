#!/usr/bin/env tsx

import { businessGenerator } from '../lib/business-generator';
import { cache } from '../lib/cache';
import { CATEGORIES } from '../config/categories';

interface BulkAdditionResult {
  success: boolean;
  businessesAdded: number;
  businessesUpdated: number;
  errors: string[];
  summary: {
    totalBusinesses: number;
    categoriesUpdated: string[];
    neighbourhoodsUpdated: string[];
    timeElapsed: string;
  };
}

export async function addBulkBusinesses(count: number = 500): Promise<BulkAdditionResult> {
  const startTime = Date.now();
  console.log(`🚀 Starting bulk business addition: ${count} businesses`);
  
  const result: BulkAdditionResult = {
    success: false,
    businessesAdded: 0,
    businessesUpdated: 0,
    errors: [],
    summary: {
      totalBusinesses: 0,
      categoriesUpdated: [],
      neighbourhoodsUpdated: [],
      timeElapsed: ''
    }
  };

  try {
    // Generate businesses in batches to avoid memory issues
    const batchSize = 50;
    const batches = Math.ceil(count / batchSize);
    const categoriesUpdated = new Set<string>();
    const neighbourhoodsUpdated = new Set<string>();

    console.log(`📊 Processing ${batches} batches of ${batchSize} businesses each`);

    for (let batch = 0; batch < batches; batch++) {
      const batchCount = Math.min(batchSize, count - (batch * batchSize));
      console.log(`🔄 Processing batch ${batch + 1}/${batches} (${batchCount} businesses)...`);

      // Generate businesses for this batch
      const batchBusinesses = await businessGenerator.generateBusinesses({
        count: batchCount,
        includeReviews: true,
        includeImages: false
      });

      // Add businesses to cache
      for (const business of batchBusinesses) {
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

          if (result.businessesAdded % 25 === 0) {
            console.log(`✅ Added ${result.businessesAdded}/${count} businesses...`);
          }

        } catch (error) {
          const errorMsg = `Failed to add business ${business.name}: ${error.message}`;
          console.error(`❌ ${errorMsg}`);
          result.errors.push(errorMsg);
        }
      }

      // Small delay between batches
      if (batch < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Get final counts
    const allPlaces = await cache.getAllPlaces();
    result.summary.totalBusinesses = allPlaces.length;
    result.summary.categoriesUpdated = Array.from(categoriesUpdated);
    result.summary.neighbourhoodsUpdated = Array.from(neighbourhoodsUpdated);
    result.summary.timeElapsed = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;

    result.success = true;

    console.log('🎉 Bulk business addition completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Businesses added: ${result.businessesAdded}`);
    console.log(`   - Total businesses: ${result.summary.totalBusinesses}`);
    console.log(`   - Categories updated: ${result.summary.categoriesUpdated.length}`);
    console.log(`   - Neighbourhoods updated: ${result.summary.neighbourhoodsUpdated.length}`);
    console.log(`   - Time elapsed: ${result.summary.timeElapsed}`);
    console.log(`   - Errors: ${result.errors.length}`);

    return result;

  } catch (error) {
    console.error('❌ Bulk business addition failed:', error);
    result.errors.push(`Bulk addition failed: ${error.message}`);
    result.summary.timeElapsed = `${((Date.now() - startTime) / 1000).toFixed(2)}s`;
    return result;
  }
}

// CLI execution
if (require.main === module) {
  const count = parseInt(process.argv[2]) || 500;
  
  addBulkBusinesses(count)
    .then(result => {
      if (result.success) {
        console.log('✅ Bulk business addition completed successfully!');
        process.exit(0);
      } else {
        console.error('❌ Bulk business addition failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Unexpected error:', error);
      process.exit(1);
    });
}
