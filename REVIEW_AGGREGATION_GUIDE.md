# Multi-Source Review Aggregation System

## Overview
This system aggregates customer reviews from multiple online platforms into a single unified view, giving you comprehensive insights into what customers are saying across the web.

## Supported Review Sources

### ✅ Currently Integrated (API Available)

1. **Google Reviews** (Google Places API)
   - Most popular review platform
   - Up to 5 most helpful reviews per business
   - Includes author name, rating, text, date
   - Verified reviews with profile links
   - **API Key Required**: `GOOGLE_PLACES_API_KEY`

2. **Facebook Reviews** (Facebook Graph API)
   - Customer recommendations and ratings
   - Access requires business page permissions
   - **API Key Required**: `FACEBOOK_ACCESS_TOKEN`

3. **Trustpilot** (Trustpilot API)
   - Trusted review platform (especially UK)
   - Verified purchase reviews
   - **API Key Required**: `TRUSTPILOT_API_KEY`

4. **TripAdvisor** (TripAdvisor Content API)
   - Essential for restaurants, hotels, attractions
   - Detailed traveler reviews
   - **API Key Required**: `TRIPADVISOR_API_KEY`

### 🔧 Planned Integration (Requires Scraping)

5. **Yell.com**
   - Popular UK business directory
   - Requires web scraping (no public API)

6. **Checkatrade**
   - UK tradespeople reviews
   - Requires web scraping (no public API)

7. **Yelp** (Yelp Fusion API)
   - Popular in US, growing in UK
   - **API Key**: `YELP_API_KEY`

8. **Freeindex**
   - UK business directory
   - Requires web scraping

## How It Works

### Architecture

```
┌──────────────────────────────────────────┐
│     Business Data (businesses.json)      │
│  - Google Place ID                       │
│  - Facebook Page ID                      │
│  - Trustpilot ID                         │
│  - TripAdvisor ID                        │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│   Review Aggregator (reviewAggregator.ts)│
│  - Fetches from all sources in parallel  │
│  - Normalizes ratings to 5-star scale    │
│  - Combines & sorts by date              │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│        Aggregated Reviews                │
│  - Source (google/facebook/etc)          │
│  - Author name                           │
│  - Rating (1-5)                          │
│  - Review text                           │
│  - Date                                  │
│  - Verified status                       │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│       Review Statistics                  │
│  - Total reviews across all sources      │
│  - Average rating                        │
│  - Rating breakdown (5,4,3,2,1 stars)    │
│  - Sentiment score                       │
│  - Source breakdown                      │
└──────────────────────────────────────────┘
```

### Data Flow

1. **Collection**: Script fetches reviews from all configured sources
2. **Normalization**: Converts all ratings to 5-star scale
3. **Aggregation**: Combines reviews from all sources
4. **Statistics**: Calculates comprehensive stats
5. **Storage**: Saves to `businesses.json`
6. **Display**: Shows on website (league tables, business pages, etc.)

## Setup Instructions

### 1. Get API Keys

#### Google Places API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable "Places API"
4. Create credentials (API key)
5. Set environment variable: `GOOGLE_PLACES_API_KEY=your_key`

#### Facebook Graph API
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app
3. Get a Page Access Token with `pages_read_engagement` permission
4. Set environment variable: `FACEBOOK_ACCESS_TOKEN=your_token`

#### Trustpilot API
1. Go to [Trustpilot Developer Portal](https://developers.trustpilot.com/)
2. Register for API access
3. Get API key
4. Set environment variable: `TRUSTPILOT_API_KEY=your_key`

#### TripAdvisor Content API
1. Go to [TripAdvisor Developer Portal](https://developer-tripadvisor.com/)
2. Apply for API access
3. Get API key
4. Set environment variable: `TRIPADVISOR_API_KEY=your_key`

### 2. Configure Business IDs

Update your `businesses.json` with review platform IDs:

```json
{
  "id": "business-1",
  "name": "Example Business",
  "google_place_id": "ChIJa...",
  "facebook_page_id": "12345678",
  "trustpilot_id": "example-business-123",
  "tripadvisor_id": "d123456"
}
```

### 3. Run Aggregation

```bash
# Set your API keys
export GOOGLE_PLACES_API_KEY=your_google_key
export FACEBOOK_ACCESS_TOKEN=your_facebook_token
export TRUSTPILOT_API_KEY=your_trustpilot_key
export TRIPADVISOR_API_KEY=your_tripadvisor_key

# Run aggregation
npm run aggregate:reviews
```

## Usage

### Command Line

```bash
# Aggregate reviews from all sources
npm run aggregate:reviews

# Enrich just estate agents (Google only)
npm run enrich:estate-agents

# Full business data enrichment (all fields)
npm run enrich
```

### In Code

```typescript
import { aggregateAllReviews, calculateReviewStats } from '@/lib/reviewAggregator'

// Aggregate reviews for a business
const reviews = await aggregateAllReviews(
  {
    google_place_id: 'ChIJ...',
    facebook_page_id: '12345',
    trustpilot_id: 'business-123',
    tripadvisor_id: 'd456'
  },
  {
    google: process.env.GOOGLE_PLACES_API_KEY,
    facebook: process.env.FACEBOOK_ACCESS_TOKEN,
    trustpilot: process.env.TRUSTPILOT_API_KEY,
    tripadvisor: process.env.TRIPADVISOR_API_KEY
  }
)

// Calculate statistics
const stats = calculateReviewStats(reviews)
console.log(`Total reviews: ${stats.total_reviews}`)
console.log(`Average rating: ${stats.average_rating}`)
console.log(`Sources: ${stats.sources.length}`)
```

## Features

### Review Filtering

```typescript
import { filterReviews } from '@/lib/reviewAggregator'

// Get only 5-star reviews
const fiveStarReviews = filterReviews(reviews, { minRating: 5 })

// Get only verified reviews
const verifiedOnly = filterReviews(reviews, { verifiedOnly: true })

// Get reviews from specific sources
const googleAndFacebook = filterReviews(reviews, { 
  sources: ['google', 'facebook'] 
})

// Combine filters
const topVerified = filterReviews(reviews, {
  minRating: 4.5,
  verifiedOnly: true,
  limit: 10
})
```

### Review Highlights

```typescript
import { getReviewHighlights } from '@/lib/reviewAggregator'

// Get 3 best reviews (high rating + detailed text)
const highlights = getReviewHighlights(reviews, 3)
```

### Statistics

```typescript
const stats = calculateReviewStats(reviews)

// Access data
console.log(stats.total_reviews)      // Total count
console.log(stats.average_rating)     // Average (1-5)
console.log(stats.rating_breakdown)   // Count per star
console.log(stats.sentiment_score)    // -1 to 1
console.log(stats.sources)            // Per-source breakdown
```

## Display Integration

### On Business Pages

```typescript
// In your business page component
const business = await getBusinessBySlug(slug)

if (business.aggregated_reviews) {
  // Show reviews from all sources
  {business.aggregated_reviews.map(review => (
    <ReviewCard 
      source={review.source}
      author={review.author_name}
      rating={review.rating}
      text={review.text}
      date={review.date}
      verified={review.verified}
    />
  ))}
}

// Show statistics
if (business.review_stats) {
  <div>
    Total: {business.review_stats.total_reviews}
    Average: {business.review_stats.average_rating}⭐
    Sources: {business.review_stats.sources.length}
  </div>
}
```

### Source Badges

Show which platforms have reviews:

```typescript
{business.review_stats?.sources.map(source => (
  <Badge key={source.source}>
    {source.source} ({source.count})
  </Badge>
))}
```

## API Rate Limits

Be aware of rate limits for each platform:

- **Google Places**: 100 requests/day (free), more with billing
- **Facebook**: 200 calls/hour per user
- **Trustpilot**: Varies by plan
- **TripAdvisor**: Varies by plan

The aggregation script includes built-in rate limiting (300ms between requests).

## Benefits

### For Business Owners
- ✅ Single dashboard for all reviews
- ✅ Identify trends across platforms
- ✅ Respond to all feedback in one place
- ✅ Track reputation holistically

### For Customers
- ✅ Complete picture of business reputation
- ✅ Reviews from multiple trusted sources
- ✅ More data points for decision making
- ✅ See patterns across platforms

### For Directory
- ✅ Richer, more comprehensive data
- ✅ Better SEO with user-generated content
- ✅ Increased trust and credibility
- ✅ Competitive advantage

## Future Enhancements

### Web Scraping for Additional Sources
- Yell.com
- Checkatrade
- Freeindex
- Which? Local

### Advanced Features
- Sentiment analysis (NLP)
- Review response tracking
- Trend analysis over time
- Automated alerts for new reviews
- Review response suggestions
- Competitor comparison

### Integration Options
- Real-time webhook notifications
- Auto-sync on schedule (cron job)
- Manual refresh button on UI
- Incremental updates (only new reviews)

## Troubleshooting

### No Reviews Found
- Check API keys are correct
- Verify business IDs are valid
- Ensure APIs are enabled in respective dashboards
- Check API quota hasn't been exceeded

### Partial Results
- Some APIs may fail while others succeed
- Check error logs for specific failures
- Verify permissions for each platform

### Rate Limit Errors
- Increase delay between requests
- Split into smaller batches
- Run during off-peak hours
- Consider upgrading API plans

## Cost Considerations

### Free Tiers
- Google Places: 100 requests/day free
- Facebook: Free with valid access token
- Trustpilot: Free tier available
- TripAdvisor: Contact for pricing

### Paid Options
For high-volume usage:
- Google: Pay per request beyond free tier
- Consider review aggregation services (Birdeye, Yotpo, etc.)

## Compliance

### GDPR & Privacy
- Reviews are public data
- Display with proper attribution
- Link back to original source
- Honor deletion requests

### Terms of Service
- Respect each platform's ToS
- Don't manipulate or filter unfairly
- Attribute reviews to correct source
- Follow rate limiting guidelines

## Support

For issues or questions:
1. Check API documentation
2. Review error logs
3. Test individual sources
4. Contact API support for platform-specific issues

