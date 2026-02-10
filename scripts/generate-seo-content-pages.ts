import fs from 'fs'
import path from 'path'

// Google Places API configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY || 'your-api-key-here'
const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

// Content directory
const contentDir = path.join(process.cwd(), 'data', 'seo-content')
const pagesDir = path.join(process.cwd(), 'app', 'seo')

// Ensure directories exist
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true })
}
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true })
}

// List of all SEO content files
const seoContentFiles = [
  'beauty_salon_slough.md',
  'boiler_service_slough.md',
  'cafes_slough.md',
  'car_hire_slough.md',
  'car_service_slough.md',
  'car_wash_slough.md',
  'chiropodist_slough.md',
  'dentist_slough.md',
  'doctor_slough.md',
  'driving_instructor_slough.md',
  'electrician_slough.md',
  'fish_and_chips_slough.md',
  'gas_engineer_slough.md',
  'hairdresser_slough.md',
  'handyman_slough.md',
  'houses_for_sale_slough.md',
  'leigh_park.md',
  'locksmith_slough.md',
  'massage_slough.md',
  'mortgage_advisor_slough.md',
  'nurseries_in_slough.md',
  'optician_slough.md',
  'painter_decorator_slough.md',
  'pet_shops_slough.md',
  'plumber_slough.md',
  'pubs_in_slough.md',
  'removals_slough.md',
  'rental_properties_slough.md',
  'restaurants_slough.md',
  'schools_in_slough.md',
  'secondary_schools_slough.md',
  'takeaways_slough.md',
  'taxi_slough.md',
  'things_to_do_in_slough.md',
  'slough_argos.md',
  'slough_asda.md',
  'slough_estate_agents.md',
  'slough_high_street.md',
  'slough_letting_agents.md',
  'slough_market.md',
  'slough_new_builds.md',
  'slough_news.md',
  'slough_postcode.md',
  'slough_sainsburys.md',
  'slough_shops.md',
  'slough_soft_play.md',
  'slough_town_centre.md',
  'slough_wickes.md'
]

// Function to extract target keyword from markdown content
function extractTargetKeyword(content: string): string {
  const match = content.match(/\*\*Target Keyword:\*\*\s*(.+)/)
  return match ? match[1].trim() : ''
}

// Function to extract title from markdown content
function extractTitle(content: string): string {
  const lines = content.split('\n')
  for (const line of lines) {
    if (line.startsWith('# ')) {
      return line.replace('# ', '').trim()
    }
  }
  return 'Slough Guide'
}

// Function to extract description from content
function extractDescription(content: string): string {
  const lines = content.split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('##') || lines[i].startsWith('###')) {
      // Look for the first paragraph after a heading
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].trim() && !lines[j].startsWith('#')) {
          return lines[j].trim().substring(0, 160) + '...'
        }
      }
    }
  }
  return 'Discover the best services and information in Slough, Berkshire.'
}

// Function to generate slug from filename
function generateSlug(filename: string): string {
  return filename.replace('.md', '').replace(/_/g, '-')
}

// Function to search for relevant images using Google Places API
async function searchForImages(keyword: string, location: string = 'Slough, Berkshire'): Promise<string[]> {
  try {
    const searchQuery = `${keyword} ${location}`
    const response = await fetch(
      `${GOOGLE_PLACES_BASE_URL}/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_PLACES_API_KEY}`
    )
    
    if (!response.ok) {
      console.warn(`Google Places API request failed for ${keyword}`)
      return []
    }
    
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const images: string[] = []
      
      for (const place of data.results.slice(0, 3)) {
        if (place.photos && place.photos.length > 0) {
          const photo = place.photos[0]
          const imageUrl = `${GOOGLE_PLACES_BASE_URL}/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
          images.push(imageUrl)
        }
      }
      
      return images
    }
    
    return []
  } catch (error) {
    console.warn(`Error searching for images for ${keyword}:`, error)
    return []
  }
}

// Function to generate page content
async function generatePageContent(filename: string, content: string): Promise<string> {
  const targetKeyword = extractTargetKeyword(content)
  const title = extractTitle(content)
  const description = extractDescription(content)
  const slug = generateSlug(filename)
  
  // Search for relevant images
  const images = await searchForImages(targetKeyword)
  
  // Convert markdown to JSX-compatible content
  const jsxContent = content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[h|l])/gm, '<p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[h|l])/g, '$1')
    .replace(/(<\/[h|l]>)<\/p>/g, '$1')

  return `
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '${title} - Slough Directory',
  description: '${description}',
  keywords: '${targetKeyword}, Slough, Berkshire, local guide, ${targetKeyword} in Slough',
  openGraph: {
    title: '${title} - Slough Directory',
    description: '${description}',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${title} - Slough Directory',
    description: '${description}',
  },
}

export default function ${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, '')}Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          ${title}
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          ${description}
        </p>
        
        {/* Featured Images */}
        ${images.length > 0 ? `
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          ${images.map((image, index) => `
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="${image}"
              alt="${targetKeyword} in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          `).join('')}
        </div>
        ` : ''}
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: \`${jsxContent}\` }} />
      </div>

      {/* Related Links */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More in Slough</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/categories" className="block bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
            <h3 className="text-xl font-bold text-blue-700">Browse Categories</h3>
            <p className="text-gray-600">Discover all business categories in Slough</p>
          </Link>
          <Link href="/areas" className="block bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
            <h3 className="text-xl font-bold text-blue-700">Explore Areas</h3>
            <p className="text-gray-600">Find businesses in different areas of Slough</p>
          </Link>
          <Link href="/search" className="block bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
            <h3 className="text-xl font-bold text-blue-700">Search Directory</h3>
            <p className="text-gray-600">Search for specific businesses and services</p>
          </Link>
        </div>
      </div>

      {/* Local Business CTA */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded">
        <p className="font-bold">Looking for ${targetKeyword} services?</p>
        <p>Browse our directory of local businesses offering ${targetKeyword} in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=${encodeURIComponent(targetKeyword)}" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
`
}

// Main function to generate all pages
async function generateAllPages() {
  console.log('🚀 Starting SEO content page generation...')
  
  let successCount = 0
  let errorCount = 0
  
  for (const filename of seoContentFiles) {
    try {
      console.log(`📄 Processing ${filename}...`)
      
      // Read the markdown file
      const filePath = path.join(process.cwd(), 'Downloads', 'seo_content_individual', filename)
      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Generate page content
      const pageContent = await generatePageContent(filename, content)
      
      // Create the page file
      const slug = generateSlug(filename)
      const pagePath = path.join(pagesDir, `${slug}`, 'page.tsx')
      
      // Ensure directory exists
      const pageDir = path.dirname(pagePath)
      if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true })
      }
      
      // Write the page file
      fs.writeFileSync(pagePath, pageContent)
      
      console.log(`✅ Created page: /seo/${slug}`)
      successCount++
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
      
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error)
      errorCount++
    }
  }
  
  console.log(`\n🎉 Page generation complete!`)
  console.log(`✅ Successfully created: ${successCount} pages`)
  console.log(`❌ Errors: ${errorCount} pages`)
  
  // Generate sitemap entries
  generateSitemapEntries()
}

// Function to generate sitemap entries
function generateSitemapEntries() {
  console.log('\n📋 Generating sitemap entries...')
  
  const sitemapEntries = seoContentFiles.map(filename => {
    const slug = generateSlug(filename)
    return `  {
    url: \`\${baseUrl}/seo/${slug}\`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },`
  }).join('\n')
  
  const sitemapContent = `
// SEO Content Pages (generated)
${sitemapEntries}
`
  
  // Write to a file for easy copying
  const sitemapPath = path.join(process.cwd(), 'data', 'seo-sitemap-entries.txt')
  fs.writeFileSync(sitemapPath, sitemapContent)
  
  console.log(`✅ Sitemap entries saved to: ${sitemapPath}`)
  console.log('📝 Copy these entries to your sitemap.ts file')
}

// Run the script
if (require.main === module) {
  generateAllPages().catch(console.error)
}

export { generateAllPages }
