import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';

export async function GET() {
  try {
    console.log('Initializing cache with sample businesses...');
    
    await cache.initializeWithSampleData();
    
    const allPlaces = await cache.getAllPlaces();
    const categoryCounts = await cache.getCategoryCounts();
    
    return NextResponse.json({
      success: true,
      message: `Successfully initialized cache with ${allPlaces.length} sample businesses`,
      totalPlaces: allPlaces.length,
      categoryCounts,
      businesses: allPlaces.map(place => ({
        name: place.name,
        category: place.types[0],
        rating: place.rating,
        address: place.formatted_address
      }))
    });
    
  } catch (error) {
    console.error('Error initializing cache:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to initialize cache with sample data',
      error: String(error)
    }, { status: 500 });
  }
}
