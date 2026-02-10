import fs from 'fs'
import path from 'path'

// Sample barber images from Unsplash
const barberImages = {
  'Studio H': [
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b7d?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&q=80'
  ],
  'JC Barbering': [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop&q=80'
  ],
  'The Langley Barber Shop': [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1594736797933-d0f6c0b0b0b0?w=800&h=600&fit=crop&q=80'
  ],
  'L.A. Barbers': [
    'https://images.unsplash.com/photo-1562322140-8baaccef4b5b?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80'
  ],
  'Jay\'s Barbers': [
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b7d?w=800&h=600&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&q=80'
  ]
}

async function addBarberImages() {
  try {
    console.log('🔍 Adding images to barber businesses...')
    
    // Read the businesses database
    const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses-lightweight.json')
    const businessesData = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'))
    
    let updatedCount = 0
    
    // Update barber businesses with images
    const updatedBusinesses = businessesData.map((business: any) => {
      if (business.category === 'hair-salons' && barberImages[business.name]) {
        console.log(`✅ Adding images to ${business.name}`)
        updatedCount++
        return {
          ...business,
          images: barberImages[business.name]
        }
      }
      return business
    })
    
    // Write the updated businesses data
    fs.writeFileSync(businessesPath, JSON.stringify(updatedBusinesses, null, 2))
    
    console.log(`✅ Successfully added images to ${updatedCount} barber businesses`)
    
    // Also update the CSV file
    const csvPath = path.join(process.cwd(), 'data', 'businesses.csv')
    let csvContent = fs.readFileSync(csvPath, 'utf-8')
    
    // Add images column if it doesn't exist
    if (!csvContent.includes('images')) {
      csvContent = csvContent.replace('featured', 'images,featured')
    }
    
    // Update CSV with image URLs (simplified - just first image)
    Object.entries(barberImages).forEach(([name, images]) => {
      const regex = new RegExp(`"${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}",hair-salons[^\\n]*`, 'g')
      csvContent = csvContent.replace(regex, (match) => {
        if (!match.includes('images')) {
          return match.replace('false', `"${images[0]}",false`)
        }
        return match
      })
    })
    
    fs.writeFileSync(csvPath, csvContent)
    console.log('✅ Updated CSV file with barber images')
    
  } catch (error) {
    console.error('❌ Error adding barber images:', error)
  }
}

// Run the script
addBarberImages().catch(console.error)
