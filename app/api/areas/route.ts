import { NextResponse } from 'next/server'
import { getAreas } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const areas = await getAreas()
    return NextResponse.json(areas)
  } catch (error) {
    console.error('[API_ERROR]', { 
      route: '/api/areas', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
