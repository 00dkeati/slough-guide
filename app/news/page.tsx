import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Slough News | Local News & Updates',
  description: 'Latest news from Slough, Langley, Horndean and surrounding areas. Council updates, local events, crime reports, and community stories.',
  keywords: 'slough news, cowplain news, horndean news, local news hampshire, slough council',
}

interface NewsArticle {
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

async function getArticles(): Promise<NewsArticle[]> {
  const articlesData = await import('@/data/news-articles.json')
  const articles: NewsArticle[] = articlesData.default as NewsArticle[]
  
  return articles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export default async function NewsPage() {
  const articles = await getArticles()
  const featuredArticle = articles.find(a => a.featured)
  const regularArticles = articles.filter(a => !a.featured)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return formatDate(dateString)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-700 to-red-800 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm mb-4">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>
            Live Local News
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Slough News
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            Local news, council updates, events, and community stories from Slough and surrounding areas
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Featured Story */}
        {featuredArticle && (
          <section className="mb-12">
            <Link href={`/news/${featuredArticle.slug}`} className="block group">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="md:flex">
                  {featuredArticle.heroImage && (
                    <div className="md:w-1/2 relative h-64 md:h-auto">
                      <Image
                        src={featuredArticle.heroImage}
                        alt={featuredArticle.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      </div>
                    </div>
                  )}
                  <div className={`p-6 md:p-8 ${featuredArticle.heroImage ? 'md:w-1/2' : 'w-full'}`}>
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {featuredArticle.category}
                      </span>
                      <span>{timeAgo(featuredArticle.publishedAt)}</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 group-hover:text-red-700 transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>{featuredArticle.readTime} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* News Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['All', 'Council', 'Crime', 'Events', 'Business', 'Schools', 'Traffic'].map(cat => (
            <button 
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cat === 'All' 
                  ? 'bg-red-700 text-white' 
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Latest Stories */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Latest Stories</h2>
          
          {articles.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <p className="text-slate-500 text-lg">No news articles yet. Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map(article => (
                <Link 
                  key={article.id} 
                  href={`/news/${article.slug}`}
                  className="block bg-white rounded-xl p-5 hover:shadow-md transition-shadow border border-slate-100"
                >
                  <div className="flex gap-4">
                    {article.heroImage && (
                      <div className="w-24 h-24 md:w-32 md:h-24 relative flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={article.heroImage}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {article.category}
                        </span>
                        <span>{timeAgo(article.publishedAt)}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-red-700">
                        {article.title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 hidden md:block">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
          <p className="text-slate-300 mb-6">Get Slough news delivered to your inbox</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </section>

        {/* SEO Content */}
        <section className="mt-12 prose prose-slate max-w-none">
          <h2>Your Source for Slough Local News</h2>
          <p>
            Slough.co brings you the latest local news from Slough, Langley, Horndean, 
            Cippenham, and surrounding Berkshire villages. While regional outlets like Berkshire Live 
            and Portsmouth News cover the broader area, we focus exclusively on hyper-local stories 
            that matter to our community.
          </p>
          <p>
            From Havant Borough Council decisions and planning applications to local crime reports, 
            school news, and community events – we cover what the big outlets miss. Our news desk 
            monitors council meetings, police reports, and local social media to bring you timely, 
            relevant updates about life in Slough.
          </p>
          <h3>What We Cover</h3>
          <ul>
            <li><strong>Council &amp; Planning</strong> – Havant Borough Council decisions, planning applications, local policy changes</li>
            <li><strong>Crime &amp; Safety</strong> – Berkshire Police reports, community safety alerts, court cases</li>
            <li><strong>Events &amp; Community</strong> – Local markets, fairs, charity events, things to do</li>
            <li><strong>Business</strong> – New openings, closures, and changes on Slough high street</li>
            <li><strong>Schools</strong> – Education news, Ofsted reports, school achievements</li>
            <li><strong>Traffic &amp; Transport</strong> – Roadworks, bus service changes, parking updates</li>
          </ul>
          <p>
            Got a news tip? Email us at news@slough.co – we want to hear from you.
          </p>
        </section>
      </div>
    </div>
  )
}
