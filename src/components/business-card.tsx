import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/ui/rating-stars';
import { Place } from '@/lib/types';
import { getCategoryById } from '@/config/categories';
import { isOpenNow, getPriceLevelDescription } from '@/lib/place-utils';
import { 
  Phone, 
  Globe, 
  MapPin, 
  Clock, 
  ExternalLink
} from 'lucide-react';

// Flexible Place type for BusinessCard
type BusinessCardPlace = Omit<Place, 'photos'> & {
  photos?: { photo_reference: string; width: number; height: number; }[] | string[];
};

interface BusinessCardProps {
  place: BusinessCardPlace;
  showNeighbourhood?: boolean;
  showCategories?: boolean;
  className?: string;
}

export function BusinessCard({ 
  place, 
  showNeighbourhood = true,
  showCategories = true,
  className 
}: BusinessCardProps) {
  const primaryCategory = getCategoryById(place.types[0]);
  const isOpen = isOpenNow(place);
  const priceLevel = getPriceLevelDescription(place.price_level);

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardContent className="p-0">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          {place.photos && place.photos.length > 0 ? (
            <Image
              src={`/api/photo?ref=${typeof place.photos[0] === 'string' ? place.photos[0] : place.photos[0].photo_reference}&w=400`}
              alt={`${place.name} in Slough`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl">{primaryCategory?.icon || '📍'}</span>
            </div>
          )}
          
          {/* Open Now Badge */}
          {isOpen === true && (
            <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">
              <Clock className="w-3 h-3 mr-1" />
              Open Now
            </Badge>
          )}
          
          {/* Price Level Badge */}
          {place.price_level !== undefined && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              {priceLevel}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Name and Rating */}
          <div className="mb-3">
            <Link 
              href={`/business/${place.slug}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
            >
              {place.name}
            </Link>
            
            <div className="flex items-center gap-2 mt-1">
              {place.rating && (
                <RatingStars rating={place.rating} size="sm" showNumber />
              )}
              {place.user_ratings_total && (
                <span className="text-sm text-gray-500">
                  ({place.user_ratings_total} reviews)
                </span>
              )}
            </div>
          </div>

          {/* Categories */}
          {showCategories && place.types.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {place.types.slice(0, 2).map(typeId => {
                const category = getCategoryById(typeId);
                return (
                  <Badge key={typeId} variant="outline" className="text-xs">
                    {category?.icon} {category?.label || typeId}
                  </Badge>
                );
              })}
              {place.types.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{place.types.length - 2} more
                </Badge>
              )}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {place.vicinity || place.formatted_address}
            </span>
          </div>

          {/* Neighbourhood */}
          {showNeighbourhood && place.neighbourhood && (
            <div className="mb-3">
              <Badge variant="secondary" className="text-xs">
                {place.neighbourhood}
              </Badge>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {place.phone && (
              <Button size="sm" variant="outline" asChild className="flex-1">
                <a href={`tel:${place.phone}`}>
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </a>
              </Button>
            )}
            
            {place.website && (
              <Button size="sm" variant="outline" asChild className="flex-1">
                <a href={place.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-1" />
                  Website
                </a>
              </Button>
            )}
            
            {place.google_maps_url && (
              <Button size="sm" variant="outline" asChild className="flex-1">
                <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Directions
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
