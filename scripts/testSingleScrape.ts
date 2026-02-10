import { chromium } from 'playwright'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

async function testScrapeOne() {
  console.log('🧪 Testing scrape for A J Eyre and Sons Estate Agents\n')

  const browser = await chromium.launch({ 
    headless: false, // Show browser so we can see what's happening
    slowMo: 500 // Slow down so we can watch
  })

  const page = await browser.newPage()

  try {
    // Test Google Maps
    console.log('📍 Loading Google Maps...')
    const url = 'https://www.google.com/maps/search/A+J+Eyre+and+Sons+Slough'
    
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(5000)

    console.log('📸 Taking screenshot...')
    await page.screenshot({ path: 'test-google-maps.png', fullPage: true })

    // Get all text
    const pageText = await page.evaluate(() => document.body.innerText)
    console.log(`\n📄 Page content length: ${pageText.length} characters`)
    console.log(`\n📝 First 500 characters:`)
    console.log(pageText.substring(0, 500))
    console.log('\n...\n')

    // Look for review-like content
    const hasReviews = pageText.toLowerCase().includes('review') || 
                      pageText.toLowerCase().includes('star') ||
                      pageText.toLowerCase().includes('rating')
    
    console.log(`🔍 Contains review content: ${hasReviews}`)

    if (OPENAI_API_KEY && pageText.length > 1000) {
      console.log('\n🤖 Sending to OpenAI for extraction...')
      
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
            content: `Extract customer reviews from this Google Maps page text:

${pageText.substring(0, 10000)}

Return JSON array of reviews:
[{"author_name": "Name", "rating": 5, "text": "Review text", "date": "2024-01-01"}]

If no reviews visible, return []`
          }],
          temperature: 0,
          max_tokens: 3000
        })
      })

      const data = await response.json()
      console.log('\n📬 OpenAI Response:')
      console.log(JSON.stringify(data, null, 2))
    }

    console.log('\n✅ Test complete! Check test-google-maps.png to see what the scraper sees')
    console.log('Press Ctrl+C to close browser')
    
    await page.waitForTimeout(30000) // Wait 30 seconds to inspect

  } finally {
    await browser.close()
  }
}

testScrapeOne().catch(console.error)

