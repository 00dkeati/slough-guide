import fs from 'fs'
import path from 'path'

// Script to verify and fix business images across all pages
async function fixBusinessImages() {
  console.log('🔍 Checking business images...')
  
  // Read the businesses data
  const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses-lightweight.json')
  const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf8'))
  
  let totalBusinesses = businesses.length
  let businessesWithImages = 0
  let businessesWithoutImages = 0
  let invalidImageUrls = 0
  
  console.log(`📊 Total businesses: ${totalBusinesses}`)
  
  businesses.forEach((business: any, index: number) => {
    if (business.images && business.images.length > 0) {
      // Check if images are valid Google Places URLs
      const validImages = business.images.filter((img: string) => 
        img.includes('maps.googleapis.com/maps/api/place/photo') && 
        img.includes('photoreference=') &&
        img.includes('key=')
      )
      
      if (validImages.length > 0) {
        businessesWithImages++
      } else {
        invalidImageUrls++
        console.log(`⚠️  Invalid images for: ${business.name}`)
      }
    } else {
      businessesWithoutImages++
      console.log(`❌ No images for: ${business.name}`)
    }
  })
  
  console.log('\n📈 Image Statistics:')
  console.log(`✅ Businesses with valid images: ${businessesWithImages}`)
  console.log(`❌ Businesses without images: ${businessesWithoutImages}`)
  console.log(`⚠️  Businesses with invalid image URLs: ${invalidImageUrls}`)
  console.log(`📊 Coverage: ${((businessesWithImages / totalBusinesses) * 100).toFixed(1)}%`)
  
  // Generate recommendations
  console.log('\n💡 Recommendations:')
  if (businessesWithoutImages > 0) {
    console.log(`- ${businessesWithoutImages} businesses need Google Places photos`)
    console.log('- Consider running Google Places API sync for missing images')
  }
  if (invalidImageUrls > 0) {
    console.log(`- ${invalidImageUrls} businesses have invalid image URLs`)
    console.log('- Check Google Places API key and photo references')
  }
  
  // Check specific categories
  const categories = [...new Set(businesses.map((b: any) => b.category))]
  console.log('\n📂 Category Breakdown:')
  
  categories.forEach(category => {
    const categoryBusinesses = businesses.filter((b: any) => b.category === category)
    const withImages = categoryBusinesses.filter((b: any) => 
      b.images && b.images.length > 0 && 
      b.images.some((img: string) => 
        img.includes('maps.googleapis.com/maps/api/place/photo')
      )
    )
    const coverage = ((withImages.length / categoryBusinesses.length) * 100).toFixed(1)
    console.log(`- ${category}: ${withImages.length}/${categoryBusinesses.length} (${coverage}%)`)
  })
}

// Run the check
fixBusinessImages().catch(console.error)
