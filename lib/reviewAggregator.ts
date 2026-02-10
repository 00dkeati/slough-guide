// Multi-source review aggregation system
// Aggregates reviews from Google, Facebook, Trustpilot, Yell, and more

export interface AggregatedReview {
  source: 'google' | 'facebook' | 'trustpilot' | 'yell' | 'tripadvisor' | 'yelp' | 'checkatrade' | 'freeindex' | 'other'
  author_name: string
  rating: number // 1-5 scale (normalized)
  text: string
  date: string // ISO date string
  verified: boolean
  profile_url?: string
  helpful_count?: number
  source_url?: string
}

export interface ReviewStats {
  total_reviews: number
  average_rating: number
  rating_breakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  sentiment_score: number // -1 to 1
  sources: {
    source: string
    count: number
    avg_rating: number
  }[]
}

// Google Reviews API
export async function fetchGoogleReviews(placeId: string, apiKey: string): Promise<AggregatedReview[]> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status === 'OK' && data.result?.reviews) {
      return data.result.reviews.map((review: any) => ({
        source: 'google',
        author_name: review.author_name,
        rating: review.rating,
        text: review.text,
        date: new Date(review.time * 1000).toISOString(),
        verified: true,
        profile_url: review.author_url,
        source_url: `https://www.google.com/maps/place/?q=place_id:${placeId}`
      }))
    }
  } catch (error) {
    console.error('Error fetching Google reviews:', error)
  }
  
  return []
}

// Facebook Reviews API (Graph API)
export async function fetchFacebookReviews(pageId: string, accessToken: string): Promise<AggregatedReview[]> {
  const url = `https://graph.facebook.com/v18.0/${pageId}/ratings?fields=review_text,reviewer,rating,created_time&access_token=${accessToken}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.data) {
      return data.data.map((review: any) => ({
        source: 'facebook',
        author_name: review.reviewer?.name || 'Facebook User',
        rating: review.rating,
        text: review.review_text || '',
        date: review.created_time,
        verified: true,
        source_url: `https://www.facebook.com/${pageId}`
      }))
    }
  } catch (error) {
    console.error('Error fetching Facebook reviews:', error)
  }
  
  return []
}

// Trustpilot API
export async function fetchTrustpilotReviews(businessUnitId: string, apiKey: string): Promise<AggregatedReview[]> {
  const url = `https://api.trustpilot.com/v1/business-units/${businessUnitId}/reviews?apikey=${apiKey}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.reviews) {
      return data.reviews.map((review: any) => ({
        source: 'trustpilot',
        author_name: review.consumer?.displayName || 'Trustpilot User',
        rating: review.stars,
        text: review.text || review.title,
        date: review.createdAt,
        verified: review.isVerified || false,
        source_url: review.url
      }))
    }
  } catch (error) {
    console.error('Error fetching Trustpilot reviews:', error)
  }
  
  return []
}

// Yell.com scraper (no official API)
export async function fetchYellReviews(businessUrl: string): Promise<AggregatedReview[]> {
  // Note: This would require web scraping with Playwright/Puppeteer
  // For now, returning empty array - implement scraper separately
  console.log('Yell.com reviews require web scraping - implement with Playwright')
  return []
}

// TripAdvisor API
export async function fetchTripAdvisorReviews(locationId: string, apiKey: string): Promise<AggregatedReview[]> {
  const url = `https://api.tripadvisor.com/api/partner/2.0/location/${locationId}/reviews?key=${apiKey}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.data) {
      return data.data.map((review: any) => ({
        source: 'tripadvisor',
        author_name: review.user?.username || 'TripAdvisor User',
        rating: review.rating,
        text: review.text,
        date: review.published_date,
        verified: true,
        source_url: review.url
      }))
    }
  } catch (error) {
    console.error('Error fetching TripAdvisor reviews:', error)
  }
  
  return []
}

// Checkatrade (UK tradespeople)
export async function fetchCheckatradeReviews(tradeId: string): Promise<AggregatedReview[]> {
  // Checkatrade doesn't have a public API - requires scraping
  console.log('Checkatrade reviews require web scraping')
  return []
}

// Aggregate all reviews from multiple sources
export async function aggregateAllReviews(businessData: {
  google_place_id?: string
  facebook_page_id?: string
  trustpilot_id?: string
  tripadvisor_id?: string
  yell_url?: string
  checkatrade_id?: string
}, apiKeys: {
  google?: string
  facebook?: string
  trustpilot?: string
  tripadvisor?: string
}): Promise<AggregatedReview[]> {
  const allReviews: AggregatedReview[] = []
  
  // Fetch from all available sources in parallel
  const promises: Promise<AggregatedReview[]>[] = []
  
  if (businessData.google_place_id && apiKeys.google) {
    promises.push(fetchGoogleReviews(businessData.google_place_id, apiKeys.google))
  }
  
  if (businessData.facebook_page_id && apiKeys.facebook) {
    promises.push(fetchFacebookReviews(businessData.facebook_page_id, apiKeys.facebook))
  }
  
  if (businessData.trustpilot_id && apiKeys.trustpilot) {
    promises.push(fetchTrustpilotReviews(businessData.trustpilot_id, apiKeys.trustpilot))
  }
  
  if (businessData.tripadvisor_id && apiKeys.tripadvisor) {
    promises.push(fetchTripAdvisorReviews(businessData.tripadvisor_id, apiKeys.tripadvisor))
  }
  
  // Wait for all sources to complete
  const results = await Promise.allSettled(promises)
  
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      allReviews.push(...result.value)
    }
  })
  
  // Sort by date (newest first)
  allReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return allReviews
}

// Calculate review statistics
export function calculateReviewStats(reviews: AggregatedReview[]): ReviewStats {
  const total = reviews.length
  
  if (total === 0) {
    return {
      total_reviews: 0,
      average_rating: 0,
      rating_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      sentiment_score: 0,
      sources: []
    }
  }
  
  // Rating breakdown
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  let ratingSum = 0
  
  reviews.forEach(review => {
    const roundedRating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5
    breakdown[roundedRating]++
    ratingSum += review.rating
  })
  
  const avgRating = ratingSum / total
  
  // Source breakdown
  const sourceMap = new Map<string, { count: number, ratingSum: number }>()
  
  reviews.forEach(review => {
    const existing = sourceMap.get(review.source) || { count: 0, ratingSum: 0 }
    existing.count++
    existing.ratingSum += review.rating
    sourceMap.set(review.source, existing)
  })
  
  const sources = Array.from(sourceMap.entries()).map(([source, data]) => ({
    source,
    count: data.count,
    avg_rating: data.ratingSum / data.count
  }))
  
  // Simple sentiment score based on rating distribution
  const sentiment = ((breakdown[5] * 1) + (breakdown[4] * 0.5) - (breakdown[2] * 0.5) - (breakdown[1] * 1)) / total
  
  return {
    total_reviews: total,
    average_rating: avgRating,
    rating_breakdown: breakdown,
    sentiment_score: sentiment,
    sources
  }
}

// Filter and sort reviews
export function filterReviews(
  reviews: AggregatedReview[],
  options: {
    minRating?: number
    maxRating?: number
    sources?: string[]
    verifiedOnly?: boolean
    limit?: number
  }
): AggregatedReview[] {
  let filtered = [...reviews]
  
  if (options.minRating) {
    filtered = filtered.filter(r => r.rating >= options.minRating!)
  }
  
  if (options.maxRating) {
    filtered = filtered.filter(r => r.rating <= options.maxRating!)
  }
  
  if (options.sources && options.sources.length > 0) {
    filtered = filtered.filter(r => options.sources!.includes(r.source))
  }
  
  if (options.verifiedOnly) {
    filtered = filtered.filter(r => r.verified)
  }
  
  if (options.limit) {
    filtered = filtered.slice(0, options.limit)
  }
  
  return filtered
}

// Get review highlights (best reviews)
export function getReviewHighlights(reviews: AggregatedReview[], count: number = 3): AggregatedReview[] {
  return reviews
    .filter(r => r.rating >= 4.5)
    .filter(r => r.text && r.text.length >= 50) // Meaningful reviews
    .sort((a, b) => {
      // Sort by rating, then by text length (more detailed = better)
      if (b.rating !== a.rating) return b.rating - a.rating
      return b.text.length - a.text.length
    })
    .slice(0, count)
}

// Normalize rating to 5-star scale (some sources use different scales)
export function normalizeRating(rating: number, maxRating: number = 5): number {
  return (rating / maxRating) * 5
}

