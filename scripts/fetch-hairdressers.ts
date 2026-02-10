/**
 * Fetch Hairdressers from Google Places API
 * Adds real hairdresser businesses to the directory
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!API_KEY) {
  console.error('❌ Error: GOOGLE_PLACES_API_KEY not set!')
  process.exit(1)
}

const BUSINESSES_FILE = path.join(process.cwd(), 'public/data/businesses.json')
const OUTPUT_DIR = path.join(process.cwd(), 'public/images/hairdressers')

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
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
  images?: string[]
}

// Search for places
async function searchPlaces(query: string): Promise<any[]> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`
  const response = await fetch(url)
  const data = await response.json()
  
  if (data.status === 'OK') {
    return data.results
  }
  console.log(`Search status: ${data.status}`)
  return []
}

// Get place details including photos
async function getPlaceDetails(placeId: string): Promise<any> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,geometry,address_components,types,photos&key=${API_KEY}`
  const response = await fetch(url)
  const data = await response.json()
  return data.status === 'OK' ? data.result : null
}

// Download photo
async function downloadPhoto(photoReference: string, filename: string): Promise<string | null> {
  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoReference}&key=${API_KEY}`
  const filepath = path.join(OUTPUT_DIR, filename)
  
  if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
    return `/images/hairdressers/${filename}`
  }
  
  return new Promise((resolve) => {
    const makeRequest = (url: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        resolve(null)
        return
      }
      const protocol = url.startsWith('https') ? https : http
      protocol.get(url, (response) => {
        if (response.statusCode === 302 || response.statusCode === 301) {
          const redirectUrl = response.headers.location
          if (redirectUrl) {
            makeRequest(redirectUrl, redirectCount + 1)
            return
          }
        }
        if (response.statusCode !== 200) {
          resolve(null)
          return
        }
        const fileStream = fs.createWriteStream(filepath)
        response.pipe(fileStream)
        fileStream.on('finish', () => {
          fileStream.close()
          resolve(`/images/hairdressers/${filename}`)
        })
        fileStream.on('error', () => {
          fs.unlink(filepath, () => {})
          resolve(null)
        })
      }).on('error', () => resolve(null))
    }
    makeRequest(photoUrl)
  })
}

// Extract postcode from address components
function extractPostcode(components: any[]): string {
  const pc = components?.find((c: any) => c.types.includes('postal_code'))
  return pc?.long_name || 'SL1'
}

// Extract area from address
function extractArea(components: any[], address: string): string {
  const areas = ['slough', 'cowplain', 'denmead', 'purbrook', 'havant', 'horndean', 'clanfield', 'lovedean']
  const locality = components?.find((c: any) => c.types.includes('locality'))?.long_name?.toLowerCase() || ''
  const addressLower = address.toLowerCase()
  
  for (const area of areas) {
    if (locality.includes(area) || addressLower.includes(area)) {
      return area
    }
  }
  return 'slough'
}

// Create URL slug from name
function createSlug(name: string, area: string = ''): string {
  const base = name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
  return area && !base.includes(area) ? `${base}-${area}` : base
}

async function main() {
  console.log('💇 Fetching hairdressers for Slough area...\n')
  
  const businesses: Business[] = JSON.parse(fs.readFileSync(BUSINESSES_FILE, 'utf8'))
  const existingIds = new Set(businesses.map(b => b.google_place_id).filter(Boolean))
  
  const searches = [
    'hairdressers in Slough',
    'hair salon Slough',
    'hairdressers Langley',
    'hair salon Horndean',
    'hairdressers Cippenham',
    'hairdressers Chalvey',
    'hair salon Havant',
  ]
  
  const allPlaces = new Map<string, any>()
  
  for (const query of searches) {
    console.log(`🔍 Searching: ${query}`)
    const results = await searchPlaces(query)
    
    for (const place of results) {
      if (!allPlaces.has(place.place_id) && !existingIds.has(place.place_id)) {
        // Filter to local area
        const addr = place.formatted_address?.toLowerCase() || ''
        if (addr.includes('slough') || addr.includes('cowplain') || 
            addr.includes('horndean') || addr.includes('denmead') ||
            addr.includes('purbrook') || addr.includes('havant') ||
            addr.includes('clanfield') || addr.includes('lovedean') ||
            addr.includes('po7') || addr.includes('po8') || addr.includes('po9')) {
          allPlaces.set(place.place_id, place)
        }
      }
    }
    await new Promise(r => setTimeout(r, 200))
  }
  
  console.log(`\n📋 Found ${allPlaces.size} unique hairdressers\n`)
  
  const newBusinesses: Business[] = []
  
  for (const [placeId, place] of allPlaces) {
    console.log(`📷 ${place.name}...`)
    
    const details = await getPlaceDetails(placeId)
    if (!details) {
      console.log('   ⚠️ No details')
      continue
    }
    
    const area = extractArea(details.address_components || [], details.formatted_address || '')
    const slug = createSlug(place.name, area)
    
    // Download photo if available
    let images: string[] | undefined
    if (details.photos?.[0]?.photo_reference) {
      const filename = `${slug}.jpg`
      const localPath = await downloadPhoto(details.photos[0].photo_reference, filename)
      if (localPath) {
        images = [localPath]
        console.log('   ✅ Photo downloaded')
      }
    } else {
      console.log('   ⚠️ No photo')
    }
    
    const business: Business = {
      id: `hairdresser-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: place.name,
      slug,
      category: 'hairdressers',
      area,
      postcode: extractPostcode(details.address_components),
      address: details.formatted_address || '',
      lat: details.geometry?.location?.lat || 0,
      lng: details.geometry?.location?.lng || 0,
      phone: details.formatted_phone_number || '',
      website: details.website || '',
      description: `${place.name} is a hairdresser in ${area.charAt(0).toUpperCase() + area.slice(1)}.`,
      opening_hours_json: JSON.stringify(details.opening_hours?.weekday_text || []),
      rating: details.rating || 0,
      review_count: details.user_ratings_total || 0,
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      google_place_id: placeId,
      images,
    }
    
    newBusinesses.push(business)
    await new Promise(r => setTimeout(r, 200))
  }
  
  // Add to businesses
  businesses.push(...newBusinesses)
  
  // Save
  fs.writeFileSync(BUSINESSES_FILE, JSON.stringify(businesses, null, 2))
  
  console.log(`\n✅ Added ${newBusinesses.length} hairdressers!`)
  console.log(`📁 Total businesses: ${businesses.length}`)
}

main()
