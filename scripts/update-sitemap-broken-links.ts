import fs from 'fs'
import path from 'path'

const baseUrl = 'https://www.slough.co'

// New routes to add to sitemap
const newRoutes = [
  // Category routes
  '/category/education',
  '/category/healthcare',
  '/category/insurance',
  '/category/shops',
  '/category/estate',
  '/category/hairdressers',
  '/category/driving-instructor',
  '/category/handymen',
  '/category/bars',
  '/category/conveyancing',
  '/category/home-staging',
  '/category/mortgage-brokers',
  '/category/property-management',
  '/category/removal-services',
  '/category/surveyors',
  '/category/afterschool-clubs',
  '/category/alarm-systems',
  '/category/cctv',
  '/category/doctors',
  '/category/nail-salons',
  '/category/opticians',
  '/category/playgroups',
  '/category/safes',
  '/category/schools',
  '/category/security-companies',
  '/category/chinese-takeaway',
  '/category/fish-and-chips',
  '/category/indian-takeaway',
  '/category/pizza',
  '/category/veterinarians',
  '/category/spas',
  '/category/care-homes',
  '/category/dementia-care',
  '/category/emergency-care',
  '/category/home-care',
  '/category/nursing-homes',
  '/category/respite-care',
  '/category/event-planning',
  '/category/garden-centres',
  '/category/wedding-services',
  '/category/chiropractic',
  '/category/massage',
  '/category/physiotherapy',
  '/category/childcare',

  // Services routes
  '/services',
  '/services/barbers-slough',
  '/services/care-home-slough',
  '/services/chinese-takeaway-slough',
  '/services/dentist-slough',
  '/services/estate-agents-slough',
  '/services/florist-slough',
  '/services/hairdresser-slough',
  '/services/locksmiths-slough',
  '/services/massage-slough',
  '/services/nursery-slough',
  '/services/restaurants-slough',
  '/services/takeaway-slough',

  // Property routes
  '/property',
  '/property/houses-for-sale-slough',
  '/property/properties-to-rent-slough',
  '/property/conveyancing-slough',
  '/property/mortgage-brokers-slough',
  '/property/property-management-slough',
  '/property/removal-services-slough',
  '/property/surveyors-slough'
]

function addUrlsToSitemap(sitemap: string, urls: string[]): string {
  const urlEntries = urls.map(url => {
    return `    <url>
      <loc>${baseUrl}${url}</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
  }).join('\n')

  // Insert before the closing </urlset> tag
  return sitemap.replace('</urlset>', `${urlEntries}\n</urlset>`)
}

function urlsExistInSitemap(sitemap: string, urls: string[]): boolean {
  return urls.some(url => sitemap.includes(`<loc>${baseUrl}${url}</loc>`))
}

async function updateSitemap() {
  try {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
    const sitemap = fs.readFileSync(sitemapPath, 'utf8')

    // Check if URLs already exist
    if (urlsExistInSitemap(sitemap, newRoutes)) {
      console.log('Some URLs already exist in sitemap, skipping...')
      return
    }

    // Add new URLs to sitemap
    const updatedSitemap = addUrlsToSitemap(sitemap, newRoutes)
    
    // Write updated sitemap
    fs.writeFileSync(sitemapPath, updatedSitemap)
    
    console.log(`Successfully added ${newRoutes.length} new URLs to sitemap.xml`)
    console.log('New routes added:')
    newRoutes.forEach(route => console.log(`  - ${route}`))
    
  } catch (error) {
    console.error('Error updating sitemap:', error)
  }
}

// Run the update
updateSitemap()


