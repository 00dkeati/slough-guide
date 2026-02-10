import fs from 'fs'
import path from 'path'

async function updateBusinessImages() {
  try {
    console.log('🖼️ Updating business images with real photos...')
    
    // Read the businesses.json file
    const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
    const businessesData = JSON.parse(fs.readFileSync(businessesPath, 'utf8'))
    
    // Find all businesses that were added in the recent population (they have 'new-' in their ID)
    const newBusinesses = businessesData.filter(business => business.id.startsWith('new-'))
    
    console.log(`Found ${newBusinesses.length} businesses to update images for`)
    
    // Define image mappings for each business type
    const imageMappings = {
      // Trades & Services
      'carpenters': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'roofers': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
      'painters': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'handyman': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'heating-engineers': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'landscapers': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      'locksmiths': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Home & Cleaning
      'domestic-cleaners': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'carpet-cleaning': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'pest-control': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Pets
      'dog-walkers': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
      'dog-groomers': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
      'pet-shops': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
      
      // Shopping & Retail
      'butchers': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'bakeries': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
      'florists': 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800',
      'gift-shops': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'convenience-stores': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Health & Beauty
      'barbers': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'beauty-salons': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'nail-technicians': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'massage-therapists': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Automotive
      'mot-centres': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'car-wash': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'mobile-mechanics': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'tyre-shops': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'driving-instructors': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Food & Drink
      'takeaways': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'fish-chips': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'catering-services': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'coffee-shops': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800',
      
      // Education & Childcare
      'nurseries': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'tutors': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'driving-schools': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'childminders': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Health & Fitness
      'personal-trainers': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'yoga-studios': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'physiotherapists': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'chiropractors': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Property
      'letting-agents': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'removal-companies': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Business Services
      'bookkeepers': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'it-services': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'web-designers': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'marketing-agencies': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'printers': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Media & Creative
      'photographers': 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
      'graphic-designers': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Events
      'wedding-planners': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'djs': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Travel & Leisure
      'taxi-firms': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      
      // Community
      'community-centres': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800',
      'charities': 'https://images.unsplash.com/photo-1581578731548-c6d0f3e0c4e8?w=800'
    }
    
    // Update each business with appropriate image
    const updatedBusinesses = businessesData.map(business => {
      if (business.id.startsWith('new-')) {
        const categoryImage = imageMappings[business.category]
        if (categoryImage) {
          business.images = [categoryImage]
          console.log(`✅ Updated: ${business.name} (${business.category})`)
        } else {
          console.log(`⚠️ No image mapping for: ${business.category}`)
        }
      }
      return business
    })
    
    // Write updated data back
    fs.writeFileSync(businessesPath, JSON.stringify(updatedBusinesses, null, 2))
    
    console.log(`\n🎉 Successfully updated images for ${newBusinesses.length} businesses!`)
    console.log(`📊 Summary:`)
    console.log(`  - Businesses updated: ${newBusinesses.length}`)
    console.log(`  - Image categories: ${Object.keys(imageMappings).length}`)
    console.log(`  - All images from Unsplash (high quality)`)
    console.log(`📁 Updated: ${businessesPath}`)
    
  } catch (error) {
    console.error('❌ Error updating business images:', error)
  }
}

updateBusinessImages()




