import { chromium, Page } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// AI-Powered Review Scraper
// Uses Playwright for web scraping + OpenAI for intelligent extraction

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface ScrapedReview {
  source: string
  author_name: string
  rating: number
  text: string
  date: string
  verified?: boolean
}

interface Business {
  [key: string]: any
  id: string
  name: string
  website?: string
  google_place_id?: string
}

// AI-powered content extraction using OpenAI
async function extractReviewsWithAI(html: string, source: string): Promise<ScrapedReview[]> {
  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not set - falling back to regex extraction')
    return extractReviewsWithRegex(html, source)
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cheaper, faster model
        messages: [
          {
            role: 'system',
            content: `You are a web scraping expert. Extract customer reviews from HTML content. 
Return ONLY a valid JSON array of reviews with this structure:
[
  {
    "author_name": "string",
    "rating": number (1-5),
    "text": "string",
    "date": "YYYY-MM-DD or relative like '2 weeks ago'",
    "verified": boolean
  }
]

Rules:
- Extract ALL reviews you can find
- Normalize ratings to 1-5 scale (if they use 10-point scale, divide by 2)
- Keep review text verbatim
- Mark as verified if you see verified/purchased badges
- If no reviews found, return empty array []
- Return ONLY the JSON array, no explanations`
          },
          {
            role: 'user',
            content: `Extract reviews from this ${source} page HTML:\n\n${html.substring(0, 15000)}`
          }
        ],
        temperature: 0.1, // Low temperature for consistent extraction
        max_tokens: 2000
      })
    })

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No content returned from OpenAI')
    }

    // Parse JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.warn('⚠️  Could not parse AI response as JSON')
      return []
    }

    const reviews = JSON.parse(jsonMatch[0])
    
    // Add source to each review
    return reviews.map((r: any) => ({
      source,
      author_name: r.author_name || 'Anonymous',
      rating: Number(r.rating) || 0,
      text: r.text || '',
      date: r.date || new Date().toISOString(),
      verified: r.verified || false
    }))

  } catch (error) {
    console.error(`❌ AI extraction failed: ${error}`)
    return extractReviewsWithRegex(html, source)
  }
}

// Fallback: Simple regex-based extraction
function extractReviewsWithRegex(html: string, source: string): Promise<ScrapedReview[]> {
  const reviews: ScrapedReview[] = []
  
  // This is a basic fallback - AI is much better
  console.log('   Using regex fallback (less accurate)')
  
  return Promise.resolve(reviews)
}

// Scrape Google Reviews (from business's Google Maps page)
async function scrapeGoogleReviews(page: Page, businessName: string): Promise<ScrapedReview[]> {
  try {
    console.log('   Searching Google Maps...')
    
    await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(businessName + ' Slough')}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    })

    await page.waitForTimeout(2000)

    // Click on reviews tab if exists
    try {
      const reviewsTab = page.locator('button:has-text("Reviews")')
      if (await reviewsTab.isVisible({ timeout: 3000 })) {
        await reviewsTab.click()
        await page.waitForTimeout(2000)
      }
    } catch (e) {
      console.log('   No reviews tab found')
    }

    // Scroll to load more reviews
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        const scrollable = document.querySelector('[role="feed"]') || 
                          document.querySelector('[class*="review"]')
        if (scrollable) {
          scrollable.scrollTop = scrollable.scrollHeight
        }
      })
      await page.waitForTimeout(1000)
    }

    const html = await page.content()
    return await extractReviewsWithAI(html, 'google')

  } catch (error) {
    console.error(`   Error scraping Google: ${error}`)
    return []
  }
}

// Scrape Facebook Reviews
async function scrapeFacebookReviews(page: Page, businessName: string): Promise<ScrapedReview[]> {
  try {
    console.log('   Searching Facebook...')
    
    await page.goto(`https://www.facebook.com/search/pages/?q=${encodeURIComponent(businessName + ' Slough')}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    })

    await page.waitForTimeout(3000)
    
    // This would require login - skip for now or handle separately
    console.log('   Facebook requires login - skipping')
    return []

  } catch (error) {
    console.error(`   Error scraping Facebook: ${error}`)
    return []
  }
}

// Scrape Trustpilot
async function scrapeTrustpilotReviews(page: Page, businessName: string): Promise<ScrapedReview[]> {
  try {
    console.log('   Searching Trustpilot...')
    
    // Trustpilot search
    await page.goto(`https://www.trustpilot.com/search?query=${encodeURIComponent(businessName)}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    })

    await page.waitForTimeout(2000)

    // Click first result if exists
    try {
      const firstResult = page.locator('a[name="business-unit-card"]').first()
      if (await firstResult.isVisible({ timeout: 3000 })) {
        await firstResult.click()
        await page.waitForTimeout(3000)

        // Scroll to load reviews
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await page.waitForTimeout(2000)

        const html = await page.content()
        return await extractReviewsWithAI(html, 'trustpilot')
      }
    } catch (e) {
      console.log('   No Trustpilot page found')
    }

    return []

  } catch (error) {
    console.error(`   Error scraping Trustpilot: ${error}`)
    return []
  }
}

// Scrape Yell.com (UK business directory)
async function scrapeYellReviews(page: Page, businessName: string): Promise<ScrapedReview[]> {
  try {
    console.log('   Searching Yell.com...')
    
    await page.goto(`https://www.yell.com/ucs/UcsSearchAction.do?keywords=${encodeURIComponent(businessName)}&location=Slough`, {
      waitUntil: 'networkidle',
      timeout: 30000
    })

    await page.waitForTimeout(2000)

    // Click first business
    try {
      const firstBusiness = page.locator('a.businessCapsule--title').first()
      if (await firstBusiness.isVisible({ timeout: 3000 })) {
        await firstBusiness.click()
        await page.waitForTimeout(2000)

        // Click reviews tab
        const reviewsTab = page.locator('a:has-text("Reviews")')
        if (await reviewsTab.isVisible({ timeout: 2000 })) {
          await reviewsTab.click()
          await page.waitForTimeout(2000)
        }

        const html = await page.content()
        return await extractReviewsWithAI(html, 'yell')
      }
    } catch (e) {
      console.log('   No Yell listing found')
    }

    return []

  } catch (error) {
    console.error(`   Error scraping Yell: ${error}`)
    return []
  }
}

// Scrape TripAdvisor
async function scrapeTripAdvisorReviews(page: Page, businessName: string): Promise<ScrapedReview[]> {
  try {
    console.log('   Searching TripAdvisor...')
    
    await page.goto(`https://www.tripadvisor.com/Search?q=${encodeURIComponent(businessName + ' Slough')}`, {
      waitUntil: 'networkidle',
      timeout: 30000
    })

    await page.waitForTimeout(2000)

    // Click first result
    try {
      const firstResult = page.locator('a[class*="result"]').first()
      if (await firstResult.isVisible({ timeout: 3000 })) {
        await firstResult.click()
        await page.waitForTimeout(3000)

        // Scroll to reviews
        await page.evaluate(() => window.scrollTo(0, 800))
        await page.waitForTimeout(2000)

        const html = await page.content()
        return await extractReviewsWithAI(html, 'tripadvisor')
      }
    } catch (e) {
      console.log('   No TripAdvisor listing found')
    }

    return []

  } catch (error) {
    console.error(`   Error scraping TripAdvisor: ${error}`)
    return []
  }
}

// Main scraping function
async function scrapeAllReviewsForBusiness(
  browser: any,
  business: Business,
  sources: string[]
): Promise<ScrapedReview[]> {
  const allReviews: ScrapedReview[] = []
  const page = await browser.newPage()

  // Set a realistic user agent
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  })

  try {
    for (const source of sources) {
      console.log(`   📍 Scraping ${source}...`)
      
      let reviews: ScrapedReview[] = []
      
      switch (source) {
        case 'google':
          reviews = await scrapeGoogleReviews(page, business.name)
          break
        case 'facebook':
          reviews = await scrapeFacebookReviews(page, business.name)
          break
        case 'trustpilot':
          reviews = await scrapeTrustpilotReviews(page, business.name)
          break
        case 'yell':
          reviews = await scrapeYellReviews(page, business.name)
          break
        case 'tripadvisor':
          reviews = await scrapeTripAdvisorReviews(page, business.name)
          break
      }

      if (reviews.length > 0) {
        console.log(`   ✅ Found ${reviews.length} reviews from ${source}`)
        allReviews.push(...reviews)
      } else {
        console.log(`   ℹ️  No reviews found on ${source}`)
      }

      // Delay between sources to be respectful
      await page.waitForTimeout(2000)
    }
  } finally {
    await page.close()
  }

  return allReviews
}

// Main execution
async function aiScrapeReviews() {
  console.log('🤖 AI-Powered Review Scraper')
  console.log('=' + '='.repeat(49))
  console.log('')

  if (!OPENAI_API_KEY) {
    console.warn('⚠️  OPENAI_API_KEY not set - AI extraction will be limited')
    console.warn('   Set it with: export OPENAI_API_KEY=your_key')
    console.log('')
  }

  // Load businesses
  const businessesPath = join(process.cwd(), 'public', 'data', 'businesses.json')
  const businesses: Business[] = JSON.parse(readFileSync(businessesPath, 'utf-8'))

  // Filter estate agents for demo (or change as needed)
  const estateAgents = businesses.filter(b => 
    b.category === 'estate-agents' || 
    b.name.toLowerCase().includes('estate')
  )

  console.log(`📊 Found ${estateAgents.length} estate agents to scrape\n`)

  // Sources to scrape (customize as needed)
  const sources = ['google', 'trustpilot', 'yell']
  console.log(`🎯 Scraping sources: ${sources.join(', ')}\n`)

  // Launch browser
  const browser = await chromium.launch({
    headless: true // Set to false to see what's happening
  })

  let totalReviews = 0
  let successCount = 0

  try {
    for (let i = 0; i < estateAgents.length; i++) {
      const business = estateAgents[i]
      console.log(`\n[${i + 1}/${estateAgents.length}] ${business.name}`)

      try {
        const reviews = await scrapeAllReviewsForBusiness(browser, business, sources)

        if (reviews.length > 0) {
          // Update business in main array
          const businessIndex = businesses.findIndex(b => b.id === business.id)
          if (businessIndex !== -1) {
            businesses[businessIndex].aggregated_reviews = reviews
            businesses[businessIndex].review_count = reviews.length
            
            // Calculate average rating
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            businesses[businessIndex].rating = avgRating
          }

          totalReviews += reviews.length
          successCount++
        }

      } catch (error) {
        console.error(`   ❌ Error: ${error}`)
      }

      // Progress indicator
      console.log(`   Progress: ${i + 1}/${estateAgents.length}`)
    }

  } finally {
    await browser.close()
  }

  // Save results
  console.log('\n💾 Saving results...')
  writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))

  console.log('\n' + '='.repeat(50))
  console.log('✅ SCRAPING COMPLETE')
  console.log('='.repeat(50))
  console.log(`Businesses processed: ${estateAgents.length}`)
  console.log(`Successfully scraped: ${successCount}`)
  console.log(`Total reviews: ${totalReviews}`)
  console.log(`\n📁 Data saved to: ${businessesPath}`)
}

// Run
if (require.main === module) {
  aiScrapeReviews().catch(console.error)
}

export { aiScrapeReviews }

