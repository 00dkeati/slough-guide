import slugify from 'slugify';
import { Place, GooglePlaceDetails } from './types';
import { CATEGORIES, getCategoriesByGoogleType } from '@/config/categories';
import { CITY, NEIGHBOURHOOD_COORDS } from '@/config/city';

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Infer neighbourhood from address or coordinates
export function inferNeighbourhood(
  address?: string,
  vicinity?: string,
  lat?: number,
  lng?: number
): string | undefined {
  // First try to match by address/vicinity
  const searchText = `${address || ''} ${vicinity || ''}`.toLowerCase();
  
  for (const neighbourhood of CITY.neighbourhoods) {
    if (searchText.includes(neighbourhood.toLowerCase())) {
      return neighbourhood;
    }
  }
  
  // If no match and we have coordinates, find nearest neighbourhood
  if (lat && lng) {
    let nearestNeighbourhood = '';
    let minDistance = Infinity;
    
    for (const [name, coords] of Object.entries(NEIGHBOURHOOD_COORDS)) {
      const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestNeighbourhood = name;
      }
    }
    
    // Only return if within reasonable distance (5km)
    if (minDistance < 5) {
      return nearestNeighbourhood;
    }
  }
  
  return undefined;
}

// Extract postcode from address
export function extractPostcode(address?: string): string | undefined {
  if (!address) return undefined;
  
  const postcodeRegex = /\b(SL[123]|SL95)\s*\d[A-Z]{2}\b/i;
  const match = address.match(postcodeRegex);
  return match ? match[0] : undefined;
}

// Map Google types to our categories
export function mapGoogleTypesToCategories(googleTypes: string[]): string[] {
  const categories = new Set<string>();
  
  for (const googleType of googleTypes) {
    const matchingCategories = getCategoriesByGoogleType(googleType);
    for (const category of matchingCategories) {
      categories.add(category.id);
    }
  }
  
  return Array.from(categories);
}

// Convert Google Place Details to our Place format
export function convertGooglePlaceToPlace(googlePlace: GooglePlaceDetails): Place {
  const slug = `${slugify(googlePlace.name, { lower: true, strict: true })}-${googlePlace.place_id.slice(-6)}`;
  const categories = mapGoogleTypesToCategories(googlePlace.types);
  const neighbourhood = inferNeighbourhood(
    googlePlace.formatted_address,
    googlePlace.vicinity,
    googlePlace.geometry.location.lat,
    googlePlace.geometry.location.lng
  );
  const postcode = extractPostcode(googlePlace.formatted_address);
  
  return {
    place_id: googlePlace.place_id,
    name: googlePlace.name,
    slug,
    types: googlePlace.types,
    phone: googlePlace.international_phone_number,
    website: googlePlace.website,
    formatted_address: googlePlace.formatted_address,
    vicinity: googlePlace.vicinity,
    lat: googlePlace.geometry.location.lat,
    lng: googlePlace.geometry.location.lng,
    rating: googlePlace.rating,
    user_ratings_total: googlePlace.user_ratings_total,
    opening_hours: googlePlace.opening_hours,
    photos: googlePlace.photos,
    google_maps_url: googlePlace.url,
    business_status: googlePlace.business_status,
    price_level: googlePlace.price_level,
    last_fetched: new Date().toISOString(),
    categories,
    neighbourhood,
    postcode,
  };
}

// Filter places by intent
export function filterPlacesByIntent(places: Place[], intent: string): Place[] {
  switch (intent) {
    case 'best':
      return places
        .filter(place => place.rating && place.rating >= 4.4 && place.user_ratings_total && place.user_ratings_total >= 50)
        .sort((a, b) => {
          if (!a.rating || !b.rating) return 0;
          if (a.rating !== b.rating) return b.rating - a.rating;
          return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
        });
    
    case 'open-now':
      return places.filter(place => place.opening_hours?.open_now === true);
    
    case '24-hours':
      return places.filter(place => 
        place.opening_hours?.weekday_text?.some(hours => 
          hours.toLowerCase().includes('24 hours') || hours.toLowerCase().includes('open 24')
        )
      );
    
    case 'cheap':
      return places.filter(place => 
        place.price_level === 0 || place.price_level === 1
      );
    
    case 'top-rated':
      return places
        .filter(place => place.rating && place.user_ratings_total && place.user_ratings_total >= 20)
        .sort((a, b) => {
          if (!a.rating || !b.rating) return 0;
          return b.rating - a.rating;
        });
    
    case 'near-me':
      // This will be handled by the frontend with geolocation
      return places;
    
    default:
      return places;
  }
}

// Sort places by various criteria
export function sortPlaces(places: Place[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc'): Place[] {
  const sorted = [...places].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0);
        break;
      case 'reviews':
        comparison = (a.user_ratings_total || 0) - (b.user_ratings_total || 0);
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'distance':
        // This will be handled by the frontend with geolocation
        comparison = 0;
        break;
      default:
        // Default: rating desc, then reviews desc
        comparison = (a.rating || 0) - (b.rating || 0);
        if (comparison === 0) {
          comparison = (a.user_ratings_total || 0) - (b.user_ratings_total || 0);
        }
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
}

// Get top picks for a category
export function getTopPicks(places: Place[], limit: number = 10, minReviews: number = 50): Place[] {
  return places
    .filter(place => 
      place.rating && 
      place.rating >= 4.0 && 
      place.user_ratings_total && 
      place.user_ratings_total >= minReviews
    )
    .sort((a, b) => {
      if (!a.rating || !b.rating) return 0;
      if (a.rating !== b.rating) return b.rating - a.rating;
      return (b.user_ratings_total || 0) - (a.user_ratings_total || 0);
    })
    .slice(0, limit);
}

// Check if place is open now
export function isOpenNow(place: Place): boolean | undefined {
  return place.opening_hours?.open_now;
}

// Format opening hours for display
export function formatOpeningHours(place: Place): string[] {
  return place.opening_hours?.weekday_text || [];
}

// Get price level description
export function getPriceLevelDescription(priceLevel?: number): string {
  switch (priceLevel) {
    case 0: return 'Free';
    case 1: return 'Inexpensive';
    case 2: return 'Moderate';
    case 3: return 'Expensive';
    case 4: return 'Very Expensive';
    default: return 'Price not available';
  }
}

// Generate business slug
export function generateBusinessSlug(name: string, placeId: string): string {
  return `${slugify(name, { lower: true, strict: true })}-${placeId.slice(-6)}`;
}
