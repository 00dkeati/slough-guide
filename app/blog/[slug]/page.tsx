import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcrumbs'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

interface BlogArticle {
  id: number
  title: string
  slug: string
  languageCode: string
  orgWebsite: string
  created_at: string
  meta_description?: string
  hero_image_url?: string
  content_html?: string
  content_markdown?: string
}

async function getBlogArticle(slug: string): Promise<BlogArticle | null> {
  try {
    // Use the correct base URL for production or development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://www.slough.co'
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    
    // First get all articles to find the one with matching slug
    const response = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 3600 },
    })
    
    if (!response.ok) {
      return null
    }
    
    const articles = await response.json()
    const article = articles.find((a: BlogArticle) => a.slug === slug)
    
    if (!article) {
      return null
    }
    
    // Now get the full article content
    const fullResponse = await fetch(`${baseUrl}/api/blog?id=${article.id}`, {
      next: { revalidate: 3600 },
    })
    
    if (!fullResponse.ok) {
      return null
    }
    
    return await fullResponse.json()
  } catch (error) {
    return null
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface BlogArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const article = await getBlogArticle(params.slug)
  
  if (!article) {
    return {
      title: 'Article Not Found - Slough Blog',
      description: 'The requested blog article could not be found.',
    }
  }

  return {
    title: `${article.title} - Slough Blog`,
    description: article.meta_description || `Read about ${article.title} on the Slough blog.`,
    keywords: `slough blog, ${article.title.toLowerCase()}, slough news, local news`,
    openGraph: {
      title: `${article.title} - Slough Blog`,
      description: article.meta_description || `Read about ${article.title} on the Slough blog.`,
      url: `https://slough.co/blog/${article.slug}`,
      type: 'article',
      publishedTime: article.created_at,
      images: article.hero_image_url ? [article.hero_image_url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const article = await getBlogArticle(params.slug)

  if (!article) {
    notFound()
  }

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Blog', href: '/blog' },
        { label: article.title }
      ]} />

      <div className="max-w-4xl mx-auto">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          {article.hero_image_url && (
            <div className="relative h-64 md:h-96 w-full">
              <Image
                src={article.hero_image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </div>
          )}

          <div className="p-8">
            {/* Article Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                <time dateTime={article.created_at} className="flex items-center">
                  <span className="mr-2">📅</span>
                  {formatDate(article.created_at)}
                </time>
                <Link 
                  href="/blog" 
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  ← Back to Blog
                </Link>
              </div>

              {article.meta_description && (
                <p className="text-lg text-gray-700 leading-relaxed">
                  {article.meta_description}
                </p>
              )}
            </header>

            {/* Article Content */}
            {article.content_html ? (
              <div 
                className="prose prose-lg prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content_html }}
              />
            ) : article.content_markdown ? (
              <div className="prose prose-lg prose-gray max-w-none">
                <pre className="whitespace-pre-wrap">{article.content_markdown}</pre>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Content not available for this article.</p>
              </div>
            )}

            {/* Article Footer */}
            <footer className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-600">
                    Published on {formatDate(article.created_at)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Slough Blog • Community News & Stories
                  </p>
                </div>
                
                <Link 
                  href="/blog" 
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  ← Back to All Articles
                </Link>
              </div>
            </footer>
          </div>
        </article>

        {/* Related Articles Section */}
        <div className="mt-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            More from Our Blog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Community Stories
              </h3>
              <p className="text-gray-600 mb-4">
                Discover inspiring stories from Slough residents and community members.
              </p>
              <Link href="/blog" className="text-red-600 hover:text-red-700 font-medium">
                Read Community Stories →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Local News & Events
              </h3>
              <p className="text-gray-600 mb-4">
                Stay updated with the latest news and events happening in Slough.
              </p>
              <Link href="/blog" className="text-red-600 hover:text-red-700 font-medium">
                Read Local News →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
