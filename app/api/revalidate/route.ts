import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get('path')
  const secret = request.nextUrl.searchParams.get('secret')
  
  // Simple secret check
  if (secret !== 'slough2026') {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }
  
  if (!path) {
    return NextResponse.json({ error: 'Path required' }, { status: 400 })
  }
  
  try {
    revalidatePath(path)
    return NextResponse.json({ 
      revalidated: true, 
      path,
      timestamp: new Date().toISOString()
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
}
