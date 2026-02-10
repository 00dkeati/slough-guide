export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { sendBusinessSubmissionEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Extract form data
    const businessName = formData.get('businessName') as string
    const contactName = formData.get('contactName') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const businessType = formData.get('businessType') as string
    const address = formData.get('address') as string
    const website = formData.get('website') as string
    const description = formData.get('description') as string

    // Validate required fields
    if (!businessName || !contactName || !email || !businessType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create submission object
    const submission = {
      businessName,
      contactName,
      email,
      phone: phone || undefined,
      businessType,
      address: address || undefined,
      website: website || undefined,
      description: description || undefined,
    }

    // Send email
    await sendBusinessSubmissionEmail(
      submission,
      request.ip || undefined,
      request.headers.get('user-agent') || undefined
    )

    // Redirect to success page
    return NextResponse.redirect(new URL('/get-featured?success=true', request.url))
    
  } catch (error) {
    console.error('[GET_FEATURED_ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
