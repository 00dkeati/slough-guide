import Link from 'next/link';
import { Metadata } from 'next';
import { CITY } from '@/config/city';
import { cache } from '@/lib/cache';
import { generateMetaTags } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export const metadata: Metadata = generateMetaTags({
  title: 'All Areas in Slough - Slough Guide',
  description: 'Explore all neighbourhoods and areas in Slough. Find local businesses in your area.',
  canonical: '/neighbourhoods',
});

export default async function NeighbourhoodsPage() {
  const neighbourhoodCounts = await cache.getNeighbourhoodCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Areas in Slough</h1>
          <p className="text-lg text-gray-600">
            Explore all neighbourhoods and areas in Slough, Berkshire
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CITY.neighbourhoods.map((neighbourhood) => (
            <Link
              key={neighbourhood}
              href={`/neighbourhood/${neighbourhood.toLowerCase().replace(/\s+/g, '-')}`}
              className="group block"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="text-xl">{neighbourhood}</div>
                      <div className="text-sm text-gray-500 font-normal">
                        {neighbourhoodCounts[neighbourhood] || 0} businesses
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Discover local businesses and services in {neighbourhood}, Slough.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
