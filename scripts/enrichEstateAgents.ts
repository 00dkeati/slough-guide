import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!API_KEY) {
  console.error('Error: GOOGLE_PLACES_API_KEY environment variable not set')
  process.exit(1)
}

interface Business {
  [key: string]: any
  google_place_id?: string
  category?: string
  name: string
}

interface GoogleReview {
  author_name: string
  rating: number
  text: string
  time: number
  relative_time_description: string
  profile_photo_url?: string
}

async function getPlaceDetailsWithReviews(placeId: string): Promise<any> {
  // Request reviews along with other details
  const fields = [
    'name',
    'rating',
    'user_ratings_total',
    'reviews', // This is the key field for getting actual customer reviews
    'price_level',
    'types',
    'editorial_summary',
  ].join(',')

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK') {
      return data.result
    } else {
      console.error(`Error fetching place details: ${data.status}`)
      if (data.error_message) {
        console.error(`  Message: ${data.error_message}`)
      }
      return null
    }
  } catch (error) {
    console.error(`Error fetching place ${placeId}:`, error)
    return null
  }
}

function extractReviewsData(placeData: any): GoogleReview[] | null {
  if (!placeData.reviews || placeData.reviews.length === 0) {
    return null
  }

  // Extract and format reviews (Google returns up to 5 most helpful reviews)
  return placeData.reviews.map((review: any) => ({
    author_name: review.author_name,
    rating: review.rating,
    text: review.text,
    time: review.time,
    relative_time_description: review.relative_time_description,
    profile_photo_url: review.profile_photo_url
  }))
}

async function enrichEstateAgents() {
  console.log('Loading businesses...')
  const businessesPath = join(process.cwd(), 'public', 'data', 'businesses.json')
  const businesses: Business[] = JSON.parse(readFileSync(businessesPath, 'utf-8'))

  // Filter for estate agents
  const estateAgents = businesses.filter(b => 
    b.category === 'estate-agents' || 
    b.category === 'property' ||
    (b.name && b.name.toLowerCase().includes('estate'))
  )

  console.log(`Found ${estateAgents.length} estate agents`)
  console.log('Fetching Google reviews...\n')

  let enrichedCount = 0
  let errorCount = 0
  let reviewsFound = 0

  for (let i = 0; i < estateAgents.length; i++) {
    const agent = estateAgents[i]

    if (!agent.google_place_id) {
      console.log(`[${i + 1}/${estateAgents.length}] Skipping ${agent.name} - no Google Place ID`)
      continue
    }

    console.log(`[${i + 1}/${estateAgents.length}] Fetching reviews for ${agent.name}...`)

    try {
      const placeData = await getPlaceDetailsWithReviews(agent.google_place_id)

      if (placeData) {
        const reviews = extractReviewsData(placeData)

        if (reviews && reviews.length > 0) {
          // Find the business in the main array and update it
          const businessIndex = businesses.findIndex(b => b.google_place_id === agent.google_place_id)
          if (businessIndex !== -1) {
            businesses[businessIndex].reviews = reviews
            reviewsFound += reviews.length
            console.log(`  ✅ Found ${reviews.length} reviews`)
            
            // Display a sample review
            if (reviews[0]) {
              const sampleText = reviews[0].text.length > 80 
                ? reviews[0].text.substring(0, 80) + '...' 
                : reviews[0].text
              console.log(`  💬 Sample: "${sampleText}"`)
              console.log(`     ⭐ ${reviews[0].rating}/5 by ${reviews[0].author_name}`)
            }
            
            enrichedCount++
          }
        } else {
          console.log(`  ⚠️  No reviews available`)
        }

        // Also update rating if available
        if (placeData.rating && placeData.user_ratings_total) {
          const businessIndex = businesses.findIndex(b => b.google_place_id === agent.google_place_id)
          if (businessIndex !== -1) {
            businesses[businessIndex].rating = placeData.rating
            businesses[businessIndex].review_count = placeData.user_ratings_total
          }
        }
      }

      // Rate limiting - Google API has strict limits
      // Wait 200ms between requests to be safe
      await new Promise(resolve => setTimeout(resolve, 200))

    } catch (error) {
      console.error(`  ❌ Error: ${error}`)
      errorCount++
    }
  }

  // Save enriched data
  console.log('\n📝 Saving enriched data...')
  writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))

  console.log(`\n✅ Complete!`)
  console.log(`   Estate agents processed: ${estateAgents.length}`)
  console.log(`   Successfully enriched: ${enrichedCount}`)
  console.log(`   Total reviews fetched: ${reviewsFound}`)
  console.log(`   Errors: ${errorCount}`)
  console.log(`\n💡 Reviews are now available in businesses.json`)
  console.log(`   Each estate agent now has a 'reviews' array with Google review data`)
}

// Run if called directly
if (require.main === module) {
  enrichEstateAgents().catch(console.error)
}

export { enrichEstateAgents }

