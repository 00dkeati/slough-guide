import { z } from 'zod';

// Google Places API Response Schemas
export const GooglePlacePhotoSchema = z.object({
  photo_reference: z.string(),
  width: z.number(),
  height: z.number(),
});

export const GoogleOpeningHoursSchema = z.object({
  weekday_text: z.array(z.string()).optional(),
  open_now: z.boolean().optional(),
});

export const GooglePlaceDetailsSchema = z.object({
  place_id: z.string(),
  name: z.string(),
  formatted_address: z.string().optional(),
  vicinity: z.string().optional(),
  geometry: z.object({
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
  }),
  international_phone_number: z.string().optional(),
  website: z.string().optional(),
  opening_hours: GoogleOpeningHoursSchema.optional(),
  photos: z.array(GooglePlacePhotoSchema).optional(),
  rating: z.number().optional(),
  user_ratings_total: z.number().optional(),
  types: z.array(z.string()),
  business_status: z.string().optional(),
  price_level: z.number().optional(),
  url: z.string().optional(),
});

// Our internal Place schema
export const PlaceSchema = z.object({
  place_id: z.string(),
  name: z.string(),
  slug: z.string(),
  types: z.array(z.string()),
  phone: z.string().optional(),
  website: z.string().optional(),
  formatted_address: z.string().optional(),
  vicinity: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  rating: z.number().optional(),
  user_ratings_total: z.number().optional(),
  opening_hours: GoogleOpeningHoursSchema.optional(),
  photos: z.array(GooglePlacePhotoSchema).optional(),
  google_maps_url: z.string().optional(),
  business_status: z.string().optional(),
  price_level: z.number().optional(),
  last_fetched: z.string(), // ISO date
  categories: z.array(z.string()),
  neighbourhood: z.string().optional(),
  postcode: z.string().optional(),
});

// Type exports
export type GooglePlacePhoto = z.infer<typeof GooglePlacePhotoSchema>;
export type GoogleOpeningHours = z.infer<typeof GoogleOpeningHoursSchema>;
export type GooglePlaceDetails = z.infer<typeof GooglePlaceDetailsSchema>;
export type Place = z.infer<typeof PlaceSchema>;

// AI Enrichment types
export const ReviewSchema = z.object({
  source: z.enum(['google', 'tripadvisor', 'yelp', 'facebook']),
  rating: z.number(),
  text: z.string(),
  author: z.string(),
  date: z.string(),
  helpful: z.number().optional(),
});

export const SEOContentSchema = z.object({
  title: z.string(),
  metaDescription: z.string(),
  keywords: z.string(),
  structuredData: z.any(),
});

export const EnrichedPlaceSchema = PlaceSchema.extend({
  aiGeneratedDescription: z.string(),
  scrapedReviews: z.array(ReviewSchema),
  additionalInfo: z.record(z.string(), z.any()),
  socialMediaLinks: z.record(z.string()),
  amenities: z.array(z.string()),
  seoContent: SEOContentSchema.optional(),
  lastEnriched: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;
export type SEOContent = z.infer<typeof SEOContentSchema>;
export type EnrichedPlace = z.infer<typeof EnrichedPlaceSchema>;

// Search and filter types
export const SearchFiltersSchema = z.object({
  category: z.string().optional(),
  neighbourhood: z.string().optional(),
  openNow: z.boolean().optional(),
  minRating: z.number().min(0).max(5).optional(),
  priceLevel: z.number().min(0).max(4).optional(),
  sortBy: z.enum(['rating', 'reviews', 'name', 'distance']).default('rating'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

// API Response types
export const SearchResultsSchema = z.object({
  places: z.array(PlaceSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  hasMore: z.boolean(),
});

export type SearchResults = z.infer<typeof SearchResultsSchema>;

// Intent types
export type Intent = 'best' | 'open-now' | 'near-me' | '24-hours' | 'cheap' | 'top-rated';

// SEO types
export const SEOMetaSchema = z.object({
  title: z.string(),
  description: z.string(),
  canonical: z.string().optional(),
  openGraph: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    url: z.string().optional(),
  }).optional(),
});

export type SEOMeta = z.infer<typeof SEOMetaSchema>;

// Structured data types
export const LocalBusinessSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('LocalBusiness'),
  name: z.string(),
  description: z.string().optional(),
  address: z.object({
    '@type': z.literal('PostalAddress'),
    streetAddress: z.string().optional(),
    addressLocality: z.string(),
    addressRegion: z.string().optional(),
    postalCode: z.string().optional(),
    addressCountry: z.string(),
  }).optional(),
  geo: z.object({
    '@type': z.literal('GeoCoordinates'),
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  telephone: z.string().optional(),
  url: z.string().optional(),
  image: z.string().optional(),
  aggregateRating: z.object({
    '@type': z.literal('AggregateRating'),
    ratingValue: z.number(),
    reviewCount: z.number(),
  }).optional(),
  openingHoursSpecification: z.array(z.object({
    '@type': z.literal('OpeningHoursSpecification'),
    dayOfWeek: z.array(z.string()),
    opens: z.string().optional(),
    closes: z.string().optional(),
  })).optional(),
});

export type LocalBusiness = z.infer<typeof LocalBusinessSchema>;

export const ItemListSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('ItemList'),
  name: z.string(),
  description: z.string().optional(),
  numberOfItems: z.number(),
  itemListElement: z.array(z.object({
    '@type': z.literal('ListItem'),
    position: z.number(),
    item: LocalBusinessSchema,
  })),
});

export type ItemList = z.infer<typeof ItemListSchema>;

export const BreadcrumbListSchema = z.object({
  '@context': z.literal('https://schema.org'),
  '@type': z.literal('BreadcrumbList'),
  itemListElement: z.array(z.object({
    '@type': z.literal('ListItem'),
    position: z.number(),
    name: z.string(),
    item: z.string().optional(),
  })),
});

export type BreadcrumbList = z.infer<typeof BreadcrumbListSchema>;
