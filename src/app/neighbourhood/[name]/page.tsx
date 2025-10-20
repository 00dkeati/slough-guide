import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { KVStore } from '@/lib/kv';
import { CATEGORIES, getCategoryById } from '@/config/categories';
import { CITY } from '@/config/city';
import { 
  generateNeighbourhoodTitle, 
  generateNeighbourhoodDescription,
  generateBreadcrumbStructuredData,
  generateMetaTags
} from '@/lib/seo';
import { BusinessCard } from '@/components/business-card';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, Building } from 'lucide-react';

interface NeighbourhoodPageProps {
  params: {
    name: string;
  };
}

export async function generateStaticParams() {
  return CITY.neighbourhoods.map((neighbourhood) => ({
    name: neighbourhood.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: NeighbourhoodPageProps): Promise<Metadata> {
  const neighbourhoodName = params.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const neighbourhood = CITY.neighbourhoods.find(n => 
    n.toLowerCase().replace(/\s+/g, '-') === params.name
  );
  
  if (!neighbourhood) {
    return {
      title: 'Neighbourhood Not Found',
    };
  }

  const title = generateNeighbourhoodTitle(neighbourhood);
  const description = generateNeighbourhoodDescription(neighbourhood);
  const canonical = `/neighbourhood/${params.name}`;

  return generateMetaTags({
    title,
    description,
    canonical,
  });
}

export default async function NeighbourhoodPage({ params }: NeighbourhoodPageProps) {
  const neighbourhoodName = params.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const neighbourhood = CITY.neighbourhoods.find(n => 
    n.toLowerCase().replace(/\s+/g, '-') === params.name
  );
  
  if (!neighbourhood) {
    notFound();
  }

  // Get all places in this neighbourhood
  const neighbourhoodPlaces = await KVStore.getNeighbourhoodPlaces(neighbourhood);
  
  // Get places by category
  const placesByCategory = await Promise.all(
    CATEGORIES.slice(0, 8).map(async (category) => {
      const places = await KVStore.getNeighbourhoodCategoryPlaces(neighbourhood, category.id);
      return { category, places: places.slice(0, 3) };
    })
  );

  // Get top rated places
  const topRatedPlaces = neighbourhoodPlaces
    .filter(place => place.rating && place.user_ratings_total && place.user_ratings_total >= 10)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  // Generate structured data
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: neighbourhood },
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-gray-900">Home</Link></li>
              <li>/</li>
              <li className="text-gray-900">{neighbourhood}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Best Places in {neighbourhood}, Slough
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Discover the best businesses and services in {neighbourhood}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{neighbourhoodPlaces.length} businesses found</span>
              <span>•</span>
              <span>Part of Slough, Berkshire</span>
            </div>
          </div>

          {/* Top Rated Places */}
          {topRatedPlaces.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-500" />
                Top Rated in {neighbourhood}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topRatedPlaces.map((place) => (
                  <BusinessCard key={place.place_id} place={place} showNeighbourhood={false} />
                ))}
              </div>
            </section>
          )}

          {/* Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-600" />
              Popular Categories in {neighbourhood}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {placesByCategory
                .filter(({ places }) => places.length > 0)
                .map(({ category, places }) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">{category.icon}</span>
                        <span>{category.label}</span>
                        <Badge variant="secondary">{places.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {places.map((place) => (
                          <BusinessCard
                            key={place.place_id}
                            place={place}
                            showNeighbourhood={false}
                            showCategories={false}
                            className="shadow-none border-0 p-0"
                          />
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Link
                          href={`/neighbourhood/${params.name}/${category.id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View all {category.label.toLowerCase()} in {neighbourhood} →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </section>

          {/* All Places */}
          {neighbourhoodPlaces.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                All Businesses in {neighbourhood}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {neighbourhoodPlaces.map((place) => (
                  <BusinessCard key={place.place_id} place={place} showNeighbourhood={false} />
                ))}
              </div>
            </section>
          )}

          {/* No Results */}
          {neighbourhoodPlaces.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No businesses found in {neighbourhood}
                </h3>
                <p className="text-gray-600 mb-6">
                  We don't have any businesses listed for {neighbourhood} yet. Check back soon or explore other areas.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Explore Other Areas
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Other Neighbourhoods */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Areas in Slough</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {CITY.neighbourhoods
                .filter(n => n !== neighbourhood)
                .map((otherNeighbourhood) => (
                  <Link
                    key={otherNeighbourhood}
                    href={`/neighbourhood/${otherNeighbourhood.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200 hover:border-blue-300 text-center"
                  >
                    <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-medium text-gray-900">{otherNeighbourhood}</h3>
                  </Link>
                ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
