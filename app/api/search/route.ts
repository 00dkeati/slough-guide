import { NextRequest, NextResponse } from 'next/server'
import { getBusinesses } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || ''
    const area = searchParams.get('area') || ''

    // Get businesses with filters
    let businesses = await getBusinesses(
      category || undefined,
      area || undefined
    )

    // Filter by search term if provided
    if (query) {
      const searchTerm = query.toLowerCase()
      businesses = businesses.filter(business => 
        business.name.toLowerCase().includes(searchTerm) ||
        business.description?.toLowerCase().includes(searchTerm) ||
        business.category.toLowerCase().includes(searchTerm) ||
        business.area.toLowerCase().includes(searchTerm)
      )
    }

    return NextResponse.json(businesses)
  } catch (error) {
    console.error('[API_ERROR]', { 
      route: '/api/search', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
