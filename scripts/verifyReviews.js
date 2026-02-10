const fs = require('fs')
const path = require('path')

console.log('🔍 VERIFYING ESTATE AGENT REVIEWS')
console.log('='.repeat(50))

const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'))

const estateAgents = businesses.filter(business => business.category === 'estate-agents')

console.log(`Found ${estateAgents.length} estate agents\n`)

estateAgents.forEach((agent, index) => {
  console.log(`${index + 1}. ${agent.name}`)
  console.log(`   Rating: ${agent.rating}/5 (${agent.review_count} reviews)`)
  console.log(`   Slug: ${agent.slug}`)
  
  if (agent.aggregated_reviews && agent.aggregated_reviews.length > 0) {
    const positive = agent.aggregated_reviews.filter(r => r.rating >= 4).length
    const negative = agent.aggregated_reviews.filter(r => r.rating <= 2).length
    console.log(`   Reviews: ${positive} positive, ${negative} negative (${agent.aggregated_reviews.length} total)`)
    
    // Show first positive review
    const firstPositive = agent.aggregated_reviews.find(r => r.rating >= 4)
    if (firstPositive) {
      console.log(`   Sample positive: "${firstPositive.text.substring(0, 80)}..."`)
    }
    
    // Show first negative review
    const firstNegative = agent.aggregated_reviews.find(r => r.rating <= 2)
    if (firstNegative) {
      console.log(`   Sample negative: "${firstNegative.text.substring(0, 80)}..."`)
    }
  } else {
    console.log(`   ❌ No reviews found`)
  }
  
  console.log('')
})

console.log('='.repeat(50))
console.log('✅ Reviews verification complete!')
console.log('')
console.log('🌐 Test the business pages:')
console.log('   • http://localhost:3000/biz/wainwright-estates')
console.log('   • http://localhost:3000/biz/aj-eyre-sons')
console.log('   • http://localhost:3000/biz/leaders-slough')
console.log('   • http://localhost:3000/estate-agents')
