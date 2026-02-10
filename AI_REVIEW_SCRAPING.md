# AI-Powered Review Scraping (No APIs Required!)

## Overview
This system uses **AI (OpenAI GPT-4) + Web Scraping (Playwright)** to extract reviews from any website without needing API access. Perfect for platforms like Yell, Checkatrade, and others that don't offer public APIs.

## Why AI Scraping?

### Traditional Approach (APIs):
- ❌ Requires API keys from each platform
- ❌ Many platforms don't offer public APIs
- ❌ API limits and costs
- ❌ Complex authentication
- ❌ Different formats for each source

### AI Scraping Approach:
- ✅ Works with ANY review website
- ✅ No API keys needed (except OpenAI)
- ✅ No rate limits (except OpenAI)
- ✅ Handles any HTML structure
- ✅ Adapts to website changes
- ✅ Single unified extraction method

## How It Works

### Architecture

```
┌─────────────────────────────────┐
│   1. Playwright Browser         │
│   Navigates to review sites     │
│   (Google, Yell, Trustpilot)    │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   2. Extract Page Content       │
│   Gets HTML/text from page      │
│   Scrolls to load all reviews   │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   3. OpenAI GPT-4 Analysis      │
│   AI reads the page content     │
│   Intelligently extracts:       │
│   - Author names                │
│   - Ratings                     │
│   - Review text                 │
│   - Dates                       │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│   4. Structured JSON Output     │
│   Clean, normalized data        │
│   Saved to businesses.json      │
└─────────────────────────────────┘
```

## Setup

### 1. Install Dependencies (Already Done)
```bash
npm install playwright
# Playwright is already in your package.json
```

### 2. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Set environment variable:
```bash
export OPENAI_API_KEY=sk-proj-...your-key-here
```

### 3. Run the Scraper
```bash
npm run scrape:reviews
```

## What Gets Scraped

### Sources (No API Needed!)

1. **Google Maps Reviews**
   - Searches for business on Google Maps
   - Extracts all visible reviews
   - Gets ratings, author names, review text, dates

2. **Trustpilot**
   - Searches UK Trustpilot
   - Finds business page
   - Extracts verified reviews

3. **Yell.com**
   - Popular UK business directory
   - Local business reviews
   - No API required!

4. **TripAdvisor** (optional)
   - Restaurant and attraction reviews
   - Traveler ratings

5. **Checkatrade** (can be added)
   - UK tradespeople reviews
   - Trusted trader ratings

## Example Output

```json
{
  "id": "estate-1",
  "name": "A J Eyre and Sons",
  "aggregated_reviews": [
    {
      "author_name": "John Smith",
      "rating": 5,
      "text": "Excellent service from start to finish. Very professional team who made selling our house stress-free. Highly recommend!",
      "date": "2024-09-15",
      "source": "google"
    },
    {
      "author_name": "Sarah Williams",
      "rating": 5,
      "text": "A J Eyre helped us find our perfect home. Great local knowledge and always available to answer questions.",
      "date": "2024-08-22",
      "source": "trustpilot"
    },
    {
      "author_name": "Mike Johnson",
      "rating": 4,
      "text": "Professional and efficient. Would use again.",
      "date": "2024-07-30",
      "source": "yell"
    }
  ],
  "review_count": 3,
  "rating": 4.67
}
```

## Advantages Over APIs

### 1. Universal Coverage
- Works with ANY review site
- No need to wait for API access
- Scrape niche platforms
- Access locked-down sites

### 2. AI Intelligence
- Adapts to website changes automatically
- Understands context
- Handles different HTML structures
- Extracts meaning, not just patterns

### 3. Cost Effective
- One OpenAI key for all sources
- No per-platform fees
- Cheaper than multiple APIs
- GPT-4-mini is very affordable

### 4. Flexibility
- Easy to add new sources
- Customize extraction logic
- Handle special cases
- Combine with APIs when available

## AI Extraction Process

### What the AI Does:

1. **Reads** the page content (HTML or text)
2. **Understands** the structure and context
3. **Identifies** review elements:
   - Author names (even with different HTML classes)
   - Ratings (converts any scale to 1-5)
   - Review text (full content)
   - Dates (parses any format to YYYY-MM-DD)
4. **Returns** clean JSON structure

### Example AI Prompt:

```
Extract customer reviews from this Google Maps page for "A J Eyre and Sons".

Page content:
[HTML/text content here]

Return a JSON array of reviews with this exact structure:
[{
  "author_name": "John Smith",
  "rating": 5,
  "text": "Review text...",
  "date": "2024-01-15",
  "source": "google"
}]
```

The AI intelligently finds and extracts this data regardless of HTML structure!

## Usage

### Command Line

```bash
# Scrape reviews using AI
npm run scrape:reviews

# Or use API-based aggregation (if you have API keys)
npm run aggregate:reviews
```

### In Your Code

```typescript
import { scrapeReviewsWithAI } from './scripts/simpleAiScraper'

// Run scraper
await scrapeReviewsWithAI()

// Reviews are now in businesses.json
// Access them in your components:
const business = await getBusinessBySlug(slug)
const reviews = business.aggregated_reviews || []
```

## Cost Estimate

### OpenAI Pricing (GPT-4-mini)
- Input: $0.150 per 1M tokens
- Output: $0.600 per 1M tokens

### Example Cost:
- Scraping 10 estate agents
- 3 sources each (Google, Trustpilot, Yell)
- ~8,000 tokens per page
- ~500 tokens output per page
- Total: ~30 pages × 8,500 tokens = 255K tokens
- **Cost: ~$0.05** (5 cents!)

**vs API Approach:**
- Google Places: Free tier (limited)
- Trustpilot: $99+/month
- Others: Various costs
- **AI scraping is WAY cheaper!**

## Limitations & Solutions

### Rate Limiting
**Issue**: Too many requests can get blocked
**Solution**: 
- Built-in delays (2-3 seconds between requests)
- Use residential proxies if needed
- Spread over time

### Website Changes
**Issue**: Sites update their HTML
**Solution**: 
- AI adapts automatically (doesn't rely on specific HTML)
- Understands content semantically
- Much more robust than regex

### JavaScript-Heavy Sites
**Issue**: Some sites need JavaScript execution
**Solution**: 
- Playwright executes JavaScript
- Waits for content to load
- Scrolls to trigger lazy loading

## Best Practices

### 1. Be Respectful
- Don't scrape too fast
- Use delays between requests
- Respect robots.txt
- Don't overload servers

### 2. Cache Results
- Save reviews to JSON
- Don't re-scrape unnecessarily
- Update periodically (weekly/monthly)

### 3. Error Handling
- Log failures
- Retry with exponential backoff
- Skip problematic sources
- Continue with successful ones

### 4. Data Quality
- Validate AI output
- Check for reasonable ratings (1-5)
- Verify review text isn't truncated
- Ensure dates are valid

## Advanced Options

### Headless vs Headful
```typescript
// See what's happening (for debugging)
const browser = await chromium.launch({ headless: false })

// Run invisibly (for production)
const browser = await chromium.launch({ headless: true })
```

### Custom Extraction
Modify the AI prompt to extract additional fields:
- Review title
- Helpful vote counts
- Response from business
- Photos/images
- Verification badges

### Proxy Support
```typescript
const browser = await chromium.launch({
  proxy: {
    server: 'http://proxy-server:port',
    username: 'user',
    password: 'pass'
  }
})
```

## Comparison: API vs AI Scraping

| Feature | API Approach | AI Scraping |
|---------|-------------|-------------|
| **Setup** | Multiple API keys | Just OpenAI key |
| **Coverage** | Only sites with APIs | ANY review site |
| **Cost** | Per-platform fees | ~$0.005 per page |
| **Rate Limits** | Strict API limits | Flexible |
| **Maintenance** | Breaks with API changes | AI adapts |
| **Speed** | Fast (API calls) | Moderate (page loads) |
| **Accuracy** | 100% (structured) | ~95% (AI extraction) |

## Recommended Hybrid Approach

**Best Strategy**: Use both!

```
Google Reviews → Use API (fast, free tier available)
Facebook Reviews → Use API (if you have page access)
Trustpilot → Use AI scraping (no free API)
Yell.com → Use AI scraping (no API)
Checkatrade → Use AI scraping (no API)
TripAdvisor → Use API if available, scrape otherwise
```

## Quick Start

### Minimal Setup (Just OpenAI):
```bash
# 1. Get OpenAI key
export OPENAI_API_KEY=sk-...

# 2. Run scraper
npm run scrape:reviews

# 3. Reviews appear on your site!
```

### Full Setup (APIs + AI):
```bash
# APIs for fast/reliable sources
export GOOGLE_PLACES_API_KEY=...

# AI for everything else
export OPENAI_API_KEY=...

# Run both
npm run aggregate:reviews  # Uses APIs where available
npm run scrape:reviews     # Fills gaps with AI scraping
```

## Future Enhancements

1. **Screenshot Analysis**
   - Use GPT-4 Vision to analyze page screenshots
   - Even more robust than text extraction

2. **Automated Scheduling**
   - Cron job to refresh weekly
   - Detect new reviews automatically
   - Email alerts for new feedback

3. **More Sources**
   - LinkedIn recommendations
   - Which? Local reviews
   - Freeindex
   - Local newspaper reviews

4. **Smart Extraction**
   - Detect review patterns with ML
   - Learn from successful extractions
   - Self-improving accuracy

## Support

### Debugging
- Set `headless: false` to watch the browser
- Check console logs for errors
- Test individual sources first
- Verify OpenAI key is valid

### Common Issues
- **No reviews found**: Check if business exists on that platform
- **AI errors**: Verify OpenAI key and quota
- **Timeout errors**: Increase wait times
- **Blocked**: Use proxies or reduce frequency

## Legal & Ethical

### ✅ Legal to Scrape:
- Public review data
- Proper attribution
- Personal use / research
- Follow robots.txt

### ⚠️ Be Careful:
- Don't overload servers
- Respect rate limits
- Don't violate ToS for commercial use
- Get permission if unsure

### Best Approach:
1. Try API first (if available)
2. Use AI scraping for gaps
3. Cache results
4. Update periodically, not constantly

---

**Bottom Line**: AI scraping gives you reviews from ANYWHERE without expensive API subscriptions! 🚀

