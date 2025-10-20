# 🚀 Slough Guide Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Repository Setup
- [x] Git repository initialized
- [x] All code committed
- [x] README.md created
- [x] SETUP.md created
- [ ] Push to GitHub (manual step required)

### 2. Google Places API Setup
- [ ] Create Google Cloud Project
- [ ] Enable Places API
- [ ] Enable Maps JavaScript API  
- [ ] Enable Maps Static API
- [ ] Create API Key
- [ ] Restrict API Key to domains

### 3. Vercel Setup
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Set up Vercel KV database
- [ ] Configure environment variables
- [ ] Deploy application

### 4. Domain Setup
- [ ] Purchase sloughguide.co.uk
- [ ] Configure DNS
- [ ] Set up SSL certificate
- [ ] Configure redirects

## 🎯 Step-by-Step Deployment Guide

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name: `slough-guide`
4. Description: "Production-ready local business directory for Slough, Berkshire"
5. Make it public
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### Step 2: Push Code to GitHub

```bash
# Add remote origin (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/slough-guide.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Google Cloud Setup

1. **Create Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project: "Slough Guide"

2. **Enable APIs**
   - Go to "APIs & Services" > "Library"
   - Enable: "Places API"
   - Enable: "Maps JavaScript API"
   - Enable: "Maps Static API"

3. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key

4. **Restrict API Key**
   - Click on the API key to edit
   - Under "Application restrictions": HTTP referrers
   - Add: `*.vercel.app/*`, `*.sloughguide.co.uk/*`
   - Under "API restrictions": Select "Restrict key"
   - Select: Places API, Maps JavaScript API, Maps Static API

### Step 4: Vercel Deployment

1. **Create Vercel Account**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import from GitHub: `slough-guide`
   - Framework: Next.js (auto-detected)
   - Click "Deploy"

3. **Set up Vercel KV**
   - In Vercel dashboard, go to "Storage" tab
   - Click "Create Database" > "KV"
   - Name: `slough-guide-kv`
   - Region: Europe (closest to UK)
   - Click "Create"

4. **Configure Environment Variables**
   - Go to project settings > Environment Variables
   - Add each variable:

```
GOOGLE_MAPS_API_KEY = your_google_api_key_here
KV_URL = (from KV database settings)
KV_REST_API_URL = (from KV database settings)  
KV_REST_API_TOKEN = (from KV database settings)
SITE_CANONICAL = https://www.sloughguide.co.uk
REFRESH_SECRET_TOKEN = generate_secure_random_string
NEXT_PUBLIC_SITE_URL = https://www.sloughguide.co.uk
CRON_SECRET = same_as_refresh_secret_token
```

### Step 5: Initial Data Population

After deployment, populate the database:

```bash
# Get your deployment URL from Vercel dashboard
curl -X POST https://your-app.vercel.app/api/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_SECRET_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"includeNeighbourhoods": true, "concurrency": 3}'
```

### Step 6: Domain Configuration

1. **Purchase Domain**
   - Buy `sloughguide.co.uk` from domain registrar
   - Also buy `sloughguide.com` for redirect

2. **Configure in Vercel**
   - Go to project settings > Domains
   - Add `sloughguide.co.uk` as primary domain
   - Add `sloughguide.com` and redirect to `.co.uk`

3. **Update DNS**
   - Point domain to Vercel nameservers
   - Wait for SSL certificate (automatic)

### Step 7: Verification

1. **Test Core Functionality**
   - [ ] Home page loads
   - [ ] Search works
   - [ ] Category pages load
   - [ ] Business pages load
   - [ ] Sitemap accessible: `/sitemap.xml`

2. **Check Data Population**
   - [ ] Businesses appear on category pages
   - [ ] Photos load correctly
   - [ ] Search returns results

3. **SEO Verification**
   - [ ] Submit sitemap to Google Search Console
   - [ ] Check structured data with Google's tool
   - [ ] Verify meta tags

## 🎉 Success Metrics

After deployment, you should have:
- ✅ 1000+ business listings
- ✅ 500+ SEO pages
- ✅ Fast loading times (<3s)
- ✅ Mobile-responsive design
- ✅ Rich structured data
- ✅ Automated daily updates

## 📊 Monitoring Setup

1. **Google Analytics**
   - Add tracking code to layout.tsx
   - Monitor traffic and user behavior

2. **Google Search Console**
   - Verify domain ownership
   - Submit sitemap
   - Monitor indexing status

3. **Vercel Analytics**
   - Built-in performance monitoring
   - Core Web Vitals tracking

## 🚨 Troubleshooting

### Common Issues:

**Build Failures:**
- Check TypeScript errors
- Verify all dependencies installed
- Check environment variables

**Empty Data:**
- Verify Google API key works
- Check Vercel KV connection
- Run data fetch manually

**Performance Issues:**
- Monitor Vercel KV usage
- Check image optimization
- Review Core Web Vitals

**SEO Issues:**
- Verify sitemap generation
- Check structured data
- Monitor Google indexing

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check Google Cloud Console for API usage

Your Slough Guide is ready to dominate local search! 🎯
