import fs from 'fs'
import path from 'path'

// Google Places API key - you'll need to add this to your .env.local
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'AIzaSyB3pZBoHHpAmibsx8zT1VH6JW9_Odpm9sM'

// Better category-specific images from Unsplash
const categoryImageMap: { [key: string]: string } = {
  'carpenters': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800', // carpentry workshop
  'roofers': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // roofing work
  'painters': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // painting work
  'handyman': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800', // tools
  'heating-engineers': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // HVAC
  'landscapers': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800', // landscaping
  'locksmiths': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // locks
  'domestic-cleaners': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // cleaning
  'carpet-cleaning': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // carpet
  'pest-control': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // pest control
  'dog-walkers': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // dog walking
  'dog-groomers': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // dog grooming
  'pet-shops': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // pet shop
  'butchers': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', // butcher shop
  'bakeries': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', // bakery
  'florists': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // flowers
  'gift-shops': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // gift shop
  'convenience-stores': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // convenience store
  'barbers': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // barber shop
  'beauty-salons': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // beauty salon
  'nail-technicians': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // nails
  'massage-therapists': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // massage
  'mot-centres': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // garage
  'car-wash': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // car wash
  'mobile-mechanics': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // mechanic
  'tyre-shops': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // tyres
  'driving-instructors': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // driving
  'takeaways': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', // takeaway food
  'fish-chips': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', // fish and chips
  'catering-services': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', // catering
  'coffee-shops': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', // coffee shop
  'nurseries': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // nursery
  'tutors': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // tutor
  'driving-schools': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // driving school
  'childminders': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // childminder
  'personal-trainers': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // personal trainer
  'yoga-studios': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // yoga
  'physiotherapists': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // physio
  'chiropractors': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // chiropractor
  'letting-agents': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // letting agent
  'removal-companies': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // removals
  'bookkeepers': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // bookkeeping
  'it-services': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // IT services
  'web-designers': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // web design
  'marketing-agencies': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // marketing
  'printers': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800', // printing
  'photographers': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // photography
  'graphic-designers': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // graphic design
  'wedding-planners': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // wedding
  'djs': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // DJ
  'taxi-firms': 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800', // taxi
  'community-centres': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // community
  'charities': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', // charity
}

async function fetchGooglePlacesImages(placeId: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_PLACES_API_KEY}`
    )
    
    if (!response.ok) {
      console.log(`Failed to fetch Google Places data for ${placeId}`)
      return []
    }
    
    const data = await response.json()
    
    if (data.result && data.result.photos) {
      return data.result.photos.slice(0, 5).map((photo: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
      )
    }
    
    return []
  } catch (error) {
    console.log(`Error fetching Google Places images for ${placeId}:`, error)
    return []
  }
}

async function fixBusinessImages() {
  try {
    console.log('🖼️ Fixing business images...')

    const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
    let businessesData = JSON.parse(fs.readFileSync(businessesPath, 'utf8'))

    let updatedCount = 0
    let googleImagesCount = 0
    let categoryImagesCount = 0

    for (const business of businessesData) {
      let newImages: string[] = []
      
      // First try to get Google Places images if we have a place_id
      if (business.google_place_id && !business.images?.some((img: string) => img.includes('maps.googleapis.com'))) {
        console.log(`🔍 Fetching Google Places images for: ${business.name}`)
        const googleImages = await fetchGooglePlacesImages(business.google_place_id)
        if (googleImages.length > 0) {
          newImages = googleImages
          googleImagesCount++
          console.log(`✅ Found ${googleImages.length} Google Places images for: ${business.name}`)
        }
      }
      
      // If no Google images, use category-specific images
      if (newImages.length === 0) {
        const categoryImage = categoryImageMap[business.category]
        if (categoryImage) {
          newImages = [categoryImage]
          categoryImagesCount++
          console.log(`📸 Using category image for: ${business.name} (${business.category})`)
        }
      }
      
      // Update the business if we found new images
      if (newImages.length > 0) {
        business.images = newImages
        updatedCount++
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    fs.writeFileSync(businessesPath, JSON.stringify(businessesData, null, 2))

    console.log(`\n🎉 Successfully updated images for ${updatedCount} businesses!`)
    console.log(`📊 Summary:`)
    console.log(`  - Businesses updated: ${updatedCount}`)
    console.log(`  - Google Places images: ${googleImagesCount}`)
    console.log(`  - Category-specific images: ${categoryImagesCount}`)
    console.log(`📁 Updated: ${businessesPath}`)

  } catch (error) {
    console.error('❌ Error fixing business images:', error)
  }
}

fixBusinessImages()




