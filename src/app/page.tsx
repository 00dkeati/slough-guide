import Link from 'next/link';
import { Metadata } from 'next';
import { cache } from '@/lib/cache';
import { sampleBusinesses } from '@/data/sample-businesses';
import { CATEGORIES, getCategoryById } from '@/config/categories';
import { CITY } from '@/config/city';
import { getTopPicks } from '@/lib/search';
import { BusinessCard } from '@/components/business-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  generateMetaTags,
  generateBreadcrumbStructuredData
} from '@/lib/seo';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone
} from 'lucide-react';

export const metadata: Metadata = generateMetaTags({
  title: 'Slough Guide - Best Local Businesses & Services in Slough, Berkshire',
  description: 'Discover the best restaurants, shops, services and businesses in Slough. Read reviews, check opening hours, and find top-rated local businesses near you.',
  canonical: '/',
});

// Featured categories for the home page
const FEATURED_CATEGORIES = [
  'restaurants',
  'takeaways', 
  'cafes',
  'pubs',
  'gyms',
  'barbers',
  'hairdressers',
  'plumbers',
  'electricians',
  'car_wash',
  'taxi',
  'hotels'
];

export default async function HomePage() {
  // Get top picks for featured categories
  const featuredData = await Promise.all(
    FEATURED_CATEGORIES.map(async (categoryId) => {
      const category = getCategoryById(categoryId);
      const topPicks = await getTopPicks(categoryId, 3);
      return { category, topPicks };
    })
  );

  // Get stats
  let totalPlaces = await cache.getAllPlaces();
  let categoryCounts = await cache.getCategoryCounts();
  
  // If no data in cache, use sample data + generate more businesses
  if (totalPlaces.length === 0) {
    console.log('No data in cache, using sample data + generating more');
    
    // Use sample data as base
    totalPlaces = [...sampleBusinesses] as any;
    
    // Generate additional businesses to make it more realistic
    const { SloughBusinessGenerator } = await import('@/lib/business-generator');
    const generator = new SloughBusinessGenerator();
    const additionalBusinesses = await generator.generateBusinesses({ count: 100 });
    totalPlaces = [...totalPlaces, ...additionalBusinesses] as any;
    
    // Calculate category counts from all data (including generated businesses)
    categoryCounts = {};
    CATEGORIES.forEach(category => {
      const count = totalPlaces.filter((business: any) => 
        business.categories && business.categories.includes(category.id)
      ).length;
      categoryCounts[category.id] = count;
      console.log(`Category ${category.id}: ${count} businesses`);
    });
    console.log(`Total places: ${totalPlaces.length}`);
  }

  // Generate structured data
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home' },
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

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Discover the Best of Slough
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Find top-rated restaurants, services, and businesses in Slough, Berkshire
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <form action="/search" method="GET" className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search restaurants, services, businesses..."
                    className="w-full pl-12 pr-4 py-4 text-lg rounded-lg border-0 focus:ring-2 focus:ring-blue-300"
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    Search
                  </Button>
                </form>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-8 mt-8 text-blue-100">
                <div className="text-center">
                  <div className="text-2xl font-bold">{totalPlaces.length.toLocaleString()}</div>
                  <div className="text-sm">Businesses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{CATEGORIES.length}</div>
                  <div className="text-sm">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{CITY.neighbourhoods.length}</div>
                  <div className="text-sm">Areas</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Popular Categories
              </h2>
              <p className="text-lg text-gray-600">
                Explore the most popular business categories in Slough
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredData.map(({ category, topPicks }) => (
                category && (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="group block p-6 bg-white rounded-lg border hover:shadow-lg transition-all duration-200 hover:border-blue-300"
                  >
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.label}</h3>
                    <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                      <span>{categoryCounts[category.id] || 0} businesses</span>
                      {topPicks.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {topPicks[0].rating?.toFixed(1)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  </Link>
                )
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/categories"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Categories
              </Link>
            </div>
          </div>
        </section>

        {/* Top Picks */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Top Rated Businesses
              </h2>
              <p className="text-lg text-gray-600">
                Discover the highest-rated businesses in Slough
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredData.slice(0, 6).map(({ category, topPicks }) => (
                category && (
                  <div key={category.id}>
                  {topPicks.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          <span>Top {category.label}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {topPicks.map((place) => (
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
                            href={`/category/${category.id}/best`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            View all best {category.label.toLowerCase()} →
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  </div>
                )
              ))}
            </div>
          </div>
        </section>

        {/* Areas */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Explore Slough Areas
              </h2>
              <p className="text-lg text-gray-600">
                Find businesses in your local area
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {CITY.neighbourhoods.map((neighbourhood) => (
                <Link
                  key={neighbourhood}
                  href={`/neighbourhood/${neighbourhood.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group block p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200 hover:border-blue-300 text-center"
                >
                  <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform" />
                  <h3 className="font-medium text-gray-900">{neighbourhood}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <p className="text-lg text-gray-600">
                Find what you need quickly
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Link
                href="/category/restaurants/open-now"
                className="group block p-6 bg-white rounded-lg border hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Open Now</h3>
                    <p className="text-sm text-gray-600">Find restaurants open right now</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/category/takeaways/24-hours"
                className="group block p-6 bg-white rounded-lg border hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">24 Hours</h3>
                    <p className="text-sm text-gray-600">Businesses open around the clock</p>
                  </div>
                </div>
              </Link>

              <Link
                href="/add-business"
                className="group block p-6 bg-white rounded-lg border hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Add Business</h3>
                    <p className="text-sm text-gray-600">List your business with us</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}