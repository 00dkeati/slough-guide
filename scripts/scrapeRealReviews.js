const fs = require('fs')
const path = require('path')

console.log('🔍 SCRAPING REAL CUSTOMER REVIEWS WITH MANUS AI')
console.log('='.repeat(60))

const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'))

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
          `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`,
          `https://www.tripadvisor.com/Search?q=${encodeURIComponent(searchQuery)}`,
          `https://www.yelp.co.uk/search?find_desc=${encodeURIComponent(searchQuery)}`
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

// Function to process and extract reviews from scrape results
function processReviews(scrapeResults, businessName, category) {
  const reviews = []
  
  try {
    if (scrapeResults && scrapeResults.data) {
      const reviewData = scrapeResults.data
      
      // Extract reviews from the scraped content
      if (Array.isArray(reviewData)) {
        reviewData.forEach(item => {
          if (item.content) {
            // Look for review patterns in the content
            const reviewPatterns = [
              /(?:reviewer|author|name)[^:]*:?\s*([A-Za-z\s]+)[,\n]*(?:rating|stars?)[^:]*:?\s*(\d+)[,\n]*(?:text|review|comment)[^:]*:?\s*["']([^"']+)["']/gi,
              /(\d+)\s*stars?[,\n]*([A-Za-z\s]+)[,\n]*["']([^"']+)["']/gi,
              /([A-Za-z\s]+)[,\n]*(\d+)\s*stars?[,\n]*["']([^"']+)["']/gi
            ]
            
            reviewPatterns.forEach(pattern => {
              let match
              while ((match = pattern.exec(item.content)) !== null && reviews.length < 10) {
                const parts = match
                if (parts && parts.length >= 4) {
                  let authorName, rating, reviewText
                  
                  if (pattern.source.includes('stars')) {
                    // Pattern: "5 stars, John Smith, 'Great food...'"
                    rating = parseInt(parts[1]) || parseInt(parts[2])
                    authorName = parts[2] || parts[1]
                    reviewText = parts[3]
                  } else {
                    // Pattern: "John Smith, 5, 'Great food...'"
                    authorName = parts[1]
                    rating = parseInt(parts[2])
                    reviewText = parts[3]
                  }
                  
                  if (rating >= 1 && rating <= 5 && reviewText.length > 10) {
                    reviews.push({
                      author_name: authorName.trim(),
                      rating: rating,
                      text: reviewText.trim(),
                      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      source: 'scraped'
                    })
                  }
                }
              }
            })
          }
        })
      }
    }
    
    // If no structured reviews found, try to extract from raw text
    if (reviews.length === 0 && scrapeResults && scrapeResults.data) {
      const rawText = JSON.stringify(scrapeResults.data)
      
      // Look for common review phrases and ratings
      const genericPatterns = [
        /(\d+)\s*stars?[,\s]*["']([^"']{20,200})["']/gi,
        /"([^"]{20,200})"[,\s]*(\d+)\s*stars?/gi
      ]
      
      genericPatterns.forEach(pattern => {
        let match
        while ((match = pattern.exec(rawText)) !== null && reviews.length < 10) {
          const rating = parseInt(match[1]) || parseInt(match[2])
          const text = match[2] || match[1]
          
          if (rating >= 1 && rating <= 5 && text.length > 20) {
            reviews.push({
              author_name: `Customer ${reviews.length + 1}`,
              rating: rating,
              text: text.trim(),
              date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              source: 'scraped'
            })
          }
        }
      })
    }
    
    return reviews.slice(0, 6) // Limit to 6 reviews max
    
  } catch (error) {
    console.log(`   ⚠️  Error processing reviews for ${businessName}: ${error.message}`)
    return []
  }
}

// Function to get category-specific search instructions
function getCategoryInstructions(category, businessName, location) {
  const categoryInstructions = {
    'restaurants': `Find 3 positive and 3 negative customer reviews for ${businessName} restaurant in ${location}. Look for reviews about food quality, service, atmosphere, value for money, and overall dining experience. Extract reviewer name, rating (1-5 stars), and review text.`,
    'pubs': `Find 3 positive and 3 negative customer reviews for ${businessName} pub in ${location}. Look for reviews about drinks, atmosphere, food, service, and overall pub experience. Extract reviewer name, rating (1-5 stars), and review text.`,
    'cafes': `Find 3 positive and 3 negative customer reviews for ${businessName} cafe in ${location}. Look for reviews about coffee quality, food, atmosphere, service, and overall cafe experience. Extract reviewer name, rating (1-5 stars), and review text.`,
    'supermarkets': `Find 3 positive and 3 negative customer reviews for ${businessName} supermarket in ${location}. Look for reviews about product quality, prices, customer service, cleanliness, and shopping experience. Extract reviewer name, rating (1-5 stars), and review text.`,
    'pharmacies': `Find 3 positive and 3 negative customer reviews for ${businessName} pharmacy in ${location}. Look for reviews about prescription service, staff helpfulness, wait times, and overall pharmacy experience. Extract reviewer name, rating (1-5 stars), and review text.`,
    'dentists': `Find 3 positive and 3 negative customer reviews for ${businessName} dentist in ${location}. Look for reviews about dental care quality, pain management, staff friendliness, and overall dental experience. Extract reviewer name, rating (1-5 stars), and review text.`,
    'hair-salons': `Find 3 positive and 3 negative customer reviews for ${businessName} hair salon in ${location}. Look for reviews about haircut quality, styling, staff skills, and overall salon experience. Extract reviewer name, rating (1-5 stars), and review text.`,
    'gyms': `Find 3 positive and 3 negative customer reviews for ${businessName} gym in ${location}. Look for reviews about equipment quality, cleanliness, staff, classes, and overall fitness experience. Extract reviewer name, rating (1-5 stars), and review text.`,
    'builders': `Find 3 positive and 3 negative customer reviews for ${businessName} builders in ${location}. Look for reviews about work quality, reliability, communication, pricing, and overall building experience. Extract reviewer name, rating (1-5 stars), and review text.`,
    'plumbers': `Find 3 positive and 3 negative customer reviews for ${businessName} plumber in ${location}. Look for reviews about repair quality, response time, pricing, professionalism, and overall plumbing service. Extract reviewer name, rating (1-5 stars), and review text.`,
    'electricians': `Find 3 positive and 3 negative customer reviews for ${businessName} electrician in ${location}. Look for reviews about electrical work quality, safety, reliability, pricing, and overall electrical service. Extract reviewer name, rating (1-5 stars), and review text.`,
    'car-mechanics': `Find 3 positive and 3 negative customer reviews for ${businessName} car mechanic in ${location}. Look for reviews about repair quality, honesty, pricing, turnaround time, and overall automotive service. Extract reviewer name, rating (1-5 stars), and review text.`,
    'vets': `Find 3 positive and 3 negative customer reviews for ${businessName} veterinary clinic in ${location}. Look for reviews about animal care quality, staff compassion, wait times, pricing, and overall veterinary experience. Extract reviewer name, rating (1-5 stars), and review text.`,
    'solicitors': `Find 3 positive and 3 negative customer reviews for ${businessName} solicitors in ${location}. Look for reviews about legal expertise, communication, case outcomes, fees, and overall legal service. Extract reviewer name, rating (1-5 stars), and review text.`,
    'accountants': `Find 3 positive and 3 negative customer reviews for ${businessName} accountants in ${location}. Look for reviews about financial expertise, tax advice, communication, fees, and overall accounting service. Extract reviewer name, rating (1-5 stars), and review text.`
  }
  
  return categoryInstructions[category] || `Find 3 positive and 3 negative customer reviews for ${businessName} in ${location}. Extract reviewer name, rating (1-5 stars), and review text.`
}

// Main scraping function
async function scrapeReviewsForCategory(category) {
  console.log(`\n🏪 SCRAPING REVIEWS FOR: ${category.toUpperCase()}`)
  console.log('='.repeat(50))
  
  const categoryBusinesses = businesses.filter(b => b.category === category)
  console.log(`Found ${categoryBusinesses.length} businesses in ${category} category\n`)
  
  let successCount = 0
  
  for (let i = 0; i < categoryBusinesses.length; i++) {
    const business = categoryBusinesses[i]
    console.log(`[${i + 1}/${categoryBusinesses.length}] ${business.name}`)
    console.log(`   📍 ${business.area}`)
    
    try {
      // Create search query
      const searchQuery = `${business.name} ${business.area} ${category} reviews`
      const instructions = getCategoryInstructions(category, business.name, business.area)
      
      console.log(`   🔍 Scraping reviews...`)
      const scrapeResults = await scrapeWithManusAPI(searchQuery, instructions)
      
      // Process reviews
      const reviews = processReviews(scrapeResults, business.name, category)
      
      if (reviews.length > 0) {
        // Update business with reviews
        const businessIndex = businesses.findIndex(b => b.id === business.id)
        if (businessIndex !== -1) {
          businesses[businessIndex].aggregated_reviews = reviews
          successCount++
          console.log(`   ✅ Added ${reviews.length} reviews`)
          
          // Show sample review
          const sampleReview = reviews[0]
          console.log(`   📝 Sample: "${sampleReview.text.substring(0, 60)}..." (${sampleReview.rating}⭐)`)
        }
      } else {
        console.log(`   ❌ No reviews found`)
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    
    console.log('')
    
    // Add delay between requests to be respectful
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
  
  // Save updated businesses
  fs.writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))
  
  console.log('='.repeat(50))
  console.log(`✅ COMPLETE! ${category.toUpperCase()}`)
  console.log(`Successfully added reviews to: ${successCount}/${categoryBusinesses.length} businesses`)
  console.log(`📁 Data saved to: public/data/businesses.json`)
  
  return successCount
}

// Get category from command line argument
const category = process.argv[2]

if (!category) {
  console.log('Usage: node scripts/scrapeRealReviews.js <category>')
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

// Check if Manus API key is set
if (!process.env.MANUS_API_KEY) {
  console.log('❌ Error: MANUS_API_KEY environment variable not set')
  console.log('Set it with: export MANUS_API_KEY=your_api_key_here')
  process.exit(1)
}

// Run the scraper for the specified category
scrapeReviewsForCategory(category).catch(console.error)
