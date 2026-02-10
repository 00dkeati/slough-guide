import { writeFileSync } from 'fs'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!API_KEY) {
  console.error('Error: GOOGLE_PLACES_API_KEY not set!')
  process.exit(1)
}

interface GooglePlace {
  place_id: string
  name: string
  formatted_address: string
  geometry: { location: { lat: number; lng: number } }
  rating?: number
  user_ratings_total?: number
  formatted_phone_number?: string
  types: string[]
}

interface PainterResult {
  place_id: string
  name: string
  address: string
  area: string
  phone: string
  rating: number
  review_count: number
  lat: number
  lng: number
  website?: string
  opening_hours?: any
  reviews?: any[]
}

async function searchPlaces(query: string, location: string): Promise<GooglePlace[]> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' near ' + location)}&key=${API_KEY}`
  console.log(`Searching: ${query} near ${location}`)
  const response = await fetch(url)
  const data = await response.json()
  if (data.status === 'OK') return data.results
  console.log(`  Status: ${data.status}`)
  return []
}

async function getPlaceDetails(placeId: string): Promise<any> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,geometry,address_components,types,reviews&key=${API_KEY}`
  const response = await fetch(url)
  const data = await response.json()
  return data.status === 'OK' ? data.result : null
}

function extractArea(address: string): string {
  const targetAreas = ['slough', 'cowplain', 'denmead', 'purbrook', 'havant', 'horndean', 'emsworth', 'leigh park']
  const lowerAddress = address.toLowerCase()
  for (const area of targetAreas) {
    if (lowerAddress.includes(area)) {
      return area.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    }
  }
  return 'Unknown'
}

async function main() {
  // ONLY local areas - NO Winchester, Southampton, Fareham, Basingstoke
  const areas = [
    'Slough, Berkshire',
    'Horndean, Berkshire',
    'Havant, Berkshire',
    'Langley, Slough',
    'Cippenham, Slough',
    'Chalvey, Slough',
    'Leigh Park, Havant',
    'Emsworth, Berkshire'
  ]
  
  const searches = [
    'painter and decorator',
    'painters',
    'decorators',
    'painting services',
    'decorating services'
  ]
  
  const allResults: PainterResult[] = []
  const seen = new Set<string>()
  
  console.log('🎨 SEARCHING FOR LOCAL PAINTERS ONLY\n')
  console.log('Target areas:', areas.join(', '))
  console.log('\n')
  
  for (const area of areas) {
    console.log(`\n📍 Searching ${area}...`)
    for (const search of searches) {
      const places = await searchPlaces(search, area)
      console.log(`  Found ${places.length} results for "${search}"`)
      
      for (const place of places) {
        if (seen.has(place.place_id)) continue
        seen.add(place.place_id)
        
        const details = await getPlaceDetails(place.place_id)
        if (!details) continue
        
        const phone = details.formatted_phone_number || ''
        const isMobile = phone.includes('07') || phone.startsWith('07')
        const rating = place.rating || 0
        const reviewCount = place.user_ratings_total || 0
        
        // Filter: Need mobile number, 5+ reviews, 4+ stars
        if (!isMobile || reviewCount < 5 || rating < 4) {
          console.log(`    ❌ ${place.name} - Mobile: ${isMobile}, Reviews: ${reviewCount}, Rating: ${rating}`)
          continue
        }
        
        const extractedArea = extractArea(place.formatted_address)
        
        // Double-check it's actually local
        const tooFar = ['winchester', 'southampton', 'basingstoke', 'fareham', 'portsmouth']
        if (tooFar.some(far => place.formatted_address.toLowerCase().includes(far))) {
          console.log(`    ❌ ${place.name} - TOO FAR: ${place.formatted_address}`)
          continue
        }
        
        console.log(`    ✅ ${place.name} - ${extractedArea} - ${phone} - ${rating}⭐ (${reviewCount} reviews)`)
        
        allResults.push({
          place_id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          area: extractedArea,
          phone: phone,
          rating: rating,
          review_count: reviewCount,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          website: details.website,
          opening_hours: details.opening_hours,
          reviews: details.reviews
        })
        
        await new Promise((r) => setTimeout(r, 150))
      }
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  
  console.log(`\n\n✅ TOTAL FOUND: ${allResults.length} local painters with mobile numbers`)
  console.log('Sorting by review count...\n')
  
  allResults.sort((a, b) => b.review_count - a.review_count)
  
  // Take top 15 to have some backup
  const top15 = allResults.slice(0, 15)
  
  console.log('TOP 15 LOCAL PAINTERS:\n')
  top15.forEach((p, i) => {
    console.log(`${i + 1}. ${p.name} - ${p.area}`)
    console.log(`   ${p.phone} - ${p.rating}⭐ (${p.review_count} reviews)`)
    console.log(`   ${p.address}`)
    console.log('')
  })
  
  writeFileSync('local-painters-results.json', JSON.stringify(top15, null, 2))
  console.log('Saved to local-painters-results.json')
}

main().catch(console.error)
