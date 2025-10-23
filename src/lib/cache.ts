import { Place } from './types';
import { CATEGORIES } from '@/config/categories';
import { CITY } from '@/config/city';
import { sortPlaces } from './place-utils';
import { kv } from '@vercel/kv';
import { sampleBusinesses } from '@/data/sample-businesses';

interface CacheData {
  places: Record<string, Place>; // place_id -> Place
  categoryPlaceIds: Record<string, string[]>; // categoryId -> place_id[]
  neighbourhoodPlaceIds: Record<string, string[]>; // neighbourhood -> place_id[]
  nameIndex: Record<string, string[]>; // firstLetter -> place_id[]
  lastRefresh: string | null;
}

class FileCache {
  private async loadData(): Promise<CacheData> {
    try {
      const data = await kv.get<CacheData>('slough-guide-cache');
      if (data && Object.keys(data.places).length > 0) {
        return data;
      }
      // If no data or empty, initialize with sample data
      console.log('No data in Vercel KV, initializing with sample data');
      const sampleData = this.initializeWithSampleDataSync();
      await this.saveData(sampleData);
      return sampleData;
    } catch (error) {
      console.error('Error loading cache data:', error);
      // Fallback to sample data
      const sampleData = this.initializeWithSampleDataSync();
      return sampleData;
    }
  }

  private async saveData(data: CacheData): Promise<void> {
    try {
      await kv.set('slough-guide-cache', data);
    } catch (error) {
      console.error('Error saving cache data:', error);
    }
  }

  private getEmptyData(): CacheData {
    const data: CacheData = {
      places: {},
      categoryPlaceIds: {},
      neighbourhoodPlaceIds: {},
      nameIndex: {},
      lastRefresh: null,
    };

    // Initialize category and neighbourhood arrays
    CATEGORIES.forEach(cat => {
      data.categoryPlaceIds[cat.id] = [];
    });
    CITY.neighbourhoods.forEach(nh => {
      data.neighbourhoodPlaceIds[nh] = [];
    });

    return data;
  }

  private initializeWithSampleDataSync(): CacheData {
    console.log('Initializing cache with sample data...');

    const data: CacheData = {
      places: {},
      categoryPlaceIds: {},
      neighbourhoodPlaceIds: {},
      nameIndex: {},
      lastRefresh: new Date().toISOString(),
    };

    // Initialize category and neighbourhood arrays
    CATEGORIES.forEach(cat => {
      data.categoryPlaceIds[cat.id] = [];
    });
    CITY.neighbourhoods.forEach(nh => {
      data.neighbourhoodPlaceIds[nh] = [];
    });

    // Add sample businesses
    for (const business of sampleBusinesses) {
      data.places[business.place_id] = business;

      // Add to categories based on types
      const categoryMap: Record<string, string> = {
        'restaurant': 'restaurants',
        'meal_takeaway': 'takeaways',
        'cafe': 'cafes',
        'bar': 'pubs',
        'gym': 'gyms',
        'hair_care': 'barbers',
        'beauty_salon': 'hairdressers',
        'plumber': 'plumbers'
      };

      // Find the appropriate category
      const category = business.types.find(type => categoryMap[type]);
      if (category) {
        const categoryId = categoryMap[category];
        data.categoryPlaceIds[categoryId].push(business.place_id);
      }

      // Add to neighbourhood
      data.neighbourhoodPlaceIds['Slough'].push(business.place_id);

      // Add to name index
      const firstLetter = business.name.charAt(0).toLowerCase();
      if (!data.nameIndex[firstLetter]) {
        data.nameIndex[firstLetter] = [];
      }
      data.nameIndex[firstLetter].push(business.place_id);
    }
    
    console.log(`Initialized with ${sampleBusinesses.length} sample businesses.`);
    return data;
  }

  async savePlace(place: Place): Promise<void> {
    const data = await this.loadData();
    data.places[place.place_id] = place;
    
    // Add to name index
    const firstLetter = place.name.charAt(0).toLowerCase();
    if (!data.nameIndex[firstLetter]) {
      data.nameIndex[firstLetter] = [];
    }
    if (!data.nameIndex[firstLetter].includes(place.place_id)) {
      data.nameIndex[firstLetter].push(place.place_id);
    }
    
    await this.saveData(data);
  }

  async getPlace(placeId: string): Promise<Place | null> {
    const data = await this.loadData();
    return data.places[placeId] || null;
  }

  async findPlaceBySlug(slug: string): Promise<Place | null> {
    const data = await this.loadData();
    for (const place of Object.values(data.places)) {
      if (place.slug === slug) {
        return place;
      }
    }
    return null;
  }

  async getAllPlaces(): Promise<Place[]> {
    const data = await this.loadData();
    return Object.values(data.places);
  }

  async addPlaceToCategory(placeId: string, categoryId: string): Promise<void> {
    const data = await this.loadData();
    if (!data.categoryPlaceIds[categoryId]) {
      data.categoryPlaceIds[categoryId] = [];
    }
    if (!data.categoryPlaceIds[categoryId].includes(placeId)) {
      data.categoryPlaceIds[categoryId].push(placeId);
    }
    await this.saveData(data);
  }

  async getCategoryPlaceIds(categoryId: string): Promise<string[]> {
    const data = await this.loadData();
    return data.categoryPlaceIds[categoryId] || [];
  }

  async getCategoryPlaces(categoryId: string): Promise<Place[]> {
    const data = await this.loadData();
    const placeIds = data.categoryPlaceIds[categoryId] || [];
    return placeIds.map(id => data.places[id]).filter(Boolean);
  }

  async getTopRatedPlaces(categoryId: string, limit: number = 10, minReviews: number = 5): Promise<Place[]> {
    const places = await this.getCategoryPlaces(categoryId);
    const filtered = places.filter(place => place.rating && place.user_ratings_total && place.user_ratings_total >= minReviews);
    return sortPlaces(filtered, 'rating', 'desc').slice(0, limit);
  }

  async getMostReviewedPlaces(categoryId: string, limit: number = 10): Promise<Place[]> {
    const places = await this.getCategoryPlaces(categoryId);
    const filtered = places.filter(place => place.user_ratings_total);
    return sortPlaces(filtered, 'reviews', 'desc').slice(0, limit);
  }

  async addPlaceToNeighbourhood(placeId: string, neighbourhood: string): Promise<void> {
    const data = await this.loadData();
    if (!data.neighbourhoodPlaceIds[neighbourhood]) {
      data.neighbourhoodPlaceIds[neighbourhood] = [];
    }
    if (!data.neighbourhoodPlaceIds[neighbourhood].includes(placeId)) {
      data.neighbourhoodPlaceIds[neighbourhood].push(placeId);
    }
    await this.saveData(data);
  }

  async getNeighbourhoodPlaces(neighbourhood: string): Promise<Place[]> {
    const data = await this.loadData();
    const placeIds = data.neighbourhoodPlaceIds[neighbourhood] || [];
    return placeIds.map(id => data.places[id]).filter(Boolean);
  }

  async getNeighbourhoodCategoryPlaces(
    neighbourhood: string,
    categoryId: string
  ): Promise<Place[]> {
    const data = await this.loadData();
    const neighbourhoodPlaceIds = new Set(data.neighbourhoodPlaceIds[neighbourhood] || []);
    const categoryPlaceIds = new Set(data.categoryPlaceIds[categoryId] || []);

    const intersectionIds = Array.from(neighbourhoodPlaceIds).filter(placeId =>
      categoryPlaceIds.has(placeId)
    );

    return intersectionIds.map(id => data.places[id]).filter(Boolean);
  }

  async searchPlaces(query: string, limit: number = 100): Promise<Place[]> {
    const data = await this.loadData();
    const searchTerm = query.toLowerCase();
    const matchingPlaces: Place[] = [];

    for (const place of Object.values(data.places)) {
      if (place.name.toLowerCase().includes(searchTerm) || 
          place.types.some(type => type.toLowerCase().includes(searchTerm))) {
        matchingPlaces.push(place);
      }
      if (matchingPlaces.length >= limit) break;
    }
    return matchingPlaces;
  }

  async getCategoryCounts(): Promise<Record<string, number>> {
    const data = await this.loadData();
    const counts: Record<string, number> = {};
    CATEGORIES.forEach(category => {
      counts[category.id] = (data.categoryPlaceIds[category.id] || []).length;
    });
    return counts;
  }

  async getNeighbourhoodCounts(): Promise<Record<string, number>> {
    const data = await this.loadData();
    const counts: Record<string, number> = {};
    CITY.neighbourhoods.forEach(neighbourhood => {
      counts[neighbourhood] = (data.neighbourhoodPlaceIds[neighbourhood] || []).length;
    });
    return counts;
  }

  async clearAllData(): Promise<void> {
    const emptyData = this.getEmptyData();
    await this.saveData(emptyData);
  }

  setLastRefresh(date: Date): void {
    // This will be saved on next data operation
    this.lastRefreshDate = date;
  }

  getLastRefresh(): Date | null {
    return this.lastRefreshDate;
  }

  private lastRefreshDate: Date | null = null;

  async saveLastRefresh(): Promise<void> {
    if (this.lastRefreshDate) {
      const data = await this.loadData();
      data.lastRefresh = this.lastRefreshDate.toISOString();
      await this.saveData(data);
    }
  }

  async initializeWithSampleData(): Promise<void> {
    console.log('Initializing cache with sample data...');
    
    // Clear existing data
    await this.clearAllData();
    
    // Add sample businesses
    for (const business of sampleBusinesses) {
      await this.savePlace(business);
      
      // Add to categories based on types
      const categoryMap: Record<string, string> = {
        'restaurant': 'restaurants',
        'meal_takeaway': 'takeaways',
        'cafe': 'cafes',
        'bar': 'pubs',
        'gym': 'gyms',
        'hair_care': 'barbers',
        'beauty_salon': 'hairdressers',
        'plumber': 'plumbers'
      };
      
      // Find the appropriate category
      const category = business.types.find(type => categoryMap[type]);
      if (category) {
        await this.addPlaceToCategory(business.place_id, categoryMap[category]);
      }
      
      // Add to neighbourhood
      await this.addPlaceToNeighbourhood(business.place_id, 'Slough');
    }
    
    // Set last refresh time
    this.setLastRefresh(new Date());
    await this.saveLastRefresh();
    
    console.log(`Initialized cache with ${sampleBusinesses.length} sample businesses`);
  }
}

export const cache = new FileCache();