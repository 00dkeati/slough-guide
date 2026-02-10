import fs from 'fs'
import path from 'path'

async function addMissingCategories() {
  try {
    console.log('🚀 Adding missing UK business categories...')
    
    // Read the current categories.json file
    const categoriesPath = path.join(process.cwd(), 'public', 'data', 'categories.json')
    const categoriesData = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'))
    
    // Define high-priority missing categories (most likely to have businesses)
    const newCategories = [
      // High-demand trades & services
      { name: 'Carpenters & Joiners', slug: 'carpenters', description: 'Professional carpentry and joinery services for home improvements and construction projects.' },
      { name: 'Roofers', slug: 'roofers', description: 'Roofing specialists for repairs, maintenance, and new installations.' },
      { name: 'Painters & Decorators', slug: 'painters', description: 'Professional painting and decorating services for homes and businesses.' },
      { name: 'Handyman Services', slug: 'handyman', description: 'General handyman services for home repairs and maintenance.' },
      { name: 'Heating Engineers', slug: 'heating-engineers', description: 'Boiler specialists and heating system installation and repair services.' },
      { name: 'Landscapers & Gardeners', slug: 'landscapers', description: 'Garden design, landscaping, and maintenance services.' },
      { name: 'Locksmiths', slug: 'locksmiths', description: 'Emergency locksmith services and security solutions.' },
      
      // Home & cleaning services
      { name: 'Domestic Cleaners', slug: 'domestic-cleaners', description: 'Professional house cleaning and domestic cleaning services.' },
      { name: 'Carpet Cleaning', slug: 'carpet-cleaning', description: 'Professional carpet and upholstery cleaning services.' },
      { name: 'Pest Control', slug: 'pest-control', description: 'Professional pest control and extermination services.' },
      
      // Pets
      { name: 'Dog Walkers', slug: 'dog-walkers', description: 'Professional dog walking and pet care services.' },
      { name: 'Dog Groomers', slug: 'dog-groomers', description: 'Professional dog grooming and pet grooming services.' },
      { name: 'Pet Shops', slug: 'pet-shops', description: 'Pet supplies, food, and accessories for all animals.' },
      
      // Shopping & retail
      { name: 'Butchers', slug: 'butchers', description: 'Fresh meat, poultry, and deli products from local butchers.' },
      { name: 'Bakeries', slug: 'bakeries', description: 'Fresh bread, cakes, pastries, and baked goods.' },
      { name: 'Florists', slug: 'florists', description: 'Fresh flowers, bouquets, and floral arrangements for all occasions.' },
      { name: 'Gift Shops', slug: 'gift-shops', description: 'Unique gifts, cards, and special occasion items.' },
      { name: 'Convenience Stores', slug: 'convenience-stores', description: 'Local convenience stores and corner shops.' },
      
      // Health & beauty
      { name: 'Barbers', slug: 'barbers', description: 'Traditional barber services and men\'s grooming.' },
      { name: 'Beauty Salons', slug: 'beauty-salons', description: 'Professional beauty treatments and skincare services.' },
      { name: 'Nail Technicians', slug: 'nail-technicians', description: 'Professional nail care, manicures, and pedicures.' },
      { name: 'Massage Therapists', slug: 'massage-therapists', description: 'Professional massage therapy and relaxation services.' },
      
      // Automotive
      { name: 'MOT Centres', slug: 'mot-centres', description: 'MOT testing and vehicle inspection services.' },
      { name: 'Car Wash & Valeting', slug: 'car-wash', description: 'Professional car washing, valeting, and detailing services.' },
      { name: 'Mobile Mechanics', slug: 'mobile-mechanics', description: 'Mobile car repair and maintenance services.' },
      { name: 'Tyre Shops', slug: 'tyre-shops', description: 'Tyre fitting, repair, and replacement services.' },
      { name: 'Driving Instructors', slug: 'driving-instructors', description: 'Professional driving lessons and instructor services.' },
      
      // Food & drink
      { name: 'Takeaways', slug: 'takeaways', description: 'Takeaway food delivery and collection services.' },
      { name: 'Fish & Chips Shops', slug: 'fish-chips', description: 'Traditional British fish and chips takeaways.' },
      { name: 'Catering Services', slug: 'catering-services', description: 'Professional catering for events and occasions.' },
      { name: 'Coffee Shops', slug: 'coffee-shops', description: 'Specialty coffee shops and cafes.' },
      
      // Education & childcare
      { name: 'Nurseries', slug: 'nurseries', description: 'Early years childcare and nursery education.' },
      { name: 'Tutors', slug: 'tutors', description: 'Private tutoring and educational support services.' },
      { name: 'Driving Schools', slug: 'driving-schools', description: 'Professional driving schools and lessons.' },
      { name: 'Childminders', slug: 'childminders', description: 'Registered childminders and childcare providers.' },
      
      // Health, fitness & wellbeing
      { name: 'Personal Trainers', slug: 'personal-trainers', description: 'Personal fitness training and coaching services.' },
      { name: 'Yoga & Pilates Studios', slug: 'yoga-studios', description: 'Yoga, Pilates, and mindfulness classes.' },
      { name: 'Physiotherapists', slug: 'physiotherapists', description: 'Physical therapy and rehabilitation services.' },
      { name: 'Chiropractors', slug: 'chiropractors', description: 'Chiropractic care and spinal health services.' },
      
      // Property & real estate
      { name: 'Letting Agents', slug: 'letting-agents', description: 'Property letting and rental management services.' },
      { name: 'Removal Companies', slug: 'removal-companies', description: 'House removal and relocation services.' },
      
      // Business services
      { name: 'Bookkeepers', slug: 'bookkeepers', description: 'Professional bookkeeping and accounting services.' },
      { name: 'IT Services', slug: 'it-services', description: 'Computer support, IT consulting, and technology services.' },
      { name: 'Web Designers', slug: 'web-designers', description: 'Website design and development services.' },
      { name: 'Marketing Agencies', slug: 'marketing-agencies', description: 'Digital marketing and advertising services.' },
      { name: 'Printers', slug: 'printers', description: 'Printing services, business cards, and promotional materials.' },
      
      // Media & creative
      { name: 'Photographers', slug: 'photographers', description: 'Professional photography services for all occasions.' },
      { name: 'Graphic Designers', slug: 'graphic-designers', description: 'Graphic design and visual communication services.' },
      
      // Events & occasions
      { name: 'Wedding Planners', slug: 'wedding-planners', description: 'Professional wedding planning and coordination services.' },
      { name: 'DJs', slug: 'djs', description: 'Professional DJ services for events and parties.' },
      
      // Travel & leisure
      { name: 'Taxi Firms', slug: 'taxi-firms', description: 'Local taxi services and private hire vehicles.' },
      
      // Community
      { name: 'Community Centres', slug: 'community-centres', description: 'Local community centers and meeting venues.' },
      { name: 'Charities', slug: 'charities', description: 'Local charities and community organizations.' }
    ]
    
    // Get existing slugs to avoid duplicates
    const existingSlugs = categoriesData.map((cat: any) => cat.slug)
    
    // Filter out categories that already exist
    const categoriesToAdd = newCategories.filter(cat => !existingSlugs.includes(cat.slug))
    
    console.log(`📋 Adding ${categoriesToAdd.length} new categories:`)
    categoriesToAdd.forEach(cat => {
      console.log(`  ✅ ${cat.name} (${cat.slug})`)
    })
    
    // Add new categories to the existing data
    const updatedCategories = [...categoriesData, ...categoriesToAdd]
    
    // Write updated data back
    fs.writeFileSync(categoriesPath, JSON.stringify(updatedCategories, null, 2))
    
    console.log(`\n🎉 Successfully added ${categoriesToAdd.length} new categories!`)
    console.log(`📊 Summary:`)
    console.log(`  - Original categories: ${categoriesData.length}`)
    console.log(`  - New categories added: ${categoriesToAdd.length}`)
    console.log(`  - Total categories: ${updatedCategories.length}`)
    console.log(`📁 Updated: ${categoriesPath}`)
    
  } catch (error) {
    console.error('❌ Error adding categories:', error)
  }
}

addMissingCategories()

