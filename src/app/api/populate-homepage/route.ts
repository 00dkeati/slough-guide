import { NextRequest, NextResponse } from 'next/server';
import { SloughBusinessGenerator } from '../../../lib/business-generator';
import { cache } from '../../../lib/cache';
import { sampleBusinesses } from '../../../data/sample-businesses';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting homepage cache population...');
    
    // Clear existing cache first
    await cache.clearCache();
    
    // Add sample businesses
    let totalAdded = 0;
    for (const business of sampleBusinesses) {
      await cache.savePlace(business);
      for (const categoryId of business.categories || []) {
        await cache.addPlaceToCategory(business.place_id, categoryId);
      }
      if (business.vicinity) {
        await cache.addPlaceToNeighbourhood(business.place_id, business.vicinity);
      }
      totalAdded++;
    }
    
    // Generate additional businesses
    const generator = new SloughBusinessGenerator();
    const additionalBusinesses = await generator.generateBusinesses({ count: 100 });
    
    for (const business of additionalBusinesses) {
      await cache.savePlace(business);
      for (const categoryId of business.categories || []) {
        await cache.addPlaceToCategory(business.place_id, categoryId);
      }
      if (business.vicinity) {
        await cache.addPlaceToNeighbourhood(business.place_id, business.vicinity);
      }
      totalAdded++;
    }
    
    const totalPlaces = (await cache.getAllPlaces()).length;
    console.log(`✅ Successfully populated cache with ${totalAdded} businesses. Total: ${totalPlaces}`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully populated cache with ${totalAdded} businesses`,
      totalBusinesses: totalPlaces 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
