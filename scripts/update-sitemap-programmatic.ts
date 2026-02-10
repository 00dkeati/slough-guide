import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Helper to get __dirname in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load keywords data
const keywords = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/keywords.json'), 'utf8'))

// Generate sitemap entries for programmatic pages
function generateSitemapEntries() {
  const entries = keywords.map((keyword: any) => {
    const slug = keyword.keyword.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    
    const priority = keyword.priority === 'high' ? '0.9' : 
                    keyword.priority === 'medium' ? '0.7' : '0.5'
    
    return `    {
      url: \`\${baseUrl}/k/\${slug}\`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: ${priority},
    },`
  }).join('\n')
  
  return entries
}

// Update sitemap.ts
function updateSitemap() {
  const sitemapPath = path.join(__dirname, '../app/sitemap.ts')
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf8')
  
  // Generate programmatic entries
  const programmaticEntries = generateSitemapEntries()
  
  // Find the insertion point (before the closing bracket)
  const insertionPoint = sitemapContent.lastIndexOf('  ]')
  
  if (insertionPoint !== -1) {
    // Insert programmatic entries before the closing bracket
    const beforeClosing = sitemapContent.substring(0, insertionPoint)
    const afterClosing = sitemapContent.substring(insertionPoint)
    
    const updatedContent = beforeClosing + 
      '\n    // Programmatic SEO pages\n' +
      programmaticEntries + '\n' +
      afterClosing
    
    fs.writeFileSync(sitemapPath, updatedContent)
    console.log('✅ Updated sitemap.ts with programmatic pages')
  } else {
    console.log('❌ Could not find insertion point in sitemap.ts')
  }
}

// Run the update
updateSitemap()
