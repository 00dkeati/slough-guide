import { NextRequest, NextResponse } from 'next/server'

const BABYLOVE_API_KEY = 'd09c1189-9188-4c04-9699-d52a59bfe698'
const BABYLOVE_API_BASE = 'https://api.babylovegrowth.ai/api/public'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    // Use request.nextUrl instead of request.url to avoid static generation issues
    const articleId = request.nextUrl.searchParams.get('id')

    if (articleId) {
      // Get specific article
      const response = await fetch(`${BABYLOVE_API_BASE}/articles/${articleId}`, {
        headers: {
          'X-API-Key': BABYLOVE_API_KEY,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch article' },
          { status: response.status }
        )
      }

      const article = await response.json()
      return NextResponse.json(article)
    } else {
      // Get all articles
      const response = await fetch(`${BABYLOVE_API_BASE}/articles`, {
        headers: {
          'X-API-Key': BABYLOVE_API_KEY,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Failed to fetch articles' },
          { status: response.status }
        )
      }

      const articles = await response.json()
      return NextResponse.json(articles)
    }
  } catch (error) {
    console.error('[API_ERROR]', { 
      route: '/api/blog', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
