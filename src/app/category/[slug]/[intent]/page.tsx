import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { cache } from '@/lib/cache';
import { getCategoryById, CATEGORIES } from '@/config/categories';
import { 
  generateIntentTitle, 
  generateIntentDescription,
  generateItemListStructuredData,
  generateBreadcrumbStructuredData,
  generateMetaTags
} from '@/lib/seo';
import { filterPlacesByIntent } from '@/lib/place-utils';
import { BusinessCard } from '@/components/business-card';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Clock, MapPin, DollarSign, TrendingUp } from 'lucide-react';

interface IntentPageProps {
  params: {
    slug: string;
    intent: string;
  };
}

const VALID_INTENTS = ['best', 'open-now', 'near-me', '24-hours', 'cheap', 'top-rated'];

export async function generateStaticParams() {
  const params: Array<{ slug: string; intent: string }> = [];
  
  for (const category of CATEGORIES) {
    for (const intent of category.intents) {
      params.push({
        slug: category.id,
        intent,
      });
    }
  }
  
  return params;
}

export async function generateMetadata({ params }: IntentPageProps): Promise<Metadata> {
  const category = getCategoryById(params.slug);
  
  if (!category || !VALID_INTENTS.includes(params.intent)) {
    return {
      title: 'Page Not Found',
    };
  }

  const title = generateIntentTitle(category.id, params.intent);
  const description = generateIntentDescription(category.id, params.intent);
  const canonical = `/category/${category.id}/${params.intent}`;

  return generateMetaTags({
    title,
    description,
    canonical,
  });
}

export default async function IntentPage({ params }: IntentPageProps) {
  const category = getCategoryById(params.slug);
  
  if (!category || !VALID_INTENTS.includes(params.intent)) {
    notFound();
  }

  // Get places for this category
  const allPlaces = await cache.getCategoryPlaces(category.id);
  
  // Filter by intent
  const filteredPlaces = filterPlacesByIntent(allPlaces, params.intent);

  // Generate structured data
  const structuredData = generateItemListStructuredData(
    filteredPlaces.slice(0, 20),
    `${params.intent.charAt(0).toUpperCase() + params.intent.slice(1)} ${category.label} in Slough`,
    generateIntentDescription(category.id, params.intent)
  );
  
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: category.label, url: `/category/${category.id}` },
    { name: params.intent.charAt(0).toUpperCase() + params.intent.slice(1) },
  ]);

  const intentLabels: Record<string, { label: string; icon: React.ReactNode; description: string }> = {
    'best': {
      label: 'Best',
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      description: 'Top-rated businesses with excellent reviews'
    },
    'open-now': {
      label: 'Open Now',
      icon: <Clock className="w-6 h-6 text-green-500" />,
      description: 'Currently open and ready to serve you'
    },
    'near-me': {
      label: 'Near Me',
      icon: <MapPin className="w-6 h-6 text-blue-500" />,
      description: 'Closest to your location'
    },
    '24-hours': {
      label: '24 Hours',
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      description: 'Open around the clock'
    },
    'cheap': {
      label: 'Cheap',
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      description: 'Affordable options for budget-conscious customers'
    },
    'top-rated': {
      label: 'Top Rated',
      icon: <TrendingUp className="w-6 h-6 text-orange-500" />,
      description: 'Highest rated businesses with many reviews'
    }
  };

  const intentInfo = intentLabels[params.intent];

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
              <li><Link href={`/category/${category.id}`} className="hover:text-gray-900">
                {category.label}
              </Link></li>
              <li>/</li>
              <li className="text-gray-900">{intentInfo.label}</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{category.icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  {intentInfo.label} {category.label} in Slough
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  {intentInfo.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{filteredPlaces.length} businesses found</span>
              <span>•</span>
              <span>Updated daily</span>
            </div>
          </div>

          {/* Results */}
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place) => (
                <BusinessCard key={place.place_id} place={place} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No {intentInfo.label.toLowerCase()} {category.label.toLowerCase()} found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any {category.label.toLowerCase()} that match your criteria.
                </p>
                <Link
                  href={`/category/${category.id}`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View All {category.label}
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Other Intents */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other {category.label} Options</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {category.intents
                .filter(intent => intent !== params.intent)
                .map((intent) => {
                  const otherIntentInfo = intentLabels[intent];
                  return (
                    <Link
                      key={intent}
                      href={`/category/${category.id}/${intent}`}
                      className="block p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {otherIntentInfo.icon}
                        <span className="font-medium">{otherIntentInfo.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">{otherIntentInfo.description}</p>
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* Back to Category */}
          <div className="mt-8 text-center">
            <Link
              href={`/category/${category.id}`}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              ← Back to All {category.label}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
