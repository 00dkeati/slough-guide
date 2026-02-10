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
}

async function getEnhancedPlaceData(placeId: string): Promise<any> {
  // Request all available fields from Google Places API
  const fields = [
    'name',
    'formatted_address',
    'formatted_phone_number',
    'website',
    'rating',
    'user_ratings_total',
    'reviews', // Get actual reviews
    'price_level',
    'opening_hours',
    'photos',
    'types',
    'editorial_summary',
    'current_opening_hours',
    // Service options
    'takeout',
    'delivery',
    'dine_in',
    'reservable',
    // Dining options
    'serves_breakfast',
    'serves_lunch',
    'serves_dinner',
    'serves_beer',
    'serves_wine',
    'serves_vegetarian_food',
    // Amenities
    'wheelchair_accessible_entrance',
    'outdoor_seating',
    'good_for_children',
    // Payment
    'accepts_credit_cards',
    'accepts_debit_cards',
    'accepts_cash_only',
    // Parking
    'parking',
  ].join(',')

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${API_KEY}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK') {
      return data.result
    } else {
      console.error(`Error fetching place details: ${data.status}`)
      return null
    }
  } catch (error) {
    console.error(`Error fetching place ${placeId}:`, error)
    return null
  }
}

function extractEnhancedData(placeData: any): Partial<Business> {
  const enhanced: any = {}

  // Price level
  if (placeData.price_level !== undefined) {
    enhanced.price_level = placeData.price_level
  }

  // Reviews
  if (placeData.reviews && placeData.reviews.length > 0) {
    enhanced.reviews = placeData.reviews.slice(0, 5).map((review: any) => ({
      author_name: review.author_name,
      rating: review.rating,
      text: review.text,
      time: review.time,
      relative_time_description: review.relative_time_description,
      profile_photo_url: review.profile_photo_url
    }))
  }

  // Types
  if (placeData.types) {
    enhanced.types = placeData.types
  }

  // Editorial summary (Google's AI description)
  if (placeData.editorial_summary?.overview) {
    enhanced.editorial_summary = placeData.editorial_summary.overview
  }

  // Current opening hours status
  if (placeData.current_opening_hours?.weekday_text) {
    enhanced.current_opening_hours = placeData.current_opening_hours.weekday_text.join('\n')
  }

  // Service options
  if (placeData.takeout !== undefined) enhanced.takeout = placeData.takeout
  if (placeData.delivery !== undefined) enhanced.delivery = placeData.delivery
  if (placeData.dine_in !== undefined) enhanced.dine_in = placeData.dine_in
  if (placeData.reservable !== undefined) enhanced.reservable = placeData.reservable

  // Dining options
  if (placeData.serves_breakfast !== undefined) enhanced.serves_breakfast = placeData.serves_breakfast
  if (placeData.serves_lunch !== undefined) enhanced.serves_lunch = placeData.serves_lunch
  if (placeData.serves_dinner !== undefined) enhanced.serves_dinner = placeData.serves_dinner
  if (placeData.serves_beer !== undefined) enhanced.serves_beer = placeData.serves_beer
  if (placeData.serves_wine !== undefined) enhanced.serves_wine = placeData.serves_wine
  if (placeData.serves_vegetarian_food !== undefined) enhanced.serves_vegetarian_food = placeData.serves_vegetarian_food

  // Amenities
  if (placeData.wheelchair_accessible_entrance !== undefined) {
    enhanced.wheelchair_accessible = placeData.wheelchair_accessible_entrance
  }
  if (placeData.outdoor_seating !== undefined) enhanced.outdoor_seating = placeData.outdoor_seating
  if (placeData.good_for_children !== undefined) enhanced.good_for_children = placeData.good_for_children

  // Payment options
  const paymentOptions: string[] = []
  if (placeData.accepts_credit_cards) paymentOptions.push('credit_cards')
  if (placeData.accepts_debit_cards) paymentOptions.push('debit_cards')
  if (placeData.accepts_cash_only) paymentOptions.push('cash_only')
  if (paymentOptions.length > 0) {
    enhanced.payment_options = paymentOptions
  }

  // Parking
  if (placeData.parking) {
    const parkingOptions: string[] = []
    if (placeData.parking.free_parking) parkingOptions.push('free_parking')
    if (placeData.parking.paid_parking) parkingOptions.push('paid_parking')
    if (placeData.parking.street_parking) parkingOptions.push('street_parking')
    if (parkingOptions.length > 0) {
      enhanced.parking_options = parkingOptions
    }
  }

  return enhanced
}

async function enrichBusinesses() {
  console.log('Loading businesses...')
  const businessesPath = join(process.cwd(), 'public', 'data', 'businesses.json')
  const businesses: Business[] = JSON.parse(readFileSync(businessesPath, 'utf-8'))

  console.log(`Found ${businesses.length} businesses`)
  console.log('Enriching with Google Places data...\n')

  let enrichedCount = 0
  let errorCount = 0

  for (let i = 0; i < businesses.length; i++) {
    const business = businesses[i]

    if (!business.google_place_id) {
      console.log(`Skipping ${business.name} - no Google Place ID`)
      continue
    }

    console.log(`[${i + 1}/${businesses.length}] Enriching ${business.name}...`)

    try {
      const placeData = await getEnhancedPlaceData(business.google_place_id)

      if (placeData) {
        const enhancedData = extractEnhancedData(placeData)
        businesses[i] = { ...business, ...enhancedData }
        enrichedCount++

        // Log interesting findings
        if (enhancedData.editorial_summary) {
          console.log(`  ✨ Got AI summary`)
        }
        if (enhancedData.reviews) {
          console.log(`  📝 Got ${enhancedData.reviews.length} reviews`)
        }
        if (enhancedData.price_level !== undefined) {
          const levels = ['Free', '£', '££', '£££', '££££']
          console.log(`  💰 Price level: ${levels[enhancedData.price_level]}`)
        }
      }

      // Rate limiting - wait 100ms between requests
      await new Promise(resolve => setTimeout(resolve, 100))

    } catch (error) {
      console.error(`  ❌ Error: ${error}`)
      errorCount++
    }
  }

  // Save enriched data
  console.log('\nSaving enriched data...')
  writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))

  console.log(`\n✅ Complete!`)
  console.log(`   Enriched: ${enrichedCount} businesses`)
  console.log(`   Errors: ${errorCount}`)
  console.log(`   Total: ${businesses.length} businesses`)
}

// Run if called directly
if (require.main === module) {
  enrichBusinesses().catch(console.error)
}

export { enrichBusinesses }

