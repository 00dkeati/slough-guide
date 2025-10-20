# Slough Guide

A production-ready local business directory for Slough, Berkshire, built with Next.js 14, TypeScript, and Vercel KV.

## Features

- **Programmatic SEO**: Hundreds of automatically generated pages for categories, neighbourhoods, and query intents
- **Google Places Integration**: Real-time business data from Google Places API
- **Fast Performance**: Optimized for Core Web Vitals with ISR and caching
- **Mobile-First Design**: Responsive UI built with Tailwind CSS and shadcn/ui
- **Rich Structured Data**: JSON-LD schema markup for better SEO
- **Automated Data Refresh**: Daily cron jobs to keep business data current

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Database**: Vercel KV (Redis)
- **API**: Google Places API
- **Deployment**: Vercel

## Setup

### 1. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Google Places API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Vercel KV (Redis)
KV_URL=your_vercel_kv_url
KV_REST_API_URL=your_vercel_kv_rest_api_url
KV_REST_API_TOKEN=your_vercel_kv_rest_api_token

# Site Configuration
SITE_CANONICAL=https://www.sloughguide.co.uk
REFRESH_SECRET_TOKEN=your_secret_token_for_refresh_endpoint

# Next.js
NEXT_PUBLIC_SITE_URL=https://www.sloughguide.co.uk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Seed Data

To populate the database with business data:

```bash
npm run fetch
```

This will fetch data from Google Places API for all categories and neighbourhoods in Slough.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── business/[slug]/   # Business detail pages
│   ├── category/[slug]/   # Category listing pages
│   ├── neighbourhood/     # Neighbourhood pages
│   └── search/           # Search functionality
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── business-card.tsx # Business listing component
│   ├── header.tsx        # Site header
│   └── footer.tsx        # Site footer
├── config/               # Configuration files
│   ├── city.ts          # Slough city configuration
│   └── categories.ts    # Business categories
├── jobs/                # Data fetching jobs
│   ├── fetch-category.ts # Category data fetching
│   └── refresh-all.ts   # Full data refresh
├── lib/                 # Utility libraries
│   ├── google.ts        # Google Places API integration
│   ├── kv.ts           # Vercel KV operations
│   ├── search.ts       # Search functionality
│   ├── seo.ts          # SEO utilities
│   └── types.ts        # TypeScript types
└── types.ts            # Zod schemas
```

## API Endpoints

### Data Refresh
- `POST /api/refresh` - Manual data refresh (requires secret token)
- `GET /api/cron` - Cron job endpoint for scheduled refresh

### Photo Proxy
- `GET /api/photo?ref=...&w=...` - Proxies Google Places photos

## Deployment

### Vercel Setup

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure Vercel KV database
4. Set up cron job in `vercel.json` for daily data refresh

### Domain Configuration

- Primary domain: `sloughguide.co.uk`
- Redirect `sloughguide.com` to `.co.uk`
- Update `SITE_CANONICAL` environment variable

## Data Management

### Categories

The site supports 22+ business categories including:
- Restaurants, Takeaways, Cafes, Pubs
- Gyms, Barbers, Hairdressers
- Plumbers, Electricians, Builders
- Hotels, Taxis, Car Wash
- And more...

### Neighbourhoods

Covers 10 areas in Slough:
- Cippenham, Chalvey, Britwell
- Wexham, Langley, Upton
- Salt Hill, Manor Park
- Colnbrook, Poyle

### Intent Pages

Each category generates multiple intent pages:
- Best (top-rated with reviews)
- Open Now (currently open)
- 24 Hours (open around the clock)
- Cheap (affordable options)
- Top Rated (highest ratings)

## SEO Features

- **Structured Data**: JSON-LD markup for businesses, categories, and breadcrumbs
- **Sitemaps**: Auto-generated XML sitemaps for all pages
- **Meta Tags**: Dynamic title and description generation
- **Internal Linking**: Contextual links between related pages
- **Performance**: Optimized for Core Web Vitals

## Performance

- **ISR**: Static generation with 12-hour revalidation
- **Image Optimization**: Next.js Image component with lazy loading
- **Caching**: Vercel KV for data, CDN for images
- **Rate Limiting**: Google API requests limited to 50/second

## Monitoring

- **Analytics**: Vercel Analytics integration
- **Error Tracking**: Built-in error handling and logging
- **Performance**: Lighthouse scores >85 (mobile), >95 (SEO)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact [your-email@domain.com]