import fs from 'fs'
import path from 'path'

async function fixBusinessAreas() {
  try {
    console.log('🔧 Fixing business areas to Slough only...')
    
    // Read the businesses.json file
    const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
    const businessesData = JSON.parse(fs.readFileSync(businessesPath, 'utf8'))
    
    // Find all businesses that were added in the recent population (they have 'new-' in their ID)
    const newBusinesses = businessesData.filter(business => business.id.startsWith('new-'))
    
    console.log(`Found ${newBusinesses.length} businesses to fix`)
    
    // Update each business to be Slough only
    const updatedBusinesses = businessesData.map(business => {
      if (business.id.startsWith('new-')) {
        // Update area to slough
        business.area = 'slough'
        
        // Update address to be Slough specific
        if (business.address.includes('Slough')) {
          // Address already includes Slough, keep it
          return business
        } else {
          // Add Slough to the address
          business.address = `${business.address}, Slough`
        }
        
        // Update postcode to be SL1 (Slough postcode)
        business.postcode = 'SL1 6XX'
        
        console.log(`✅ Fixed: ${business.name} -> Slough`)
      }
      return business
    })
    
    // Write updated data back
    fs.writeFileSync(businessesPath, JSON.stringify(updatedBusinesses, null, 2))
    
    console.log(`\n🎉 Successfully fixed ${newBusinesses.length} businesses to Slough only!`)
    console.log(`📊 Summary:`)
    console.log(`  - Businesses fixed: ${newBusinesses.length}`)
    console.log(`  - All areas set to: slough`)
    console.log(`  - All postcodes set to: SL1 6XX`)
    console.log(`  - All addresses include: Slough`)
    console.log(`📁 Updated: ${businessesPath}`)
    
  } catch (error) {
    console.error('❌ Error fixing business areas:', error)
  }
}

fixBusinessAreas()




