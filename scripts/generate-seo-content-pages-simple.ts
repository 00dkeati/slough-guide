import fs from 'fs'
import path from 'path'

// Content directory
const pagesDir = path.join(process.cwd(), 'app', 'seo')

// Ensure directories exist
if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true })
}

// List of all SEO content files with their content
const seoContentData = [
  {
    filename: 'beauty_salon_slough.md',
    content: `# Beauty Salon Slough

**Target Keyword:** beauty salon slough

Discovering the perfect **beauty salon in Slough** can transform your self-care routine, offering a sanctuary where expert treatments meet personalized attention. Slough boasts a vibrant selection of salons, each providing a unique blend of services designed to enhance your natural beauty and promote relaxation. Whether you're seeking a quick refresh or a comprehensive pampering session, the local beauty scene has something for everyone.

From luxurious **facials** tailored to your skin type, including popular options like ELEMIS treatments, to meticulous **nail services** such as gel nails and manicures, salons in Slough prioritize precision and quality. Many establishments also specialize in **eye treatments**, offering lash lifts, tinting, and brow shaping to frame your features perfectly. For those looking for smooth, radiant skin, professional **waxing** and **threading** services are readily available, performed by experienced therapists.

Beyond these essentials, you'll find salons providing indulgent **massages** to melt away stress, advanced **aesthetic treatments** for rejuvenation, and even comprehensive **hair services** ranging from cuts and coloring to extensions. Some local gems, like Salon One, go a step further by offering accredited beauty academy courses, showcasing a deep commitment to expertise and continuous improvement within the industry.

When choosing a beauty salon in Slough, consider factors such as the range of services, therapist expertise, client reviews, and the overall ambiance. Many salons, including Diamonds Beauty Rooms and Pretty Lilly's Beauty Salon, are highly rated for their exceptional customer service and diverse treatment menus. With convenient booking options often available online, finding your ideal beauty destination in Slough is easier than ever. Embrace the opportunity to indulge in top-tier beauty care right on your doorstep, and experience the difference that professional attention can make.`
  },
  {
    filename: 'boiler_service_slough.md',
    content: `# Boiler Service Slough

**Target Keyword:** boiler service slough

## Essential Boiler Service in Slough: Ensuring Safety and Efficiency

For homeowners in Slough, maintaining a functional and efficient boiler is paramount, especially with the unpredictable British weather. A regular **boiler service Slough** is not just about preventing breakdowns; it's a crucial investment in the safety, efficiency, and longevity of your heating system. Neglecting annual maintenance can lead to higher energy bills, unexpected repairs, and even dangerous situations.

### The Undeniable Benefits of Regular Boiler Servicing

An annual boiler service offers a multitude of advantages. Firstly, it significantly **improves energy efficiency**. During a service, engineers clean internal components, optimize settings, and check for any inefficiencies, ensuring your boiler operates at its peak performance. This directly translates to lower energy consumption and reduced utility bills. Secondly, regular servicing enhances **reliability and extends the boiler's lifespan**. Catching minor issues early prevents them from escalating into costly repairs or premature boiler replacement. Furthermore, **safety is paramount**. A qualified Gas Safe engineer will inspect for dangerous carbon monoxide leaks, which are odorless, colorless, and potentially fatal. They also check for proper ventilation and ensure all safety devices are functioning correctly, providing peace of mind for you and your family.

### Common Boiler Issues Prevented by Servicing

Many common boiler problems can be identified and rectified during a routine service. These include issues like **low boiler pressure**, which can lead to inefficient heating, or **strange noises** emanating from the unit, often indicative of internal component wear or blockages. Ignition problems, minor leaks in pipework, and issues with the boiler's pump or thermostat are also frequently addressed. By proactively tackling these potential faults, a boiler service helps avoid inconvenient and often expensive emergency repairs, ensuring your home remains warm and comfortable throughout the year.

### Choosing a Local Slough Boiler Service Provider

When seeking a **boiler service Slough**, it is essential to choose a reputable and Gas Safe registered engineer. Local providers understand the specific needs and common boiler types in the area, offering prompt and reliable service. Companies like Gas-Fix and Tyrone Guy Ltd. are examples of local specialists who offer comprehensive boiler installation, servicing, and repair solutions, ensuring residents have access to expert assistance when needed. Engaging a local professional not only supports the community but also guarantees a quicker response time in case of an emergency.

In conclusion, an annual **boiler service Slough** is an indispensable practice for any homeowner. It safeguards your household against potential hazards, optimizes your heating system's performance, and prevents unexpected breakdowns, ultimately saving you money and providing comfort.`
  }
  // Note: I'm including just 2 examples here for brevity, but the script will handle all files
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

// Function to convert markdown to JSX-compatible content
function convertMarkdownToJSX(content: string): string {
  return content
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
}

// Function to get placeholder images based on keyword
function getPlaceholderImages(keyword: string): string[] {
  const imageMap: { [key: string]: string[] } = {
    'beauty salon slough': [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=400&fit=crop'
    ],
    'boiler service slough': [
      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop'
    ],
    'cafes slough': [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop'
    ],
    'car hire slough': [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=400&fit=crop'
    ],
    'car service slough': [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&h=400&fit=crop'
    ],
    'car wash slough': [
      'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=400&fit=crop'
    ],
    'chiropodist slough': [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop'
    ],
    'dentist slough': [
      'https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=400&fit=crop'
    ],
    'doctor slough': [
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop'
    ],
    'driving instructor slough': [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
    ],
    'electrician slough': [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=400&fit=crop'
    ],
    'fish and chips slough': [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=400&fit=crop'
    ],
    'gas engineer slough': [
      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop'
    ],
    'hairdresser slough': [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=400&fit=crop'
    ],
    'handyman slough': [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop'
    ],
    'houses for sale slough': [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop'
    ],
    'locksmith slough': [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=800&h=400&fit=crop'
    ],
    'massage slough': [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop'
    ],
    'mortgage advisor slough': [
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop'
    ],
    'nurseries in slough': [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop'
    ],
    'optician slough': [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop'
    ],
    'painter decorator slough': [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop'
    ],
    'pet shops slough': [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400&fit=crop'
    ],
    'plumber slough': [
      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2fcc0?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop'
    ],
    'pubs in slough': [
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop'
    ],
    'removals slough': [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
    ],
    'rental properties slough': [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop'
    ],
    'restaurants slough': [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop'
    ],
    'schools in slough': [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop'
    ],
    'secondary schools slough': [
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=400&fit=crop'
    ],
    'takeaways slough': [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=400&fit=crop'
    ],
    'taxi slough': [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
    ],
    'things to do in slough': [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop'
    ]
  }
  
  return imageMap[keyword] || [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop'
  ]
}

// Function to generate page content
function generatePageContent(filename: string, content: string): string {
  const targetKeyword = extractTargetKeyword(content)
  const title = extractTitle(content)
  const description = extractDescription(content)
  const slug = generateSlug(filename)
  
  // Get placeholder images
  const images = getPlaceholderImages(targetKeyword)
  
  // Convert markdown to JSX-compatible content
  const jsxContent = convertMarkdownToJSX(content)

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
function generateAllPages() {
  console.log('🚀 Starting SEO content page generation...')
  
  let successCount = 0
  let errorCount = 0
  
  // Read all the markdown files from Downloads/seo_content_individual/
  const downloadsDir = path.join('/Users/deankeating', 'Downloads', 'seo_content_individual')
  
  if (!fs.existsSync(downloadsDir)) {
    console.error('❌ Downloads/seo_content_individual directory not found!')
    console.log('Please ensure the markdown files are in the correct location.')
    return
  }
  
  const files = fs.readdirSync(downloadsDir).filter(file => file.endsWith('.md'))
  
  for (const filename of files) {
    try {
      console.log(`📄 Processing ${filename}...`)
      
      // Read the markdown file
      const filePath = path.join(downloadsDir, filename)
      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Generate page content
      const pageContent = generatePageContent(filename, content)
      
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
      
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error)
      errorCount++
    }
  }
  
  console.log(`\n🎉 Page generation complete!`)
  console.log(`✅ Successfully created: ${successCount} pages`)
  console.log(`❌ Errors: ${errorCount} pages`)
  
  // Generate sitemap entries
  generateSitemapEntries(files)
}

// Function to generate sitemap entries
function generateSitemapEntries(files: string[]) {
  console.log('\n📋 Generating sitemap entries...')
  
  const sitemapEntries = files.map(filename => {
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
  generateAllPages()
}

export { generateAllPages }
