const API_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!API_KEY) {
  console.error('Error: GOOGLE_PLACES_API_KEY not set!')
  process.exit(1)
}

// Specific painters we know exist but need details for
const paintersToFind = [
  'Jade Lisa Interiors Havant',
  'MS Decorating Slough',
  'Johnsons Decorating Leigh Park',
  'Lee Baker Decorating Slough',
  'Brewer Painter Decorator Havant',
  'Charles Henry Property Services Emsworth'
]

async function searchAndGetDetails(searchQuery: string) {
  // Text search
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${API_KEY}`
  const searchRes = await fetch(searchUrl)
  const searchData = await searchRes.json()
  
  if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
    console.log(`❌ Not found: ${searchQuery}`)
    return null
  }
  
  const place = searchData.results[0]
  
  // Get details
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,geometry,reviews&key=${API_KEY}`
  const detailsRes = await fetch(detailsUrl)
  const detailsData = await detailsRes.json()
  
  if (detailsData.status !== 'OK') {
    console.log(`❌ Details not found for: ${searchQuery}`)
    return null
  }
  
  const details = detailsData.result
  
  return {
    place_id: place.place_id,
    name: details.name,
    address: details.formatted_address,
    phone: details.formatted_phone_number || '',
    rating: details.rating || 0,
    review_count: details.user_ratings_total || 0,
    lat: details.geometry.location.lat,
    lng: details.geometry.location.lng,
    website: details.website || '',
    reviews: details.reviews || []
  }
}

async function main() {
  console.log('🔍 SEARCHING FOR SPECIFIC LOCAL PAINTERS\n')
  
  const results: any[] = []
  
  for (const query of paintersToFind) {
    console.log(`Searching: ${query}...`)
    const result = await searchAndGetDetails(query)
    if (result) {
      console.log(`✅ Found: ${result.name} - ${result.phone} - ${result.rating}⭐ (${result.review_count} reviews)`)
      console.log(`   ${result.address}`)
      console.log('')
      results.push(result)
    }
    await new Promise(r => setTimeout(r, 500))
  }
  
  console.log(`\n✅ FOUND ${results.length} ADDITIONAL PAINTERS`)
  
  // Save
  const fs = await import('fs')
  fs.writeFileSync('additional-painters.json', JSON.stringify(results, null, 2))
  console.log('📝 Saved to additional-painters.json')
}

main().catch(console.error)
