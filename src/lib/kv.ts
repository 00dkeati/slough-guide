import { kv } from '@vercel/kv';
import { Place, PlaceSchema } from './types';
import { CATEGORIES } from '@/config/categories';
import { CITY } from '@/config/city';

// Key patterns
const PLACE_KEY = (placeId: string) => `place:${placeId}`;
const CATEGORY_PLACES_KEY = (categoryId: string) => `cat:${categoryId}:place_ids`;
const RANKING_RATING_KEY = (categoryId: string) => `rank:${categoryId}:rating`;
const RANKING_REVIEWS_KEY = (categoryId: string) => `rank:${categoryId}:reviews`;
const NEIGHBOURHOOD_PLACES_KEY = (neighbourhood: string) => `neighbourhood:${neighbourhood}:place_ids`;
const META_KEY = (categoryId: string) => `meta:${categoryId}`;
const NAME_INDEX_KEY = (firstLetter: string) => `idx:name:${firstLetter}`;

export class KVStore {
  // Place operations
  static async savePlace(place: Place): Promise<void> {
    await kv.set(PLACE_KEY(place.place_id), place);
    
    // Add to name index
    const firstLetter = place.name.charAt(0).toLowerCase();
    if (/[a-z]/.test(firstLetter)) {
      await kv.sadd(NAME_INDEX_KEY(firstLetter), place.place_id);
    }
  }

  static async getPlace(placeId: string): Promise<Place | null> {
    const data = await kv.get(PLACE_KEY(placeId));
    if (!data) return null;
    
    try {
      return PlaceSchema.parse(data);
    } catch (error) {
      console.error(`Invalid place data for ${placeId}:`, error);
      return null;
    }
  }

  static async findPlaceBySlug(slug: string): Promise<Place | null> {
    // Search through all places to find one with matching slug
    // This is not efficient for large datasets, but works for now
    const keys = await kv.keys('place:*');
    if (keys.length === 0) return null;
    
    const places = await kv.mget(...keys);
    
    for (const data of places) {
      if (!data) continue;
      
      try {
        const place = PlaceSchema.parse(data);
        if (place.slug === slug) {
          return place;
        }
      } catch (error) {
        console.error('Invalid place data:', error);
        continue;
      }
    }
    
    return null;
  }

  static async getPlaces(placeIds: string[]): Promise<Place[]> {
    const keys = placeIds.map(PLACE_KEY);
    const results = await kv.mget(...keys);
    
    return results
      .filter((data): data is Place => data !== null)
      .map(data => {
        try {
          return PlaceSchema.parse(data);
        } catch (error) {
          console.error('Invalid place data:', error);
          return null;
        }
      })
      .filter((place): place is Place => place !== null);
  }

  // Category operations
  static async addPlaceToCategory(placeId: string, categoryId: string): Promise<void> {
    await kv.sadd(CATEGORY_PLACES_KEY(categoryId), placeId);
  }

  static async getCategoryPlaceIds(categoryId: string): Promise<string[]> {
    return await kv.smembers(CATEGORY_PLACES_KEY(categoryId));
  }

  static async getCategoryPlaces(categoryId: string): Promise<Place[]> {
    const placeIds = await this.getCategoryPlaceIds(categoryId);
    return await this.getPlaces(placeIds);
  }

  // Ranking operations
  static async updatePlaceRanking(place: Place): Promise<void> {
    for (const categoryId of place.categories) {
      if (place.rating) {
        await kv.zadd(RANKING_RATING_KEY(categoryId), {
          score: place.rating,
          member: place.place_id,
        });
      }
      
      if (place.user_ratings_total) {
        await kv.zadd(RANKING_REVIEWS_KEY(categoryId), {
          score: place.user_ratings_total,
          member: place.place_id,
        });
      }
    }
  }

  static async getTopRatedPlaces(
    categoryId: string,
    limit: number = 10,
    minReviews: number = 5
  ): Promise<Place[]> {
    const placeIds = await kv.zrange(RANKING_RATING_KEY(categoryId), 0, limit - 1, { rev: true });
    const places = await this.getPlaces(placeIds);
    
    // Filter by minimum reviews
    return places.filter(place => 
      place.user_ratings_total && place.user_ratings_total >= minReviews
    );
  }

  static async getMostReviewedPlaces(
    categoryId: string,
    limit: number = 10
  ): Promise<Place[]> {
    const placeIds = await kv.zrange(RANKING_REVIEWS_KEY(categoryId), 0, limit - 1, { rev: true });
    return await this.getPlaces(placeIds);
  }

  // Neighbourhood operations
  static async addPlaceToNeighbourhood(placeId: string, neighbourhood: string): Promise<void> {
    await kv.sadd(NEIGHBOURHOOD_PLACES_KEY(neighbourhood), placeId);
  }

  static async getNeighbourhoodPlaces(neighbourhood: string): Promise<Place[]> {
    const placeIds = await kv.smembers(NEIGHBOURHOOD_PLACES_KEY(neighbourhood));
    return await this.getPlaces(placeIds);
  }

  static async getNeighbourhoodCategoryPlaces(
    neighbourhood: string,
    categoryId: string
  ): Promise<Place[]> {
    const neighbourhoodPlaceIds = await kv.smembers(NEIGHBOURHOOD_PLACES_KEY(neighbourhood));
    const categoryPlaceIds = await kv.smembers(CATEGORY_PLACES_KEY(categoryId));
    
    // Find intersection
    const intersection = neighbourhoodPlaceIds.filter(id => categoryPlaceIds.includes(id));
    return await this.getPlaces(intersection);
  }

  // Search operations
  static async searchPlacesByName(query: string, limit: number = 50): Promise<Place[]> {
    const results: Place[] = [];
    const searchTerm = query.toLowerCase();
    
    // Search through name index
    for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
      const placeIds = await kv.smembers(NAME_INDEX_KEY(letter));
      if (placeIds.length === 0) continue;
      
      const places = await this.getPlaces(placeIds);
      const matches = places.filter(place => 
        place.name.toLowerCase().includes(searchTerm)
      );
      
      results.push(...matches);
      
      if (results.length >= limit) break;
    }
    
    return results.slice(0, limit);
  }

  // Meta operations
  static async updateCategoryMeta(
    categoryId: string,
    data: { count: number; lastUpdated: string }
  ): Promise<void> {
    await kv.hset(META_KEY(categoryId), data);
  }

  static async getCategoryMeta(categoryId: string): Promise<{
    count: number;
    lastUpdated: string;
  } | null> {
    const data = await kv.hgetall(META_KEY(categoryId));
    if (!data || Object.keys(data).length === 0) return null;
    
    return {
      count: parseInt(data.count as string) || 0,
      lastUpdated: data.lastUpdated as string || new Date().toISOString(),
    };
  }

  // Utility operations
  static async getPlaceCount(): Promise<number> {
    const keys = await kv.keys('place:*');
    return keys.length;
  }

  static async getCategoryCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    
    for (const category of CATEGORIES) {
      const placeIds = await kv.smembers(CATEGORY_PLACES_KEY(category.id));
      counts[category.id] = placeIds.length;
    }
    
    return counts;
  }

  static async getNeighbourhoodCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    
    for (const neighbourhood of CITY.neighbourhoods) {
      const placeIds = await kv.smembers(NEIGHBOURHOOD_PLACES_KEY(neighbourhood));
      counts[neighbourhood] = placeIds.length;
    }
    
    return counts;
  }

  // Cleanup operations
  static async clearCategoryData(categoryId: string): Promise<void> {
    const placeIds = await kv.smembers(CATEGORY_PLACES_KEY(categoryId));
    
    // Remove from category sets
    await kv.del(CATEGORY_PLACES_KEY(categoryId));
    await kv.del(RANKING_RATING_KEY(categoryId));
    await kv.del(RANKING_REVIEWS_KEY(categoryId));
    await kv.del(META_KEY(categoryId));
    
    // Remove from name index
    for (const placeId of placeIds) {
      const place = await this.getPlace(placeId);
      if (place) {
        const firstLetter = place.name.charAt(0).toLowerCase();
        if (/[a-z]/.test(firstLetter)) {
          await kv.srem(NAME_INDEX_KEY(firstLetter), placeId);
        }
      }
    }
  }

  static async clearAllData(): Promise<void> {
    const keys = await kv.keys('*');
    if (keys.length > 0) {
      await kv.del(...keys);
    }
  }
}
