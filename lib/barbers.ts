import { getBusinesses } from './db'
import { getPlacePrimaryPhotoRef, getPlacePhotoUrl, validatePhotoUrl, getValidatedPlacePhotoUrl } from './googlePhotos'

export interface Barber {
  id: string
  name: string
  slug?: string
  area?: string
  address?: string
  phone?: string
  website?: string
  rating?: number
  review_count?: number
  place_id?: string
  photo_reference?: string | null
  imageUrl?: string | null
  lat?: number
  lng?: number
  description?: string
  overallScore?: number
  rank?: number
  category?: string
}

// Helper to normalize strings for deduplication
function normalizeString(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
}

// Helper to create a composite key for deduplication
function createDedupeKey(barber: Barber): string {
  if (barber.place_id) {
    return `place_id:${barber.place_id}`
  }
  
  // For businesses without place_id, use normalized name + address
  // Remove area suffixes from names (e.g., "Studio Hslough" -> "Studio H")
  const cleanName = barber.name
    .replace(/(slough|cowplain|denmead|purbrook|horndean|clanfield)$/i, '')
    .replace(/(slough|cowplain|denmead|purbrook|horndean|clanfield)([A-Z])/g, '$2') // Handle camelCase
    .trim()
  const normalizedName = normalizeString(cleanName)
  const normalizedAddress = normalizeString(barber.address || '')
  
  // If the normalized name is too short or empty, use the original name
  const finalName = normalizedName.length < 2 ? normalizeString(barber.name) : normalizedName
  
  // For businesses with very similar names, use just the name for deduplication
  // This will catch cases like "Studio H" and "Studio H Slough"
  if (finalName.length > 3) {
    return `name_only:${finalName}`
  }
  
  return `name_address:${finalName}|${normalizedAddress}`
}

// Helper to determine which barber is "better" when duplicates are found
function isBetterBarber(current: Barber, candidate: Barber): boolean {
  // Prefer the one with a valid place_id
  if (candidate.place_id && !current.place_id) return true
  if (current.place_id && !candidate.place_id) return false
  
  // If both have place_id, prefer the one with higher review_count
  if (candidate.review_count && current.review_count) {
    if (candidate.review_count > current.review_count) return true
    if (candidate.review_count < current.review_count) return false
  }
  
  // If review counts are equal or missing, prefer higher rating
  if (candidate.rating && current.rating) {
    if (candidate.rating > current.rating) return true
    if (candidate.rating < current.rating) return false
  }
  
  // If ratings are equal, prefer the one with a website
  if (candidate.website && !current.website) return true
  if (current.website && !candidate.website) return false
  
  // If still equal, keep the current one (first in original order)
  return false
}

// Helper to deduplicate barbers
function dedupeBarbers(barbers: Barber[]): Barber[] {
  const seen = new Map<string, Barber>()
  
  for (const barber of barbers) {
    const key = createDedupeKey(barber)
    const existing = seen.get(key)
    
    if (!existing || isBetterBarber(existing, barber)) {
      seen.set(key, barber)
    } else {
      console.log(`[barbers] Duplicate found: ${barber.name} (key: ${key}) - keeping existing: ${existing.name}`)
    }
  }
  
  const result = Array.from(seen.values())
  console.log(`[barbers] Deduplication: ${barbers.length} → ${result.length} barbers`)
  
  return result
}

// Helper to assign dense ranks
function assignDenseRanks(barbers: Barber[]): Barber[] {
  // Sort by overallScore desc, then rating desc, then review_count desc, then name asc
  const sorted = [...barbers].sort((a, b) => {
    // Overall score (descending)
    const scoreA = a.overallScore || 0
    const scoreB = b.overallScore || 0
    if (scoreA !== scoreB) return scoreB - scoreA
    
    // Rating (descending)
    const ratingA = a.rating || 0
    const ratingB = b.rating || 0
    if (ratingA !== ratingB) return ratingB - ratingA
    
    // Review count (descending)
    const reviewsA = a.review_count || 0
    const reviewsB = b.review_count || 0
    if (reviewsA !== reviewsB) return reviewsB - reviewsA
    
    // Name (ascending)
    return a.name.localeCompare(b.name)
  })
  
  // Assign dense ranks
  let currentRank = 1
  let lastScore = sorted[0]?.overallScore
  
  return sorted.map((barber, index) => {
    if (index > 0 && barber.overallScore !== lastScore) {
      currentRank = index + 1
      lastScore = barber.overallScore
    }
    
    return {
      ...barber,
      rank: currentRank
    }
  })
}

// Barber-related keywords to filter businesses
const BARBER_KEYWORDS = [
  'barber',
  'barbershop', 
  'men\'s hair',
  'gents hair',
  'hair salon',
  'hairdresser',
  'hair care'
]

// Areas to include in the league table
const TARGET_AREAS = [
  'slough',
  'horndean', 
  'cowplain',
  'purbrook',
  'clanfield',
  'denmead'
]

/**
 * Get all barber businesses for the Slough area
 */
export async function getBarbersForSlough(): Promise<Barber[]> {
  try {
    // Get all businesses
    const allBusinesses = await getBusinesses()
    
    // Filter for barber-related businesses in target areas
    const barberBusinesses = allBusinesses.filter(business => {
      const isBarberCategory = BARBER_KEYWORDS.some(keyword => 
        business.category?.toLowerCase().includes(keyword) ||
        business.name?.toLowerCase().includes(keyword) ||
        business.description?.toLowerCase().includes(keyword)
      )
      
      const isTargetArea = TARGET_AREAS.some(area => 
        business.area?.toLowerCase().includes(area) ||
        business.address?.toLowerCase().includes(area)
      )
      
      return isBarberCategory && isTargetArea
    })

    console.log(`[barbers] Found ${barberBusinesses.length} barber businesses`)

    // Process each business to get photos and calculate scores
    const processedBarbers: Barber[] = []
    
    for (const business of barberBusinesses) {
      try {
        // Clean up business name by removing area suffixes
        const cleanName = business.name
          .replace(/(slough|cowplain|denmead|purbrook|horndean|clanfield)$/i, '')
          .replace(/(slough|cowplain|denmead|purbrook|horndean|clanfield)([A-Z])/g, '$2')
          .trim()

        const barber: Barber = {
          id: business.id,
          name: cleanName,
          slug: business.slug,
          area: business.area,
          address: business.address,
          phone: business.phone,
          website: business.website,
          rating: business.rating,
          review_count: business.review_count,
          place_id: business.google_place_id,
          photo_reference: business.images?.[0] ? 'existing' : null,
          lat: business.lat,
          lng: business.lng,
          description: business.description,
          category: business.category,
          imageUrl: null
        }

        // Try to get a valid photo
        if (business.google_place_id) {
          try {
            // First try existing images
            if (business.images && business.images.length > 0) {
              const existingImage = business.images[0]
              if (existingImage && existingImage.includes('maps.googleapis.com')) {
                // Use the existing image without validation for now
                barber.imageUrl = existingImage
                console.log(`[barbers] Using existing image for ${business.name}: ${existingImage}`)
              }
            }
            
            // If no existing image, try to get one from Place Details
            if (!barber.imageUrl) {
              const photoRef = await getPlacePrimaryPhotoRef(business.google_place_id)
              if (photoRef) {
                const photoUrl = await getValidatedPlacePhotoUrl(photoRef, { width: 800 })
                if (photoUrl) {
                  barber.imageUrl = photoUrl
                  barber.photo_reference = photoRef
                  console.log(`[barbers] Got new image for ${business.name}`)
                }
              }
            }
          } catch (error) {
            console.warn(`[barbers] Failed to get photo for ${business.name}:`, error)
          }
        }

        // Calculate overall score
        barber.overallScore = calculateOverallScore(barber.rating, barber.review_count)
        
        processedBarbers.push(barber)
      } catch (error) {
        console.error(`[barbers] Error processing ${business.name}:`, error)
      }
    }

    // Deduplicate barbers
    const dedupedBarbers = dedupeBarbers(processedBarbers)
    
    // Assign dense ranks
    const rankedBarbers = assignDenseRanks(dedupedBarbers)

    console.log(`[barbers] Found ${barberBusinesses.length} barber businesses`)
    console.log(`[barbers] After deduplication: ${dedupedBarbers.length} unique barbers`)
    console.log(`[barbers] Processed ${rankedBarbers.length} barbers with photos: ${rankedBarbers.filter(b => b.imageUrl).length}`)
    
    return rankedBarbers
  } catch (error) {
    console.error('[barbers] Error getting barbers:', error)
    return []
  }
}

/**
 * Calculate overall score (0-100) based on rating and review count
 */
function calculateOverallScore(rating?: number, reviewCount?: number): number {
  if (!rating && !reviewCount) return 0
  
  // Normalize rating (0-5) to 0-100
  const normRating = rating ? (rating / 5) * 100 : 0
  
  // Normalize review count using log scale (0-1000 reviews = 0-100)
  const normReviews = reviewCount ? 
    Math.min((Math.log10(reviewCount + 1) / Math.log10(1000)) * 100, 100) : 0
  
  // Weighted combination: 70% rating, 30% review count
  let score = 0
  let totalWeight = 0
  
  if (rating) {
    score += normRating * 0.7
    totalWeight += 0.7
  }
  
  if (reviewCount) {
    score += normReviews * 0.3
    totalWeight += 0.3
  }
  
  // If we have partial data, scale proportionally
  if (totalWeight > 0) {
    score = score / totalWeight
  }
  
  return Math.round(score)
}

/**
 * Get barbers filtered by area
 */
export function filterBarbersByArea(barbers: Barber[], area: string): Barber[] {
  if (!area || area === 'all') return barbers
  
  return barbers.filter(barber => 
    barber.area?.toLowerCase().includes(area.toLowerCase()) ||
    barber.address?.toLowerCase().includes(area.toLowerCase())
  )
}

/**
 * Sort barbers by different criteria
 */
export function sortBarbers(barbers: Barber[], sortBy: string): Barber[] {
  const sorted = [...barbers]
  
  switch (sortBy) {
    case 'score':
      return sorted.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case 'reviews':
      return sorted.sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'area':
      return sorted.sort((a, b) => (a.area || '').localeCompare(b.area || ''))
    default:
      return sorted
  }
}
