import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Editorial Articles',
  description: 'In-depth stories, guides, and features about Slough businesses and local life.',
}

interface EditorialArticle {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  author: string
  publishedAt: string
  featured: boolean
  heroImage: string
  excerpt: string
  readTime: number
  tags: string[]
}

async function getArticles(): Promise<EditorialArticle[]> {
  const articlesData = await import('@/data/editorial-articles.json')
  const articles: EditorialArticle[] = (articlesData.default as unknown) as EditorialArticle[]
  
  // Sort by publish date (newest first)
  return articles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export default async function EditorialPage() {
  const articles = await getArticles()
  const featuredArticles = articles.filter(a => a.featured)
  const regularArticles = articles.filter(a => !a.featured)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Editorial
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          In-depth stories, guides, and features about Slough's best businesses and local life
        </p>
      </div>

      {/* Comprehensive Editorial Introduction */}
      <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Discover Slough Through Our Stories</h2>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="mb-4">
            Welcome to our editorial section, where we dive deep into the heart of Slough's business community. Our comprehensive guides and in-depth features provide you with valuable insights into the local services, businesses, and professionals that make Slough such a vibrant place to live and work.
          </p>
          <p className="mb-4">
            From detailed comparative analyses of local businesses to expert guides on choosing the right services for your needs, our editorial content is designed to help you make informed decisions while supporting the local economy. We believe that well-researched, honest reviews and guides benefit both consumers and businesses alike.
          </p>
          <p className="mb-4">
            Our team of local experts and researchers work tirelessly to bring you accurate, up-to-date information about Slough's business landscape. Whether you're looking for the best driving instructors, comparing estate agents, or discovering hidden gems in the local market, our editorial content provides the depth and detail you need.
          </p>
        </div>
      </section>

      {/* Editorial Mission */}
      <section className="mb-12 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Editorial Mission</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Transparency & Accuracy</h3>
            <p className="text-gray-700 mb-4">
              We are committed to providing honest, transparent reviews and guides based on thorough research, customer feedback, and industry expertise. Our editorial standards ensure that every piece of content meets our high standards for accuracy and usefulness.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Local Focus</h3>
            <p className="text-gray-700">
              Our content is specifically tailored to Slough residents and businesses. We understand the unique characteristics of our local market and provide insights that are relevant to our community's specific needs and preferences.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Comprehensive Coverage</h3>
            <p className="text-gray-700 mb-4">
              From essential services like healthcare and education to lifestyle businesses like restaurants and entertainment, we cover the full spectrum of local businesses that matter to Slough residents.
            </p>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Regular Updates</h3>
            <p className="text-gray-700">
              Our editorial content is regularly updated to reflect changes in the local business landscape, ensuring that our readers always have access to the most current and relevant information available.
            </p>
          </div>
        </div>
      </section>

      {/* Content Categories */}
      <section className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Find Here</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Business Comparisons</h3>
            <p className="text-gray-700 text-sm">
              Detailed side-by-side comparisons of local businesses, including pricing, services, customer reviews, and unique selling points to help you make informed decisions.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Industry Guides</h3>
            <p className="text-gray-700 text-sm">
              Comprehensive guides covering different industries and services available in Slough, with expert insights and practical advice for consumers.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Local Insights</h3>
            <p className="text-gray-700 text-sm">
              In-depth analysis of local market trends, business developments, and community insights that affect how residents interact with local services.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Stories</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/editorial/${article.slug}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="relative h-64 w-full">
                  <Image 
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{article.author}</span>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      {regularArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <Link
                key={article.id}
                href={`/editorial/${article.slug}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="relative h-48 w-full">
                  <Image 
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-medium">{article.author}</span>
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No articles available yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}

