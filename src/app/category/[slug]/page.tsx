import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { cache } from '@/lib/cache';
import { sampleBusinesses } from '@/data/sample-businesses';
import { getCategoryById, CATEGORIES } from '@/config/categories';
import { 
  generateCategoryTitle, 
  generateCategoryDescription,
  generateItemListStructuredData,
  generateBreadcrumbStructuredData,
  generateMetaTags
} from '@/lib/seo';
import { getTopPicks } from '@/lib/search';
import { BusinessCard } from '@/components/business-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Clock, MapPin, DollarSign, TrendingUp } from 'lucide-react';

type Place = {
  place_id: string;
  name: string;
  slug?: string;
  rating?: number;
  address?: string;
  photos?: string[];
  categories?: string[];
  opening_hours?: any;
  price_level?: number;
  user_ratings_total?: number;
  formatted_address?: string;
  types?: string[];
  lat?: number;
  lng?: number;
  last_fetched?: string;
  phone?: string;
  website?: string;
  neighbourhood?: string;
  vicinity?: string;
  business_status?: string;
};

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.id,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryById(params.slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const title = generateCategoryTitle(category.id);
  const description = generateCategoryDescription(category.id);
  const canonical = `/category/${category.id}`;

  return generateMetaTags({
    title,
    description,
    canonical,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryById(params.slug);
  
  if (!category) {
    notFound();
  }

  // Get places for this category
  let allPlaces = await cache.getCategoryPlaces(category.id);
  let topPicks: Place[] = [];
  
  // If no data in cache, use sample data
  if (allPlaces.length === 0) {
    console.log('No data in cache, using sample data for category:', category.id);
    allPlaces = sampleBusinesses.filter(business => 
      business.categories.includes(category.id)
    ) as any;
    
    // Get top picks from sample data
    topPicks = allPlaces
      .filter(place => place.rating && place.user_ratings_total && place.user_ratings_total >= 5)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10);
  } else {
    topPicks = await getTopPicks(category.id, 10);
  }

  // Generate structured data
  const structuredData = generateItemListStructuredData(
    allPlaces.slice(0, 20),
    `Best ${category.label} in Slough`,
    `Discover the best ${category.label.toLowerCase()} in Slough with reviews, ratings, and contact information.`
  );
  
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
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
              <li className="text-gray-900">{category.label}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{category.icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Best {category.label} in Slough
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  {category.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{allPlaces.length} businesses found</span>
              <span>•</span>
              <span>Updated daily</span>
            </div>
          </div>

          {/* Intent Tabs */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="best">Best</TabsTrigger>
              <TabsTrigger value="open-now">Open Now</TabsTrigger>
              <TabsTrigger value="24-hours">24 Hours</TabsTrigger>
              <TabsTrigger value="cheap">Cheap</TabsTrigger>
              <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPlaces.map((place) => (
                  <BusinessCard key={place.place_id} place={place} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="best" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topPicks.map((place) => (
                  <BusinessCard key={place.place_id} place={place} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="open-now" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPlaces
                  .filter(place => place.opening_hours?.open_now === true)
                  .map((place) => (
                    <BusinessCard key={place.place_id} place={place} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="24-hours" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPlaces
                  .filter(place => 
                    place.opening_hours?.weekday_text?.some(hours => 
                      hours.toLowerCase().includes('24 hours') || hours.toLowerCase().includes('open 24')
                    )
                  )
                  .map((place) => (
                    <BusinessCard key={place.place_id} place={place} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="cheap" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPlaces
                  .filter(place => place.price_level === 0 || place.price_level === 1)
                  .map((place) => (
                    <BusinessCard key={place.place_id} place={place} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="top-rated" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allPlaces
                  .filter(place => place.rating && place.user_ratings_total && place.user_ratings_total >= 20)
                  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                  .map((place) => (
                    <BusinessCard key={place.place_id} place={place} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Links */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {category.intents.map((intent) => (
                <Link
                  key={intent}
                  href={`/category/${category.id}/${intent}`}
                  className="block p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2">
                    {intent === 'best' && <Star className="w-5 h-5 text-yellow-500" />}
                    {intent === 'open-now' && <Clock className="w-5 h-5 text-green-500" />}
                    {intent === 'near-me' && <MapPin className="w-5 h-5 text-blue-500" />}
                    {intent === '24-hours' && <Clock className="w-5 h-5 text-purple-500" />}
                    {intent === 'cheap' && <DollarSign className="w-5 h-5 text-green-500" />}
                    {intent === 'top-rated' && <TrendingUp className="w-5 h-5 text-orange-500" />}
                    <span className="font-medium capitalize">
                      {intent.replace('-', ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Related Categories */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CATEGORIES
                .filter(cat => cat.id !== category.id && cat.googleTypes.some(type => category.googleTypes.includes(type)))
                .slice(0, 8)
                .map((relatedCategory) => (
                  <Link
                    key={relatedCategory.id}
                    href={`/category/${relatedCategory.id}`}
                    className="block p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{relatedCategory.icon}</span>
                      <span className="font-medium">{relatedCategory.label}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
