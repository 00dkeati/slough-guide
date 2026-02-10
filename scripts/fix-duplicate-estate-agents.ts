import fs from 'fs'
import path from 'path'

async function fixDuplicateEstateAgents() {
  try {
    console.log('🔍 Analyzing estate agents for duplicates...')
    
    // Read the businesses.json file
    const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
    const businessesData = JSON.parse(fs.readFileSync(businessesPath, 'utf8'))
    
    // Filter estate agents
    const estateAgents = businessesData.filter((business: any) => 
      business.category === 'estate-agents' || 
      business.category === 'property' ||
      business.name.toLowerCase().includes('estate')
    )
    
    console.log(`Found ${estateAgents.length} estate agent entries`)
    
    // Group by name to find duplicates
    const groupedByName: { [key: string]: any[] } = {}
    
    estateAgents.forEach((agent: any) => {
      const normalizedName = agent.name.toLowerCase().trim()
      if (!groupedByName[normalizedName]) {
        groupedByName[normalizedName] = []
      }
      groupedByName[normalizedName].push(agent)
    })
    
    // Find duplicates
    const duplicates: { [key: string]: any[] } = {}
    Object.keys(groupedByName).forEach(name => {
      if (groupedByName[name].length > 1) {
        duplicates[name] = groupedByName[name]
      }
    })
    
    console.log(`\n🔍 Found ${Object.keys(duplicates).length} duplicate groups:`)
    
    // Process duplicates
    const businessesToRemove: string[] = []
    
    Object.keys(duplicates).forEach(name => {
      const group = duplicates[name]
      console.log(`\n📋 "${name}":`)
      
      // Sort by review count and rating to keep the best one
      group.sort((a, b) => {
        if (b.review_count !== a.review_count) {
          return b.review_count - a.review_count
        }
        return b.rating - a.rating
      })
      
      const keep = group[0]
      const remove = group.slice(1)
      
      console.log(`  ✅ KEEP: ${keep.name} (${keep.slug}) - ${keep.rating}⭐, ${keep.review_count} reviews`)
      
      remove.forEach(agent => {
        console.log(`  ❌ REMOVE: ${agent.name} (${agent.slug}) - ${agent.rating}⭐, ${agent.review_count} reviews`)
        businessesToRemove.push(agent.id)
      })
    })
    
    // Remove duplicates from the main businesses array
    const cleanedBusinesses = businessesData.filter((business: any) => 
      !businessesToRemove.includes(business.id)
    )
    
    console.log(`\n📊 Summary:`)
    console.log(`  - Original businesses: ${businessesData.length}`)
    console.log(`  - Duplicates removed: ${businessesToRemove.length}`)
    console.log(`  - Final businesses: ${cleanedBusinesses.length}`)
    
    // Write cleaned data back
    fs.writeFileSync(businessesPath, JSON.stringify(cleanedBusinesses, null, 2))
    
    console.log(`\n✅ Successfully cleaned duplicate estate agents!`)
    console.log(`📁 Updated: ${businessesPath}`)
    
  } catch (error) {
    console.error('❌ Error cleaning estate agents:', error)
  }
}

fixDuplicateEstateAgents()

