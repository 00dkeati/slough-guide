import Link from 'next/link';
import { Metadata } from 'next';
import { sampleBusinesses } from '@/data/sample-businesses';
import { CATEGORIES, getCategoryById } from '@/config/categories';
import { CITY } from '@/config/city';
import { getTopPicks } from '@/lib/search';
import { BusinessCard } from '@/components/business-card';
import { SloughBusinessGenerator } from '@/lib/business-generator';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Slough Guide - All Businesses',
    description: 'Complete directory of all businesses in Slough',
  };
}

export default async function AllBusinessesPage() {
  console.log('AllBusinessesPage: Loading all businesses...');
  
  let totalPlaces: any[] = [];
  let categoryCounts: Record<string, number> = {};
  
  // Use sample data as base
  totalPlaces = [...sampleBusinesses] as any;
  
  // Generate additional businesses to show realistic count
  try {
    const generator = new SloughBusinessGenerator();
    const generatedBusinesses = await generator.generateBusinesses({ count: 100 });
    totalPlaces = [...totalPlaces, ...generatedBusinesses] as any;
    console.log(`AllBusinessesPage: Total businesses: ${totalPlaces.length}`);
  } catch (error) {
    console.error('AllBusinessesPage: Error generating businesses:', error);
    totalPlaces = [...sampleBusinesses] as any;
  }

  // Calculate category counts
  categoryCounts = {};
  CATEGORIES.forEach(category => {
    categoryCounts[category.id] = totalPlaces.filter((business: any) => 
      business.categories && business.categories.includes(category.id)
    ).length;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Businesses in Slough</h1>
          <p className="text-xl text-gray-600 mb-6">Complete directory of {totalPlaces.length.toLocaleString()} businesses</p>
          
          <div className="flex justify-center gap-8 text-blue-600">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalPlaces.length.toLocaleString()}</div>
              <div className="text-sm">Total Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{CATEGORIES.length}</div>
              <div className="text-sm">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{CITY.neighbourhoods.length}</div>
              <div className="text-sm">Areas</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Businesses by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => {
              const count = categoryCounts[category.id] || 0;
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="block p-4 bg-white rounded-lg border hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.label}</h3>
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    <div className="text-lg font-bold text-blue-600">{count} businesses</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sample Businesses */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Businesses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {totalPlaces.slice(0, 12).map((business) => (
              <BusinessCard key={business.place_id} place={business} />
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
