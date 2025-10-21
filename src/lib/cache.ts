import { Place } from './types';
import { CATEGORIES } from '@/config/categories';
import { CITY } from '@/config/city';

// In-memory cache
interface CacheData {
  places: Map<string, Place>;
  categoryPlaces: Map<string, Set<string>>;
  neighbourhoodPlaces: Map<string, Set<string>>;
  nameIndex: Map<string, Set<string>>;
  lastUpdated: number;
}

class MemoryCache {
  private cache: CacheData = {
    places: new Map(),
    categoryPlaces: new Map(),
    neighbourhoodPlaces: new Map(),
    nameIndex: new Map(),
    lastUpdated: 0
  };

  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Check if cache is valid
  private isCacheValid(): boolean {
    return Date.now() - this.cache.lastUpdated < this.CACHE_DURATION;
  }

  // Place operations
  async savePlace(place: Place): Promise<void> {
    this.cache.places.set(place.place_id, place);
    
    // Add to name index
    const firstLetter = place.name.charAt(0).toLowerCase();
    if (!this.cache.nameIndex.has(firstLetter)) {
      this.cache.nameIndex.set(firstLetter, new Set());
    }
    this.cache.nameIndex.get(firstLetter)!.add(place.place_id);
  }

  async getPlace(placeId: string): Promise<Place | null> {
    return this.cache.places.get(placeId) || null;
  }

  async getAllPlaces(): Promise<Place[]> {
    return Array.from(this.cache.places.values());
  }

  async getPlaces(placeIds: string[]): Promise<Place[]> {
    return placeIds
      .map(id => this.cache.places.get(id))
      .filter((place): place is Place => place !== undefined);
  }

  // Category operations
  async addPlaceToCategory(placeId: string, categoryId: string): Promise<void> {
    if (!this.cache.categoryPlaces.has(categoryId)) {
      this.cache.categoryPlaces.set(categoryId, new Set());
    }
    this.cache.categoryPlaces.get(categoryId)!.add(placeId);
  }

  async getCategoryPlaceIds(categoryId: string): Promise<string[]> {
    return Array.from(this.cache.categoryPlaces.get(categoryId) || []);
  }

  async getCategoryPlaces(categoryId: string): Promise<Place[]> {
    const placeIds = await this.getCategoryPlaceIds(categoryId);
    return await this.getPlaces(placeIds);
  }

  async getTopRatedPlaces(
    categoryId: string,
    limit: number = 10,
    minReviews: number = 5
  ): Promise<Place[]> {
    const places = await this.getCategoryPlaces(categoryId);
    
    return places
      .filter(place => 
        place.user_ratings_total && 
        place.user_ratings_total >= minReviews &&
        place.rating
      )
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  }

  async getMostReviewedPlaces(
    categoryId: string,
    limit: number = 10
  ): Promise<Place[]> {
    const places = await this.getCategoryPlaces(categoryId);
    
    return places
      .filter(place => place.user_ratings_total)
      .sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0))
      .slice(0, limit);
  }

  // Neighbourhood operations
  async addPlaceToNeighbourhood(placeId: string, neighbourhood: string): Promise<void> {
    if (!this.cache.neighbourhoodPlaces.has(neighbourhood)) {
      this.cache.neighbourhoodPlaces.set(neighbourhood, new Set());
    }
    this.cache.neighbourhoodPlaces.get(neighbourhood)!.add(placeId);
  }

  async getNeighbourhoodPlaces(neighbourhood: string): Promise<Place[]> {
    const placeIds = Array.from(this.cache.neighbourhoodPlaces.get(neighbourhood) || []);
    return await this.getPlaces(placeIds);
  }

  async getNeighbourhoodCategoryPlaces(
    neighbourhood: string,
    categoryId: string
  ): Promise<Place[]> {
    const neighbourhoodPlaceIds = Array.from(this.cache.neighbourhoodPlaces.get(neighbourhood) || []);
    const categoryPlaceIds = Array.from(this.cache.categoryPlaces.get(categoryId) || []);
    
    // Find intersection
    const intersection = neighbourhoodPlaceIds.filter(id => categoryPlaceIds.includes(id));
    return await this.getPlaces(intersection);
  }

  // Search operations
  async searchPlaces(query: string, limit: number = 20): Promise<Place[]> {
    const results: Place[] = [];
    const searchTerm = query.toLowerCase();
    
    // Search through name index
    for (const letter of 'abcdefghijklmnopqrstuvwxyz') {
      const placeIds = Array.from(this.cache.nameIndex.get(letter) || []);
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

  // Statistics
  async getCategoryCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    
    for (const category of CATEGORIES) {
      const placeIds = Array.from(this.cache.categoryPlaces.get(category.id) || []);
      counts[category.id] = placeIds.length;
    }
    
    return counts;
  }

  async getNeighbourhoodCounts(): Promise<Record<string, number>> {
    const counts: Record<string, number> = {};
    
    for (const neighbourhood of CITY.neighbourhoods) {
      const placeIds = Array.from(this.cache.neighbourhoodPlaces.get(neighbourhood) || []);
      counts[neighbourhood] = placeIds.length;
    }
    
    return counts;
  }

  // Cache management
  async clearAll(): Promise<void> {
    this.cache = {
      places: new Map(),
      categoryPlaces: new Map(),
      neighbourhoodPlaces: new Map(),
      nameIndex: new Map(),
      lastUpdated: 0
    };
  }

  async markAsUpdated(): Promise<void> {
    this.cache.lastUpdated = Date.now();
  }

  async isDataStale(): Promise<boolean> {
    return !this.isCacheValid();
  }

  // Find place by slug
  async findPlaceBySlug(slug: string): Promise<Place | null> {
    for (const place of this.cache.places.values()) {
      if (place.slug === slug) {
        return place;
      }
    }
    return null;
  }
}

// Export singleton instance
export const cache = new MemoryCache();
