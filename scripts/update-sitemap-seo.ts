import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface KeywordStrategy {
  keyword: string
  targetPage: string
  needsNewPage: boolean
  priority: string
  searchVolume: number
}

// Generate sitemap entry
function generateSitemapEntry(url: string, priority: number, changefreq: string = 'weekly'): string {
  const lastmod = new Date().toISOString().split('T')[0]
  return `  <url>
    <loc>https://slough.co${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
}

// Update sitemap.xml
async function updateSitemap() {
  console.log('🗺️  Updating sitemap...')
  
  // Load strategy
  const strategyPath = path.join(__dirname, '..', 'data', 'keyword-seo-strategy.json')
  if (!fs.existsSync(strategyPath)) {
    console.error('❌ Strategy file not found')
    process.exit(1)
  }
  
  const strategies: KeywordStrategy[] = JSON.parse(fs.readFileSync(strategyPath, 'utf-8'))
  
  // Generate sitemap entries for new pages
  const entries: string[] = []
  
  strategies.forEach(strategy => {
    let priority = 0.7 // Default
    
    // Adjust priority based on search volume and current priority
    if (strategy.searchVolume >= 1000) {
      priority = 0.9
    } else if (strategy.searchVolume >= 500) {
      priority = 0.8
    } else if (strategy.priority === 'high') {
      priority = 0.8
    } else if (strategy.priority === 'medium') {
      priority = 0.7
    } else {
      priority = 0.6
    }
    
    // Higher priority for existing pages being enhanced
    if (!strategy.needsNewPage) {
      priority = Math.min(priority + 0.1, 1.0)
    }
    
    const changefreq = strategy.searchVolume >= 500 ? 'daily' : 'weekly'
    entries.push(generateSitemapEntry(strategy.targetPage, priority, changefreq))
  })
  
  // Read existing sitemap
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml')
  let sitemap = ''
  
  if (fs.existsSync(sitemapPath)) {
    sitemap = fs.readFileSync(sitemapPath, 'utf-8')
  } else {
    // Create new sitemap
    sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`
  }
  
  // Check if entries already exist
  const newEntries = entries.filter(entry => {
    const url = entry.match(/<loc>(.*?)<\/loc>/)?.[1]
    return url && !sitemap.includes(url)
  })
  
  if (newEntries.length === 0) {
    console.log('✅ All SEO pages already in sitemap')
    return
  }
  
  // Insert new entries before closing tag
  const insertPoint = sitemap.lastIndexOf('</urlset>')
  const updatedSitemap = 
    sitemap.slice(0, insertPoint) +
    '\n  <!-- SEO Landing Pages -->\n' +
    newEntries.join('\n') +
    '\n\n' +
    sitemap.slice(insertPoint)
  
  // Write updated sitemap
  fs.writeFileSync(sitemapPath, updatedSitemap)
  
  console.log(`✅ Added ${newEntries.length} new entries to sitemap`)
  console.log(`📊 Total SEO pages: ${entries.length}`)
}

// Also update sitemap.ts (Next.js dynamic sitemap)
async function updateDynamicSitemap() {
  console.log('🗺️  Updating dynamic sitemap...')
  
  const sitemapTsPath = path.join(__dirname, '..', 'app', 'sitemap.ts')
  
  if (!fs.existsSync(sitemapTsPath)) {
    console.log('⏭️  No dynamic sitemap found, skipping')
    return
  }
  
  let sitemapContent = fs.readFileSync(sitemapTsPath, 'utf-8')
  
  // Check if SEO pages section exists
  if (sitemapContent.includes('// SEO Landing Pages')) {
    console.log('✅ Dynamic sitemap already includes SEO pages section')
    return
  }
  
  // Add SEO pages section before the return statement
  const seoSection = `
  // SEO Landing Pages
  const seoPages = [
    '/k/slough-shops',
    '/k/slough-market',
    '/k/houses-for-sale-slough',
    '/k/slough-news',
    '/k/things-to-do-in-slough',
    // Add more as needed
  ]
  
  const seoUrls = seoPages.map((page) => ({
    url: \`\${baseUrl}\${page}\`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
`
  
  // Insert before the final return
  const returnIndex = sitemapContent.lastIndexOf('return [')
  if (returnIndex !== -1) {
    sitemapContent = 
      sitemapContent.slice(0, returnIndex) +
      seoSection +
      '\n  ' +
      sitemapContent.slice(returnIndex).replace('return [', 'return [\n    ...seoUrls,')
    
    fs.writeFileSync(sitemapTsPath, sitemapContent)
    console.log('✅ Updated dynamic sitemap with SEO pages')
  }
}

// Main execution
async function main() {
  try {
    await updateSitemap()
    await updateDynamicSitemap()
    console.log('\n✅ Sitemap update complete!')
  } catch (error) {
    console.error('❌ Error updating sitemap:', error)
    process.exit(1)
  }
}

main()

