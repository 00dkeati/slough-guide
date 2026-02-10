#!/usr/bin/env tsx

/**
 * Editorial Page Generator for Slough Directory
 * 
 * Automatically generates SEO-optimized editorial pages for Slough keywords
 * with dynamic internal linking and sitemap updates.
 */

import fs from 'fs/promises'
import path from 'path'
import { execSync } from 'child_process'

// Types
interface GenerationLog {
  keyword: string
  slug: string
  action: 'created' | 'skipped-exists' | 'created-variant'
  filepath: string
  date: string
}

interface KeywordCategory {
  name: string
  keywords: string[]
  template: string
}

interface RelatedLink {
  keyword: string
  slug: string
  score: number
}

// Configuration
const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.slough.co'
const EDITORIAL_DIR = path.join(process.cwd(), 'app', 'editorial', '[slug]')
const INPUT_FILE = path.join(process.cwd(), 'scripts', 'input', 'editorial-keywords.txt')
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output')
const LOG_FILE = path.join(OUTPUT_DIR, 'editorial-generation-log.json')

// Keyword categories for content generation
const KEYWORD_CATEGORIES: KeywordCategory[] = [
  {
    name: 'retail',
    keywords: ['sainsburys', 'asda', 'wickes', 'argos', 'matalan', 'dfs', 'kwik fit', 'm&s', 'specsavers', 'dominos', 'mcdonalds', 'shops', 'retail park', 'tk maxx', 'waitrose', 'boots', 'iceland', 'b&q'],
    template: 'retail'
  },
  {
    name: 'employment',
    keywords: ['jobs', 'vacancies', 'part time', 'full time', 'indeed', 'job centre'],
    template: 'employment'
  },
  {
    name: 'property',
    keywords: ['houses for sale', 'estate agents', 'new builds', 'rent', 'rightmove', 'zoopla', 'flats to rent', 'used cars', 'car sales'],
    template: 'property'
  },
  {
    name: 'healthcare',
    keywords: ['dentist', 'dental studio', 'orthodontics', 'orthodontist', 'orthodontic practice', 'doctors', 'doctors surgery', 'medical centre', 'health centre', 'gp', 'vets', 'pharmacy'],
    template: 'healthcare'
  },
  {
    name: 'beauty',
    keywords: ['hairdressers', 'barbers', 'massage', 'nails', 'nail salon', 'nail bar', 'spa', 'salon'],
    template: 'beauty'
  },
  {
    name: 'food',
    keywords: ['restaurants', 'chinese', 'indian', 'kebab', 'fish and chips', 'cafe', 'breakfast', 'food', 'noodle bar', 'kebab house'],
    template: 'food'
  },
  {
    name: 'leisure',
    keywords: ['horizon', 'gym', 'puregym', 'swimming', 'pool', 'golf', 'golf course', 'golf club', 'boxing', 'boxing club', 'archery', 'air rifle club', 'rifle club', 'bowls club', 'cricket club', 'football', 'fc', 'soft play', 'play cafe', 'kids play', 'kids cafe', 'kids party', 'snooker club', 'bridge club', 'motorcycle club', 'mx club', 'gymnastics', 'karate', 'kickboxing', 'yoga'],
    template: 'leisure'
  },
  {
    name: 'services',
    keywords: ['taxis', 'garage', 'locksmith', 'nursery', 'van hire', 'carpets', 'windows', 'builders', 'electrician', 'crash repair', 'hand car wash', 'key cutting', 'ear wax removal', 'driving school', 'upholstery', 'vape shop', 'vineyard', 'van sales', 'vine medical', 'village hall', 'scrap yard', 'windows ltd'],
    template: 'services'
  },
  {
    name: 'weather',
    keywords: ['weather', 'forecast', 'bbc weather', 'met office', '10 day', '14 day', '7 days', '30 day', 'tomorrow', 'today'],
    template: 'weather'
  },
  {
    name: 'transport',
    keywords: ['station', 'bus routes', 'bus', 'parking', 'car park', 'portsmouth', 'delivery office', 'royal mail', 'post office'],
    template: 'transport'
  },
  {
    name: 'community',
    keywords: ['community centre', 'asylum seekers', 'migrants', 'protest', 'news', 'events', 'festival', 'fete', 'market', 'christmas market', 'xmas market', 'car show', 'fireworks', 'art trail', 'nature trail', 'recreation ground', 'cemetery', 'fire station', 'library', 'church', 'baptist church', 'catholic church', 'kingdom hall', 'food bank', 'charity shops', 'dump', 'amenity tip', 'refuse tip', 'waste', 'recycling', 'bin collection', 'hwrc', 'waste recycling'],
    template: 'community'
  },
  {
    name: 'location',
    keywords: ['postcode', 'po7', 'po8', 'map', 'hampshire', 'uk', 'county', 'population', 'named after', 'origin', 'memories', 'old photos', 'obituaries'],
    template: 'location'
  }
]

// Content templates
const CONTENT_TEMPLATES = {
  retail: (keyword: string) => ({
    intro: `Looking for ${keyword} in Slough? You'll find excellent options in our town centre and retail park. Whether you're shopping for essentials or treating yourself, Slough offers convenient access to major retailers and local businesses.`,
    guidance: `The main shopping areas in Slough include the town centre on London Road and the retail park. Most stores are easily accessible by car with good parking facilities, or you can take the bus routes 8, 37, or 39 from surrounding areas like Langley, Cippenham, and Chalvey.`,
    local: `Slough's retail offerings serve not just the town itself but also nearby communities including Horndean, Widley, and Clanfield. The retail park is particularly popular for larger purchases, while the town centre offers a more traditional shopping experience.`,
    practical: `Most retail stores in Slough operate standard business hours, typically 9am-6pm Monday to Saturday, with some opening on Sundays. Parking is available at the retail park and in the town centre car park. The Horizon leisure centre is nearby if you want to combine shopping with other activities.`
  }),
  
  employment: (keyword: string) => ({
    intro: `Finding ${keyword} in Slough and the surrounding area is easier than you might think. With a growing local economy and proximity to Portsmouth and Havant, there are opportunities across various sectors.`,
    guidance: `Check local job boards, visit the job centre on London Road, or explore opportunities at the retail park and industrial estate. Many positions are also available in nearby areas like Langley, Cippenham, and Chalvey.`,
    local: `Slough's job market benefits from its location between Portsmouth and Havant, offering opportunities in retail, healthcare, education, and services. The town also has a growing number of local businesses and startups.`,
    practical: `The job centre is located on London Road and is easily accessible by bus routes 8, 37, and 39. Many employers in the area offer flexible working arrangements, and there are good transport links to Portsmouth and Havant for commuters.`
  }),
  
  property: (keyword: string) => ({
    intro: `Whether you're looking to buy, rent, or sell property in Slough, the local market offers a range of options from family homes to modern developments. The town's excellent location and amenities make it a popular choice for families and professionals.`,
    guidance: `Start by checking online property portals and visiting local estate agents. Slough has several established agents who know the area well. Consider nearby areas like Langley, Cippenham, and Chalvey for additional options.`,
    local: `Slough's property market is influenced by its proximity to Portsmouth, good schools, and excellent transport links. The town offers a mix of period properties, modern developments, and new build opportunities.`,
    practical: `Property viewings are typically arranged through estate agents, and most are available evenings and weekends. The town centre has good parking, and properties are well-connected by bus routes 8, 37, and 39.`
  }),
  
  healthcare: (keyword: string) => ({
    intro: `Accessing quality ${keyword} in Slough is straightforward with several excellent practices and facilities serving the local community. The town's healthcare services are well-regarded and easily accessible.`,
    guidance: `Slough has a health centre on Milton Road and Dryden Close, plus several private practices. For specialist care, you're well-positioned to access services in Portsmouth and Havant. Register with a local practice to access NHS services.`,
    local: `The healthcare services in Slough serve not just the town but also surrounding areas like Langley, Cippenham, and Chalvey. Many practices offer extended hours and emergency appointments.`,
    practical: `Most healthcare facilities are easily accessible by car with parking available, or by bus routes 8, 37, and 39. The health centre is located near the town centre, making it convenient for most residents.`
  }),
  
  beauty: (keyword: string) => ({
    intro: `Slough offers excellent ${keyword} services with a range of salons and professionals to choose from. Whether you're looking for a quick trim or a full treatment, you'll find quality services in the town centre and surrounding areas.`,
    guidance: `Check out the salons on London Road and in the town centre. Many offer online booking, and it's worth booking ahead for popular services. Consider nearby areas like Langley and Cippenham for additional options.`,
    local: `Slough's beauty services cater to the local community and visitors from surrounding areas. The town has a good mix of established salons and newer, modern facilities.`,
    practical: `Most salons are open Tuesday to Saturday, with some offering Sunday appointments. Parking is available in the town centre, and the salons are easily accessible by bus routes 8, 37, and 39.`
  }),
  
  food: (keyword: string) => ({
    intro: `Slough's ${keyword} scene offers something for everyone, from traditional British fare to international cuisine. The town centre and surrounding areas boast a variety of restaurants, cafes, and takeaways.`,
    guidance: `Explore the restaurants on London Road and in the town centre. Many offer delivery services, and some have outdoor seating. Don't forget to check out the options in nearby Langley and Cippenham.`,
    local: `Slough's food scene reflects the town's diverse community, with options ranging from traditional fish and chips to modern international cuisine. The town is well-served by both independent and chain restaurants.`,
    practical: `Most restaurants are open for lunch and dinner, with some offering breakfast. Parking is available in the town centre, and many establishments are accessible by bus routes 8, 37, and 39.`
  }),
  
  leisure: (keyword: string) => ({
    intro: `Slough offers excellent ${keyword} facilities and activities for all ages and interests. From the Horizon leisure centre to local clubs and societies, there's plenty to keep you active and engaged.`,
    guidance: `The Horizon leisure centre is the main facility, offering swimming, gym, and various classes. Local clubs and societies meet regularly, and many offer taster sessions for new members.`,
    local: `Slough's leisure facilities serve the local community and visitors from surrounding areas like Langley, Cippenham, and Chalvey. The town has a strong community spirit with many active groups.`,
    practical: `The Horizon leisure centre is easily accessible by car with parking available, or by bus routes 8, 37, and 39. Many clubs and societies meet in the community centre or local venues.`
  }),
  
  services: (keyword: string) => ({
    intro: `Finding reliable ${keyword} in Slough is easy with a range of local businesses and professionals serving the community. The town's service providers are known for their quality and customer service.`,
    guidance: `Check local directories, ask for recommendations from neighbors, or search online for reviews. Many services offer quotes and can be booked in advance. Consider nearby areas like Langley and Cippenham for additional options.`,
    local: `Slough's service providers serve the local community and surrounding areas. The town has a good mix of established businesses and newer services, many of which are family-run.`,
    practical: `Most services are available during business hours, with some offering evening and weekend appointments. The town centre is easily accessible by car with parking available, or by bus routes 8, 37, and 39.`
  }),
  
  weather: (keyword: string) => ({
    intro: `Staying informed about ${keyword} in Slough is essential for planning your day and activities. The town's weather is typical of the South Coast, with mild winters and pleasant summers.`,
    guidance: `Check the Met Office or BBC Weather for the most accurate forecasts. Local weather can vary from the coast, so it's worth checking specific forecasts for Slough and the surrounding area.`,
    local: `Slough's weather is influenced by its inland location in Berkshire, generally being slightly warmer and drier than coastal areas. The town enjoys good weather for outdoor activities at the Horizon leisure centre and local parks.`,
    practical: `Weather forecasts are available online, on mobile apps, and through local news sources. The town's location makes it suitable for outdoor activities most of the year, with good access to indoor facilities when needed.`
  }),
  
  transport: (keyword: string) => ({
    intro: `Getting around Slough and connecting to surrounding areas is straightforward with good transport links. The town is well-connected by road and public transport, making it easy to access Portsmouth, Havant, and beyond.`,
    guidance: `Bus routes 8, 37, and 39 connect Slough to Portsmouth, Havant, and surrounding areas. The town centre has good parking facilities, and there are regular services throughout the day.`,
    local: `Slough's transport links make it easy to access nearby areas like Langley, Cippenham, and Chalvey, as well as larger towns like Portsmouth and Havant. The town is well-positioned for commuters.`,
    practical: `Bus services run regularly during the day, with reduced services in the evening and on Sundays. The town centre has good parking facilities, and there are regular connections to Portsmouth and Havant.`
  }),
  
  community: (keyword: string) => ({
    intro: `Slough's ${keyword} reflects the town's strong community spirit and active local life. The town has a vibrant community with regular events, activities, and services for residents.`,
    guidance: `Check the community centre, local noticeboards, and online community groups for information about events and activities. Many community services are available to residents and visitors.`,
    local: `Slough's community services serve the local area and surrounding communities. The town has a strong sense of community with many active groups and regular events.`,
    practical: `Community facilities are easily accessible by car with parking available, or by bus routes 8, 37, and 39. Many services are available during business hours, with some offering evening and weekend access.`
  }),
  
  location: (keyword: string) => ({
    intro: `Slough's ${keyword} tells the story of a thriving Berkshire town with a rich history and bright future. Located between Portsmouth and Havant, the town offers the perfect balance of urban convenience and community charm.`,
    guidance: `Explore the town centre, visit local landmarks, and discover the history of the area. Slough is well-connected to surrounding areas and offers easy access to the South Coast.`,
    local: `Slough serves as a hub for surrounding areas including Langley, Cippenham, and Chalvey. The town's location makes it ideal for families and professionals working in the wider area.`,
    practical: `The town is easily accessible by car via the A3 and A3(M), with good parking facilities. Bus routes 8, 37, and 39 provide regular connections to Portsmouth, Havant, and surrounding areas.`
  })
}

// Utility functions
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function getCategoryForKeyword(keyword: string): string {
  const lowerKeyword = keyword.toLowerCase()
  for (const category of KEYWORD_CATEGORIES) {
    if (category.keywords.some(k => lowerKeyword.includes(k))) {
      return category.name
    }
  }
  return 'general'
}

function generateContent(keyword: string): string {
  const category = getCategoryForKeyword(keyword)
  const template = CONTENT_TEMPLATES[category as keyof typeof CONTENT_TEMPLATES] || CONTENT_TEMPLATES.location
  const content = template(keyword)
  
  return `## ${keyword} in Slough

${content.intro}

### What You Need to Know

${content.guidance}

### Local Context

${content.local}

### Practical Information

${content.practical}

### About Slough

Slough is a thriving town in Berkshire, perfectly positioned between Portsmouth and Havant. With excellent transport links, quality schools, and a strong community spirit, it's an ideal place to live, work, and visit. The town offers a great mix of traditional charm and modern amenities, making it popular with families and professionals alike.

Whether you're looking for shopping, dining, leisure activities, or services, Slough has something to offer everyone. The town's central location makes it easy to access the South Coast, London, and other major destinations while enjoying the benefits of a close-knit community.`
}

function findRelatedKeywords(keyword: string, allKeywords: string[], excludeSlug: string): RelatedLink[] {
  const keywordTokens = keyword.toLowerCase().split(/\s+/)
  const related: RelatedLink[] = []
  
  for (const otherKeyword of allKeywords) {
    if (otherKeyword === keyword) continue
    
    const otherSlug = slugify(otherKeyword)
    if (otherSlug === excludeSlug) continue
    
    const otherTokens = otherKeyword.toLowerCase().split(/\s+/)
    let score = 0
    
    // Check for token overlap
    for (const token of keywordTokens) {
      if (otherTokens.includes(token)) {
        score += 2
      }
    }
    
    // Check for substring matches
    if (otherKeyword.toLowerCase().includes(keyword.toLowerCase()) || 
        keyword.toLowerCase().includes(otherKeyword.toLowerCase())) {
      score += 1
    }
    
    if (score > 0) {
      related.push({ keyword: otherKeyword, slug: otherSlug, score })
    }
  }
  
  return related
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

function generateInternalLinks(relatedLinks: RelatedLink[]): string {
  const links = relatedLinks.map(link => 
    `- [${link.keyword}](/editorial/${link.slug})`
  ).join('\n')
  
  return `### Related Topics

${links}

- [Slough Directory Homepage](/)`
}

function generatePageContent(keyword: string, relatedLinks: RelatedLink[]): string {
  const content = generateContent(keyword)
  const internalLinks = generateInternalLinks(relatedLinks)
  const slug = slugify(keyword)
  
  return `import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import TopNav from '@/app/(site)/components/TopNav'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: \`${keyword} in Slough – Local Guide, Info & Tips\`,
    description: \`Everything you need to know about ${keyword} in Slough. Local guide with practical information, tips, and insights for residents and visitors.\`,
    openGraph: {
      title: \`${keyword} in Slough – Local Guide, Info & Tips\`,
      description: \`Everything you need to know about ${keyword} in Slough. Local guide with practical information, tips, and insights for residents and visitors.\`,
      type: 'article',
    },
    alternates: {
      canonical: \`/editorial/${slug}\`,
    },
  }
}

export default function EditorialPage() {
  const content = \`${content.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
  const internalLinks = \`${internalLinks.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`
  
  return (
    <>
      <TopNav />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "${keyword} in Slough – Local Guide, Info & Tips",
            "description": "Everything you need to know about ${keyword} in Slough. Local guide with practical information, tips, and insights for residents and visitors.",
            "author": {
              "@type": "Organization",
              "name": "Slough.co"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Slough Directory",
              "url": "${SITE_BASE_URL}"
            },
            "datePublished": "${new Date().toISOString()}",
            "dateModified": "${new Date().toISOString()}",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "${SITE_BASE_URL}/editorial/${slug}"
            }
          })
        }}
      />

      <main className="pt-20 lg:pt-24">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/editorial" className="hover:text-green-600 transition-colors">Editorial</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">${keyword}</span>
          </nav>

          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden mb-8">
            <div className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight text-balance">
                ${keyword} – Everything You Need to Know in Slough
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.replace(/\\n/g, '<br>') }} />
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div dangerouslySetInnerHTML={{ __html: internalLinks.replace(/\\n/g, '<br>') }} />
              </div>
            </div>
          </article>

          {/* Back to Editorial */}
          <div className="text-center mb-12">
            <Link 
              href="/editorial"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}`
}

async function checkFileExists(filepath: string): Promise<boolean> {
  try {
    await fs.access(filepath)
    return true
  } catch {
    return false
  }
}

async function generateSlug(keyword: string, allSlugs: Set<string>): Promise<string> {
  let baseSlug = slugify(keyword)
  let slug = baseSlug
  
  if (allSlugs.has(slug)) {
    // Try variants
    const variants = ['-guide', '-info', '-2025']
    for (const variant of variants) {
      slug = baseSlug + variant
      if (!allSlugs.has(slug)) {
        break
      }
    }
  }
  
  allSlugs.add(slug)
  return slug
}

async function updateSitemap(generatedPages: GenerationLog[]): Promise<void> {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml')
  const now = new Date().toISOString()
  
  let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_BASE_URL}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`
  
  // Add existing editorial pages (we'll need to scan the directory)
  try {
    const editorialDir = path.join(process.cwd(), 'app', 'editorial', '[slug]')
    const files = await fs.readdir(editorialDir)
    
    for (const file of files) {
      if (file.endsWith('.tsx') && file !== 'page.tsx') {
        const slug = file.replace('.tsx', '')
        sitemapContent += `
  <url>
    <loc>${SITE_BASE_URL}/editorial/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
      }
    }
  } catch (error) {
    console.warn('Could not scan existing editorial pages:', error)
  }
  
  // Add newly generated pages
  for (const page of generatedPages) {
    if (page.action === 'created' || page.action === 'created-variant') {
      sitemapContent += `
  <url>
    <loc>${SITE_BASE_URL}/editorial/${page.slug}</loc>
    <lastmod>${page.date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    }
  }
  
  sitemapContent += `
</urlset>`
  
  await fs.writeFile(sitemapPath, sitemapContent)
  console.log(`✅ Updated sitemap.xml with ${generatedPages.length} new pages`)
}

async function updateRobotsTxt(): Promise<void> {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt')
  
  let robotsContent = ''
  try {
    robotsContent = await fs.readFile(robotsPath, 'utf-8')
  } catch {
    robotsContent = 'User-agent: *\nAllow: /\n'
  }
  
  if (!robotsContent.includes('Sitemap:')) {
    robotsContent += `\nSitemap: ${SITE_BASE_URL}/sitemap.xml`
  }
  
  if (!robotsContent.includes('Allow: /editorial/')) {
    robotsContent = robotsContent.replace('Allow: /', 'Allow: /\nAllow: /editorial/')
  }
  
  await fs.writeFile(robotsPath, robotsContent)
  console.log('✅ Updated robots.txt')
}

async function runBuildCheck(): Promise<void> {
  try {
    console.log('🔨 Running build check...')
    execSync('npm run build', { stdio: 'pipe' })
    console.log('✅ Build check passed - no errors found')
  } catch (error) {
    console.error('❌ Build check failed:')
    console.error(error.toString())
    process.exit(1)
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const overwrite = args.includes('--overwrite')
  const onlyKeyword = args.find(arg => arg.startsWith('--only='))?.split('=')[1]
  const matchPattern = args.find(arg => arg.startsWith('--match='))?.split('=')[1]
  
  console.log('🚀 Starting editorial page generation...')
  console.log(`📁 Input file: ${INPUT_FILE}`)
  console.log(`📁 Output directory: ${OUTPUT_DIR}`)
  
  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  
  // Read keywords
  const keywordsContent = await fs.readFile(INPUT_FILE, 'utf-8')
  let keywords = keywordsContent.split('\n').map(k => k.trim()).filter(k => k.length > 0)
  
  // Apply filters
  if (onlyKeyword) {
    keywords = keywords.filter(k => k.toLowerCase() === onlyKeyword.toLowerCase())
    console.log(`🎯 Filtering to only: ${onlyKeyword}`)
  }
  
  if (matchPattern) {
    const regex = new RegExp(matchPattern, 'i')
    keywords = keywords.filter(k => regex.test(k))
    console.log(`🔍 Filtering by pattern: ${matchPattern}`)
  }
  
  console.log(`📝 Processing ${keywords.length} keywords...`)
  
  const generatedPages: GenerationLog[] = []
  const allSlugs = new Set<string>()
  
  // Process each keyword
  for (const keyword of keywords) {
    const slug = await generateSlug(keyword, allSlugs)
    const filepath = path.join(EDITORIAL_DIR, `${slug}.tsx`)
    
    // Check if file exists
    const exists = await checkFileExists(filepath)
    if (exists && !overwrite) {
      console.log(`⏭️  exists: ${slug}`)
      generatedPages.push({
        keyword,
        slug,
        action: 'skipped-exists',
        filepath,
        date: new Date().toISOString()
      })
      continue
    }
    
    // Generate content
    const relatedLinks = findRelatedKeywords(keyword, keywords, slug)
    const pageContent = generatePageContent(keyword, relatedLinks)
    
    // Write file
    await fs.writeFile(filepath, pageContent)
    
    const action = exists ? 'created-variant' : 'created'
    console.log(`✅ ${action}: ${slug}`)
    
    generatedPages.push({
      keyword,
      slug,
      action,
      filepath,
      date: new Date().toISOString()
    })
  }
  
  // Write generation log
  await fs.writeFile(LOG_FILE, JSON.stringify(generatedPages, null, 2))
  
  // Update sitemap and robots.txt
  await updateSitemap(generatedPages)
  await updateRobotsTxt()
  
  // Run build check
  await runBuildCheck()
  
  // Print summary
  const created = generatedPages.filter(p => p.action === 'created').length
  const variants = generatedPages.filter(p => p.action === 'created-variant').length
  const skipped = generatedPages.filter(p => p.action === 'skipped-exists').length
  
  console.log('\n📊 Generation Summary:')
  console.log(`✅ Created: ${created}`)
  console.log(`🔄 Created variants: ${variants}`)
  console.log(`⏭️  Skipped (exists): ${skipped}`)
  console.log(`📄 Total processed: ${generatedPages.length}`)
  console.log(`📝 Log saved to: ${LOG_FILE}`)
  
  console.log('\n🎉 Editorial page generation complete!')
}

// Run the script
if (require.main === module) {
  main().catch(console.error)
}

export { main }
