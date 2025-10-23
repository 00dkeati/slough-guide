import { NextRequest, NextResponse } from 'next/server';
import { SloughBusinessGenerator } from '../../../lib/business-generator';
import { sampleBusinesses } from '../../../data/sample-businesses';

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Generating businesses...');
    
    // Use sample data as base
    let totalPlaces = [...sampleBusinesses] as any;
    
    // Generate additional businesses
    const generator = new SloughBusinessGenerator();
    const additionalBusinesses = await generator.generateBusinesses({ count: 100 });
    
    // Add generated businesses to totalPlaces
    totalPlaces = [...totalPlaces, ...additionalBusinesses] as any;
    
    console.log(`Generated ${totalPlaces.length} businesses total`);
    
    return NextResponse.json({ 
      success: true, 
      totalBusinesses: totalPlaces.length,
      businesses: totalPlaces
    });
  } catch (error) {
    console.error('Error generating businesses:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
