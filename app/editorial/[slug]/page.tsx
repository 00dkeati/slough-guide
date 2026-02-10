import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'

interface ArticleContent {
  type: 'paragraph' | 'heading' | 'quote' | 'list' | 'callout' | 'image'
  text?: string
  author?: string
  items?: string[]
  src?: string
  alt?: string
  caption?: string
}

interface EditorialArticle {
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

async function getArticle(slug: string): Promise<EditorialArticle | null> {
  const articlesData = await import('@/data/editorial-articles.json')
  const articles: EditorialArticle[] = articlesData.default as EditorialArticle[]
  return articles.find(article => article.slug === slug) || null
}

async function getRelatedArticles(currentArticle: EditorialArticle): Promise<EditorialArticle[]> {
  const articlesData = await import('@/data/editorial-articles.json')
  const articles: EditorialArticle[] = articlesData.default as EditorialArticle[]
  
  // Score articles by relevance (category match + tag overlap)
  const scored = articles
    .filter(a => a.slug !== currentArticle.slug)
    .map(article => {
      let score = 0
      // Category match is worth 3 points
      if (article.category === currentArticle.category) score += 3
      // Each matching tag is worth 1 point
      const matchingTags = article.tags?.filter(tag => 
        currentArticle.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
      ) || []
      score += matchingTags.length
      return { article, score }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => item.article)
  
  return scored
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug)
  if (!article) return { title: 'Not Found' }
  return {
    title: `${article.title} | Slough.co`,
    description: article.excerpt,
  }
}

export const revalidate = 3600

// Parse markdown formatting
function renderText(text: string) {
  // Split by bold, links, and newlines
  const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\)|\n)/g)
  return parts.map((part, i) => {
    if (part === '\n') return <br key={i} />
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
    }
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/)
    if (linkMatch) {
      return <a key={i} href={linkMatch[2]} className="text-blue-600 hover:underline" target="_blank" rel="noopener">{linkMatch[1]}</a>
    }
    return part
  })
}

// Check if text is a markdown table
function isTable(text: string): boolean {
  const lines = text.trim().split('\n')
  return lines.length >= 2 && lines[0].includes('|') && lines[1].includes('---')
}

// Render markdown table - mobile card layout, desktop table
function renderTable(text: string) {
  const lines = text.trim().split('\n').filter(l => l.trim())
  const parseRow = (line: string) => line.split('|').map(c => c.trim()).filter(Boolean)
  const headers = parseRow(lines[0])
  const rows = lines.slice(2).map(parseRow)
  
  return (
    <div className="my-8">
      {/* Mobile: Card layout */}
      <div className="md:hidden space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 text-lg leading-tight">
                  {renderText(row[1] || row[0])}
                </div>
                {row[2] && (
                  <div className="text-sm text-slate-500 mt-0.5">{renderText(row[2])}</div>
                )}
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-lg font-bold text-blue-600">{renderText(row[3] || '')}</div>
                <div className="text-xs text-slate-500">{renderText(row[4] || '')} reviews</div>
              </div>
            </div>
            {row[5] && (
              <div className="text-sm text-slate-600 pt-2 border-t border-slate-100 mt-2">
                {renderText(row[5])}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Desktop: Traditional table */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 text-left font-semibold text-slate-900 whitespace-nowrap">
                  {renderText(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50 transition-colors">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-slate-700">
                    {renderText(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default async function EditorialArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)
  if (!article) notFound()
  
  const relatedArticles = await getRelatedArticles(article)

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  })

  // Group content into sections (split by headings that contain business numbers like "1.", "2.")
  const isBusinessHeading = (text?: string) => text && /^[1-9]\./.test(text)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">
            Slough<span className="text-blue-600">.co</span>
          </Link>
          <Link href="/editorial" className="text-sm text-slate-600 hover:text-slate-900">
            ← All Guides
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-[50vh] min-h-[400px] max-h-[600px] relative">
          <img
            src={article.heroImage}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-4xl mx-auto px-4 pb-8 md:pb-12">
            <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              {article.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {article.author.charAt(0)}
            </div>
            <span className="font-medium text-slate-900">{article.author}</span>
          </div>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">{formatDate(article.publishedAt)}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600">{article.readTime} min read</span>
        </div>
      </div>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="space-y-6">
          {article.content?.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                if (isTable(block.text || '')) {
                  return <div key={index}>{renderTable(block.text!)}</div>
                }
                return (
                  <p key={index} className="text-slate-700 text-lg leading-relaxed">
                    {renderText(block.text || '')}
                  </p>
                )
              
              case 'heading':
                // Check if this is a business/venue heading (numbered)
                if (isBusinessHeading(block.text)) {
                  return (
                    <div key={index} className="pt-8 first:pt-0">
                      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        {block.text}
                      </h2>
                      <div className="h-1 w-16 bg-blue-600 rounded-full" />
                    </div>
                  )
                }
                // Regular heading
                return (
                  <h2 key={index} className="text-xl md:text-2xl font-bold text-slate-900 pt-6">
                    {block.text}
                  </h2>
                )
              
              case 'image':
                return (
                  <figure key={index} className="my-8">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <img
                        src={block.src}
                        alt={block.alt || ''}
                        className="w-full h-64 md:h-80 object-cover"
                      />
                    </div>
                    {block.caption && (
                      <figcaption className="text-sm text-slate-500 mt-3 text-center">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              
              case 'quote':
                return (
                  <blockquote key={index} className="my-8 relative">
                    <div className="absolute -left-4 top-0 text-6xl text-blue-200 font-serif leading-none">"</div>
                    <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 pl-8 border-l-4 border-blue-500">
                      <p className="text-lg text-slate-700 italic leading-relaxed">
                        {block.text}
                      </p>
                      {block.author && (
                        <cite className="block mt-4 text-sm font-medium text-slate-600 not-italic">
                          — {block.author}
                        </cite>
                      )}
                    </div>
                  </blockquote>
                )
              
              case 'list':
                return (
                  <ul key={index} className="my-6 space-y-3">
                    {block.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                          ✓
                        </span>
                        <span className="text-slate-700 text-lg leading-relaxed">
                          {renderText(item)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )
              
              case 'callout':
                return (
                  <div key={index} className="my-8 rounded-2xl bg-amber-50 border border-amber-200 p-6">
                    <p className="text-slate-800 text-lg">
                      {renderText(block.text || '')}
                    </p>
                  </div>
                )
              
              default:
                return null
            }
          })}
        </div>

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {relatedArticles.map((related) => (
                <Link 
                  key={related.slug}
                  href={`/editorial/${related.slug}`}
                  className="group block p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded mb-2">
                    {related.category}
                  </span>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {related.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Discover more local guides
          </h3>
          <p className="text-slate-400 mb-6">
            We've ranked the best businesses across Slough
          </p>
          <Link 
            href="/editorial"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
          >
            View all guides →
          </Link>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-slate-500">
          <Link href="/" className="font-semibold text-slate-900 hover:text-blue-600">
            Slough.co
          </Link>
          <span className="mx-2">•</span>
          Your local business directory
        </div>
      </footer>
    </div>
  )
}

export async function generateStaticParams() {
  const articlesData = await import('@/data/editorial-articles.json')
  const articles: EditorialArticle[] = articlesData.default as EditorialArticle[]
  return articles.map((article) => ({ slug: article.slug }))
}

