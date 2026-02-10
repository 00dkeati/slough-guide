import fs from 'fs'
import path from 'path'

async function addLangleyAccountants() {
  try {
    console.log('🏢 Adding accountants to serve Langley area...')
    
    // Read the businesses.json file
    const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
    const businessesData = JSON.parse(fs.readFileSync(businessesPath, 'utf8'))
    
    // Find Slough accountants that should also serve Langley
    const sloughAccountants = businessesData.filter((business: any) => 
      business.category === 'accountants' && business.area === 'slough'
    )
    
    console.log(`Found ${sloughAccountants.length} Slough accountants`)
    
    // Select top-rated accountants to also serve Langley
    const topAccountants = sloughAccountants
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 8) // Take top 8 accountants
    
    console.log(`\n📋 Adding top ${topAccountants.length} accountants to serve Langley:`)
    
    const newLangleyAccountants = topAccountants.map((accountant: any, index: number) => {
      const newId = `cowplain-${accountant.id}-${Date.now()}-${index}`
      const newSlug = `${accountant.slug}-cowplain`
      
      console.log(`  ✅ ${accountant.name} (${accountant.rating}⭐) -> Langley`)
      
      return {
        ...accountant,
        id: newId,
        slug: newSlug,
        area: 'cowplain',
        address: accountant.address.replace('Slough', 'Langley, Slough'),
        description: `${accountant.description} Serving Langley and surrounding areas.`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    })
    
    // Add the new Langley accountants to the businesses array
    const updatedBusinesses = [...businessesData, ...newLangleyAccountants]
    
    // Write updated data back
    fs.writeFileSync(businessesPath, JSON.stringify(updatedBusinesses, null, 2))
    
    console.log(`\n✅ Successfully added ${newLangleyAccountants.length} accountants to Langley!`)
    console.log(`📁 Updated: ${businessesPath}`)
    console.log(`📊 Total businesses: ${businessesData.length} -> ${updatedBusinesses.length}`)
    
  } catch (error) {
    console.error('❌ Error adding Langley accountants:', error)
  }
}

addLangleyAccountants()

