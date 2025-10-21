import axios from 'axios';
import { GooglePlaceDetails, GooglePlaceDetailsSchema } from './types';

const GOOGLE_MAPS_API_KEY = process.env.Google_places_api;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// Only check for API key when actually making requests (not during build)
const checkApiKey = () => {
  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Google_places_api environment variable is required');
  }
};

// Rate limiting: Google allows 50 requests per second
const RATE_LIMIT_DELAY = 20; // 20ms between requests = 50 requests per second
let lastRequestTime = 0;

async function rateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
}

interface GooglePlacesResponse<T> {
  results: T[];
  status: string;
  next_page_token?: string;
  error_message?: string;
}

interface GooglePlaceDetailsResponse {
  result: GooglePlaceDetails;
  status: string;
  error_message?: string;
}

export async function placesTextSearch(
  query: string,
  pageToken?: string
): Promise<{ results: unknown[]; nextPageToken?: string }> {
  checkApiKey();
  await rateLimit();
  
  const params = new URLSearchParams({
    query,
    key: GOOGLE_MAPS_API_KEY || '',
    fields: 'place_id,name,formatted_address,geometry,types,business_status',
  });

  if (pageToken) {
    params.append('pagetoken', pageToken);
  }

  try {
    const response = await axios.get<GooglePlacesResponse<unknown>>(
      `${BASE_URL}/textsearch/json?${params}`
    );

    if (response.data.status === 'ZERO_RESULTS') {
      return { results: [] };
    }

    if (response.data.status !== 'OK') {
      throw new Error(`Google Places API error: ${response.data.status} - ${response.data.error_message}`);
    }

    return {
      results: response.data.results,
      nextPageToken: response.data.next_page_token,
    };
  } catch (error) {
    console.error('Error in placesTextSearch:', error);
    throw error;
  }
}

export async function placesNearby(
  lat: number,
  lng: number,
  type: string,
  radius: number = 7000,
  pageToken?: string
): Promise<{ results: unknown[]; nextPageToken?: string }> {
  checkApiKey();
  await rateLimit();
  
  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    radius: radius.toString(),
    type,
    key: GOOGLE_MAPS_API_KEY || '',
    fields: 'place_id,name,formatted_address,geometry,types,business_status',
  });

  if (pageToken) {
    params.append('pagetoken', pageToken);
  }

  try {
    const response = await axios.get<GooglePlacesResponse<unknown>>(
      `${BASE_URL}/nearbysearch/json?${params}`
    );

    if (response.data.status === 'ZERO_RESULTS') {
      return { results: [] };
    }

    if (response.data.status !== 'OK') {
      throw new Error(`Google Places API error: ${response.data.status} - ${response.data.error_message}`);
    }

    return {
      results: response.data.results,
      nextPageToken: response.data.next_page_token,
    };
  } catch (error) {
    console.error('Error in placesNearby:', error);
    throw error;
  }
}

export async function placeDetails(placeId: string): Promise<GooglePlaceDetails> {
  checkApiKey();
  await rateLimit();
  
  const params = new URLSearchParams({
    place_id: placeId,
    key: GOOGLE_MAPS_API_KEY || '',
    fields: [
      'name',
      'formatted_address',
      'geometry',
      'international_phone_number',
      'website',
      'opening_hours',
      'photos',
      'rating',
      'user_ratings_total',
      'types',
      'utc_offset_minutes',
      'business_status',
      'price_level',
      'url',
      'vicinity'
    ].join(','),
  });

  try {
    const response = await axios.get<GooglePlaceDetailsResponse>(
      `${BASE_URL}/details/json?${params}`
    );

    if (response.data.status !== 'OK') {
      throw new Error(`Google Places API error: ${response.data.status} - ${response.data.error_message}`);
    }

    // Validate the response with Zod
    const validatedResult = GooglePlaceDetailsSchema.parse(response.data.result);
    return validatedResult;
  } catch (error) {
    console.error('Error in placeDetails:', error);
    throw error;
  }
}

export function placePhotoUrl(photoReference: string, maxWidth: number = 800): string {
  return `/api/photo?ref=${photoReference}&w=${maxWidth}`;
}

// Helper function to get all pages of results
export async function getAllPlaces(
  searchFn: (pageToken?: string) => Promise<{ results: unknown[]; nextPageToken?: string }>
): Promise<unknown[]> {
  const allResults: unknown[] = [];
  let pageToken: string | undefined;
  let pageCount = 0;
  const maxPages = 3; // Google limits to 3 pages (60 results max)

  do {
    const response = await searchFn(pageToken);
    allResults.push(...response.results);
    pageToken = response.nextPageToken;
    pageCount++;

    // Add delay between pages (required by Google)
    if (pageToken && pageCount < maxPages) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  } while (pageToken && pageCount < maxPages);

  return allResults;
}

// Batch fetch place details with concurrency control
export async function batchPlaceDetails(
  placeIds: string[],
  concurrency: number = 5
): Promise<GooglePlaceDetails[]> {
  const results: GooglePlaceDetails[] = [];
  const errors: string[] = [];

  // Process in batches
  for (let i = 0; i < placeIds.length; i += concurrency) {
    const batch = placeIds.slice(i, i + concurrency);
    
    const batchPromises = batch.map(async (placeId) => {
      try {
        return await placeDetails(placeId);
      } catch (error) {
        console.error(`Failed to fetch details for ${placeId}:`, error);
        errors.push(placeId);
        return null;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults.filter((result): result is GooglePlaceDetails => result !== null));
  }

  if (errors.length > 0) {
    console.warn(`Failed to fetch details for ${errors.length} places:`, errors);
  }

  return results;
}
