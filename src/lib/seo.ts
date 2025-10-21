import { format } from 'date-fns';
import { Place, LocalBusiness, ItemList, BreadcrumbList } from './types';
import { getCategoryById } from '@/config/categories';

const SITE_CANONICAL = process.env.SITE_CANONICAL || 'https://www.sloughguide.co.uk';

// SEO title and description generators
export function generateCategoryTitle(categoryId: string, year?: number): string {
  const category = getCategoryById(categoryId);
  const currentYear = year || new Date().getFullYear();
  return `Best ${category?.label || categoryId} in Slough (${currentYear}) – Top Rated ${category?.label || categoryId} Near You`;
}

export function generateCategoryDescription(categoryId: string): string {
  const category = getCategoryById(categoryId);
  return `Discover the best ${category?.label?.toLowerCase() || categoryId} in Slough. Read reviews, check opening hours, and find top-rated ${category?.label?.toLowerCase() || categoryId} near you.`;
}

export function generateIntentTitle(categoryId: string, intent: string): string {
  const category = getCategoryById(categoryId);
  const intentLabels: Record<string, string> = {
    'best': 'Best',
    'open-now': 'Open Now',
    'near-me': 'Near Me',
    '24-hours': '24 Hours',
    'cheap': 'Cheap',
    'top-rated': 'Top Rated'
  };
  
  const intentLabel = intentLabels[intent] || intent;
  const month = format(new Date(), 'MMMM');
  const year = new Date().getFullYear();
  
  return `${intentLabel} ${category?.label || categoryId} in Slough – ${month} ${year}`;
}

export function generateIntentDescription(categoryId: string, intent: string): string {
  const category = getCategoryById(categoryId);
  const intentDescriptions: Record<string, string> = {
    'best': `Find the best ${category?.label?.toLowerCase() || categoryId} in Slough with top ratings and reviews.`,
    'open-now': `Discover ${category?.label?.toLowerCase() || categoryId} that are currently open in Slough.`,
    'near-me': `Find ${category?.label?.toLowerCase() || categoryId} near your location in Slough.`,
    '24-hours': `Discover ${category?.label?.toLowerCase() || categoryId} that are open 24 hours in Slough.`,
    'cheap': `Find affordable ${category?.label?.toLowerCase() || categoryId} in Slough.`,
    'top-rated': `Browse the highest rated ${category?.label?.toLowerCase() || categoryId} in Slough.`
  };
  
  return intentDescriptions[intent] || `Find ${category?.label?.toLowerCase() || categoryId} in Slough.`;
}

export function generateNeighbourhoodTitle(neighbourhood: string, categoryId?: string): string {
  if (categoryId) {
    const category = getCategoryById(categoryId);
    return `Best ${category?.label || categoryId} in ${neighbourhood}, Slough – Top Picks`;
  }
  return `Best Places in ${neighbourhood}, Slough – Local Guide`;
}

export function generateNeighbourhoodDescription(neighbourhood: string, categoryId?: string): string {
  if (categoryId) {
    const category = getCategoryById(categoryId);
    return `Discover the best ${category?.label?.toLowerCase() || categoryId} in ${neighbourhood}, Slough. Local recommendations and reviews.`;
  }
  return `Explore the best places in ${neighbourhood}, Slough. Find restaurants, shops, services and more in your local area.`;
}

export function generateBusinessTitle(place: Place): string {
  const primaryCategory = place.categories?.[0] || place.types?.[0] || 'business';
  const category = getCategoryById(primaryCategory);
  return `${place.name} – ${category?.label || primaryCategory} in Slough | Reviews, Hours, Phone`;
}

export function generateBusinessDescription(place: Place): string {
  const primaryCategory = place.categories?.[0] || place.types?.[0] || 'business';
  const category = getCategoryById(primaryCategory);
  const rating = place.rating ? ` Rated ${place.rating}/5` : '';
  const reviews = place.user_ratings_total ? ` with ${place.user_ratings_total} reviews` : '';
  
  return `${place.name} is a ${category?.label?.toLowerCase() || primaryCategory} in Slough.${rating}${reviews}. Check opening hours, contact details and more.`;
}

// Structured data generators
export function generateLocalBusinessStructuredData(place: Place): LocalBusiness {
  const primaryCategory = place.categories?.[0] || place.types?.[0] || 'business';
  const category = getCategoryById(primaryCategory);
  
  const structuredData: LocalBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: place.name,
    description: category?.description || `${category?.label || primaryCategory} in Slough`,
  };

  // Address
  if (place.formatted_address) {
    structuredData.address = {
      '@type': 'PostalAddress',
      addressLocality: 'Slough',
      addressRegion: 'Berkshire',
      addressCountry: 'GB',
    };

    // Try to extract street address and postcode
    const addressParts = place.formatted_address.split(', ');
    if (addressParts.length > 0) {
      structuredData.address.streetAddress = addressParts[0];
    }
    if (place.postcode) {
      structuredData.address.postalCode = place.postcode;
    }
  }

  // Geo coordinates
  structuredData.geo = {
    '@type': 'GeoCoordinates',
    latitude: place.lat,
    longitude: place.lng,
  };

  // Contact information
  if (place.phone) {
    structuredData.telephone = place.phone;
  }
  if (place.website) {
    structuredData.url = place.website;
  }

  // Rating
  if (place.rating && place.user_ratings_total) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: place.rating,
      reviewCount: place.user_ratings_total,
    };
  }

  // Opening hours
  if (place.opening_hours?.weekday_text) {
    structuredData.openingHoursSpecification = place.opening_hours.weekday_text.map(dayText => {
      const [day, hours] = dayText.split(': ');
      const dayMap: Record<string, string> = {
        'Monday': 'Monday',
        'Tuesday': 'Tuesday',
        'Wednesday': 'Wednesday',
        'Thursday': 'Thursday',
        'Friday': 'Friday',
        'Saturday': 'Saturday',
        'Sunday': 'Sunday',
      };
      
      let opens: string | undefined;
      let closes: string | undefined;
      
      if (hours && hours !== 'Closed') {
        const timeMatch = hours.match(/(\d{1,2}:\d{2})\s*(AM|PM)?\s*–\s*(\d{1,2}:\d{2})\s*(AM|PM)?/i);
        if (timeMatch) {
          opens = timeMatch[1] + (timeMatch[2] || '');
          closes = timeMatch[3] + (timeMatch[4] || '');
        }
      }
      
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [dayMap[day] || day],
        opens,
        closes,
      };
    });
  }

  // Image
  if (place.photos && place.photos.length > 0) {
    structuredData.image = `/api/photo?ref=${place.photos[0].photo_reference}&w=800`;
  }

  return structuredData;
}

export function generateItemListStructuredData(
  places: Place[],
  listName: string,
  description?: string
): ItemList {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description,
    numberOfItems: places.length,
    itemListElement: places.map((place, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateLocalBusinessStructuredData(place),
    })),
  };
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url?: string }>): BreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url ? `${SITE_CANONICAL}${crumb.url}` : undefined,
    })),
  };
}

// URL generators
export function generateCanonicalUrl(path: string): string {
  return `${SITE_CANONICAL}${path}`;
}

export function generateOpenGraphUrl(path: string): string {
  return `${SITE_CANONICAL}${path}`;
}

// Meta tag helpers
export function generateMetaTags({
  title,
  description,
  canonical,
  openGraph,
}: {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
}) {
  return {
    title,
    description,
    canonical: canonical || generateCanonicalUrl('/'),
    openGraph: {
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      image: openGraph?.image,
      url: openGraph?.url || generateOpenGraphUrl('/'),
      siteName: 'Slough Guide',
      locale: 'en_GB',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: openGraph?.title || title,
      description: openGraph?.description || description,
      image: openGraph?.image,
    },
  };
}
