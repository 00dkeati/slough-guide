import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!API_KEY) {
  console.error('❌ GOOGLE_PLACES_API_KEY not set!')
  process.exit(1)
}

interface Business {
  id: string
  name: string
  google_place_id?: string
  images?: string[]
  [key: string]: any
}

async function getPlacePhotos(placeId: string): Promise<string[]> {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`
    
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status === 'OK' && data.result.photos) {
      // Get up to 5 photos
      return data.result.photos.slice(0, 5).map((photo: any) => {
        // Return the photo reference URL
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${API_KEY}`
      })
    }
    
    return []
  } catch (error) {
    console.error(`Error fetching photos for ${placeId}:`, error)
    return []
  }
}

async function addPhotosToAllBusinesses() {
  const businessesPath = join(process.cwd(), 'public/data/businesses.json')
  const businesses: Business[] = JSON.parse(readFileSync(businessesPath, 'utf-8'))

  console.log(`📸 Adding photos to ${businesses.length} businesses...`)
  console.log('⏱️  This will take about 10-15 minutes\n')

  let updated = 0
  let skipped = 0

  for (let i = 0; i < businesses.length; i++) {
    const business = businesses[i]
    
    // Skip if already has images or no place_id
    if (business.images && business.images.length > 0) {
      skipped++
      continue
    }

    if (!business.google_place_id) {
      skipped++
      continue
    }

    console.log(`[${i + 1}/${businesses.length}] ${business.name}`)
    
    const photos = await getPlacePhotos(business.google_place_id)
    
    if (photos.length > 0) {
      business.images = photos
      updated++
      console.log(`  ✅ Added ${photos.length} photos`)
    } else {
      console.log(`  ⚠️  No photos available`)
    }

    // Rate limiting - wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100))

    // Save progress every 50 businesses
    if ((i + 1) % 50 === 0) {
      writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))
      console.log(`\n💾 Progress saved (${i + 1}/${businesses.length})\n`)
    }
  }

  // Final save
  writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))

  console.log(`\n${'='.repeat(60)}`)
  console.log('📊 PHOTO ADDITION COMPLETE')
  console.log(`${'='.repeat(60)}`)
  console.log(`✅ Updated: ${updated} businesses`)
  console.log(`⏭️  Skipped: ${skipped} businesses`)
  console.log(`📸 Total photos added: ${updated * 3} (approx)`)
  console.log(`💰 API Cost: ~$${(businesses.length * 0.017).toFixed(2)}`)
}

addPhotosToAllBusinesses().catch(console.error)
