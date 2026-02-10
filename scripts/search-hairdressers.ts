const API_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!API_KEY) {
  console.error('Error: GOOGLE_PLACES_API_KEY not set!')
  process.exit(1)
}

// Areas to search
const areas = ['Slough', 'Horndean', 'Havant', 'Langley', 'Cippenham']

async function searchHairdressers(area: string) {
  const searchQueries = [
    `hairdressers ${area}`,
    `barbers ${area}`,
    `hair salon ${area}`
  ]
  
  const allResults: any[] = []
  
  for (const query of searchQueries) {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`
    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()
    
    if (searchData.status === 'OK' && searchData.results) {
      allResults.push(...searchData.results)
    }
    
    await new Promise(r => setTimeout(r, 300))
  }
  
  return allResults
}

async function getPlaceDetails(placeId: string) {
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,international_phone_number,website,opening_hours,rating,user_ratings_total,geometry,reviews,photos&key=${API_KEY}`
  const detailsRes = await fetch(detailsUrl)
  const detailsData = await detailsRes.json()
  
  if (detailsData.status !== 'OK') {
    return null
  }
  
  return detailsData.result
}

async function downloadPhoto(photoReference: string, placeId: string, index: number): Promise<string | null> {
  try {
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photoReference}&key=${API_KEY}`
    const response = await fetch(photoUrl)
    
    if (!response.ok) return null
    
    const buffer = await response.arrayBuffer()
    const fs = await import('fs')
    const path = await import('path')
    
    const filename = `${placeId}-${index}.jpg`
    const filepath = path.join(process.cwd(), 'public', 'images', 'businesses', filename)
    
    fs.writeFileSync(filepath, Buffer.from(buffer))
    
    const stats = fs.statSync(filepath)
    const fileSizeKB = stats.size / 1024
    
    console.log(`   📸 Downloaded photo ${index}: ${fileSizeKB.toFixed(1)}KB`)
    
    if (fileSizeKB < 50) {
      console.log(`   ⚠️  WARNING: Photo ${index} is only ${fileSizeKB.toFixed(1)}KB (should be 50KB+)`)
    }
    
    return `/images/businesses/${filename}`
  } catch (error) {
    console.error(`   ❌ Error downloading photo:`, error)
    return null
  }
}

async function main() {
  console.log('🔍 SEARCHING FOR HAIRDRESSERS/BARBERS WITH MOBILE NUMBERS\n')
  
  const allPlaces = new Map() // Use Map to deduplicate by place_id
  
  // Search all areas
  for (const area of areas) {
    console.log(`\n📍 Searching in ${area}...`)
    const results = await searchHairdressers(area)
    
    for (const place of results) {
      if (!allPlaces.has(place.place_id)) {
        allPlaces.set(place.place_id, place)
      }
    }
    
    await new Promise(r => setTimeout(r, 500))
  }
  
  console.log(`\n📊 Found ${allPlaces.size} unique places. Getting details...\n`)
  
  const validBusinesses: any[] = []
  
  for (const [placeId, place] of allPlaces.entries()) {
    const details = await getPlaceDetails(placeId)
    
    if (!details) {
      console.log(`❌ Could not get details for ${place.name}`)
      continue
    }
    
    // Check for mobile number (UK mobile starts with 07)
    const phone = details.formatted_phone_number || details.international_phone_number || ''
    const hasMobile = phone.includes('07') || phone.includes('+44 7')
    
    // Check rating and reviews
    const rating = details.rating || 0
    const reviewCount = details.user_ratings_total || 0
    
    console.log(`\n${details.name}`)
    console.log(`   📞 ${phone || 'NO PHONE'}`)
    console.log(`   ⭐ ${rating} (${reviewCount} reviews)`)
    console.log(`   📍 ${details.formatted_address}`)
    
    if (hasMobile && rating >= 4.0 && reviewCount >= 5) {
      console.log(`   ✅ VALID - Has mobile, good rating, enough reviews`)
      
      // Download photos
      const photos: string[] = []
      if (details.photos && details.photos.length > 0) {
        console.log(`   📸 Downloading ${Math.min(3, details.photos.length)} photos...`)
        
        for (let i = 0; i < Math.min(3, details.photos.length); i++) {
          const photoPath = await downloadPhoto(
            details.photos[i].photo_reference,
            placeId,
            i + 1
          )
          if (photoPath) {
            photos.push(photoPath)
          }
          await new Promise(r => setTimeout(r, 300))
        }
      }
      
      validBusinesses.push({
        place_id: placeId,
        name: details.name,
        address: details.formatted_address,
        phone: phone,
        rating: rating,
        review_count: reviewCount,
        lat: details.geometry.location.lat,
        lng: details.geometry.location.lng,
        website: details.website || '',
        reviews: details.reviews || [],
        photos: photos
      })
    } else {
      if (!hasMobile) console.log(`   ❌ No mobile number`)
      if (rating < 4.0) console.log(`   ❌ Rating too low (${rating})`)
      if (reviewCount < 5) console.log(`   ❌ Not enough reviews (${reviewCount})`)
    }
    
    await new Promise(r => setTimeout(r, 500))
  }
  
  console.log(`\n\n✅ FOUND ${validBusinesses.length} VALID HAIRDRESSERS/BARBERS`)
  
  // Save
  const fs = await import('fs')
  fs.writeFileSync('hairdressers-with-mobile.json', JSON.stringify(validBusinesses, null, 2))
  console.log('📝 Saved to hairdressers-with-mobile.json')
  
  // Print summary
  console.log('\n📋 SUMMARY:')
  for (const biz of validBusinesses) {
    console.log(`\n${biz.name}`)
    console.log(`   📞 ${biz.phone}`)
    console.log(`   ⭐ ${biz.rating} (${biz.review_count} reviews)`)
    console.log(`   📍 ${biz.address}`)
    console.log(`   🖼️  ${biz.photos.length} photos downloaded`)
  }
}

main().catch(console.error)
