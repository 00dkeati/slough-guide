#!/usr/bin/env tsx

/**
 * Simple Editorial Page Generator for Slough Directory
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

// Configuration
const SITE_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.slough.co'
const EDITORIAL_DIR = path.join(process.cwd(), 'app', 'editorial', '[slug]')
const INPUT_FILE = path.join(process.cwd(), 'scripts', 'input', 'editorial-keywords.txt')
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output')
const LOG_FILE = path.join(OUTPUT_DIR, 'editorial-generation-log.json')

// Utility functions
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function generateContent(keyword: string): string {
  return `## ${keyword} in Slough

Looking for ${keyword} in Slough? You'll find excellent options throughout the town and surrounding areas. Whether you're a local resident or visiting the area, Slough offers convenient access to a wide range of services and amenities.

### What You Need to Know

Slough is well-connected with good transport links via bus routes 8, 37, and 39, making it easy to access from surrounding areas like Langley, Cippenham, and Chalvey. The town centre offers convenient parking and is easily accessible by car or public transport.

### Local Context

Slough serves as a hub for the local community, with many services and businesses catering to residents from the wider area. The town's central location makes it ideal for accessing various amenities and services.

### Practical Information

Most services in Slough operate standard business hours, typically 9am-6pm Monday to Saturday, with some offering Sunday services. The town centre has good parking facilities, and many establishments are accessible by public transport.

### About Slough

Slough is a thriving town in Berkshire, perfectly positioned between Portsmouth and Havant. With excellent transport links, quality schools, and a strong community spirit, it's an ideal place to live, work, and visit. The town offers a great mix of traditional charm and modern amenities, making it popular with families and professionals alike.

Whether you're looking for shopping, dining, leisure activities, or services, Slough has something to offer everyone. The town's central location makes it easy to access the South Coast, London, and other major destinations while enjoying the benefits of a close-knit community.`
}

function generateInternalLinks(keyword: string, allKeywords: string[]): string {
  // Find related keywords
  const keywordTokens = keyword.toLowerCase().split(/\s+/)
  const related: string[] = []
  
  for (const otherKeyword of allKeywords) {
    if (otherKeyword === keyword) continue
    
    const otherTokens = otherKeyword.toLowerCase().split(/\s+/)
    let score = 0
    
    // Check for token overlap
    for (const token of keywordTokens) {
      if (otherTokens.includes(token)) {
        score += 2
      }
    }
    
    if (score > 0) {
      related.push(otherKeyword)
    }
  }
  
  // Take top 3 related keywords
  const topRelated = related.slice(0, 3)
  
  let links = '### Related Topics\n\n'
  for (const relatedKeyword of topRelated) {
    const slug = slugify(relatedKeyword)
    links += `- [${relatedKeyword}](/editorial/${slug})\n`
  }
  links += '\n- [Slough Directory Homepage](/)'
  
  return links
}

function generatePageContent(keyword: string, allKeywords: string[]): string {
  const slug = slugify(keyword)
  const content = generateContent(keyword)
  const internalLinks = generateInternalLinks(keyword, allKeywords)
  
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
                <div dangerouslySetInnerHTML={{ __html: \`${content.replace(/\n/g, '<br>')}\` }} />
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div dangerouslySetInnerHTML={{ __html: \`${internalLinks.replace(/\n/g, '<br>')}\` }} />
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
    const pageContent = generatePageContent(keyword, keywords)
    
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
