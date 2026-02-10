import fs from 'fs'
import path from 'path'

async function createLightweightBusinessData() {
  try {
    console.log('🚀 Creating lightweight business data for better performance...')
    
    // Read the full businesses.json file
    const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
    const businessesData = JSON.parse(fs.readFileSync(businessesPath, 'utf8'))
    
    // Create lightweight version with only essential fields
    const lightweightBusinesses = businessesData.map((business: any) => ({
      id: business.id,
      name: business.name,
      slug: business.slug,
      category: business.category,
      area: business.area,
      postcode: business.postcode,
      address: business.address,
      lat: business.lat,
      lng: business.lng,
      phone: business.phone,
      website: business.website,
      description: business.description.substring(0, 150) + '...', // Truncate description
      rating: business.rating,
      review_count: business.review_count,
      featured: business.featured,
      images: business.images, // Include images for directory pages
      // Remove heavy fields
      // opening_hours_json: removed
      // aggregated_reviews: removed
      // google_place_id: removed
      // All other optional fields removed
    }))
    
    // Write lightweight version
    const lightweightPath = path.join(process.cwd(), 'public', 'data', 'businesses-lightweight.json')
    fs.writeFileSync(lightweightPath, JSON.stringify(lightweightBusinesses, null, 2))
    
    // Check file sizes
    const originalSize = fs.statSync(businessesPath).size
    const lightweightSize = fs.statSync(lightweightPath).size
    const reduction = ((originalSize - lightweightSize) / originalSize * 100).toFixed(1)
    
    console.log(`✅ Lightweight data created successfully!`)
    console.log(`📊 File size reduction: ${reduction}%`)
    console.log(`📁 Original: ${(originalSize / 1024).toFixed(1)}KB`)
    console.log(`📁 Lightweight: ${(lightweightSize / 1024).toFixed(1)}KB`)
    console.log(`📈 Performance improvement: Faster page loads, reduced memory usage`)
    
  } catch (error) {
    console.error('❌ Error creating lightweight data:', error)
  }
}

createLightweightBusinessData()
