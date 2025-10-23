import { NextResponse } from 'next/server';
import { cache } from '../../../lib/cache';

export async function GET() {
  try {
    console.log('🔄 Force initializing cache...');
    
    // Force load data which will initialize with sample data if empty
    const allPlaces = await cache.getAllPlaces();
    console.log(`📊 Cache now has ${allPlaces.length} businesses`);
    
    return NextResponse.json({
      success: true,
      message: `Cache initialized with ${allPlaces.length} businesses`,
      totalBusinesses: allPlaces.length
    });

  } catch (error) {
    console.error('Cache initialization error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
