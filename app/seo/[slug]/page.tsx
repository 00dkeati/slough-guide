import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import TopNav from '@/app/(site)/components/TopNav'
import { getBusinessesByKeyword } from '@/lib/localData'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface MDXPage {
  title: string
  description: string
  slug: string
  datePublished: string
  dateModified: string
  tags: string[]
  canonical: string
  ogImage: string
  schemaType: string
}

interface MDXContent {
  frontMatter: MDXPage
  content: string
}

// Read MDX file and parse frontmatter
async function getMDXPage(slug: string): Promise<MDXContent | null> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'editorial', `${slug}.mdx`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data: frontMatter, content } = matter(fileContent)
    
    return {
      frontMatter: frontMatter as MDXPage,
      content
    }
  } catch (error) {
    console.error(`Error reading MDX file for ${slug}:`, error)
    return null
  }
}

// Get all MDX slugs for static generation
async function getAllMDXSlugs(): Promise<string[]> {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'editorial')
    
    if (!fs.existsSync(contentDir)) {
      return []
    }
    
    const files = fs.readdirSync(contentDir)
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace('.mdx', ''))
  } catch (error) {
    console.error('Error reading MDX directory:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const mdxPage = await getMDXPage(params.slug)
  
  if (!mdxPage) {
    return {
      title: 'Page Not Found',
    }
  }

  return {
    title: mdxPage.frontMatter.title,
    description: mdxPage.frontMatter.description,
    openGraph: {
      title: mdxPage.frontMatter.title,
      description: mdxPage.frontMatter.description,
      images: [mdxPage.frontMatter.ogImage],
      type: 'article',
      publishedTime: mdxPage.frontMatter.datePublished,
      modifiedTime: mdxPage.frontMatter.dateModified,
      tags: mdxPage.frontMatter.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: mdxPage.frontMatter.title,
      description: mdxPage.frontMatter.description,
      images: [mdxPage.frontMatter.ogImage],
    },
  }
}

export const revalidate = 3600 // Cache for 1 hour

export default async function SEOPage({ params }: { params: { slug: string } }) {
  const mdxPage = await getMDXPage(params.slug)

  if (!mdxPage) {
    notFound()
  }

  // Get businesses for this keyword
  const keyword = params.slug.replace(/-/g, ' ')
  const businessData = await getBusinessesByKeyword(keyword, 10)

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": mdxPage.frontMatter.title,
    "description": mdxPage.frontMatter.description,
    "url": mdxPage.frontMatter.canonical,
    "datePublished": mdxPage.frontMatter.datePublished,
    "dateModified": mdxPage.frontMatter.dateModified,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.slough.co"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Editorial",
          "item": "https://www.slough.co/editorial"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": mdxPage.frontMatter.title
        }
      ]
    },
    "mainEntity": businessData.hasData ? {
      "@type": "ItemList",
      "name": `Top ${keyword} in Slough`,
      "description": mdxPage.frontMatter.description,
      "numberOfItems": businessData.businesses.length,
      "itemListElement": businessData.businesses.map((business, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "LocalBusiness",
          "name": business.name,
          "description": business.description,
          "address": business.address,
          "telephone": business.phone,
          "url": business.website,
          "image": business.images?.[0],
          "aggregateRating": business.rating ? {
            "@type": "AggregateRating",
            "ratingValue": business.rating,
            "reviewCount": business.review_count || 0
          } : undefined
        }
      }))
    } : undefined
  }

  // Parse content to extract FAQs for FAQPage schema
  const faqMatches = mdxPage.content.match(/### (.*?)\n\n(.*?)(?=\n### |\n## |$)/gs)
  const faqs = faqMatches ? faqMatches.map(match => {
    const lines = match.trim().split('\n')
    const question = lines[0].replace('### ', '')
    const answer = lines.slice(2).join('\n').trim()
    return { question, answer }
  }) : []

  const faqStructuredData = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null

  return (
    <>
      <TopNav />
      
      {/* Canonical URL */}
      <link rel="canonical" href={mdxPage.frontMatter.canonical} />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData)
          }}
        />
      )}

      <main className="pt-20 lg:pt-24">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/editorial" className="hover:text-green-600 transition-colors">Editorial</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{mdxPage.frontMatter.title}</span>
          </nav>

          {/* Page Header */}
          <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8 md:p-12 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {mdxPage.frontMatter.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6">
              {mdxPage.frontMatter.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {mdxPage.frontMatter.tags.map((tag) => (
                <span key={tag} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <article className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
                <div className="p-8 md:p-12">
                  <div className="prose prose-lg max-w-none">
                    {/* Render MDX content as HTML */}
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: mdxPage.content
                          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                          .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-green-600 hover:text-green-800 underline">$1</a>')
                          .replace(/\n\n/g, '</p><p>')
                          .replace(/^(.*)$/gm, '<p>$1</p>')
                          .replace(/<p><h/g, '<h')
                          .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
                          .replace(/<p><ul>/g, '<ul>')
                          .replace(/<\/ul><\/p>/g, '</ul>')
                          .replace(/<p><li>/g, '<li>')
                          .replace(/<\/li><\/p>/g, '</li>')
                      }} 
                    />
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Business Listings */}
              {businessData.hasData && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Local Businesses</h3>
                  <div className="space-y-4">
                    {businessData.businesses.slice(0, 5).map((business, index) => (
                      <div key={business.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <h4 className="font-semibold text-gray-900 mb-1">{business.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{business.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{business.area}</span>
                          {business.rating && (
                            <span>⭐ {business.rating}/5</span>
                          )}
                        </div>
                        {business.phone && (
                          <a 
                            href={`tel:${business.phone}`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            📞 {business.phone}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Page Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Published:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(mdxPage.frontMatter.datePublished).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(mdxPage.frontMatter.dateModified).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <span className="ml-2 text-gray-600">Local Guide</span>
                  </div>
                </div>
              </div>

              {/* Related Pages */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Guides</h3>
                <div className="space-y-2">
                  <Link href="/editorial/restaurants-slough" className="block text-green-600 hover:text-green-800 text-sm">
                    Restaurants in Slough
                  </Link>
                  <Link href="/editorial/cafes-slough" className="block text-green-600 hover:text-green-800 text-sm">
                    Cafes in Slough
                  </Link>
                  <Link href="/editorial/things-to-do-in-slough" className="block text-green-600 hover:text-green-800 text-sm">
                    Things to Do in Slough
                  </Link>
                  <Link href="/editorial/slough-shops" className="block text-green-600 hover:text-green-800 text-sm">
                    Shops in Slough
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Editorial */}
          <div className="text-center mt-12 mb-8">
            <Link 
              href="/editorial"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              ← Back to all guides
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export async function generateStaticParams() {
  const slugs = await getAllMDXSlugs()
  
  return slugs.map((slug) => ({
    slug: slug,
  }))
}
