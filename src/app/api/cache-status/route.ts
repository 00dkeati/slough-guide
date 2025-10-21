import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';

export async function GET() {
  try {
    // Check what's in the cache
    const allPlaces = await cache.getAllPlaces();
    const categoryCounts = await cache.getCategoryCounts();
    const neighbourhoodCounts = await cache.getNeighbourhoodCounts();
    const lastRefresh = cache.getLastRefresh();

    return NextResponse.json({
      message: 'Cache status check',
      totalPlaces: allPlaces.length,
      categoryCounts,
      neighbourhoodCounts,
      lastRefresh: lastRefresh?.toISOString() || 'Never',
      samplePlaces: allPlaces.slice(0, 3).map(place => ({
        name: place.name,
        place_id: place.place_id,
        categories: place.categories,
        neighbourhood: place.neighbourhood
      }))
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Cache check failed',
      message: String(error)
    }, { status: 500 });
  }
}
