import { Business, GoogleReview } from './db'

// Generate engaging AI content from business data
export function generateBusinessInsights(business: Business): {
  highlights: string[]
  detailedDescription: string
  priceInfo: string
  accessibilityInfo: string
  diningOptions: string
  reviewSummary: string
  bestFor: string[]
} {
  const highlights: string[] = []
  const bestFor: string[] = []

  // Price Level Insights
  const priceLevels = ['Free', 'Inexpensive (£)', 'Moderate (££)', 'Expensive (£££)', 'Very Expensive (££££)']
  const priceInfo = business.price_level !== undefined
    ? `${priceLevels[business.price_level]} - ${getPriceDescription(business.price_level)}`
    : 'Price information not available'

  // Rating insights
  if (business.rating >= 4.5) {
    highlights.push(`⭐ Exceptional ${business.rating} star rating with ${business.review_count}+ reviews`)
    bestFor.push('High-quality service')
  } else if (business.rating >= 4.0) {
    highlights.push(`⭐ Highly rated at ${business.rating} stars`)
  }

  // Accessibility
  const accessibilityFeatures: string[] = []
  if (business.wheelchair_accessible) {
    accessibilityFeatures.push('♿ Wheelchair accessible')
    highlights.push('Fully wheelchair accessible')
    bestFor.push('Accessible to all')
  }
  if (business.good_for_children) {
    accessibilityFeatures.push('👶 Family-friendly')
    bestFor.push('Families with children')
  }
  if (business.allows_dogs) {
    accessibilityFeatures.push('🐕 Dog-friendly')
    bestFor.push('Pet owners')
  }
  const accessibilityInfo = accessibilityFeatures.length > 0
    ? accessibilityFeatures.join(' • ')
    : 'Accessibility information not available'

  // Dining Options
  const diningFeatures: string[] = []
  if (business.takeout) diningFeatures.push('📦 Takeout available')
  if (business.delivery) diningFeatures.push('🚚 Delivery service')
  if (business.dine_in) diningFeatures.push('🍽️ Dine-in')
  if (business.reservable) {
    diningFeatures.push('📅 Reservations accepted')
    bestFor.push('Special occasions')
  }
  if (business.outdoor_seating) {
    diningFeatures.push('☀️ Outdoor seating')
    highlights.push('Enjoy outdoor dining')
    bestFor.push('Al fresco dining')
  }

  // Meal times
  const meals: string[] = []
  if (business.serves_breakfast) meals.push('breakfast')
  if (business.serves_lunch) meals.push('lunch')
  if (business.serves_dinner) meals.push('dinner')
  if (meals.length > 0) {
    diningFeatures.push(`Serving ${meals.join(', ')}`)
  }

  // Beverages
  if (business.serves_beer || business.serves_wine) {
    const drinks = []
    if (business.serves_beer) drinks.push('beer')
    if (business.serves_wine) drinks.push('wine')
    diningFeatures.push(`🍷 Licensed for ${drinks.join(' & ')}`)
    highlights.push('Fully licensed')
  }

  // Dietary
  if (business.serves_vegetarian_food) {
    diningFeatures.push('🥗 Vegetarian options')
    highlights.push('Vegetarian-friendly menu')
    bestFor.push('Vegetarians')
  }

  const diningOptions = diningFeatures.length > 0
    ? diningFeatures.join(' • ')
    : ''

  // Payment & Parking
  if (business.payment_options && business.payment_options.length > 0) {
    highlights.push(`💳 Accepts ${business.payment_options.join(', ').replace(/_/g, ' ')}`)
  }
  if (business.parking_options && business.parking_options.length > 0) {
    const parkingDesc = business.parking_options.join(', ').replace(/_/g, ' ')
    highlights.push(`🅿️ ${parkingDesc}`)
  }

  // Generate detailed description
  const detailedDescription = generateDetailedDescription(business, bestFor)

  // Review summary
  const reviewSummary = generateReviewSummary(business)

  return {
    highlights: highlights.slice(0, 6), // Top 6 highlights
    detailedDescription,
    priceInfo,
    accessibilityInfo,
    diningOptions,
    reviewSummary,
    bestFor: bestFor.slice(0, 4)
  }
}

function getPriceDescription(priceLevel: number): string {
  const descriptions = [
    'Free or very affordable',
    'Budget-friendly with great value',
    'Reasonably priced with good quality',
    'Premium pricing for quality service',
    'Luxury experience with top-tier service'
  ]
  return descriptions[priceLevel] || 'Pricing varies'
}

function generateDetailedDescription(business: Business, bestFor: string[]): string {
  const parts: string[] = []

  // Start with editorial summary if available
  if (business.editorial_summary) {
    parts.push(business.editorial_summary)
  }

  // Add business description
  if (business.description) {
    parts.push(business.description)
  }

  // Add context based on features
  if (business.category === 'restaurants' || business.category === 'cafes' || business.category === 'pubs') {
    const features: string[] = []
    if (business.serves_breakfast) features.push('breakfast')
    if (business.serves_lunch) features.push('lunch')
    if (business.serves_dinner) features.push('dinner')
    
    if (features.length > 0) {
      parts.push(`Open for ${features.join(', ')}, ${business.name} offers a welcoming atmosphere ${business.outdoor_seating ? 'with both indoor and outdoor seating options' : 'for a comfortable dining experience'}.`)
    }

    if (business.takeout && business.delivery) {
      parts.push('Convenient takeout and delivery services available for those dining at home.')
    } else if (business.takeout) {
      parts.push('Takeout service available for those on the go.')
    }
  }

  // Add social proof
  if (business.rating >= 4.5 && business.review_count >= 50) {
    parts.push(`With an impressive ${business.rating} star rating from ${business.review_count}+ customers, ${business.name} has established itself as a trusted choice in ${business.area}.`)
  }

  // Add best for section
  if (bestFor.length > 0) {
    parts.push(`Perfect for ${bestFor.slice(0, 3).join(', ').toLowerCase()}.`)
  }

  return parts.join(' ')
}

function generateReviewSummary(business: Business): string {
  if (!business.reviews || business.reviews.length === 0) {
    return `Rated ${business.rating} stars based on ${business.review_count} customer reviews.`
  }

  const avgRating = business.rating
  const totalReviews = business.review_count

  // Analyze sentiment from reviews
  const positiveKeywords = ['great', 'excellent', 'amazing', 'love', 'best', 'wonderful', 'fantastic', 'perfect', 'delicious', 'friendly']
  const reviews = business.reviews.slice(0, 5) // Analyze top 5 reviews

  let positiveCount = 0
  const commonThemes: string[] = []

  reviews.forEach(review => {
    const lowerText = review.text.toLowerCase()
    positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) positiveCount++
    })

    // Extract common themes
    if (lowerText.includes('staff') || lowerText.includes('service')) {
      if (!commonThemes.includes('service')) commonThemes.push('service')
    }
    if (lowerText.includes('food') || lowerText.includes('meal')) {
      if (!commonThemes.includes('food quality')) commonThemes.push('food quality')
    }
    if (lowerText.includes('atmosphere') || lowerText.includes('ambiance')) {
      if (!commonThemes.includes('atmosphere')) commonThemes.push('atmosphere')
    }
    if (lowerText.includes('value') || lowerText.includes('price')) {
      if (!commonThemes.includes('value')) commonThemes.push('value')
    }
  })

  let summary = `Based on ${totalReviews} customer reviews, ${business.name} maintains a ${avgRating} star rating. `

  if (positiveCount > reviews.length * 2) {
    summary += 'Customers consistently praise this establishment'
  } else if (avgRating >= 4.5) {
    summary += 'Highly regarded by customers'
  } else if (avgRating >= 4.0) {
    summary += 'Well-received by the local community'
  } else {
    summary += 'Serving the Slough area'
  }

  if (commonThemes.length > 0) {
    summary += `, with particular appreciation for ${commonThemes.join(', ')}.`
  } else {
    summary += '.'
  }

  return summary
}

// Generate comparison content for similar businesses
export function generateComparisonInsights(businesses: Business[]): string {
  if (businesses.length === 0) return ''

  const avgRating = businesses.reduce((sum, b) => sum + b.rating, 0) / businesses.length
  const totalReviews = businesses.reduce((sum, b) => sum + b.review_count, 0)

  const priceRange = businesses
    .filter(b => b.price_level !== undefined)
    .map(b => b.price_level!)

  const minPrice = Math.min(...priceRange)
  const maxPrice = Math.max(...priceRange)

  const wheelchair = businesses.filter(b => b.wheelchair_accessible).length
  const delivery = businesses.filter(b => b.delivery).length
  const outdoor = businesses.filter(b => b.outdoor_seating).length

  let comparison = `Comparing ${businesses.length} similar businesses in Slough: `
  
  comparison += `Average rating of ${avgRating.toFixed(1)} stars across ${totalReviews} total reviews. `

  if (priceRange.length > 0) {
    const priceLevels = ['free', 'inexpensive', 'moderate', 'expensive', 'very expensive']
    comparison += `Prices range from ${priceLevels[minPrice]} to ${priceLevels[maxPrice]}. `
  }

  const features: string[] = []
  if (wheelchair > 0) features.push(`${wheelchair} wheelchair accessible`)
  if (delivery > 0) features.push(`${delivery} offer delivery`)
  if (outdoor > 0) features.push(`${outdoor} have outdoor seating`)

  if (features.length > 0) {
    comparison += `Features: ${features.join(', ')}.`
  }

  return comparison
}

// Extract key phrases from reviews for display
export function extractReviewHighlights(reviews: GoogleReview[]): string[] {
  const highlights: string[] = []
  
  reviews.slice(0, 5).forEach(review => {
    // Extract sentences with superlatives or strong positive words
    const sentences = review.text.split(/[.!?]/).filter(s => s.trim().length > 10)
    
    sentences.forEach(sentence => {
      const lower = sentence.toLowerCase()
      if (
        (lower.includes('best') || lower.includes('excellent') || 
         lower.includes('amazing') || lower.includes('love') ||
         lower.includes('highly recommend')) &&
        sentence.length < 150
      ) {
        highlights.push(`"${sentence.trim()}" - ${review.author_name}`)
      }
    })
  })

  return highlights.slice(0, 3) // Top 3 highlights
}

