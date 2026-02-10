import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

// Merge scraped data back into main businesses.json
function mergeScrapedData() {
  const scrapedPath = join(process.cwd(), 'scraped-data/businesses-enriched-final.json')
  const outputPath = join(process.cwd(), 'public/data/businesses.json')
  
  const enrichedData = JSON.parse(readFileSync(scrapedPath, 'utf-8'))
  
  writeFileSync(outputPath, JSON.stringify(enrichedData, null, 2))
  
  console.log('✅ Merged scraped data into businesses.json')
}

mergeScrapedData()
