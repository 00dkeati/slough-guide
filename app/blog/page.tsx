import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcrumbs'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog - Slough News, Tips & Community Stories',
  description: 'Read the latest blog posts about Slough, local news, community stories, and helpful tips for residents and visitors.',
  keywords: 'slough blog, slough news, slough community, local news slough, slough tips',
  openGraph: {
    title: 'Blog - Slough News, Tips & Community Stories',
    description: 'Read the latest blog posts about Slough, local news, community stories, and helpful tips.',
    url: 'https://slough.co/blog',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

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

async function getBlogArticles(): Promise<BlogArticle[]> {
  try {
    // Use the correct base URL for production or development
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://www.slough.co'
      : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    const response = await fetch(`${baseUrl}/api/blog`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      return []
    }
    
    return await response.json()
  } catch (error) {
    return []
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

export default async function BlogPage() {
  const articles = await getBlogArticles()

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Blog' }
      ]} />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Slough Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, community stories, and helpful tips about Slough and the surrounding areas.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              <p>No blog articles available at the moment.</p>
              <p className="mt-2">Check back soon for the latest Slough news and stories!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <Link href={`/blog/${article.slug}`} className="block">
                  {article.hero_image_url && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={article.hero_image_url}
                        alt={article.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h2>
                    
                    {article.meta_description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.meta_description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <time dateTime={article.created_at}>
                        {formatDate(article.created_at)}
                      </time>
                      <span className="text-red-600 font-medium">
                        Read More →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About Our Slough Blog
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Welcome to the Slough blog, your go-to source for local news, community stories, and helpful information about life in Slough, Berkshire. Our blog covers everything from local events and business spotlights to community initiatives and resident stories.
            </p>
            <p className="text-gray-700 mb-4">
              Whether you're a long-time resident or new to the area, our blog provides valuable insights into what makes Slough such a special place to live, work, and visit. From local history and culture to practical tips for residents, we aim to keep you informed and connected to your community.
            </p>
            <p className="text-gray-700">
              Stay tuned for regular updates featuring local businesses, community events, resident spotlights, and helpful guides for making the most of life in Slough and the surrounding areas.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
