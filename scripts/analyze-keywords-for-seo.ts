import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface KeywordData {
  no: number
  position: string
  keyword: string
  change: number
  sd: number
  searchVolume: number
  url: string
  location: string
}

interface KeywordStrategy {
  keyword: string
  position: string
  searchVolume: number
  currentUrl: string
  intent: 'informational' | 'transactional' | 'navigational'
  contentType: 'category' | 'area' | 'business' | 'landing-page' | 'enhance-existing'
  targetPage: string
  needsNewPage: boolean
  category?: string
  area?: string
  priority: 'high' | 'medium' | 'low'
  estimatedWordCount: number
  relatedKeywords: string[]
}

// Parse CSV data
function parseCSV(csvPath: string): KeywordData[] {
  const content = fs.readFileSync(csvPath, 'utf-8')
  const lines = content.split('\n').slice(1) // Skip header
  
  return lines
    .filter(line => line.trim())
    .map((line, index) => {
      const parts = line.split(',')
      return {
        no: parseInt(parts[0]) || index + 1,
        position: parts[1]?.replace(/"/g, '').trim() || 'Not ranked',
        keyword: parts[2]?.replace(/"/g, '').trim() || '',
        change: parseInt(parts[3]) || 0,
        sd: parseInt(parts[4]) || 0,
        searchVolume: parseInt(parts[5]) || 0,
        url: parts[6]?.replace(/"/g, '').trim() || '',
        location: parts[7]?.replace(/"/g, '').trim() || ''
      }
    })
    .filter(item => item.keyword)
}

// Determine keyword intent
function determineIntent(keyword: string): 'informational' | 'transactional' | 'navigational' {
  const lowerKeyword = keyword.toLowerCase()
  
  // Navigational - specific brand/place searches
  if (lowerKeyword.includes('sainsburys') || lowerKeyword.includes('asda') || 
      lowerKeyword.includes('argos') || lowerKeyword.includes('wickes') ||
      lowerKeyword.includes('specsavers') || lowerKeyword.includes('kwik fit')) {
    return 'navigational'
  }
  
  // Transactional - buying/hiring intent
  if (lowerKeyword.includes('for sale') || lowerKeyword.includes('houses') ||
      lowerKeyword.includes('buy') || lowerKeyword.includes('hire') ||
      lowerKeyword.includes('jobs') || lowerKeyword.includes('vacancies') ||
      lowerKeyword.includes('rental') || lowerKeyword.includes('used cars')) {
    return 'transactional'
  }
  
  // Informational - everything else
  return 'informational'
}

// Extract category from keyword
function extractCategory(keyword: string): string | undefined {
  const lowerKeyword = keyword.toLowerCase()
  
  const categoryMap: Record<string, string> = {
    'electrician': 'electricians',
    'plumber': 'plumbers',
    'painter': 'painters',
    'decorator': 'painters',
    'locksmith': 'locksmiths',
    'dentist': 'dentists',
    'chiropodist': 'chiropodists',
    'hairdresser': 'hairdressers',
    'barber': 'barbers',
    'restaurant': 'restaurants',
    'pub': 'pubs',
    'cafe': 'cafes',
    'takeaway': 'takeaways',
    'chinese': 'chinese-restaurants',
    'fish and chips': 'fish-and-chips',
    'estate agent': 'estate-agents',
    'letting agent': 'letting-agents',
    'garage': 'garages',
    'tyre': 'tyres',
    'gym': 'gyms',
    'massage': 'massage-therapists',
    'spa': 'spas',
    'florist': 'florists',
    'beauty salon': 'beauty-salons',
    'nursery': 'nurseries',
    'nurseries': 'nurseries',
    'school': 'schools',
    'doctor': 'doctors',
    'optician': 'opticians',
    'vet': 'vets',
    'taxi': 'taxis',
    'removal': 'removals',
    'handyman': 'handymen',
    'pet shop': 'pet-shops',
    'garden centre': 'garden-centres'
  }
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (lowerKeyword.includes(key)) {
      return value
    }
  }
  
  return undefined
}

// Extract area from keyword
function extractArea(keyword: string): string | undefined {
  const lowerKeyword = keyword.toLowerCase()
  
  const areas = [
    'slough',
    'purbrook',
    'cowplain',
    'denmead',
    'leigh park',
    'horndean',
    'clanfield',
    'widley'
  ]
  
  for (const area of areas) {
    if (lowerKeyword.includes(area)) {
      return area
    }
  }
  
  return 'slough' // Default
}

// Determine content type and target page
function determineContentType(keyword: string, currentUrl: string, category?: string, area?: string): {
  contentType: KeywordStrategy['contentType']
  targetPage: string
  needsNewPage: boolean
} {
  const lowerKeyword = keyword.toLowerCase()
  
  // If already ranking with a URL, enhance that page
  if (currentUrl && currentUrl !== '') {
    const urlPath = currentUrl.replace('https://www.slough.co', '')
    return {
      contentType: 'enhance-existing',
      targetPage: urlPath,
      needsNewPage: false
    }
  }
  
  // Category + Area pages
  if (category && area) {
    return {
      contentType: 'category',
      targetPage: `/${category}/${area}`,
      needsNewPage: false
    }
  }
  
  // Category only
  if (category) {
    return {
      contentType: 'category',
      targetPage: `/${category}`,
      needsNewPage: false
    }
  }
  
  // Area only
  if (area && area !== 'slough') {
    return {
      contentType: 'area',
      targetPage: `/area/${area}`,
      needsNewPage: false
    }
  }
  
  // Specific business/brand searches
  if (lowerKeyword.includes('sainsburys') || lowerKeyword.includes('argos') ||
      lowerKeyword.includes('asda') || lowerKeyword.includes('wickes')) {
    const slug = keyword.toLowerCase().replace(/\s+/g, '-')
    return {
      contentType: 'landing-page',
      targetPage: `/k/${slug}`,
      needsNewPage: true
    }
  }
  
  // General informational pages
  const slug = keyword.toLowerCase().replace(/\s+/g, '-')
  return {
    contentType: 'landing-page',
    targetPage: `/k/${slug}`,
    needsNewPage: true
  }
}

// Determine priority based on search volume and current position
function determinePriority(position: string, searchVolume: number): 'high' | 'medium' | 'low' {
  const isRanked = position !== 'Not ranked' && position !== 'Pending'
  const posNum = parseInt(position) || 999
  
  // High priority: High search volume OR close to first page
  if (searchVolume >= 500 || (isRanked && posNum <= 30)) {
    return 'high'
  }
  
  // Medium priority: Moderate search volume OR ranked but not close
  if (searchVolume >= 100 || (isRanked && posNum <= 75)) {
    return 'medium'
  }
  
  // Low priority: Everything else
  return 'low'
}

// Find related keywords
function findRelatedKeywords(keyword: string, allKeywords: KeywordData[]): string[] {
  const lowerKeyword = keyword.toLowerCase()
  const words = lowerKeyword.split(/\s+/)
  
  return allKeywords
    .filter(k => {
      const lowerK = k.keyword.toLowerCase()
      return lowerK !== lowerKeyword && words.some(word => lowerK.includes(word))
    })
    .slice(0, 5)
    .map(k => k.keyword)
}

// Estimate word count needed
function estimateWordCount(contentType: KeywordStrategy['contentType'], priority: string): number {
  if (contentType === 'enhance-existing') {
    return priority === 'high' ? 400 : 300
  }
  
  if (contentType === 'landing-page') {
    return priority === 'high' ? 500 : 350
  }
  
  return 300
}

// Main analysis function
function analyzeKeywords(csvPath: string): KeywordStrategy[] {
  console.log('📊 Analyzing keywords from CSV...')
  
  const keywordData = parseCSV(csvPath)
  console.log(`Found ${keywordData.length} keywords`)
  
  const strategies: KeywordStrategy[] = keywordData.map(data => {
    const intent = determineIntent(data.keyword)
    const category = extractCategory(data.keyword)
    const area = extractArea(data.keyword)
    const { contentType, targetPage, needsNewPage } = determineContentType(
      data.keyword,
      data.url,
      category,
      area
    )
    const priority = determinePriority(data.position, data.searchVolume)
    const relatedKeywords = findRelatedKeywords(data.keyword, keywordData)
    const estimatedWordCount = estimateWordCount(contentType, priority)
    
    return {
      keyword: data.keyword,
      position: data.position,
      searchVolume: data.searchVolume,
      currentUrl: data.url,
      intent,
      contentType,
      targetPage,
      needsNewPage,
      category,
      area,
      priority,
      estimatedWordCount,
      relatedKeywords
    }
  })
  
  return strategies
}

// Generate summary statistics
function generateSummary(strategies: KeywordStrategy[]): void {
  console.log('\n📈 Analysis Summary:')
  console.log('='.repeat(50))
  
  const total = strategies.length
  const needNewPages = strategies.filter(s => s.needsNewPage).length
  const enhanceExisting = strategies.filter(s => !s.needsNewPage).length
  
  console.log(`Total Keywords: ${total}`)
  console.log(`Need New Pages: ${needNewPages}`)
  console.log(`Enhance Existing: ${enhanceExisting}`)
  
  console.log('\nBy Priority:')
  console.log(`  High: ${strategies.filter(s => s.priority === 'high').length}`)
  console.log(`  Medium: ${strategies.filter(s => s.priority === 'medium').length}`)
  console.log(`  Low: ${strategies.filter(s => s.priority === 'low').length}`)
  
  console.log('\nBy Content Type:')
  console.log(`  Landing Pages: ${strategies.filter(s => s.contentType === 'landing-page').length}`)
  console.log(`  Category Pages: ${strategies.filter(s => s.contentType === 'category').length}`)
  console.log(`  Area Pages: ${strategies.filter(s => s.contentType === 'area').length}`)
  console.log(`  Enhance Existing: ${strategies.filter(s => s.contentType === 'enhance-existing').length}`)
  
  console.log('\nBy Intent:')
  console.log(`  Informational: ${strategies.filter(s => s.intent === 'informational').length}`)
  console.log(`  Transactional: ${strategies.filter(s => s.intent === 'transactional').length}`)
  console.log(`  Navigational: ${strategies.filter(s => s.intent === 'navigational').length}`)
  
  console.log('\nTop 10 High Priority Keywords:')
  strategies
    .filter(s => s.priority === 'high')
    .slice(0, 10)
    .forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.keyword} (${s.searchVolume} vol, pos: ${s.position})`)
    })
}

// Main execution
async function main() {
  const csvPath = path.join(__dirname, '..', 'position_tracking_report.csv')
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath)
    console.log('Please ensure position_tracking_report.csv is in the project root')
    process.exit(1)
  }
  
  const strategies = analyzeKeywords(csvPath)
  
  // Generate summary
  generateSummary(strategies)
  
  // Save to JSON
  const outputPath = path.join(__dirname, '..', 'data', 'keyword-seo-strategy.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(strategies, null, 2))
  
  console.log(`\n✅ Strategy saved to: ${outputPath}`)
  console.log('\nNext steps:')
  console.log('1. Review the strategy file')
  console.log('2. Run content generator for new pages')
  console.log('3. Enhance existing pages')
  console.log('4. Update sitemap')
}

main().catch(console.error)

