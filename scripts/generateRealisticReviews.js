const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')

console.log('🤖 GENERATING REALISTIC REVIEWS WITH OPENAI')
console.log('='.repeat(60))

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'))

// Function to generate realistic reviews using OpenAI
async function generateReviewsForBusiness(business, category) {
  try {
    const prompt = `Generate 3 positive reviews (4-5 stars) and 3 negative reviews (1-2 stars) for "${business.name}", a ${category} business in ${business.area}, Hampshire, UK.

Business details:
- Name: ${business.name}
- Category: ${category}
- Location: ${business.area}
- Description: ${business.description || 'Local business'}
- Current Rating: ${business.rating}/5 (${business.review_count} reviews)

Requirements:
1. Make reviews sound authentic and realistic
2. Use British English and local references
3. Include specific details about the business type
4. Vary reviewer names (use common British names)
5. Include realistic dates from the past 6 months
6. Make negative reviews constructive, not overly harsh

Format as JSON array:
[
  {
    "author_name": "John Smith",
    "rating": 5,
    "text": "Excellent service, highly recommended!",
    "date": "2024-08-15",
    "source": "google"
  }
]

Only return the JSON array, no other text.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert at generating realistic customer reviews. Create authentic-sounding reviews that reflect real customer experiences."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1500
    })

    const response = completion.choices[0].message.content.trim()
    
    // Try to parse the JSON response
    try {
      const reviews = JSON.parse(response)
      return reviews.filter(review => 
        review.author_name && 
        review.rating >= 1 && 
        review.rating <= 5 && 
        review.text && 
        review.text.length > 10
      )
    } catch (parseError) {
      console.log(`   ⚠️  JSON parse error: ${parseError.message}`)
      return []
    }
    
  } catch (error) {
    console.log(`   ❌ OpenAI Error: ${error.message}`)
    return []
  }
}

// Function to get category-specific review themes
function getCategoryThemes(category) {
  const themes = {
    'restaurants': {
      positive: ['food quality', 'friendly service', 'atmosphere', 'value for money', 'cleanliness'],
      negative: ['slow service', 'overpriced', 'small portions', 'noisy', 'long wait times']
    },
    'pubs': {
      positive: ['great atmosphere', 'friendly staff', 'good selection of drinks', 'live music', 'pub grub'],
      negative: ['expensive drinks', 'crowded', 'poor service', 'limited seating', 'noise']
    },
    'cafes': {
      positive: ['excellent coffee', 'cozy atmosphere', 'fresh pastries', 'friendly baristas', 'free wifi'],
      negative: ['slow service', 'expensive', 'limited seating', 'poor coffee', 'unfriendly staff']
    },
    'supermarkets': {
      positive: ['good selection', 'competitive prices', 'clean store', 'helpful staff', 'fresh produce'],
      negative: ['expensive', 'poor customer service', 'limited parking', 'long queues', 'out of stock items']
    },
    'pharmacies': {
      positive: ['helpful staff', 'quick service', 'professional advice', 'good selection', 'convenient location'],
      negative: ['long wait times', 'unhelpful staff', 'expensive', 'limited stock', 'poor opening hours']
    },
    'dentists': {
      positive: ['gentle treatment', 'professional staff', 'modern equipment', 'pain-free', 'good advice'],
      negative: ['painful treatment', 'expensive', 'long appointments', 'unfriendly staff', 'poor communication']
    },
    'hair-salons': {
      positive: ['skilled stylists', 'great results', 'friendly atmosphere', 'good value', 'professional service'],
      negative: ['poor haircut', 'expensive', 'unfriendly staff', 'long wait', 'poor communication']
    },
    'gyms': {
      positive: ['modern equipment', 'clean facilities', 'helpful trainers', 'good classes', 'friendly atmosphere'],
      negative: ['crowded', 'broken equipment', 'unfriendly staff', 'expensive', 'poor maintenance']
    },
    'builders': {
      positive: ['quality work', 'reliable', 'good communication', 'fair pricing', 'clean finish'],
      negative: ['poor workmanship', 'unreliable', 'expensive', 'poor communication', 'messy work']
    },
    'plumbers': {
      positive: ['quick response', 'professional service', 'fair pricing', 'quality repairs', 'helpful advice'],
      negative: ['slow response', 'expensive', 'poor workmanship', 'unreliable', 'poor communication']
    },
    'electricians': {
      positive: ['professional service', 'safety conscious', 'reliable', 'good pricing', 'quality work'],
      negative: ['expensive', 'poor workmanship', 'unreliable', 'slow service', 'poor communication']
    },
    'car-mechanics': {
      positive: ['honest service', 'quality repairs', 'fair pricing', 'quick turnaround', 'helpful advice'],
      negative: ['expensive', 'poor workmanship', 'unreliable', 'slow service', 'dishonest']
    },
    'vets': {
      positive: ['caring staff', 'professional treatment', 'good advice', 'clean facilities', 'reasonable prices'],
      negative: ['expensive', 'unfriendly staff', 'long wait times', 'poor communication', 'overpriced treatments']
    },
    'solicitors': {
      positive: ['expert advice', 'professional service', 'good communication', 'successful outcomes', 'fair fees'],
      negative: ['expensive', 'poor communication', 'unreliable', 'slow service', 'unprofessional']
    },
    'accountants': {
      positive: ['expert advice', 'helpful service', 'good communication', 'fair pricing', 'professional'],
      negative: ['expensive', 'poor communication', 'unreliable', 'slow service', 'unprofessional']
    }
  }
  
  return themes[category] || { positive: ['good service'], negative: ['poor service'] }
}

// Main function to process a category
async function processCategory(category) {
  console.log(`\n🏪 PROCESSING: ${category.toUpperCase()}`)
  console.log('='.repeat(50))
  
  const categoryBusinesses = businesses.filter(b => b.category === category && !b.aggregated_reviews)
  console.log(`Found ${categoryBusinesses.length} businesses without reviews in ${category} category\n`)
  
  let successCount = 0
  
  for (let i = 0; i < categoryBusinesses.length; i++) {
    const business = categoryBusinesses[i]
    console.log(`[${i + 1}/${categoryBusinesses.length}] ${business.name}`)
    console.log(`   📍 ${business.area} (${business.rating}/5 - ${business.review_count} reviews)`)
    
    try {
      const reviews = await generateReviewsForBusiness(business, category)
      
      if (reviews.length > 0) {
        // Update business with reviews
        const businessIndex = businesses.findIndex(b => b.id === business.id)
        if (businessIndex !== -1) {
          businesses[businessIndex].aggregated_reviews = reviews
          successCount++
          console.log(`   ✅ Generated ${reviews.length} reviews`)
          
          // Show sample review
          const sampleReview = reviews[0]
          console.log(`   📝 Sample: "${sampleReview.text.substring(0, 60)}..." (${sampleReview.rating}⭐)`)
        }
      } else {
        console.log(`   ❌ No reviews generated`)
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    console.log('')
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Save updated businesses
  fs.writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))
  
  console.log('='.repeat(50))
  console.log(`✅ COMPLETE! ${category.toUpperCase()}`)
  console.log(`Successfully generated reviews for: ${successCount}/${categoryBusinesses.length} businesses`)
  console.log(`📁 Data saved to: public/data/businesses.json`)
  
  return successCount
}

// Get category from command line argument
const category = process.argv[2]

if (!category) {
  console.log('Usage: node scripts/generateRealisticReviews.js <category>')
  console.log('Available categories:')
  console.log('- restaurants')
  console.log('- pubs')
  console.log('- cafes')
  console.log('- supermarkets')
  console.log('- pharmacies')
  console.log('- dentists')
  console.log('- hair-salons')
  console.log('- gyms')
  console.log('- builders')
  console.log('- plumbers')
  console.log('- electricians')
  console.log('- car-mechanics')
  console.log('- vets')
  console.log('- solicitors')
  console.log('- accountants')
  process.exit(1)
}

// Check if OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.log('❌ Error: OPENAI_API_KEY environment variable not set')
  console.log('Set it with: export OPENAI_API_KEY=your_api_key_here')
  process.exit(1)
}

// Run the generator for the specified category
processCategory(category).catch(console.error)
