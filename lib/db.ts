export interface Business {
  id: string
  name: string
  slug: string
  category: string
  area: string
  postcode: string
  address: string
  lat: number
  lng: number
  phone: string
  website: string
  description: string
  opening_hours_json: string
  rating: number
  review_count: number
  featured: boolean
  created_at: string
  updated_at: string
  google_place_id?: string
  images?: string[]
  facebook_url?: string
  instagram_url?: string
  twitter_url?: string
  // Enhanced Google Places data
  price_level?: number // 0-4 (0=Free, 1=Inexpensive, 2=Moderate, 3=Expensive, 4=Very Expensive)
  reviews?: GoogleReview[] // Array of actual reviews from Google
  aggregated_reviews?: AggregatedReview[] // Array of aggregated reviews from multiple sources
  types?: string[] // All Google types for this business
  wheelchair_accessible?: boolean
  takeout?: boolean
  delivery?: boolean
  dine_in?: boolean
  reservable?: boolean
  serves_breakfast?: boolean
  serves_lunch?: boolean
  serves_dinner?: boolean
  serves_beer?: boolean
  serves_wine?: boolean
  serves_vegetarian_food?: boolean
  outdoor_seating?: boolean
  good_for_children?: boolean
  allows_dogs?: boolean
  payment_options?: string[] // e.g., ['credit_cards', 'debit_cards', 'cash_only']
  parking_options?: string[] // e.g., ['free_parking', 'paid_parking', 'street_parking']
  editorial_summary?: string // Google's AI-generated summary
  current_opening_hours?: string // Human-readable current status
}

export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  relative_time_description: string
  profile_photo_url?: string
}

export interface AggregatedReview {
  author_name: string
  rating: number
  text: string
  date: string
  source: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
}

export interface Area {
  id: string
  name: string
  slug: string
  description: string
}

// Cache for data with TTL
let businessesCache: Business[] | null = null
let businessesLightweightCache: any[] | null = null
let categoriesCache: Category[] | null = null
let areasCache: Area[] | null = null
let cacheTimestamp: number = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Helper to load lightweight JSON data with caching (for listings)
async function loadLightweightData() {
  const now = Date.now()
  
  // Check if cache is still valid
  if (businessesLightweightCache && categoriesCache && areasCache && (now - cacheTimestamp) < CACHE_TTL) {
    return
  }
  
  if (!businessesLightweightCache || (now - cacheTimestamp) >= CACHE_TTL) {
    const businesses = await import('../public/data/businesses-lightweight.json')
    businessesLightweightCache = businesses.default
  }
  if (!categoriesCache || (now - cacheTimestamp) >= CACHE_TTL) {
    const categories = await import('../public/data/categories.json')
    categoriesCache = categories.default as Category[]
  }
  if (!areasCache || (now - cacheTimestamp) >= CACHE_TTL) {
    const areas = await import('../public/data/areas.json')
    areasCache = areas.default as Area[]
  }
  
  cacheTimestamp = now
}

// Helper to load full JSON data with caching (for detailed views)
async function loadFullData() {
  const now = Date.now()
  
  if (!businessesCache || (now - cacheTimestamp) >= CACHE_TTL) {
    const businesses = await import('../public/data/businesses.json')
    businessesCache = businesses.default as unknown as Business[]
  }
  if (!categoriesCache || (now - cacheTimestamp) >= CACHE_TTL) {
    const categories = await import('../public/data/categories.json')
    categoriesCache = categories.default as Category[]
  }
  if (!areasCache || (now - cacheTimestamp) >= CACHE_TTL) {
    const areas = await import('../public/data/areas.json')
    areasCache = areas.default as Area[]
  }
  
  cacheTimestamp = now
}

export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  await loadFullData()
  return businessesCache!.find(b => b.slug === slug) || null
}

export async function getBusinessesByCategory(category: string, limit?: number): Promise<Business[]> {
  await loadLightweightData()
  let filtered = businessesLightweightCache!.filter(b => b.category === category)
  
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return filtered as Business[]
}

export async function getBusinessesByCategoryAndArea(category: string, area: string, limit?: number): Promise<Business[]> {
  await loadLightweightData()
  
  console.log('[getBusinessesByCategoryAndArea]', {
    category,
    area,
    limit,
    totalBusinesses: businessesLightweightCache?.length || 0
  })
  
  let filtered = businessesLightweightCache!.filter(b => b.category === category && b.area === area)
  
  console.log('[getBusinessesByCategoryAndArea] Filtered:', {
    count: filtered.length,
    sample: filtered[0] ? { name: filtered[0].name, id: filtered[0].id } : null
  })
  
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return filtered as Business[]
}

export async function getBusinessesByArea(area: string, limit?: number): Promise<Business[]> {
  await loadLightweightData()
  let filtered = businessesLightweightCache!.filter(b => b.area === area)
  
  if (limit) {
    filtered = filtered.slice(0, limit)
  }
  
  return filtered as Business[]
}

export async function searchBusinesses(query: string): Promise<Business[]> {
  await loadLightweightData()
  const lowerQuery = query.toLowerCase()
  
  return businessesLightweightCache!.filter(b => 
    b.name.toLowerCase().includes(lowerQuery) ||
    b.description.toLowerCase().includes(lowerQuery) ||
    b.category.toLowerCase().includes(lowerQuery) ||
    b.area.toLowerCase().includes(lowerQuery)
  ) as Business[]
}

export async function getCategories(): Promise<Category[]> {
  await loadLightweightData()
  return categoriesCache!
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await loadLightweightData()
  return categoriesCache!.find(c => c.slug === slug) || null
}

export async function getAreas(): Promise<Area[]> {
  await loadLightweightData()
  return areasCache!
}

export async function getAreaBySlug(slug: string): Promise<Area | null> {
  await loadLightweightData()
  return areasCache!.find(a => a.slug === slug) || null
}

export async function getFeaturedBusinesses(limit: number = 6, area?: string): Promise<Business[]> {
  await loadLightweightData()
  return businessesLightweightCache!
    .filter(b => b.featured && (!area || b.area === area))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit) as Business[]
}

export async function getBusinesses(categoryOrLimit?: string | number, area?: string): Promise<Business[]> {
  await loadLightweightData()
  let businesses = businessesLightweightCache!
  
  // If first arg is a string, it's a category filter
  if (typeof categoryOrLimit === 'string') {
    businesses = businesses.filter(b => b.category === categoryOrLimit)
    
    // If area is provided, filter by area too
    if (area) {
      businesses = businesses.filter(b => b.area === area)
    }
  } 
  // If first arg is a number, it's a limit
  else if (typeof categoryOrLimit === 'number') {
    businesses = businesses.slice(0, categoryOrLimit)
  }
  
  return businesses as Business[]
}
