'use server';

import { searchPlaces, searchPlacesByIntent, searchNeighbourhoodPlaces } from './search';
import { SearchFilters, SearchResults } from './types';

export async function searchPlacesAction(
  query?: string,
  filters: SearchFilters = { sortBy: 'rating', sortOrder: 'desc' },
  page: number = 1,
  limit: number = 20
): Promise<SearchResults> {
  try {
    return await searchPlaces(query, filters, page, limit);
  } catch (error) {
    console.error('Search error:', error);
    return {
      places: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };
  }
}

export async function searchPlacesByIntentAction(
  categoryId: string,
  intent: string,
  filters: SearchFilters = { sortBy: 'rating', sortOrder: 'desc' },
  page: number = 1,
  limit: number = 20
): Promise<SearchResults> {
  try {
    return await searchPlacesByIntent(categoryId, intent, filters, page, limit);
  } catch (error) {
    console.error('Intent search error:', error);
    return {
      places: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };
  }
}

export async function searchNeighbourhoodPlacesAction(
  neighbourhood: string,
  categoryId?: string,
  filters: SearchFilters = { sortBy: 'rating', sortOrder: 'desc' },
  page: number = 1,
  limit: number = 20
): Promise<SearchResults> {
  try {
    return await searchNeighbourhoodPlaces(neighbourhood, categoryId, filters, page, limit);
  } catch (error) {
    console.error('Neighbourhood search error:', error);
    return {
      places: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };
  }
}
