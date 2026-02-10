import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const MANUS_API_KEY = process.env.MANUS_API_KEY

if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY required')
  process.exit(1)
}

console.log(`✅ OpenAI API: Configured`)
console.log(`${MANUS_API_KEY ? '✅' : '⚠️ '} Manus API: ${MANUS_API_KEY ? 'Configured' : 'Not configured (optional)'}`)

interface Review {
  author_name: string
  rating: number
  text: string
  date: string
  source: string
}

// AI extraction function
async function extractReviews(pageText: string, businessName: string, source: string): Promise<Review[]> {
  if (pageText.length < 500) return []

  const prompt = `Extract ALL customer reviews from this ${source} page for "${businessName}".

Page content (first 10,000 chars):
${pageText.substring(0, 10000)}

Return JSON array:
[{"author_name": "Name", "rating": 5, "text": "Full review text", "date": "2024-01-01"}]

Extract EVERY review visible. Return [] if none found.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: prompt
        }],
        temperature: 0.1,
        max_tokens: 4000
      })
    })

    const data = await response.json()
    const content = data.choices[0]?.message?.content || '[]'
    
    const jsonMatch = content.match(/\[[\s\S]*\]/)?.[0] || 
                      content.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/)?.[1]
    
    if (!jsonMatch) return []

    const reviews = JSON.parse(jsonMatch)
    return reviews.map((r: any) => ({
      ...r,
      source,
      rating: Math.min(5, Math.max(1, Number(r.rating)))
    }))
  } catch (error) {
    console.error(`      AI error: ${error}`)
    return []
  }
}

// Scrape Google Maps
async function scrapeGoogle(page: any, businessName: string): Promise<Review[]> {
  try {
    console.log(`      📍 Google Maps...`)
    await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(businessName + ' Slough')}`, {
      waitUntil: 'domcontentloaded',
      timeout: 25000
    })
    await page.waitForTimeout(4000)

    // Handle cookies
    try {
      const acceptBtn = page.locator('button:has-text("Accept all"), button:has-text("Reject all")').first()
      if (await acceptBtn.isVisible({ timeout: 2000 })) {
        await acceptBtn.click()
        await page.waitForTimeout(1500)
      }
    } catch (e) {}

    // Click business
    try {
      await page.waitForSelector('a[href*="/maps/place/"]', { timeout: 6000 })
      await page.locator('a[href*="/maps/place/"]').first().click()
      await page.waitForTimeout(3000)

      // Click Reviews
      try {
        const reviewsBtn = page.locator('button:has-text("Reviews")').first()
        if (await reviewsBtn.isVisible({ timeout: 2000 })) {
          await reviewsBtn.click()
          await page.waitForTimeout(2000)
        }
      } catch (e) {}

      // Scroll
      for (let i = 0; i < 3; i++) {
        await page.evaluate(() => window.scrollBy(0, 400))
        await page.waitForTimeout(800)
      }
    } catch (e) {
      console.log(`      ⚠️  Business page not found`)
    }

    const text = await page.evaluate(() => document.body.innerText)
    const reviews = await extractReviews(text, businessName, 'google')
    
    if (reviews.length > 0) {
      console.log(`      ✅ ${reviews.length} Google reviews`)
    }
    
    return reviews
  } catch (error) {
    console.error(`      ❌ Google error: ${error}`)
    return []
  }
}

// Main scraper
async function scrapeCoffeeShops() {
  console.log('\n☕ COFFEE SHOPS REVIEW SCRAPER')
  console.log('='.repeat(50) + '\n')

  const businessesPath = join(process.cwd(), 'public', 'data', 'businesses.json')
  const businesses = JSON.parse(readFileSync(businessesPath, 'utf-8'))

  const coffeeShops = businesses.filter((b: any) => 
    b.category === 'cafes' || 
    b.name.toLowerCase().includes('coffee') ||
    b.name.toLowerCase().includes('cafe')
  )

  console.log(`Found ${coffeeShops.length} coffee shops\n`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  })

  let totalReviews = 0

  try {
    for (let i = 0; i < coffeeShops.length; i++) {
      const cafe = coffeeShops[i]
      console.log(`\n[${i + 1}/${coffeeShops.length}] ${cafe.name}`)

      const reviews = await scrapeGoogle(page, cafe.name)

      if (reviews.length > 0) {
        const businessIndex = businesses.findIndex((b: any) => b.id === cafe.id)
        if (businessIndex !== -1) {
          businesses[businessIndex].aggregated_reviews = reviews
          totalReviews += reviews.length
          
          const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          console.log(`      ⭐ Avg: ${avgRating.toFixed(1)} from ${reviews.length} reviews`)
        }
      }

      await page.waitForTimeout(3000) // Delay between businesses
    }
  } finally {
    await browser.close()
  }

  // Save
  writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))

  console.log('\n' + '='.repeat(50))
  console.log(`✅ COMPLETE!`)
  console.log(`Coffee shops: ${coffeeShops.length}`)
  console.log(`Total reviews: ${totalReviews}`)
  console.log(`Average: ${(totalReviews / coffeeShops.length).toFixed(1)} per shop`)
}

scrapeCoffeeShops().catch(console.error)

