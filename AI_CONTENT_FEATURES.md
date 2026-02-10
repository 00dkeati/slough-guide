# AI Content Generation Features

## Overview
This directory now includes enhanced AI content generation capabilities that pull rich data from Google Places API and generate engaging, informative content automatically.

## Enhanced Data Fields

### New Business Data from Google Places API

The following fields are now available for each business:

#### Pricing & Reviews
- `price_level` - 0-4 scale (Free, £, ££, £££, ££££)
- `reviews` - Array of actual Google reviews with ratings and text
- `editorial_summary` - Google's AI-generated business summary

#### Accessibility & Amenities
- `wheelchair_accessible` - Wheelchair accessible entrance
- `outdoor_seating` - Outdoor dining available
- `good_for_children` - Family-friendly establishment
- `allows_dogs` - Pet-friendly venue

#### Dining Options (Restaurants/Cafes)
- `takeout` - Takeout service available
- `delivery` - Delivery service available
- `dine_in` - Dine-in service available
- `reservable` - Accepts reservations
- `serves_breakfast` - Open for breakfast
- `serves_lunch` - Open for lunch
- `serves_dinner` - Open for dinner
- `serves_beer` - Licensed for beer
- `serves_wine` - Licensed for wine
- `serves_vegetarian_food` - Vegetarian options available

#### Payment & Parking
- `payment_options` - Array of accepted payment methods
- `parking_options` - Available parking (free, paid, street)

## AI Content Generation

### Features Generated Automatically

The `aiContentGenerator.ts` module creates:

1. **Business Highlights** (6 key points)
   - Top-rated services
   - Unique features
   - Accessibility options
   - Special amenities

2. **Detailed Descriptions**
   - Comprehensive business overview
   - Service details
   - Social proof from ratings
   - Best use cases

3. **Price Information**
   - Price level with description
   - Value proposition

4. **Accessibility Information**
   - Wheelchair access
   - Family-friendly features
   - Pet policies

5. **Dining Options** (for restaurants)
   - Service types (dine-in, takeout, delivery)
   - Meal times served
   - Beverage options
   - Dietary accommodations

6. **Review Summary**
   - AI analysis of customer feedback
   - Common themes and sentiments
   - Key strengths highlighted

7. **Best For** Tags
   - Target audience identification
   - Use case recommendations

### Example Output

```
Highlights:
- ⭐ Exceptional 4.8 star rating with 150+ reviews
- Fully wheelchair accessible
- 🍷 Licensed for beer & wine
- ☀️ Enjoy outdoor dining
- Vegetarian-friendly menu
- 🅿️ Free parking available

Detailed Description:
"A modern British restaurant in the heart of Slough, known for exceptional quality and outstanding customer satisfaction. Open for lunch and dinner, the restaurant offers a welcoming atmosphere with both indoor and outdoor seating options. With an impressive 4.8 star rating from 150+ customers, it has established itself as a trusted choice in Slough. Perfect for families with children, accessible to all, pet owners."

Price Info:
"Moderate (££) - Reasonably priced with good quality"

Review Summary:
"Based on 150 customer reviews, maintains a 4.8 star rating. Customers consistently praise this establishment, with particular appreciation for service, food quality, atmosphere."
```

## How to Use

### 1. Enrich Business Data

Run the enrichment script to pull enhanced data from Google Places API:

```bash
npm run enrich
```

This will:
- Load all businesses from `public/data/businesses.json`
- For each business with a `google_place_id`:
  - Fetch enhanced data from Google Places API
  - Extract reviews, amenities, pricing, etc.
  - Update the business record
- Save the enriched data back to the file

**Note**: This uses your Google Places API quota. Monitor usage at: https://console.cloud.google.com/apis/api/places-backend.googleapis.com

### 2. Generate AI Content in Your Components

```typescript
import { generateBusinessInsights } from '@/lib/aiContentGenerator'

// In your component or page
const insights = generateBusinessInsights(business)

// Use the generated content
console.log(insights.highlights) // Array of key highlights
console.log(insights.detailedDescription) // Full AI description
console.log(insights.priceInfo) // Price level information
console.log(insights.reviewSummary) // AI analysis of reviews
console.log(insights.bestFor) // Use case recommendations
```

### 3. Display in UI

The generated content can be used in:
- Business detail pages
- Search results
- Category listings
- Comparison views
- Featured business sections

## API Rate Limits

Google Places API has usage limits:
- **Free tier**: 100 requests/day  
- **Paid tier**: Higher limits with billing enabled

To manage costs:
1. Run enrichment infrequently (weekly/monthly)
2. Cache results in JSON file
3. Only enrich new or updated businesses
4. Monitor API usage in Google Cloud Console

## Content Quality

The AI-generated content:
- ✅ Is based on real Google data
- ✅ Incorporates actual customer reviews
- ✅ Highlights verified business features
- ✅ Provides accurate pricing information
- ✅ Updates with fresh review sentiment
- ✅ Maintains SEO-friendly structure

## Future Enhancements

Potential additions:
- Integration with other review platforms (TripAdvisor, Yelp)
- Sentiment analysis using OpenAI GPT
- Automatic FAQ generation from reviews
- Comparison tables between similar businesses
- Trending topics from review analysis
- Seasonal content recommendations
- Popular times analysis
- Menu item extraction for restaurants

## Environment Variables

Required:
```
GOOGLE_PLACES_API_KEY=your_api_key_here
```

Optional (for future features):
```
OPENAI_API_KEY=your_openai_key
TRIPADVISOR_API_KEY=your_tripadvisor_key
```

## Files Modified/Created

- `lib/db.ts` - Extended Business interface with new fields
- `lib/aiContentGenerator.ts` - AI content generation functions
- `scripts/enrichBusinessData.ts` - Data enrichment script
- `package.json` - Added `npm run enrich` script
- `AI_CONTENT_FEATURES.md` - This documentation

## Example Use Cases

### Business Detail Page
Show comprehensive information with AI insights, reviews, pricing, and amenities.

### Search Results
Display key highlights and best-for tags to help users find the perfect business.

### Category Pages
Compare similar businesses with pricing, features, and ratings.

### Featured Listings
Highlight top-rated businesses with AI-generated compelling descriptions.

### Review Section
Show AI summary of customer feedback with extracted highlights.

## Support

For questions or issues:
1. Check Google Places API documentation: https://developers.google.com/maps/documentation/places/web-service
2. Review API quota at: https://console.cloud.google.com/apis/dashboard
3. Test with a small subset of businesses first

