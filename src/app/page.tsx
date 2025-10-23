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
import { SloughBusinessGenerator } from '@/lib/business-generator';
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

// Force dynamic rendering to show generated businesses
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  return generateMetaTags({
    title: 'Slough Guide - Best Local Businesses & Services in Slough, Berkshire',
    description: 'Discover the best restaurants, shops, services and businesses in Slough. Read reviews, check opening hours, and find top-rated local businesses near you.',
    canonical: '/',
  });
}

// Add a timestamp to force dynamic rendering
const timestamp = Date.now();
let requestCount = 0;

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
  requestCount++;
  console.log(`HomePage request #${requestCount} at ${new Date().toISOString()}`);
  
  // Get top picks for featured categories
  const featuredData = await Promise.all(
    FEATURED_CATEGORIES.map(async (categoryId) => {
      const category = getCategoryById(categoryId);
      const topPicks = await getTopPicks(categoryId, 3);
      return { category, topPicks };
    })
  );

      // Generate businesses directly without API dependency
      console.log('Generating businesses directly...');
      
      let totalPlaces: any[] = [];
      let categoryCounts: Record<string, number> = {};
      
      // Use sample data as base
      totalPlaces = [...sampleBusinesses] as any;
      
      // Add static additional businesses
      const staticBusinesses = [
        {
          place_id: 'static_1',
          name: 'The Golden Dragon',
          slug: 'the-golden-dragon',
          types: ['restaurant'],
          lat: 51.5115,
          lng: -0.5945,
          last_fetched: new Date().toISOString(),
          categories: ['restaurants'],
          formatted_address: 'High Street, Slough SL1 1DH, UK',
          vicinity: 'Slough',
          phone: '+44 1753 521234',
          rating: 4.3,
          user_ratings_total: 89,
          price_level: 2,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 12:00 PM – 10:00 PM'] },
          photos: []
        },
        {
          place_id: 'static_2',
          name: 'Slough Pizza Palace',
          slug: 'slough-pizza-palace',
          types: ['meal_takeaway'],
          lat: 51.5120,
          lng: -0.5930,
          last_fetched: new Date().toISOString(),
          categories: ['takeaways'],
          formatted_address: 'Windsor Road, Slough SL1 2EJ, UK',
          vicinity: 'Slough',
          phone: '+44 1753 523456',
          rating: 4.1,
          user_ratings_total: 156,
          price_level: 1,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 5:00 PM – 11:00 PM'] },
          photos: []
        },
        {
          place_id: 'static_3',
          name: 'Cafe Central',
          slug: 'cafe-central',
          types: ['cafe'],
          lat: 51.5098,
          lng: -0.5958,
          last_fetched: new Date().toISOString(),
          categories: ['cafes'],
          formatted_address: 'Queensmere Shopping Centre, Slough SL1 1DB, UK',
          vicinity: 'Slough',
          phone: '+44 1753 524567',
          rating: 4.2,
          user_ratings_total: 234,
          price_level: 2,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 7:00 AM – 7:00 PM'] },
          photos: []
        },
        {
          place_id: 'static_4',
          name: 'The Crown Inn',
          slug: 'the-crown-inn',
          types: ['bar'],
          lat: 51.5102,
          lng: -0.5952,
          last_fetched: new Date().toISOString(),
          categories: ['pubs'],
          formatted_address: 'High Street, Slough SL1 1DH, UK',
          vicinity: 'Slough',
          phone: '+44 1753 525678',
          rating: 4.0,
          user_ratings_total: 178,
          price_level: 2,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: false, weekday_text: ['Monday: 12:00 PM – 11:00 PM'] },
          photos: []
        },
        {
          place_id: 'static_5',
          name: 'FitLife Gym',
          slug: 'fitlife-gym',
          types: ['gym'],
          lat: 51.5125,
          lng: -0.5925,
          last_fetched: new Date().toISOString(),
          categories: ['gyms'],
          formatted_address: 'Trading Estate, Slough SL1 4QP, UK',
          vicinity: 'Slough',
          phone: '+44 1753 526789',
          rating: 4.4,
          user_ratings_total: 312,
          price_level: 2,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 6:00 AM – 10:00 PM'] },
          photos: []
        },
        {
          place_id: 'static_6',
          name: 'Tony\'s Barber Shop',
          slug: 'tonys-barber-shop',
          types: ['hair_care'],
          lat: 51.5108,
          lng: -0.5942,
          last_fetched: new Date().toISOString(),
          categories: ['barbers'],
          formatted_address: 'Church Street, Slough SL1 1DH, UK',
          vicinity: 'Slough',
          phone: '+44 1753 527890',
          rating: 4.5,
          user_ratings_total: 67,
          price_level: 1,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 9:00 AM – 6:00 PM'] },
          photos: []
        },
        {
          place_id: 'static_7',
          name: 'Belle Hair Salon',
          slug: 'belle-hair-salon',
          types: ['hair_care'],
          lat: 51.5112,
          lng: -0.5935,
          last_fetched: new Date().toISOString(),
          categories: ['hairdressers'],
          formatted_address: 'High Street, Slough SL1 1DH, UK',
          vicinity: 'Slough',
          phone: '+44 1753 528901',
          rating: 4.4,
          user_ratings_total: 123,
          price_level: 2,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 9:00 AM – 7:00 PM'] },
          photos: []
        },
        {
          place_id: 'static_8',
          name: 'Quick Fix Plumbing',
          slug: 'quick-fix-plumbing',
          types: ['plumber'],
          lat: 51.5128,
          lng: -0.5920,
          last_fetched: new Date().toISOString(),
          categories: ['plumbers'],
          formatted_address: 'Trading Estate, Slough SL1 4QP, UK',
          vicinity: 'Slough',
          phone: '+44 1753 529012',
          rating: 4.6,
          user_ratings_total: 89,
          price_level: 2,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 8:00 AM – 5:00 PM'] },
          photos: []
        },
        {
          place_id: 'static_9',
          name: 'Spark Electric',
          slug: 'spark-electric',
          types: ['electrician'],
          lat: 51.5132,
          lng: -0.5915,
          last_fetched: new Date().toISOString(),
          categories: ['electricians'],
          formatted_address: 'Trading Estate, Slough SL1 4QP, UK',
          vicinity: 'Slough',
          phone: '+44 1753 530123',
          rating: 4.7,
          user_ratings_total: 156,
          price_level: 2,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 8:00 AM – 5:00 PM'] },
          photos: []
        },
        {
          place_id: 'static_10',
          name: 'Clean Car Wash',
          slug: 'clean-car-wash',
          types: ['car_wash'],
          lat: 51.5135,
          lng: -0.5910,
          last_fetched: new Date().toISOString(),
          categories: ['car_wash'],
          formatted_address: 'Trading Estate, Slough SL1 4QP, UK',
          vicinity: 'Slough',
          phone: '+44 1753 531234',
          rating: 4.3,
          user_ratings_total: 234,
          price_level: 1,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 8:00 AM – 6:00 PM'] },
          photos: []
        },
        {
          place_id: 'static_11',
          name: 'Slough Taxi Service',
          slug: 'slough-taxi-service',
          types: ['taxi_stand'],
          lat: 51.5105,
          lng: -0.5948,
          last_fetched: new Date().toISOString(),
          categories: ['taxi'],
          formatted_address: 'High Street, Slough SL1 1DH, UK',
          vicinity: 'Slough',
          phone: '+44 1753 532345',
          rating: 4.2,
          user_ratings_total: 178,
          price_level: 2,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 24 hours'] },
          photos: []
        },
        {
          place_id: 'static_12',
          name: 'Premier Inn Slough',
          slug: 'premier-inn-slough',
          types: ['lodging'],
          lat: 51.5095,
          lng: -0.5965,
          last_fetched: new Date().toISOString(),
          categories: ['hotels'],
          formatted_address: 'Queensmere Shopping Centre, Slough SL1 1DB, UK',
          vicinity: 'Slough',
          phone: '+44 1753 533456',
          rating: 4.1,
          user_ratings_total: 312,
          price_level: 2,
          business_status: 'OPERATIONAL',
          opening_hours: { open_now: true, weekday_text: ['Monday: 24 hours'] },
          photos: []
        }
      ];
      
      totalPlaces = [...totalPlaces, ...staticBusinesses] as any;
  
  // Calculate category counts from all data
  categoryCounts = {};
  CATEGORIES.forEach(category => {
    categoryCounts[category.id] = totalPlaces.filter((business: any) => 
      business.categories && business.categories.includes(category.id)
    ).length;
  });
  
  console.log(`Total businesses: ${totalPlaces.length}`);
  console.log('Category counts:', categoryCounts);
  console.log('Page rendered at:', new Date(timestamp).toISOString());
  console.log('Current time:', new Date().toISOString());

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
              <div className="text-center mt-4 text-blue-200 text-xs">
                Rendered at: {new Date().toISOString()} | Request #{requestCount}
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