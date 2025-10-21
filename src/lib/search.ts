import { cache } from './cache';
import { Place, SearchFilters, SearchResults } from './types';
import { filterPlacesByIntent, sortPlaces } from './place-utils';

export async function searchPlaces(
  query?: string,
  filters: SearchFilters = { sortBy: 'rating', sortOrder: 'desc' },
  page: number = 1,
  limit: number = 20
): Promise<SearchResults> {
  let places: Place[] = [];

  // If we have a search query, search by name
  if (query && query.trim()) {
    places = await cache.searchPlacesByName(query.trim(), 1000); // Get more results for filtering
  } else if (filters.category) {
    // If no query but we have a category filter, get category places
    places = await cache.getCategoryPlaces(filters.category);
  } else {
    // If no query and no category, return empty results
    return {
      places: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };
  }

  // Apply filters
  let filteredPlaces = places;

  // Category filter
  if (filters.category) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.categories.includes(filters.category!)
    );
  }

  // Neighbourhood filter
  if (filters.neighbourhood) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.neighbourhood === filters.neighbourhood
    );
  }

  // Open now filter
  if (filters.openNow) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.opening_hours?.open_now === true
    );
  }

  // Min rating filter
  if (filters.minRating) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.rating && place.rating >= filters.minRating!
    );
  }

  // Price level filter
  if (filters.priceLevel !== undefined) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.price_level === filters.priceLevel
    );
  }

  // Sort results
  filteredPlaces = sortPlaces(filteredPlaces, filters.sortBy, filters.sortOrder);

  // Pagination
  const total = filteredPlaces.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPlaces = filteredPlaces.slice(startIndex, endIndex);
  const hasMore = endIndex < total;

  return {
    places: paginatedPlaces,
    total,
    page,
    limit,
    hasMore,
  };
}

export async function searchPlacesByIntent(
  categoryId: string,
  intent: string,
  filters: SearchFilters = { sortBy: 'rating', sortOrder: 'desc' },
  page: number = 1,
  limit: number = 20
): Promise<SearchResults> {
  // Get all places for the category
  const places = await cache.getCategoryPlaces(categoryId);

  // Apply intent filter
  const intentFilteredPlaces = filterPlacesByIntent(places, intent);

  // Apply additional filters
  let filteredPlaces = intentFilteredPlaces;

  // Neighbourhood filter
  if (filters.neighbourhood) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.neighbourhood === filters.neighbourhood
    );
  }

  // Min rating filter
  if (filters.minRating) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.rating && place.rating >= filters.minRating!
    );
  }

  // Price level filter
  if (filters.priceLevel !== undefined) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.price_level === filters.priceLevel
    );
  }

  // Sort results
  filteredPlaces = sortPlaces(filteredPlaces, filters.sortBy, filters.sortOrder);

  // Pagination
  const total = filteredPlaces.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPlaces = filteredPlaces.slice(startIndex, endIndex);
  const hasMore = endIndex < total;

  return {
    places: paginatedPlaces,
    total,
    page,
    limit,
    hasMore,
  };
}

export async function searchNeighbourhoodPlaces(
  neighbourhood: string,
  categoryId?: string,
  filters: SearchFilters = { sortBy: 'rating', sortOrder: 'desc' },
  page: number = 1,
  limit: number = 20
): Promise<SearchResults> {
  let places: Place[];

  if (categoryId) {
    // Get places for specific neighbourhood and category
    places = await cache.getNeighbourhoodCategoryPlaces(neighbourhood, categoryId);
  } else {
    // Get all places for neighbourhood
    places = await cache.getNeighbourhoodPlaces(neighbourhood);
  }

  // Apply filters
  let filteredPlaces = places;

  // Open now filter
  if (filters.openNow) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.opening_hours?.open_now === true
    );
  }

  // Min rating filter
  if (filters.minRating) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.rating && place.rating >= filters.minRating!
    );
  }

  // Price level filter
  if (filters.priceLevel !== undefined) {
    filteredPlaces = filteredPlaces.filter(place => 
      place.price_level === filters.priceLevel
    );
  }

  // Sort results
  filteredPlaces = sortPlaces(filteredPlaces, filters.sortBy, filters.sortOrder);

  // Pagination
  const total = filteredPlaces.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPlaces = filteredPlaces.slice(startIndex, endIndex);
  const hasMore = endIndex < total;

  return {
    places: paginatedPlaces,
    total,
    page,
    limit,
    hasMore,
  };
}

export async function getTopPicks(
  categoryId: string,
  limit: number = 10
): Promise<Place[]> {
  return await cache.getTopRatedPlaces(categoryId, limit, 50);
}

export async function getMostReviewed(
  categoryId: string,
  limit: number = 10
): Promise<Place[]> {
  return await cache.getMostReviewedPlaces(categoryId, limit);
}
