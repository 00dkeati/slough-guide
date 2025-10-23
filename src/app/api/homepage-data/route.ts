import { NextResponse } from 'next/server';
import { SloughBusinessGenerator } from '../../../lib/business-generator';
import { sampleBusinesses } from '../../../data/sample-businesses';

export async function GET() {
  try {
    console.log('API: Generating businesses for homepage...');
    
    // Generate businesses using the business generator
    const generator = new SloughBusinessGenerator();
    const generatedBusinesses = await generator.generateBusinesses({ count: 100 });
    
    // Combine sample data with generated businesses
    const totalBusinesses = [...sampleBusinesses, ...generatedBusinesses];
    
    // Calculate category counts
    const categoryCounts: Record<string, number> = {};
    const categories = [
      'restaurants', 'takeaways', 'cafes', 'pubs', 'gyms', 'barbers', 
      'hairdressers', 'plumbers', 'electricians', 'car_wash', 'taxi', 'hotels'
    ];
    
    categories.forEach(category => {
      categoryCounts[category] = totalBusinesses.filter((business: any) => 
        business.categories && business.categories.includes(category)
      ).length;
    });
    
    console.log(`API: Generated ${totalBusinesses.length} total businesses`);
    console.log('API: Category counts:', categoryCounts);
    
    return NextResponse.json({ 
      success: true, 
      totalBusinesses: totalBusinesses.length,
      categoryCounts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      success: false, 
      totalBusinesses: sampleBusinesses.length,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
