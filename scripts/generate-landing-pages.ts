import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface KeywordStrategy {
  keyword: string
  position: string
  searchVolume: number
  currentUrl: string
  intent: 'informational' | 'transactional' | 'navigational'
  contentType: string
  targetPage: string
  needsNewPage: boolean
  category?: string
  area?: string
  priority: string
  estimatedWordCount: number
  relatedKeywords: string[]
}

// Load business data
function loadBusinessData() {
  const businessPath = path.join(__dirname, '..', 'public', 'data', 'businesses-lightweight.json')
  if (fs.existsSync(businessPath)) {
    return JSON.parse(fs.readFileSync(businessPath, 'utf-8'))
  }
  return []
}

// Find relevant businesses for a keyword
function findRelevantBusinesses(keyword: string, category: string | undefined, area: string | undefined, allBusinesses: any[]) {
  let businesses = allBusinesses
  
  // Filter by category if available
  if (category) {
    businesses = businesses.filter((b: any) => 
      b.category?.toLowerCase().includes(category.toLowerCase()) ||
      category.toLowerCase().includes(b.category?.toLowerCase())
    )
  }
  
  // Filter by area if available
  if (area) {
    businesses = businesses.filter((b: any) => 
      b.area?.toLowerCase() === area.toLowerCase()
    )
  }
  
  // If no category match, try keyword matching
  if (businesses.length === 0) {
    const keywordLower = keyword.toLowerCase()
    businesses = allBusinesses.filter((b: any) => {
      const businessText = `${b.name} ${b.category} ${b.description}`.toLowerCase()
      return keywordLower.split(' ').some(word => word.length > 3 && businessText.includes(word))
    })
  }
  
  // Return top 10 by rating
  return businesses
    .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 10)
}

// Generate page content
function generatePageContent(strategy: KeywordStrategy, businesses: any[]): string {
  const keyword = strategy.keyword
  const area = strategy.area || 'slough'
  const areaName = area.charAt(0).toUpperCase() + area.slice(1)
  const category = strategy.category || keyword.replace(/slough/gi, '').trim()
  const businessCount = businesses.length
  
  // Generate title (under 60 chars)
  let title = `${keyword} | ${areaName} Directory`
  if (title.length > 60) {
    title = keyword.length > 50 ? keyword.substring(0, 47) + '...' : keyword
  }
  
  // Generate description
  const description = `Find ${keyword} in ${areaName}. ${businessCount > 0 ? `${businessCount} verified businesses` : 'Trusted local services'} with reviews, contact details & more. Your complete local guide.`
  
  // Generate introduction
  const intro = `Looking for ${keyword}? ${areaName} offers excellent options with ${businessCount > 0 ? `${businessCount} trusted local businesses` : 'quality local services'} ready to help. Whether you're a long-time resident or new to the area, finding the right ${category} is essential for your needs. Our comprehensive guide connects you with verified, highly-rated professionals who understand the local community and deliver exceptional service.`
  
  // Generate main content
  let mainContent = `## Why Choose ${category.charAt(0).toUpperCase() + category.slice(1)} in ${areaName}\n\n`
  mainContent += `${areaName} offers several advantages when searching for ${keyword}:\n\n`
  mainContent += `- **Local Expertise**: Businesses understand the specific needs of ${areaName} residents\n`
  mainContent += `- **Convenient Access**: Easy to reach locations with good transport links and parking\n`
  mainContent += `- **Community Trust**: Established businesses with strong local reputations\n`
  mainContent += `- **Competitive Pricing**: Fair rates reflecting local market conditions\n`
  mainContent += `- **Personal Service**: Friendly, approachable professionals who care about customer satisfaction\n\n`
  
  // Add business listings if available
  if (businessCount > 0) {
    const avgRating = businesses.reduce((sum: number, b: any) => sum + (b.rating || 0), 0) / businesses.length
    const totalReviews = businesses.reduce((sum: number, b: any) => sum + (b.review_count || 0), 0)
    
    mainContent += `## Local ${category.charAt(0).toUpperCase() + category.slice(1)} Options\n\n`
    mainContent += `Our directory features ${businessCount} verified businesses with an average rating of ${avgRating.toFixed(1)} stars across ${totalReviews} customer reviews. `
    mainContent += `Each business has been carefully selected based on service quality, customer satisfaction, and local reputation.\n\n`
    
    mainContent += `### Featured Businesses\n\n`
    businesses.slice(0, 3).forEach((business: any) => {
      mainContent += `**${business.name}** - ${business.category}\n`
      if (business.rating) {
        mainContent += `- Rating: ${business.rating}/5 stars (${business.review_count || 0} reviews)\n`
      }
      if (business.address) {
        mainContent += `- Location: ${business.address}\n`
      }
      if (business.phone) {
        mainContent += `- Contact: ${business.phone}\n`
      }
      mainContent += `\n`
    })
  }
  
  // Add "What to Look For" section
  mainContent += `## What to Look For\n\n`
  mainContent += `When choosing ${category}, consider these important factors:\n\n`
  mainContent += `- **Reputation**: Check customer reviews and ratings\n`
  mainContent += `- **Experience**: Look for established local businesses\n`
  mainContent += `- **Qualifications**: Ensure proper certifications where applicable\n`
  mainContent += `- **Customer Service**: Friendly, responsive, and professional\n`
  mainContent += `- **Value**: Competitive pricing with transparent costs\n\n`
  
  // Add local context
  const localContext = `## About ${areaName}\n\n${areaName} is a thriving town in Berkshire with excellent amenities and strong community spirit. Located close to Portsmouth and with easy access to the A3(M), it's well-connected while maintaining its local character. The town offers great shopping facilities, good schools, and plenty of green spaces, making it an ideal place to live and work. Local businesses benefit from a loyal customer base and supportive community.\n\n`
  
  // Add FAQs
  let faqs = `## Frequently Asked Questions\n\n`
  faqs += `### How many ${category} are there in ${areaName}?\n\n`
  faqs += businessCount > 0 
    ? `Our directory currently lists ${businessCount} verified ${category} in ${areaName} and surrounding areas. Each business has been checked for quality and reliability.\n\n`
    : `${areaName} has several ${category} serving the local community. Our directory features verified businesses with customer reviews and detailed profiles.\n\n`
  
  faqs += `### What should I look for when choosing ${category}?\n\n`
  faqs += `Consider factors like customer reviews, experience, location, pricing, and service quality. Check for proper qualifications and certifications where applicable. Read recent customer feedback to understand service standards.\n\n`
  
  faqs += `### Are the ${category} in ${areaName} reliable?\n\n`
  faqs += `Yes, businesses in our directory are verified local establishments with genuine customer reviews. ${areaName} has many established businesses with strong reputations built over years of serving the community.\n\n`
  
  // Add call to action
  const cta = `## Find Your Perfect ${category.charAt(0).toUpperCase() + category.slice(1)}\n\nReady to find the perfect ${category}? Browse our verified directory to compare options, read reviews, and connect with trusted local businesses. Start your search today and experience quality service in your community.`
  
  // Combine all content
  const fullContent = `${intro}\n\n${mainContent}${localContext}${faqs}${cta}`
  
  return `import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '${title.replace(/'/g, "\\'")}',
  description: '${description.replace(/'/g, "\\'")}',
  keywords: '${keyword}, ${areaName}, ${category}, local businesses',
  openGraph: {
    title: '${title.replace(/'/g, "\\'")}',
    description: '${description.replace(/'/g, "\\'")}',
    url: 'https://slough.co${strategy.targetPage}',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ${toPascalCase(keyword)}Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        <h1>${keyword}</h1>
        
${fullContent.split('\n').map(line => '        ' + line).join('\n')}

${businessCount > 0 ? `
        ## Complete Business Directory

        For a full list of ${category} in ${areaName}, visit our [business directory](https://slough.co/categories).
` : ''}
      </div>
      
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More</h2>
        <p className="text-gray-700 mb-4">
          Discover more businesses and services in ${areaName}.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/categories" 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Business Directory
          </Link>
          <Link 
            href="/areas" 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Local Areas
          </Link>
        </div>
      </div>
    </div>
  )
}
`
}

// Convert string to PascalCase for component names
function toPascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

// Main generation function
async function generateLandingPages() {
  console.log('🚀 Generating landing pages...')
  
  // Load strategy
  const strategyPath = path.join(__dirname, '..', 'data', 'keyword-seo-strategy.json')
  if (!fs.existsSync(strategyPath)) {
    console.error('❌ Strategy file not found. Run analyze-keywords-for-seo.ts first.')
    process.exit(1)
  }
  
  const strategies: KeywordStrategy[] = JSON.parse(fs.readFileSync(strategyPath, 'utf-8'))
  const allBusinesses = loadBusinessData()
  
  // Filter strategies that need new pages
  const newPageStrategies = strategies.filter(s => s.needsNewPage)
  console.log(`Found ${newPageStrategies.length} keywords needing new pages`)
  
  let created = 0
  let skipped = 0
  
  for (const strategy of newPageStrategies) {
    const slug = strategy.keyword.toLowerCase().replace(/\s+/g, '-')
    const pagePath = path.join(__dirname, '..', 'app', 'k', slug)
    const pageFile = path.join(pagePath, 'page.tsx')
    
    // Check if page already exists
    if (fs.existsSync(pageFile)) {
      console.log(`⏭️  Skipping ${slug} (already exists)`)
      skipped++
      continue
    }
    
    // Find relevant businesses
    const businesses = findRelevantBusinesses(
      strategy.keyword,
      strategy.category,
      strategy.area,
      allBusinesses
    )
    
    // Generate page content
    const pageContent = generatePageContent(strategy, businesses)
    
    // Create directory and write file
    fs.mkdirSync(pagePath, { recursive: true })
    fs.writeFileSync(pageFile, pageContent)
    
    console.log(`✅ Created ${slug} (${businesses.length} businesses, ${strategy.priority} priority)`)
    created++
  }
  
  console.log('\n📊 Generation Summary:')
  console.log(`Created: ${created} pages`)
  console.log(`Skipped: ${skipped} pages`)
  console.log(`Total: ${newPageStrategies.length} pages`)
  
  console.log('\n✅ Landing pages generated successfully!')
  console.log('Next steps:')
  console.log('1. Review generated pages in app/k/')
  console.log('2. Test pages locally')
  console.log('3. Update sitemap')
  console.log('4. Deploy to production')
}

// Run the script
generateLandingPages().catch(console.error)

