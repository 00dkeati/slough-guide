import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { cache } from '@/lib/cache';
import { getCategoryById } from '@/config/categories';
import { CITY } from '@/config/city';
import { 
  generateNeighbourhoodTitle, 
  generateNeighbourhoodDescription,
  generateItemListStructuredData,
  generateBreadcrumbStructuredData,
  generateMetaTags
} from '@/lib/seo';
import { BusinessCard } from '@/components/business-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star } from 'lucide-react';

interface NeighbourhoodCategoryPageProps {
  params: {
    name: string;
    category: string;
  };
}

export async function generateStaticParams() {
  const params: Array<{ name: string; category: string }> = [];
  
  for (const neighbourhood of CITY.neighbourhoods) {
    for (const category of ['restaurants', 'takeaways', 'cafes', 'pubs', 'gyms', 'barbers', 'hairdressers']) {
      params.push({
        name: neighbourhood.toLowerCase().replace(/\s+/g, '-'),
        category,
      });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: NeighbourhoodCategoryPageProps): Promise<Metadata> {
  const neighbourhood = CITY.neighbourhoods.find(n => 
    n.toLowerCase().replace(/\s+/g, '-') === params.name
  );
  const category = getCategoryById(params.category);
  
  if (!neighbourhood || !category) {
    return {
      title: 'Page Not Found',
    };
  }

  const title = generateNeighbourhoodTitle(neighbourhood, category.id);
  const description = generateNeighbourhoodDescription(neighbourhood, category.id);
  const canonical = `/neighbourhood/${params.name}/${params.category}`;

  return generateMetaTags({
    title,
    description,
    canonical,
  });
}

export default async function NeighbourhoodCategoryPage({ params }: NeighbourhoodCategoryPageProps) {
  const neighbourhood = CITY.neighbourhoods.find(n => 
    n.toLowerCase().replace(/\s+/g, '-') === params.name
  );
  const category = getCategoryById(params.category);
  
  if (!neighbourhood || !category) {
    notFound();
  }

  // Get places for this neighbourhood and category
  const places = await cache.getNeighbourhoodCategoryPlaces(neighbourhood, category.id);
  
  // Sort by rating
  const sortedPlaces = places.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  // Generate structured data
  const structuredData = generateItemListStructuredData(
    sortedPlaces.slice(0, 20),
    `Best ${category.label} in ${neighbourhood}, Slough`,
    `Discover the best ${category.label.toLowerCase()} in ${neighbourhood}, Slough with reviews, ratings, and contact information.`
  );
  
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: neighbourhood, url: `/neighbourhood/${params.name}` },
    { name: category.label },
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
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
              <li><Link href={`/neighbourhood/${params.name}`} className="hover:text-gray-900">
                {neighbourhood}
              </Link></li>
              <li>/</li>
              <li className="text-gray-900">{category.label}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{category.icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Best {category.label} in {neighbourhood}, Slough
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  {category.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{places.length} businesses found</span>
              <span>•</span>
              <span>{neighbourhood}, Slough</span>
            </div>
          </div>

          {/* Results */}
          {places.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPlaces.map((place) => (
                <BusinessCard key={place.place_id} place={place} showNeighbourhood={false} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {category.label.toLowerCase()} found in {neighbourhood}
                </h3>
                <p className="text-gray-600 mb-6">
                  We don&apos;t have any {category.label.toLowerCase()} listed for {neighbourhood} yet.
                </p>
                <div className="space-y-2">
                  <Link
                    href={`/category/${category.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-2"
                  >
                    View All {category.label} in Slough
                  </Link>
                  <Link
                    href={`/neighbourhood/${params.name}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Explore {neighbourhood}
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Related Links */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Other Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {CITY.neighbourhoods
                      .filter(n => n !== neighbourhood)
                      .slice(0, 5)
                      .map((otherNeighbourhood) => (
                        <Link
                          key={otherNeighbourhood}
                          href={`/neighbourhood/${otherNeighbourhood.toLowerCase().replace(/\s+/g, '-')}/${category.id}`}
                          className="block p-2 rounded hover:bg-gray-100 transition-colors"
                        >
                          {category.label} in {otherNeighbourhood}
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Category Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link
                      href={`/category/${category.id}`}
                      className="block p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      All {category.label} in Slough
                    </Link>
                    <Link
                      href={`/category/${category.id}/best`}
                      className="block p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      Best {category.label} in Slough
                    </Link>
                    <Link
                      href={`/category/${category.id}/open-now`}
                      className="block p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      {category.label} Open Now
                    </Link>
                    <Link
                      href={`/neighbourhood/${params.name}`}
                      className="block p-2 rounded hover:bg-gray-100 transition-colors"
                    >
                      All Businesses in {neighbourhood}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
