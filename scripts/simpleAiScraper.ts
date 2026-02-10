import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Simple AI-powered scraper using GPT-4 Vision or text extraction
// No API keys needed for basic sources - just Playwright + OpenAI

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

interface Review {
  author_name: string
  rating: number
  text: string
  date: string
  source: string
}

// Use AI to extract structured data from raw text
async function extractWithAI(pageText: string, businessName: string, source: string): Promise<Review[]> {
  if (!OPENAI_API_KEY) {
    console.log('      ⚠️  No OpenAI key - skipping')
    return []
  }

  // Only proceed if we have substantial content
  if (!pageText || pageText.length < 200) {
    console.log('      ⚠️  Not enough page content')
    return []
  }

  try {
    const prompt = `You are extracting customer reviews from a ${source} page about "${businessName}".

Here is the page text content:
${pageText.substring(0, 12000)}

Your task: Find and extract ALL customer reviews from this page.

Return a JSON array in this EXACT format:
[
  {
    "author_name": "Customer Name",
    "rating": 5,
    "text": "The full review text exactly as written",
    "date": "2024-01-15"
  }
]

IMPORTANT:
- Extract EVERY review you can find (aim for 5-10 reviews)
- Copy review text EXACTLY as written (don't paraphrase)
- Ratings are 1-5 stars (convert if needed)
- For dates: use YYYY-MM-DD format, or "2024-01-01" if unclear
- If you see "1 week ago", convert to approximate date
- Return ONLY the JSON array, nothing else
- If NO reviews found, return: []

Begin extraction now:`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert at extracting structured data from web pages. You always return valid JSON arrays.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature: 0.1,
        max_tokens: 4000
      })
    })

    const data = await response.json()
    
    if (data.error) {
      console.error(`      ❌ OpenAI error: ${data.error.message}`)
      return []
    }

    const content = data.choices[0]?.message?.content || ''
    
    console.log(`      🤖 AI response length: ${content.length} chars`)
    
    // Extract JSON from response (handle markdown code blocks too)
    let jsonMatch = content.match(/\[[\s\S]*\]/)?.[0]
    
    // Try to find JSON in code blocks
    if (!jsonMatch) {
      const codeBlockMatch = content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/)
      if (codeBlockMatch) jsonMatch = codeBlockMatch[1]
    }
    
    if (!jsonMatch) {
      console.log(`      ⚠️  No JSON found in AI response`)
      console.log(`      Response preview: ${content.substring(0, 200)}`)
      return []
    }

    const reviews = JSON.parse(jsonMatch)
    
    if (!Array.isArray(reviews)) {
      console.log('      ⚠️  Response is not an array')
      return []
    }
    
    // Add source to each review and validate
    const validReviews = reviews
      .filter(r => r.author_name && r.text && r.rating)
      .map((r: any) => ({
        source,
        author_name: r.author_name,
        rating: Math.min(5, Math.max(1, Number(r.rating))),
        text: r.text,
        date: r.date || new Date().toISOString().split('T')[0]
      }))

    console.log(`      ✅ Extracted ${validReviews.length} valid reviews`)
    
    // Show first review as sample
    if (validReviews.length > 0) {
      const sample = validReviews[0]
      const preview = sample.text.substring(0, 80)
      console.log(`      📝 Sample: "${preview}${sample.text.length > 80 ? '...' : ''}"`)
      console.log(`         by ${sample.author_name} (${sample.rating}★)`)
    }

    return validReviews

  } catch (error) {
    console.error(`      ❌ Extraction error: ${error}`)
    return []
  }
}

// Scrape a single source
async function scrapeSource(page: any, business: any, source: string): Promise<Review[]> {
  const searchUrls: Record<string, string> = {
    google: `https://www.google.com/maps/search/${encodeURIComponent(business.name + ' Slough')}`,
    trustpilot: `https://uk.trustpilot.com/search?query=${encodeURIComponent(business.name + ' Slough')}`,
    yell: `https://www.yell.com/ucs/UcsSearchAction.do?keywords=${encodeURIComponent(business.name)}&location=Slough`,
  }

  const url = searchUrls[source]
  if (!url) return []

  try {
    console.log(`      📍 Scraping ${source}...`)
    
    await page.goto(url, { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    })
    
    console.log(`      ⏳ Page loaded, waiting for content...`)
    await page.waitForTimeout(4000)

    // For Google Maps, handle cookie consent and click on first business result
    if (source === 'google') {
      try {
        // Accept Google cookies if prompted
        try {
          const acceptButton = page.locator('button:has-text("Accept all"), button:has-text("Reject all")').first()
          if (await acceptButton.isVisible({ timeout: 3000 })) {
            await acceptButton.click()
            console.log(`      ✓ Handled cookie consent`)
            await page.waitForTimeout(2000)
          }
        } catch (e) {
          // No cookie dialog, continue
        }

        // Wait for and click the first business result
        await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 8000 })
        const firstResult = page.locator('a[href*="/maps/place/"]').first()
        await firstResult.click()
        console.log(`      ✓ Clicked business listing`)
        await page.waitForTimeout(4000)
        
        // Try to click Reviews tab
        try {
          const reviewsButton = page.locator('button:has-text("Reviews")').first()
          await reviewsButton.click({ timeout: 2000 })
          await page.waitForTimeout(2000)
        } catch (e) {
          console.log(`      ℹ️  Reviews tab not found, using main page`)
        }
        
        // Scroll to load more reviews
        for (let i = 0; i < 3; i++) {
          await page.evaluate(() => window.scrollBy(0, 500))
          await page.waitForTimeout(1000)
        }
      } catch (e) {
        console.log(`      ⚠️  Could not navigate to business page: ${e}`)
      }
    }

    // For Trustpilot, click first result
    if (source === 'trustpilot') {
      try {
        await page.waitForSelector('a[href*="/review/"]', { timeout: 5000 })
        const firstResult = page.locator('a[href*="/review/"]').first()
        await firstResult.click()
        await page.waitForTimeout(3000)
        
        // Scroll to load reviews
        await page.evaluate(() => window.scrollBy(0, 1000))
        await page.waitForTimeout(2000)
      } catch (e) {
        console.log(`      ⚠️  No Trustpilot page found`)
      }
    }

    // For Yell, click first business
    if (source === 'yell') {
      try {
        await page.waitForSelector('a.businessCapsule--title', { timeout: 5000 })
        const firstBusiness = page.locator('a.businessCapsule--title').first()
        await firstBusiness.click()
        await page.waitForTimeout(3000)
        
        // Try to click reviews tab
        try {
          const reviewsTab = page.locator('a:has-text("Reviews")').first()
          await reviewsTab.click({ timeout: 2000 })
          await page.waitForTimeout(2000)
        } catch (e) {
          console.log(`      ℹ️  Using main page for Yell`)
        }
      } catch (e) {
        console.log(`      ⚠️  No Yell listing found`)
      }
    }

    // Get all text content from page
    const pageText = await page.evaluate(() => document.body.innerText)
    
    console.log(`      📄 Page content: ${pageText.length} characters`)
    
    if (pageText.length < 500) {
      console.log(`      ⚠️  Page content too short, skipping AI extraction`)
      return []
    }
    
    // Use AI to extract reviews
    const reviews = await extractWithAI(pageText, business.name, source)
    
    return reviews

  } catch (error) {
    console.error(`      ❌ Error with ${source}: ${error}`)
    return []
  }
}

// Main function
async function scrapeReviewsWithAI() {
  console.log('\n🤖 AI-Powered Multi-Source Review Scraper')
  console.log('='+ '='.repeat(48) + '\n')

  if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY is required for AI extraction')
    console.error('   Set it with: export OPENAI_API_KEY=your_key_here')
    console.error('   Get a key from: https://platform.openai.com/api-keys\n')
    process.exit(1)
  }

  // Load businesses
  const businessesPath = join(process.cwd(), 'public', 'data', 'businesses.json')
  const businesses = JSON.parse(readFileSync(businessesPath, 'utf-8'))

  // Filter for estate agents (or change category as needed)
  const targets = businesses.filter((b: any) => 
    b.category === 'estate-agents' || 
    b.name.toLowerCase().includes('estate')
  )

  console.log(`📊 Found ${targets.length} estate agents`)
  console.log(`🎯 Sources: Google, Trustpilot, Yell`)
  console.log(`\n⚠️  NOTE: Testing with first 5 agents only (remove limit for full scrape)\n`)

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  let totalReviews = 0
  const sources = ['google'] // Start with just Google for now
  const testLimit = 5 // Limit to first 5 for testing

  try {
    const page = await browser.newPage()
    
    // Set user agent to avoid bot detection
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    })
    
    for (let i = 0; i < Math.min(targets.length, testLimit); i++) {
      const business = targets[i]
      console.log(`\n[${i + 1}/${targets.length}] ${business.name}`)

      const allReviews: Review[] = []

      for (const source of sources) {
        const reviews = await scrapeSource(page, business, source)
        allReviews.push(...reviews)
        
        // Delay between sources
        await page.waitForTimeout(2000)
      }

      // Update business
      if (allReviews.length > 0) {
        const businessIndex = businesses.findIndex((b: any) => b.id === business.id)
        if (businessIndex !== -1) {
          businesses[businessIndex].aggregated_reviews = allReviews
          businesses[businessIndex].review_count = allReviews.length
          
          const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
          businesses[businessIndex].rating = avgRating

          console.log(`   ✨ Total: ${allReviews.length} reviews, avg rating: ${avgRating.toFixed(1)}⭐`)
        }

        totalReviews += allReviews.length
      }

      // Longer delay between businesses
      await page.waitForTimeout(3000)
    }

    await page.close()

  } finally {
    await browser.close()
  }

  // Save
  console.log('\n💾 Saving results...')
  writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))

  console.log('\n' + '='.repeat(50))
  console.log('✅ COMPLETE!')
  console.log('='.repeat(50))
  console.log(`Businesses: ${targets.length}`)
  console.log(`Total reviews scraped: ${totalReviews}`)
  console.log(`Average: ${(totalReviews / targets.length).toFixed(1)} reviews per business`)
}

if (require.main === module) {
  scrapeReviewsWithAI().catch(console.error)
}

export { scrapeReviewsWithAI }

