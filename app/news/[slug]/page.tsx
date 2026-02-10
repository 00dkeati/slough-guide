import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

interface ArticleContent {
  type: 'paragraph' | 'heading' | 'quote' | 'list' | 'callout' | 'image'
  text?: string
  author?: string
  items?: string[]
  src?: string
  alt?: string
  caption?: string
}

interface NewsArticle {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  author: string
  publishedAt: string
  heroImage: string
  excerpt: string
  content: ArticleContent[]
  tags: string[]
  readTime: number
}

async function getArticle(slug: string): Promise<NewsArticle | null> {
  const articlesData = await import('@/data/news-articles.json')
  const articles: NewsArticle[] = articlesData.default as NewsArticle[]
  return articles.find(article => article.slug === slug) || null
}

async function getRelatedArticles(currentSlug: string, category: string): Promise<NewsArticle[]> {
  const articlesData = await import('@/data/news-articles.json')
  const articles: NewsArticle[] = articlesData.default as NewsArticle[]
  return articles
    .filter(a => a.slug !== currentSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Not Found' }
  return {
    title: `${article.title} | Slough News`,
    description: article.excerpt,
    keywords: `slough news, ${article.category.toLowerCase()}, ${article.tags.join(', ')}`,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author],
    },
  }
}

export const revalidate = 3600

function renderText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\)|\n)/g)
  return parts.map((part, i) => {
    if (part === '\n') return <br key={i} />
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
    if (linkMatch) {
      return <a key={i} href={linkMatch[2]} className="text-red-700 hover:underline" target="_blank" rel="noopener">{linkMatch[1]}</a>
    }
    return part
  })
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)
  if (!article) notFound()

  const relatedArticles = await getRelatedArticles(params.slug, article.category)

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  })

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
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/news" className="text-slate-600 hover:text-red-700 flex items-center gap-2 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to News
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{article.readTime} min read</span>
          </div>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm mb-4">
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
              {article.category}
            </span>
            <span className="text-slate-500">{timeAgo(article.publishedAt)}</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {article.title}
          </h1>
          
          {article.subtitle && (
            <p className="text-xl text-slate-600 mb-6">
              {article.subtitle}
            </p>
          )}

          <div className="flex items-center justify-between py-4 border-y border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-700 font-bold text-sm">W</span>
              </div>
              <div>
                <div className="font-medium text-slate-900">{article.author}</div>
                <div className="text-sm text-slate-500">{formatDate(article.publishedAt)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {article.heroImage && (
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={article.heroImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg prose-slate max-w-none">
          {article.content.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                return (
                  <p key={index} className="text-slate-700 leading-relaxed mb-6">
                    {renderText(block.text || '')}
                  </p>
                )
              case 'heading':
                return (
                  <h2 key={index} className="text-2xl font-bold text-slate-900 mt-10 mb-4">
                    {block.text}
                  </h2>
                )
              case 'quote':
                return (
                  <blockquote key={index} className="border-l-4 border-red-600 pl-6 py-2 my-8 bg-slate-50 rounded-r-lg">
                    <p className="text-lg text-slate-700 italic mb-2">"{block.text}"</p>
                    {block.author && (
                      <cite className="text-sm text-slate-500 not-italic">— {block.author}</cite>
                    )}
                  </blockquote>
                )
              case 'list':
                return (
                  <ul key={index} className="space-y-3 my-6">
                    {block.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-700">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2.5 flex-shrink-0"></span>
                        <span>{renderText(item)}</span>
                      </li>
                    ))}
                  </ul>
                )
              case 'callout':
                return (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-6 my-8">
                    <p className="text-red-900">{renderText(block.text || '')}</p>
                  </div>
                )
              case 'image':
                return (
                  <figure key={index} className="my-8">
                    <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
                      <Image
                        src={block.src || ''}
                        alt={block.alt || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {block.caption && (
                      <figcaption className="text-center text-sm text-slate-500 mt-3">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              default:
                return null
            }
          })}
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-slate-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span 
                  key={tag} 
                  className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Stories */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-6">More Slough News</h3>
            <div className="space-y-4">
              {relatedArticles.map(related => (
                <Link 
                  key={related.id}
                  href={`/news/${related.slug}`}
                  className="block p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">{related.category}</span>
                    <span>{timeAgo(related.publishedAt)}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 hover:text-red-700">
                    {related.title}
                  </h4>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Got a News Tip?</h3>
          <p className="text-slate-300 mb-4">Help us cover Slough – email news@slough.co</p>
          <Link 
            href="/contact" 
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </article>
    </div>
  )
}

export async function generateStaticParams() {
  const articlesData = await import('@/data/news-articles.json')
  const articles: NewsArticle[] = articlesData.default as NewsArticle[]
  return articles.map(article => ({ slug: article.slug }))
}
