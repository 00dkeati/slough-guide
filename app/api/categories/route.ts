import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('[API_ERROR]', { 
      route: '/api/categories', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
