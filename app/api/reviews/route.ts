import { NextResponse } from 'next/server'
import { validateReviewContent } from '@/lib/contentFilter'

export const runtime = 'nodejs'

interface Review {
  id: string
  businessName: string
  businessSlug: string
  userName: string
  rating: number
  message: string
  createdAt: string
}

// Using GitHub Gist as a simple free database
// This is a temporary solution - for production, use a proper database
const GIST_ID = process.env.REVIEWS_GIST_ID ?? ''
const GITHUB_TOKEN = process.env.GITHUB_TOKEN ?? ''

// Fallback to in-memory storage for development
let memoryReviews: Review[] = [
  {
    id: 'demo-1',
    businessName: 'Demo Business',
    businessSlug: 'demo-business',
    userName: 'Sarah Johnson',
    rating: 5,
    message: 'Excellent service! Highly recommend to anyone looking for quality work in Slough.',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'demo-2',
    businessName: 'Slough Shops',
    businessSlug: 'slough-shops',
    userName: 'Mike Peters',
    rating: 4,
    message: 'Great shopping facilities. Sainsburys is particularly good, and the retail park has everything you need.',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
]

// Simple rate limiting (in-memory)
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 3600000 // 1 hour in milliseconds
const MAX_REVIEWS_PER_HOUR = 3

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(identifier) || []
  
  // Remove timestamps older than the window
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW)
  
  if (recentTimestamps.length >= MAX_REVIEWS_PER_HOUR) {
    return false // Rate limit exceeded
  }
  
  // Add current timestamp
  recentTimestamps.push(now)
  rateLimitMap.set(identifier, recentTimestamps)
  
  return true
}

// Get reviews from GitHub Gist or memory
async function getReviews(): Promise<Review[]> {
  // If GitHub credentials are set, use Gist
  if (GIST_ID && GITHUB_TOKEN) {
    try {
      const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      
      if (response.ok) {
        const gist = await response.json()
        const content = gist.files['reviews.json']?.content
        if (content) {
          return JSON.parse(content)
        }
      }
    } catch (error) {
      // Error fetching from Gist, fallback to memory
    }
  }
  
  // Fallback to memory storage
  return memoryReviews
}

// Save reviews to GitHub Gist or memory
async function saveReviews(reviews: Review[]): Promise<boolean> {
  // If GitHub credentials are set, use Gist
  if (GIST_ID && GITHUB_TOKEN) {
    try {
      const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          files: {
            'reviews.json': {
              content: JSON.stringify(reviews, null, 2)
            }
          }
        })
      })
      
      return response.ok
    } catch (error) {
      // Error saving to Gist, fallback to memory
    }
  }
  
  // Fallback to memory storage
  memoryReviews = reviews
  return true
}

// Get reviews
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('target')
  
  try {
    let reviews = await getReviews()

    // Filter by target if provided
    if (target) {
      reviews = reviews.filter(r => r.businessSlug === target)
    }

    // Sort by date (newest first)
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('[API_ERROR]', { 
      route: '/api/reviews', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ reviews: [] })
  }
}

// Post new review
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { businessName, businessSlug, userName, rating, message } = body

    // Validation
    if (!businessName || !businessSlug || !userName || !rating || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Rate limiting (use IP or username as identifier)
    const identifier = `${userName.toLowerCase()}-${businessSlug}`
    if (!checkRateLimit(identifier)) {
      return NextResponse.json(
        { error: 'Too many reviews submitted. Please wait before submitting another review.' },
        { status: 429 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (message.length < 10 || message.length > 500) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 500 characters' },
        { status: 400 }
      )
    }

    // Validate content for profanity and spam
    const contentValidation = validateReviewContent(userName, message)
    if (!contentValidation.valid) {
      return NextResponse.json(
        { error: contentValidation.error },
        { status: 400 }
      )
    }

    // Get existing reviews
    const reviews = await getReviews()

    // Create new review
    const newReview: Review = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      businessName,
      businessSlug,
      userName: userName.trim(),
      rating,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    }

    // Add to reviews
    reviews.push(newReview)

    // Save reviews
    const saved = await saveReviews(reviews)

    if (!saved) {
      return NextResponse.json(
        { error: 'Failed to save review' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, review: newReview })
  } catch (error) {
    console.error('[API_ERROR]', { 
      route: '/api/reviews', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
