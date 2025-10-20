# Slough Guide - Deployment Setup Guide

## Step 1: Environment Variables Setup

### Local Development (.env.local)
Create a `.env.local` file in the root directory with:

```env
# Google Places API
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE

# Vercel KV (Redis) - Get these from Vercel dashboard
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Site Configuration
SITE_CANONICAL=https://www.sloughguide.co.uk
REFRESH_SECRET_TOKEN=your-secret-token-here-change-this

# Next.js
NEXT_PUBLIC_SITE_URL=https://www.sloughguide.co.uk

# Optional: Google Site Verification
GOOGLE_SITE_VERIFICATION=
```

### Vercel Environment Variables
In your Vercel dashboard, add these environment variables:

1. **GOOGLE_MAPS_API_KEY** - Your Google Places API key
2. **KV_URL** - Vercel KV connection URL
3. **KV_REST_API_URL** - Vercel KV REST API URL
4. **KV_REST_API_TOKEN** - Vercel KV REST API token
5. **SITE_CANONICAL** - https://www.sloughguide.co.uk
6. **REFRESH_SECRET_TOKEN** - A secure random string
7. **NEXT_PUBLIC_SITE_URL** - https://www.sloughguide.co.uk
8. **CRON_SECRET** - Same as REFRESH_SECRET_TOKEN

## Step 2: Google Places API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Places API
   - Maps JavaScript API
   - Maps Static API
4. Create credentials (API Key)
5. Restrict the API key to:
   - HTTP referrers: `*.vercel.app`, `*.sloughguide.co.uk`
   - APIs: Places API, Maps JavaScript API, Maps Static API

## Step 3: Vercel KV Setup

1. In Vercel dashboard, go to Storage tab
2. Create a new KV database
3. Copy the connection details to environment variables
4. The database will be automatically connected to your project

## Step 4: Deploy to Vercel

1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## Step 5: Initial Data Population

After deployment, run the data fetch:

```bash
# Via API call (recommended)
curl -X POST https://your-domain.vercel.app/api/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"includeNeighbourhoods": true, "concurrency": 3}'

# Or locally (if you have KV access)
npm run fetch
```

## Step 6: Domain Configuration

1. Purchase sloughguide.co.uk domain
2. In Vercel, add custom domain
3. Configure DNS records as instructed by Vercel
4. Set up redirect from sloughguide.com to .co.uk

## Step 7: Verify Deployment

1. Check sitemap: https://your-domain.com/sitemap.xml
2. Test search functionality
3. Verify business pages load correctly
4. Check Google Search Console for indexing

## Troubleshooting

### Common Issues:
- **API Key errors**: Check Google Cloud Console API restrictions
- **KV connection issues**: Verify environment variables in Vercel
- **Build failures**: Check TypeScript errors and dependencies
- **Empty data**: Run initial data fetch after deployment

### Performance Tips:
- Monitor Vercel KV usage
- Set up Google Analytics
- Configure error tracking (Sentry)
- Monitor Core Web Vitals
