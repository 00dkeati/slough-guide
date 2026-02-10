/**
 * Enrich Editorial Articles with Real Business Data
 * Uses Manus API to gather insights and real reviews
 */

import { getBusinessesByCategory } from '../lib/db'
import { getSectorInsights, fetchManusBusinessData } from '../lib/manusApi'
import fs from 'fs'
import path from 'path'

interface Business {
  id: string
  name: string
  slug: string
  category: string
  rating: number
  review_count: number
  description: string
  aggregated_reviews?: any[]
}

interface SectorAnalysis {
  market_overview: string
  top_trends: string[]
  customer_preferences: string[]
  competitive_landscape: string
  top_businesses: {
    name: string
    rating: number
    review_count: number
    key_strength: string
  }[]
}

async function analyzeCoffeeShops(): Promise<SectorAnalysis> {
  console.log('\n☕ Analyzing Coffee Shops in Slough...\n')
  
  const coffeeShops = await getBusinessesByCategory('cafes')
  
  // Sort by rating and review count
  const topShops = coffeeShops
    .sort((a, b) => {
      const scoreA = (a.rating * a.review_count)
      const scoreB = (b.rating * b.review_count)
      return scoreB - scoreA
    })
    .slice(0, 5)
  
  console.log('Top 5 Coffee Shops:')
  topShops.forEach((shop, i) => {
    console.log(`${i + 1}. ${shop.name} - ${shop.rating}⭐ (${shop.review_count} reviews)`)
  })
  
  // Get Manus insights
  const insights = await getSectorInsights('cafes', coffeeShops)
  
  return {
    market_overview: insights?.market_overview || 'Slough has a thriving coffee scene with both chain and independent options.',
    top_trends: insights?.top_trends || [
      'Specialty coffee and artisanal roasts',
      'Plant-based milk alternatives',
      'Cozy atmosphere and free WiFi',
      'Loyalty programs and student discounts'
    ],
    customer_preferences: insights?.customer_preferences || [
      'Quality over quantity',
      'Friendly service',
      'Good value for money',
      'Convenient location'
    ],
    competitive_landscape: insights?.competitive_landscape || 'Competition is healthy with room for both chains and independents.',
    top_businesses: topShops.map(shop => ({
      name: shop.name,
      rating: shop.rating,
      review_count: shop.review_count,
      key_strength: getKeyStrength(shop)
    }))
  }
}

async function analyzeRestaurants(): Promise<SectorAnalysis> {
  console.log('\n🍽️ Analyzing Restaurants in Slough...\n')
  
  const restaurants = await getBusinessesByCategory('restaurants')
  
  const topRestaurants = restaurants
    .sort((a, b) => {
      const scoreA = (a.rating * a.review_count)
      const scoreB = (b.rating * b.review_count)
      return scoreB - scoreA
    })
    .slice(0, 5)
  
  console.log('Top 5 Restaurants:')
  topRestaurants.forEach((restaurant, i) => {
    console.log(`${i + 1}. ${restaurant.name} - ${restaurant.rating}⭐ (${restaurant.review_count} reviews)`)
  })
  
  const insights = await getSectorInsights('restaurants', restaurants)
  
  return {
    market_overview: insights?.market_overview || 'Slough offers diverse dining options from pubs to fine dining.',
    top_trends: insights?.top_trends || [
      'Sunday roasts remain popular',
      'Fresh, locally sourced ingredients',
      'Family-friendly options',
      'Value for money is key'
    ],
    customer_preferences: insights?.customer_preferences || [
      'Generous portions',
      'Consistent quality',
      'Good atmosphere',
      'Reasonable pricing'
    ],
    competitive_landscape: insights?.competitive_landscape || 'Strong competition drives quality and innovation.',
    top_businesses: topRestaurants.map(restaurant => ({
      name: restaurant.name,
      rating: restaurant.rating,
      review_count: restaurant.review_count,
      key_strength: getKeyStrength(restaurant)
    }))
  }
}

async function analyzeHairSalons(): Promise<SectorAnalysis> {
  console.log('\n✂️ Analyzing Hair Salons in Slough...\n')
  
  const salons = await getBusinessesByCategory('hair-salons')
  
  const topSalons = salons
    .sort((a, b) => {
      const scoreA = (a.rating * a.review_count)
      const scoreB = (b.rating * b.review_count)
      return scoreB - scoreA
    })
    .slice(0, 5)
  
  console.log('Top 5 Hair Salons:')
  topSalons.forEach((salon, i) => {
    console.log(`${i + 1}. ${salon.name} - ${salon.rating}⭐ (${salon.review_count} reviews)`)
  })
  
  const insights = await getSectorInsights('beauty', salons)
  
  return {
    market_overview: insights?.market_overview || 'Slough has a strong beauty and wellness sector.',
    top_trends: insights?.top_trends || [
      'Balayage and color techniques',
      'Sustainable and organic products',
      'Men\'s grooming services',
      'Booking systems and flexibility'
    ],
    customer_preferences: insights?.customer_preferences || [
      'Consistency in results',
      'Professional consultation',
      'Value for money',
      'Relaxing atmosphere'
    ],
    competitive_landscape: insights?.competitive_landscape || 'Quality and consistency separate the best from the rest.',
    top_businesses: topSalons.map(salon => ({
      name: salon.name,
      rating: salon.rating,
      review_count: salon.review_count,
      key_strength: getKeyStrength(salon)
    }))
  }
}

function getKeyStrength(business: Business): string {
  if (business.aggregated_reviews && business.aggregated_reviews.length > 0) {
    const positiveReviews = business.aggregated_reviews.filter(r => r.rating >= 4)
    if (positiveReviews.length > 0) {
      const commonWords = extractCommonPraise(positiveReviews)
      return commonWords[0] || 'Excellent service'
    }
  }
  return 'Highly rated'
}

function extractCommonPraise(reviews: any[]): string[] {
  const words: { [key: string]: number } = {}
  
  reviews.forEach(review => {
    const text = review.text.toLowerCase()
    const praiseWords = [
      'friendly', 'professional', 'excellent', 'great', 'amazing',
      'fantastic', 'wonderful', 'outstanding', 'quality', 'clean',
      'helpful', 'knowledgeable', 'skilled', 'experienced', 'reliable'
    ]
    
    praiseWords.forEach(word => {
      if (text.includes(word)) {
        words[word] = (words[word] || 0) + 1
      }
    })
  })
  
  return Object.entries(words)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word)
}

async function generateEnrichedContent() {
  console.log('\n📊 Generating Enriched Editorial Content...\n')
  
  const [coffeeAnalysis, restaurantAnalysis, salonAnalysis] = await Promise.all([
    analyzeCoffeeShops(),
    analyzeRestaurants(),
    analyzeHairSalons()
  ])
  
  const enrichedData = {
    coffee_shops: coffeeAnalysis,
    restaurants: restaurantAnalysis,
    hair_salons: salonAnalysis,
    generated_at: new Date().toISOString()
  }
  
  // Save to file
  const outputPath = path.join(process.cwd(), 'data', 'editorial-insights.json')
  fs.writeFileSync(outputPath, JSON.stringify(enrichedData, null, 2))
  
  console.log('\n✅ Enriched data saved to data/editorial-insights.json\n')
  
  // Log summary
  console.log('📈 Summary:')
  console.log(`☕ Coffee Shops: ${coffeeAnalysis.top_businesses.length} top businesses analyzed`)
  console.log(`🍽️  Restaurants: ${restaurantAnalysis.top_businesses.length} top businesses analyzed`)
  console.log(`✂️  Hair Salons: ${salonAnalysis.top_businesses.length} top businesses analyzed`)
  
  return enrichedData
}

// Run if called directly
if (require.main === module) {
  generateEnrichedContent()
    .then(() => {
      console.log('\n✨ Done!\n')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error:', error)
      process.exit(1)
    })
}

export { generateEnrichedContent, analyzeCoffeeShops, analyzeRestaurants, analyzeHairSalons }

