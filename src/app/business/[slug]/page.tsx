import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { cache } from '@/lib/cache';
import { getCategoryById } from '@/config/categories';
import { 
  generateBusinessTitle, 
  generateBusinessDescription,
  generateLocalBusinessStructuredData,
  generateBreadcrumbStructuredData,
  generateMetaTags
} from '@/lib/seo';
import { formatOpeningHours, getPriceLevelDescription, isOpenNow } from '@/lib/place-utils';
import { BusinessCard } from '@/components/business-card';
import { RatingStars } from '@/components/ui/rating-stars';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Phone, 
  Globe, 
  MapPin, 
  Clock, 
  Navigation
} from 'lucide-react';

interface BusinessPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await cache.findPlaceBySlug(slug);
  
  if (!place) {
    return {
      title: 'Business Not Found',
    };
  }

  const title = generateBusinessTitle(place);
  const description = generateBusinessDescription(place);
  const canonical = `/business/${place.slug}`;

  return generateMetaTags({
    title,
    description,
    canonical,
    openGraph: {
      title,
      description,
      image: place.photos?.[0] ? `/api/photo?ref=${typeof place.photos[0] === 'string' ? place.photos[0] : place.photos[0].photo_reference}&w=1200` : undefined,
      url: canonical,
    },
  });
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const place = await cache.findPlaceBySlug(slug);
  
  if (!place) {
    notFound();
  }

  const primaryCategory = getCategoryById(place.categories?.[0] || place.types?.[0] || '');
  const isOpen = isOpenNow(place);
  const priceLevel = getPriceLevelDescription(place.price_level);
  const openingHours = formatOpeningHours(place);

  // Get related places in the same neighbourhood and category
  const categoryId = place.categories?.[0] || place.types?.[0] || '';
  const relatedPlaces = await cache.getNeighbourhoodCategoryPlaces(
    place.neighbourhood || '',
    categoryId
  );
  const filteredRelatedPlaces = relatedPlaces
    .filter(p => p.place_id !== place.place_id)
    .slice(0, 6);

  // Generate structured data
  const structuredData = generateLocalBusinessStructuredData(place);
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: primaryCategory?.label || 'Business', url: `/category/${categoryId}` },
    { name: place.name },
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
              <li><Link href={`/category/${categoryId}`} className="hover:text-gray-900">
                {primaryCategory?.label || categoryId}
              </Link></li>
              <li>/</li>
              <li className="text-gray-900">{place.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Business Info */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h1>
                    
                    <div className="flex items-center gap-4 mb-4">
                      {place.rating && (
                        <div className="flex items-center gap-2">
                          <RatingStars rating={place.rating} size="lg" showNumber />
                          {place.user_ratings_total && (
                            <span className="text-gray-600">
                              ({place.user_ratings_total} reviews)
                            </span>
                          )}
                        </div>
                      )}
                      
                      {isOpen !== undefined && (
                        <Badge variant={isOpen ? "default" : "secondary"} className="gap-1">
                          <Clock className="w-3 h-3" />
                          {isOpen ? 'Open Now' : 'Closed'}
                        </Badge>
                      )}
                      
                      {place.price_level !== undefined && (
                        <Badge variant="outline">{priceLevel}</Badge>
                      )}
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(place.categories || place.types || []).map(categoryId => {
                        const category = getCategoryById(categoryId);
                        return (
                          <Badge key={categoryId} variant="outline">
                            {category?.icon} {category?.label || categoryId}
                          </Badge>
                        );
                      })}
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2 text-gray-600 mb-4">
                      <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        {place.formatted_address && (
                          <p className="font-medium">{place.formatted_address}</p>
                        )}
                        {place.neighbourhood && (
                          <p className="text-sm">{place.neighbourhood}, Slough</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {place.phone && (
                        <Button asChild>
                          <a href={`tel:${place.phone}`}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </a>
                        </Button>
                      )}
                      
                      {place.website && (
                        <Button variant="outline" asChild>
                          <a href={place.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                      
                      {place.google_maps_url && (
                        <Button variant="outline" asChild>
                          <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer">
                            <Navigation className="w-4 h-4 mr-2" />
                            Directions
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Photo */}
                  {place.photos && place.photos.length > 0 && (
                    <div className="w-full md:w-48 h-48 relative rounded-lg overflow-hidden">
                      <Image
                        src={`/api/photo?ref=${typeof place.photos[0] === 'string' ? place.photos[0] : place.photos[0].photo_reference}&w=400`}
                        alt={`${place.name} in Slough`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 200px"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Gallery */}
              {place.photos && place.photos.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Photos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {place.photos.slice(1, 9).map((photo, index) => (
                        <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                          <Image
                            src={`/api/photo?ref=${typeof photo === 'string' ? photo : photo.photo_reference}&w=300`}
                            alt={`${place.name} photo ${index + 2} in Slough`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Opening Hours */}
              {openingHours.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Opening Hours</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {openingHours.map((hours, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium">{hours.split(': ')[0]}</span>
                          <span className="text-gray-600">{hours.split(': ')[1]}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Map */}
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`https://maps.googleapis.com/maps/api/staticmap?center=${place.lat},${place.lng}&zoom=15&size=400x200&markers=${place.lat},${place.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`}
                      alt={`Map showing ${place.name} location`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {place.lat.toFixed(6)}, {place.lng.toFixed(6)}
                  </p>
                </CardContent>
              </Card>

              {/* Related Places */}
              {filteredRelatedPlaces.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Also in {place.neighbourhood}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredRelatedPlaces.map(relatedPlace => (
                        <BusinessCard
                          key={relatedPlace.place_id}
                          place={relatedPlace}
                          showNeighbourhood={false}
                          showCategories={false}
                          className="shadow-none border-0"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
