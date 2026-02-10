# Editorial Content System

This guide explains the new editorial content system that replaces the news feed with engaging, tabloid-style feature articles about Slough businesses.

## Overview

The editorial system allows you to create in-depth, magazine-style articles that feature and compare Slough businesses. These articles are displayed on the homepage and have their own dedicated section.

## Key Features

- **Tabloid-style storytelling** with engaging headlines and narratives
- **Business spotlights** that embed business cards directly in articles
- **Rich content types** including paragraphs, headings, quotes, lists, and callouts
- **Featured articles** that appear prominently on the homepage
- **SEO-optimized** with proper metadata and structured content
- **Responsive design** with beautiful hero images

## File Structure

```
/data/editorial-articles.json        # Article data storage
/app/api/editorial/route.ts          # API endpoint for articles
/app/editorial/page.tsx               # Editorial listing page
/app/editorial/[slug]/page.tsx        # Individual article page
/components/EditorialFeed.tsx         # Homepage sidebar component
```

## Article Data Structure

Articles are stored in `/data/editorial-articles.json`. Each article has:

```json
{
  "id": "unique-article-id",
  "slug": "url-friendly-slug",
  "title": "Main headline",
  "subtitle": "Subheading or tagline",
  "category": "Category name",
  "author": "Author name",
  "publishedAt": "2025-10-13T09:00:00.000Z",
  "featured": true,
  "heroImage": "https://image-url.jpg",
  "excerpt": "Brief description for cards and SEO",
  "content": [/* content blocks */],
  "relatedBusinesses": ["business-slug-1", "business-slug-2"],
  "tags": ["tag1", "tag2"],
  "readTime": 6
}
```

## Content Block Types

### Paragraph
```json
{
  "type": "paragraph",
  "text": "Your paragraph text here."
}
```

### Heading
```json
{
  "type": "heading",
  "text": "Section Heading"
}
```

### Quote
```json
{
  "type": "quote",
  "text": "The quoted text",
  "author": "Author Name (optional)"
}
```

### Business Spotlight
Embeds a business card directly in the article:
```json
{
  "type": "businessSpotlight",
  "businessSlug": "business-slug-from-database"
}
```

### List
Supports markdown-style bold with `**text**`:
```json
{
  "type": "list",
  "items": [
    "**Bold text:** Regular text",
    "Another list item"
  ]
}
```

### Callout
Highlighted tip or important information:
```json
{
  "type": "callout",
  "text": "💡 **Pro Tip:** Your important tip here"
}
```

## Creating New Articles

1. **Open** `/data/editorial-articles.json`

2. **Add a new article object** to the array with all required fields

3. **Write engaging content** using the tabloid-style approach:
   - Start with a hook that grabs attention
   - Use conversational, relatable language
   - Include real quotes from reviews when possible
   - Make fair comparisons backed by data
   - End with actionable advice

4. **Set featured status:**
   - Only 2-3 articles should be `"featured": true`
   - Featured articles appear on homepage and at top of editorial page

5. **Choose a hero image:**
   - Use Unsplash for high-quality free images
   - Format: `https://images.unsplash.com/photo-ID?w=1200&h=600&fit=crop`

## Example Articles

The system includes these example articles:

1. **Best Estate Agents in Slough 2025** (Featured)
   - Compares top estate agents with real data
   - Includes business spotlights
   - Provides actionable advice for choosing

2. **Ultimate Restaurant Guide 2025** (Featured)
   - Reviews top restaurants and pubs
   - Uses real reviews from the database
   - Engaging, food-critic style writing

3. **Coffee Shop Battle** 
   - Chains vs independents comparison
   - Tips for finding the best coffee

4. **Finding a Reliable Plumber**
   - Practical advice article
   - Red flags and green lights
   - Local community insights

5. **Best Hair Salons**
   - Beauty and wellness focus
   - Price vs value discussion

6. **Retail Park Shopping Guide**
   - Location-specific guide
   - Insider tips and hacks

7. **Sunday Roast Championship**
   - Fun, competitive angle
   - Food journalism approach

## Writing Style Guide

### Headlines
- Use numbers: "5 Best..." or "2025 Guide to..."
- Ask questions: "Who is the Best...?"
- Create intrigue: "The Truth About..."
- Be specific: Include "Slough" and year

### Body Content
- **Be conversational:** Write like you're talking to a friend
- **Use real data:** Reference ratings, review counts, prices
- **Be balanced:** Show pros and cons
- **Include locals:** Quote real reviews when possible
- **Add personality:** Inject humor and local knowledge
- **Be helpful:** End with actionable takeaways

### Emojis
Use sparingly for emphasis in callouts:
- 💡 Tips and insights
- 🍽️ Food-related content
- 🚗 Transport and parking
- ✂️ Beauty and grooming
- ☕ Coffee and cafes
- 💧 Plumbing and water

## API Endpoints

### Get All Articles
```
GET /api/editorial
```

### Get Featured Articles
```
GET /api/editorial?featured=true
```

### Limit Results
```
GET /api/editorial?limit=5
```

## Homepage Integration

The `EditorialFeed` component in the homepage sidebar automatically:
- Fetches the 3 most recent featured articles
- Displays them with category badges and read times
- Links to full articles
- Shows loading and error states

## SEO Benefits

Each article generates:
- Optimized meta titles and descriptions
- Open Graph tags for social sharing
- Structured article schema
- Internal linking to business pages
- Rich, keyword-focused content

## Future Enhancement Ideas

1. **Author pages:** Profile pages for each writer
2. **Category filtering:** Browse articles by category
3. **Search functionality:** Find articles by keyword
4. **Related articles:** Suggest similar content
5. **Social sharing:** Share buttons for articles
6. **Comments:** Community engagement
7. **Email newsletter:** Weekly digest of new articles
8. **Business requests:** Let businesses request features

## Best Practices

✅ **DO:**
- Update articles regularly (at least monthly)
- Use real business data from the database
- Include business spotlights for featured businesses
- Write in an engaging, tabloid style
- Be honest and balanced in comparisons
- Add helpful tips and insider knowledge

❌ **DON'T:**
- Make claims you can't back up with data
- Be overly promotional for one business
- Use clickbait without delivering value
- Copy content from other sources
- Ignore negative reviews (address them fairly)
- Publish without proofreading

## Maintenance

- Review and update articles quarterly
- Remove outdated content
- Update statistics and prices as they change
- Add new articles for trending topics
- Monitor which articles perform best
- Respond to feedback in business reviews

