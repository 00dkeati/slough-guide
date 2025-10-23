import Link from 'next/link';
import { Metadata } from 'next';
import { sampleBusinesses } from '@/data/sample-businesses';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Businesses in Slough - Slough Guide',
    description: 'Complete directory of all businesses in Slough',
  };
}

export default function AllBusinessesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">All Businesses in Slough</h1>
      <p className="text-lg text-gray-600 mb-8">
        Discover all {sampleBusinesses.length} businesses and services listed in the Slough Guide.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleBusinesses.map((business) => (
          <div key={business.place_id} className="bg-white rounded-lg border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{business.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{business.formatted_address}</p>
            <p className="text-sm text-gray-600 mb-2">Rating: {business.rating}/5</p>
            <Link 
              href={`/business/${business.slug}`}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Details →
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}