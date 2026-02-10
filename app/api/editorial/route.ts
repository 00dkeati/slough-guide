import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600 // Cache for 1 hour

export interface EditorialArticle {
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
  content: ArticleContent[]
  relatedBusinesses: string[]
  tags: string[]
  readTime: number
}

export interface ArticleContent {
  type: 'paragraph' | 'heading' | 'quote' | 'businessSpotlight' | 'list' | 'callout'
  text?: string
  author?: string
  businessSlug?: string
  items?: string[]
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    
    // Import the editorial articles data
    const articlesData = await import('../../../data/editorial-articles.json')
    let articles: EditorialArticle[] = articlesData.default as EditorialArticle[]
    
    // Filter featured if requested
    if (featured) {
      articles = articles.filter(article => article.featured)
    }
    
    // Sort by publish date (newest first)
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    
    // Apply limit if specified
    if (limit) {
      articles = articles.slice(0, limit)
    }
    
    return NextResponse.json({ 
      articles,
      total: articles.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API_ERROR]', { 
      route: '/api/editorial', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ 
      articles: [],
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}

