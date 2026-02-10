import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600 // Cache for 1 hour

export async function GET() {
  try {
    // Using NewsAPI.org (you'll need to get a free API key from https://newsapi.org/)
    // For now, we'll return curated local news
    
    const localNews = [
      {
        title: "Best Carpenters & Joiners in Slough - Expert Woodwork Services",
        description: "Discover Slough's most skilled craftsmen with perfect ratings. From bespoke furniture to major extensions, featuring top-rated carpenters with decades of experience.",
        url: "/carpenters",
        publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        source: "Slough Directory"
      },
      {
        title: "Slough Shopping Guide - Find All Local Shops",
        description: "Discover all the shops in Slough including Sainsburys, ASDA, Waitrose, M&S, Argos and more at the retail park and town centre.",
        url: "/w/slough-shops",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        source: "Slough Directory"
      },
      {
        title: "Best Restaurants in Slough - Complete Dining Guide",
        description: "Find the best restaurants, cafes, pubs and takeaways in Slough. From Chinese and Indian to fish & chips and more.",
        url: "/w/slough-restaurants",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        source: "Slough Directory"
      },
      {
        title: "Slough Jobs & Vacancies - Employment Opportunities",
        description: "Browse current job vacancies and part-time positions available in Slough. Find your next career opportunity locally.",
        url: "/w/slough-jobs",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        source: "Slough Directory"
      },
      {
        title: "Slough Healthcare Services - Doctors & Dentists",
        description: "Find doctors, dentists, orthodontists, opticians and vets in Slough. Complete healthcare directory.",
        url: "/w/slough-healthcare",
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        source: "Slough Directory"
      },
      {
        title: "Local Services in Slough - Tradesmen & Professionals",
        description: "Find hairdressers, barbers, garages, taxis and all local services in Slough. Professional tradesmen directory.",
        url: "/w/slough-services",
        publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        source: "Slough Directory"
      }
    ]

    // If you want to use real news API, uncomment this:
    /*
    const apiKey = process.env.NEWS_API_KEY
    if (apiKey) {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=Slough OR Portsmouth OR Berkshire&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`,
        { next: { revalidate: 3600 } }
      )
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({ articles: data.articles })
      }
    }
    */

    return NextResponse.json({ 
      articles: localNews,
      cached: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[API_ERROR]', { 
      route: '/api/news', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ 
      articles: [],
      error: 'Internal Server Error' 
    }, { status: 500 })
  }
}

