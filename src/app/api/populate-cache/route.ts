import { NextRequest, NextResponse } from 'next/server';
import { businessGenerator } from '../../../lib/business-generator';
import { cache } from '../../../lib/cache';

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('Authorization')?.split(' ')[1];

    if (secret !== process.env.REFRESH_SECRET_TOKEN) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting cache population...');
    
    // Generate 1000 businesses
    const businesses = await businessGenerator.generateBusinesses({ count: 1000 });
    console.log(`📊 Generated ${businesses.length} businesses`);

    // Save to cache
    for (const business of businesses) {
      await cache.savePlace(business);
      
      // Add to categories
      for (const categoryId of business.categories) {
        await cache.addPlaceToCategory(business.place_id, categoryId);
      }
      
      // Add to neighbourhood
      if (business.vicinity) {
        await cache.addPlaceToNeighbourhood(business.place_id, business.vicinity);
      }
    }

    const totalPlaces = await cache.getAllPlaces();
    console.log(`✅ Cache populated with ${totalPlaces.length} businesses`);

    return NextResponse.json({
      success: true,
      message: `Successfully populated cache with ${totalPlaces.length} businesses`,
      totalBusinesses: totalPlaces.length
    });

  } catch (error) {
    console.error('Cache population error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
