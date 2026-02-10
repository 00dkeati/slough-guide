const fs = require('fs')
const path = require('path')

console.log('🏠 SCRAPING ESTATE AGENT REVIEWS WITH MANUS AI API')
console.log('='.repeat(60))

const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'))

// Estate agents to scrape reviews for
const estateAgents = businesses.filter(business => business.category === 'estate-agents')

console.log(`Found ${estateAgents.length} estate agents to scrape reviews for\n`)

// Function to scrape using Manus AI API
async function scrapeWithManusAPI(searchQuery, instructions) {
  try {
    const response = await fetch('https://api.manus.ai/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MANUS_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        urls: [
          `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
          `https://www.trustpilot.com/search?query=${encodeURIComponent(searchQuery)}`,
          `https://www.allagents.co.uk/search/?q=${encodeURIComponent(searchQuery)}`
        ],
        instructions: instructions
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.log(`   ⚠️  API Error: ${error.message}`)
    return { data: [] }
  }
}

async function scrapeEstateAgentReviews() {
  for (let i = 0; i < estateAgents.length; i++) {
    const agent = estateAgents[i]
    console.log(`[${i + 1}/${estateAgents.length}] ${agent.name}`)
    console.log(`   📍 Searching for reviews...`)
    
    try {
      // Search for positive reviews
      const positiveSearchQuery = `${agent.name} estate agent slough positive reviews good experience customer service`
      const negativeSearchQuery = `${agent.name} estate agent slough negative reviews bad experience complaints`
      
      console.log(`   🔍 Scraping positive reviews...`)
      const positiveResults = await scrapeWithManusAPI(positiveSearchQuery, `Find 3 recent positive customer reviews for ${agent.name} estate agent in Slough. Extract the reviewer name, rating (1-5 stars), review text, and date. Focus on reviews about good customer service, successful property sales/lettings, professional staff, and positive experiences.`)
      
      console.log(`   🔍 Scraping negative reviews...`)
      const negativeResults = await scrapeWithManusAPI(negativeSearchQuery, `Find 3 recent negative customer reviews for ${agent.name} estate agent in Slough. Extract the reviewer name, rating (1-2 stars), review text, and date. Focus on reviews about poor customer service, failed transactions, unprofessional behavior, communication issues, and negative experiences.`)
      
      // Process positive reviews
      const positiveReviews = processReviews(positiveResults, 'positive', agent.name)
      const negativeReviews = processReviews(negativeResults, 'negative', agent.name)
      
      // Update business with new reviews
      const businessIndex = businesses.findIndex(b => b.id === agent.id)
      if (businessIndex !== -1) {
        businesses[businessIndex].aggregated_reviews = [
          ...positiveReviews.slice(0, 3), // Top 3 positive
          ...negativeReviews.slice(0, 3)  // Top 3 negative
        ]
        
        console.log(`   ✅ Added: ${positiveReviews.length} positive + ${negativeReviews.length} negative reviews`)
      }
      
    } catch (error) {
      console.log(`   ❌ Error scraping ${agent.name}:`, error.message)
    }
    
    console.log('')
    
    // Add delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  // Save updated businesses
  fs.writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))
  
  console.log('='.repeat(60))
  console.log(`✅ COMPLETE! Updated ${estateAgents.length} estate agents with real reviews`)
  console.log(`📁 Data saved to: public/data/businesses.json`)
}

function processReviews(scrapeResults, type, agentName) {
  const reviews = []
  
  try {
    // Extract reviews from scrape results
    if (scrapeResults && scrapeResults.data) {
      const reviewData = scrapeResults.data
      
      // Parse the scraped content to extract reviews
      if (Array.isArray(reviewData)) {
        reviewData.forEach(item => {
          if (item.content) {
            // Extract review information using regex patterns
            const reviewMatches = item.content.match(/reviewer[^:]*:?\s*([^,\n]+)[,\n]*(?:rating|stars?)[^:]*:?\s*(\d+)[,\n]*(?:text|review)[^:]*:?\s*"([^"]+)"/gi)
            
            if (reviewMatches) {
              reviewMatches.forEach(match => {
                const parts = match.match(/reviewer[^:]*:?\s*([^,\n]+)[,\n]*(?:rating|stars?)[^:]*:?\s*(\d+)[,\n]*(?:text|review)[^:]*:?\s*"([^"]+)"/i)
                if (parts && parts.length >= 4) {
                  reviews.push({
                    author_name: parts[1].trim(),
                    rating: parseInt(parts[2]),
                    text: parts[3].trim(),
                    date: new Date().toISOString().split('T')[0],
                    source: 'scraped'
                  })
                }
              })
            }
          }
        })
      }
    }
    
    // If no reviews found in structured format, try to extract from raw text
    if (reviews.length === 0 && scrapeResults && scrapeResults.data) {
      const rawText = JSON.stringify(scrapeResults.data)
      
      // Look for common review patterns
      const reviewPattern = /(?:reviewer|author|name)[^:]*:?\s*([A-Za-z\s]+)[,\n]*(?:rating|stars?)[^:]*:?\s*(\d+)[,\n]*(?:text|review|comment)[^:]*:?\s*["']([^"']+)["']/gi
      let match
      
      while ((match = reviewPattern.exec(rawText)) !== null && reviews.length < 6) {
        reviews.push({
          author_name: match[1].trim(),
          rating: parseInt(match[2]),
          text: match[3].trim(),
          date: new Date().toISOString().split('T')[0],
          source: 'scraped'
        })
      }
    }
    
    // Filter reviews based on type and rating
    return reviews.filter(review => {
      if (type === 'positive') {
        return review.rating >= 4 && review.text.length > 20
      } else {
        return review.rating <= 2 && review.text.length > 20
      }
    }).slice(0, 3) // Limit to 3 reviews per type
    
  } catch (error) {
    console.log(`   ⚠️  Error processing ${type} reviews for ${agentName}:`, error.message)
    return []
  }
}

// Run the scraper
scrapeEstateAgentReviews().catch(console.error)
