/**
 * Analyze Restaurants in Slough and Horndean
 * Gather real data and reviews for comprehensive article
 */

import { getBusinessesByCategory, getBusinessesByArea } from '../lib/db'
import fs from 'fs'
import path from 'path'

interface Business {
  id: string
  name: string
  slug: string
  category: string
  area: string
  rating: number
  review_count: number
  description: string
  address: string
  phone: string
  images?: string[]
  aggregated_reviews?: any[]
}

async function analyzeRestaurants() {
  console.log('\n🍽️  Analyzing Restaurants in Slough and Horndean...\n')
  
  const [sloughRestaurants, horndeanRestaurants] = await Promise.all([
    getBusinessesByCategory('restaurants'),
    getBusinessesByArea('horndean')
  ])
  
  // Filter for restaurants only in Horndean
  const horndeanRestaurantsFiltered = horndeanRestaurants.filter(r => 
    r.category === 'restaurants' || r.category === 'pubs'
  )
  
  const allRestaurants = [...sloughRestaurants, ...horndeanRestaurantsFiltered]
  
  // Sort by rating and review count
  const topRestaurants = allRestaurants
    .filter(r => r.review_count >= 50) // Only include restaurants with substantial reviews
    .sort((a, b) => {
      const scoreA = (a.rating * a.review_count) + (a.review_count * 0.1)
      const scoreB = (b.rating * b.review_count) + (b.review_count * 0.1)
      return scoreB - scoreA
    })
    .slice(0, 10)
  
  console.log('Top 10 Restaurants:')
  topRestaurants.forEach((restaurant, i) => {
    console.log(`${i + 1}. ${restaurant.name} (${restaurant.area}) - ${restaurant.rating}⭐ (${restaurant.review_count} reviews)`)
  })
  
  // Analyze reviews for each restaurant
  const restaurantAnalysis = topRestaurants.map(restaurant => {
    const reviews = restaurant.aggregated_reviews || []
    const positiveReviews = reviews.filter(r => r.rating >= 4)
    const negativeReviews = reviews.filter(r => r.rating <= 2)
    
    // Extract common praise
    const praiseWords: { [key: string]: number } = {}
    positiveReviews.forEach(review => {
      const text = review.text.toLowerCase()
      const words = ['friendly', 'excellent', 'great', 'amazing', 'delicious', 'wonderful', 'outstanding', 'perfect', 'fantastic', 'good']
      words.forEach(word => {
        if (text.includes(word)) {
          praiseWords[word] = (praiseWords[word] || 0) + 1
        }
      })
    })
    
    // Extract common complaints
    const complaintWords: { [key: string]: number } = {}
    negativeReviews.forEach(review => {
      const text = review.text.toLowerCase()
      const words = ['slow', 'poor', 'bad', 'disappointing', 'expensive', 'cold', 'overpriced', 'rude', 'wait', 'disappointed']
      words.forEach(word => {
        if (text.includes(word)) {
          complaintWords[word] = (complaintWords[word] || 0) + 1
        }
      })
    })
    
    const topPraise = Object.entries(praiseWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word)
    
    const topComplaints = Object.entries(complaintWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word)
    
    // Get sample reviews
    const samplePositive = positiveReviews.slice(0, 2)
    const sampleNegative = negativeReviews.slice(0, 1)
    
    return {
      name: restaurant.name,
      slug: restaurant.slug,
      area: restaurant.area,
      rating: restaurant.rating,
      review_count: restaurant.review_count,
      address: restaurant.address,
      phone: restaurant.phone,
      description: restaurant.description,
      image: restaurant.images?.[0],
      top_praise: topPraise,
      top_complaints: topComplaints,
      sample_positive_reviews: samplePositive,
      sample_negative_reviews: sampleNegative,
      price_level: getPriceLevel(restaurant.description, reviews),
      best_for: getBestFor(reviews, restaurant.description)
    }
  })
  
  // Save analysis
  const outputPath = path.join(process.cwd(), 'data', 'restaurant-analysis.json')
  fs.writeFileSync(outputPath, JSON.stringify({
    restaurants: restaurantAnalysis,
    total_analyzed: allRestaurants.length,
    top_restaurants: topRestaurants.length,
    generated_at: new Date().toISOString()
  }, null, 2))
  
  console.log(`\n✅ Analysis saved to data/restaurant-analysis.json\n`)
  console.log('📊 Summary:')
  console.log(`   Total restaurants analyzed: ${allRestaurants.length}`)
  console.log(`   Top restaurants featured: ${topRestaurants.length}`)
  console.log(`   Total reviews analyzed: ${restaurantAnalysis.reduce((sum, r) => sum + r.review_count, 0)}`)
  
  return restaurantAnalysis
}

function getPriceLevel(description: string, reviews: any[]): string {
  const text = (description + ' ' + reviews.map(r => r.text).join(' ')).toLowerCase()
  
  if (text.includes('fine dining') || text.includes('gourmet') || text.includes('expensive')) {
    return 'High-end (££££)'
  }
  if (text.includes('casual') || text.includes('family') || text.includes('pub')) {
    return 'Mid-range (£££)'
  }
  return 'Affordable (££)'
}

function getBestFor(reviews: any[], description: string): string[] {
  const text = (description + ' ' + reviews.map(r => r.text).join(' ')).toLowerCase()
  const categories = []
  
  if (text.includes('family') || text.includes('children') || text.includes('kids')) {
    categories.push('Families')
  }
  if (text.includes('date') || text.includes('romantic') || text.includes('couple')) {
    categories.push('Date nights')
  }
  if (text.includes('business') || text.includes('meeting') || text.includes('lunch')) {
    categories.push('Business lunches')
  }
  if (text.includes('party') || text.includes('celebration') || text.includes('birthday')) {
    categories.push('Celebrations')
  }
  if (text.includes('sunday roast') || text.includes('roast')) {
    categories.push('Sunday roasts')
  }
  if (text.includes('quick') || text.includes('lunch') || text.includes('fast')) {
    categories.push('Quick lunches')
  }
  
  return categories.length > 0 ? categories : ['General dining']
}

// Run if called directly
if (require.main === module) {
  analyzeRestaurants()
    .then(() => {
      console.log('\n✨ Done!\n')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error:', error)
      process.exit(1)
    })
}

export { analyzeRestaurants }

