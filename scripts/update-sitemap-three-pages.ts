import fs from 'fs'
import path from 'path'

const newPages = [
  'sainsburys-slough',
  'dentist-slough', 
  'estate-agents-slough'
]

function addUrlsToSitemap() {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('Sitemap not found at:', sitemapPath)
    return
  }

  let sitemapContent = fs.readFileSync(sitemapPath, 'utf8')
  
  // Check if URLs already exist
  const urlsExist = urlsExistInSitemap(sitemapContent)
  if (urlsExist.length > 0) {
    console.log('These URLs already exist in sitemap:', urlsExist)
    return
  }

  // Generate new URL entries
  const newUrls = newPages.map(slug => {
    const today = new Date().toISOString().split('T')[0]
    return `  <url>
    <loc>https://www.slough.co/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  }).join('\n')

  // Insert before closing </urlset> tag
  const insertPoint = sitemapContent.lastIndexOf('</urlset>')
  if (insertPoint === -1) {
    console.error('Could not find </urlset> tag in sitemap')
    return
  }

  const updatedSitemap = sitemapContent.slice(0, insertPoint) + 
    '\n' + newUrls + '\n' + 
    sitemapContent.slice(insertPoint)

  fs.writeFileSync(sitemapPath, updatedSitemap)
  console.log('✅ Added 3 new pages to sitemap.xml')
  console.log('Added pages:', newPages)
}

function urlsExistInSitemap(sitemapContent: string): string[] {
  const existingUrls: string[] = []
  
  newPages.forEach(slug => {
    const url = `https://www.slough.co/${slug}`
    if (sitemapContent.includes(url)) {
      existingUrls.push(slug)
    }
  })
  
  return existingUrls
}

// Run the update
addUrlsToSitemap()
