import { writeFileSync } from 'fs'
import { join } from 'path'

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
  types: string[]
  business_status?: string
}

interface Business {
  id: string
  name: string
  slug: string
  category: string
  area: string
  postcode: string
  address: string
  lat: number
  lng: number
  phone: string
  website: string
  description: string
  opening_hours_json: string
  rating: number
  review_count: number
  featured: boolean
  created_at: string
  updated_at: string
  google_place_id?: string
}

const typeToCategory: Record<string, string> = {
  restaurant: 'restaurants',
  cafe: 'cafes',
  plumber: 'plumbers',
  electrician: 'electricians',
  hair_care: 'hair-salons',
  dentist: 'dentists',
  gym: 'gyms',
  veterinary_care: 'vets',
  car_repair: 'car-mechanics',
  supermarket: 'supermarkets',
  pharmacy: 'pharmacies',
  drugstore: 'pharmacies',
  post_office: 'post-offices',
  library: 'libraries',
  lawyer: 'solicitors',
  accounting: 'accountants',
  real_estate_agency: 'estate-agents',
  general_contractor: 'builders',
  home_goods_store: 'garden-centers',
  bakery: 'cafes',
  bar: 'pubs',
  meal_takeaway: 'restaurants',
}

async function searchPlaces(query: string, location: string): Promise<GooglePlace[]> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + ' near ' + location)}&key=${API_KEY}`
  const response = await fetch(url)
  const data = await response.json()
  if (data.status === 'OK') return data.results
  return []
}

async function getPlaceDetails(placeId: string): Promise<any> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,geometry,address_components,types&key=${API_KEY}`
  const response = await fetch(url)
  const data = await response.json()
  return data.status === 'OK' ? data.result : null
}

function extractPostcode(addressComponents: any[]): string {
  const pc = addressComponents.find((c) => c.types.includes('postal_code'))
  return pc?.long_name || 'SL1 7SR'
}

function extractArea(addressComponents: any[], address: string): string {
  const targetAreas = ['slough', 'cowplain', 'denmead', 'purbrook', 'havant', 'horndean', 'emsworth', 'southwick']
  const locality = addressComponents.find((c) => c.types.includes('locality'))?.long_name?.toLowerCase() || ''
  for (const target of targetAreas) {
    if (locality.includes(target) || address.toLowerCase().includes(target)) return target
  }
  return 'slough'
}

function createSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
}

function determineCategory(types: string[]): string {
  for (const type of types) {
    if (typeToCategory[type]) return typeToCategory[type]
  }
  return 'other'
}

async function convertToBusinessFormat(place: GooglePlace, details: any): Promise<Business | null> {
  const category = determineCategory(place.types)
  if (category === 'other') return null
  
  const postcode = extractPostcode(details.address_components || [])
  const area = extractArea(details.address_components || [], place.formatted_address)
  
  let openingHoursJson = '{}'
  if (details.opening_hours?.weekday_text) {
    const hours: Record<string, string> = {}
    details.opening_hours.weekday_text.forEach((text: string) => {
      const parts = text.split(': ')
      if (parts.length === 2) hours[parts[0].toLowerCase()] = parts[1]
    })
    openingHoursJson = JSON.stringify(hours)
  }
  
  return {
    id: `google-${place.place_id.slice(0, 10)}`,
    name: place.name,
    slug: createSlug(place.name),
    category,
    area,
    postcode,
    address: place.formatted_address.split(',')[0],
    lat: place.geometry.location.lat,
    lng: place.geometry.location.lng,
    phone: details.formatted_phone_number || '',
    website: details.website || '',
    description: `${place.name} in ${area.charAt(0).toUpperCase() + area.slice(1)}. Professional ${category.replace('-', ' ')} serving the local community.`,
    opening_hours_json: openingHoursJson,
    rating: place.rating || 0,
    review_count: place.user_ratings_total || 0,
    featured: (place.user_ratings_total || 0) > 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    google_place_id: place.place_id,
  }
}

async function main() {
  const areas = ['Slough', 'Langley', 'Cippenham', 'Chalvey', 'Havant', 'Horndean', 'Emsworth', 'Southwick']
  const searches = ['restaurants', 'cafes', 'pubs', 'supermarkets', 'pharmacies', 'dentists', 'hairdressers', 'gyms', 'plumbers', 'electricians', 'car mechanics', 'vets', 'solicitors', 'accountants', 'estate agents']
  
  const allBusinesses: Business[] = []
  const seen = new Set<string>()
  
  console.log('Starting search...')
  console.log(`Areas: ${areas.length}, Categories: ${searches.length}`)
  
  for (const area of areas) {
    console.log(`\nSearching ${area}...`)
    for (const search of searches) {
      const places = await searchPlaces(search, area)
      for (const place of places) {
        if (seen.has(place.place_id) || place.business_status === 'CLOSED_PERMANENTLY') continue
        seen.add(place.place_id)
        
        const details = await getPlaceDetails(place.place_id)
        if (details) {
          const business = await convertToBusinessFormat(place, details)
          if (business) {
            allBusinesses.push(business)
            console.log(`  Added: ${business.name}`)
          }
        }
        await new Promise((r) => setTimeout(r, 100))
      }
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  
  console.log(`\nTotal businesses: ${allBusinesses.length}`)
  writeFileSync(join(process.cwd(), 'public/data/businesses.json'), JSON.stringify(allBusinesses, null, 2))
  console.log('Saved to businesses.json')
}

main().catch(console.error)
