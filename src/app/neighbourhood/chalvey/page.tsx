import { Metadata } from 'next';
import Link from 'next/link';
import { BusinessCard } from '../../../components/business-card';
import { Card, CardContent } from '../../../components/ui/card';

export const metadata: Metadata = {
  title: `Businesses in chalvey, Slough | Slough Guide`,
  description: `Discover local businesses in chalvey, Slough. Find restaurants, shops, services, and more in your neighbourhood.`,
  keywords: `chalvey, Slough, local businesses, chalvey Slough`,
};

export default async function NeighbourhoodPage() {
  // In a real implementation, you'd filter businesses by neighbourhood
  const businesses = []; // Placeholder

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Link href="/" className="hover:text-blue-600">Slough Guide</Link>
            <span>/</span>
            <Link href="/neighbourhoods" className="hover:text-blue-600">Neighbourhoods</Link>
            <span>/</span>
            <span className="text-gray-900">chalvey</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Businesses in chalvey
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover local businesses in chalvey, Slough. Find restaurants, shops, services, and more in your neighbourhood.
          </p>
        </div>

        {businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} place={business} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No businesses found in chalvey.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
