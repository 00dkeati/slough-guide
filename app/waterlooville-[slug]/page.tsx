// app/slough-[slug]/page.tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Define all your SEO pages with their metadata
const seoPages: Record<string, {
  title: string
  description: string
  h1: string
  content: string
  keywords: string[]
}> = {
  'restaurants': {
    title: 'Slough Restaurants - Best Dining Guide 2025',
    description: 'Discover the best restaurants in Slough. Real reviews, ratings, and our featured restaurant of the week.',
    h1: '🍽️ Slough Restaurants',
    keywords: ['slough restaurants', 'dining slough', 'food slough', 'restaurants SL1', 'restaurants SL2'],
    content: `
      <section class="intro-section">
        <p>Welcome to the most comprehensive guide for restaurants in Slough, Berkshire. Find the best dining experiences, read reviews, and discover new places to eat.</p>
      </section>
      <section>
        <h2>Top Rated Restaurants</h2>
        <p>Our carefully curated list of Slough's finest dining establishments.</p>
      </section>
    `
  },
  'shops': {
    title: 'Slough Shops - Complete Shopping Directory 2025',
    description: 'Find all shops in Slough. From major retailers to local boutiques, discover shopping in SL1 and SL2.',
    h1: '🛍️ Slough Shops',
    keywords: ['slough shops', 'shopping slough', 'retail slough', 'shops SL1', 'shops SL2'],
    content: `
      <section class="intro-section">
        <p>Your complete guide to shopping in Slough. From the Wellington Retail Park to local independent stores.</p>
      </section>
      <section>
        <h2>Popular Shopping Areas</h2>
        <p>Wellington Way, The Precinct, and more shopping destinations.</p>
      </section>
    `
  },
  'dentist': {
    title: 'Slough Dentist - Find NHS & Private Dental Care',
    description: 'Looking for a dentist in Slough? Compare NHS and private dental practices, read reviews, and book appointments.',
    h1: '🦷 Slough Dentist',
    keywords: ['slough dentist', 'dental care slough', 'NHS dentist SL1', 'dentist SL2'],
    content: `
      <section class="intro-section">
        <p>Find trusted dental care in Slough. Compare NHS and private dentists, read patient reviews, and find emergency dental services.</p>
      </section>
      <section>
        <h2>Dental Practices in Slough</h2>
        <p>Comprehensive list of dental services available locally.</p>
      </section>
    `
  },
  'hairdressers': {
    title: 'Slough Hairdressers - Salons & Barbers Guide',
    description: 'Find the best hairdressers in Slough. Compare salons, read reviews, check prices and book appointments.',
    h1: '💇 Slough Hairdressers',
    keywords: ['slough hairdressers', 'hair salons slough', 'barbers slough'],
    content: `
      <section class="intro-section">
        <p>Discover top-rated hairdressers and barbers in Slough. From trendy salons to traditional barber shops.</p>
      </section>
    `
  },
  'gym': {
    title: 'Slough Gym - Fitness Centers & Health Clubs',
    description: 'Find gyms in Slough. Compare membership prices, facilities, classes and opening hours.',
    h1: '💪 Slough Gym',
    keywords: ['slough gym', 'fitness slough', 'health clubs SL1'],
    content: `
      <section class="intro-section">
        <p>Get fit in Slough! Compare local gyms, fitness centers, and health clubs. Find the perfect place for your workout.</p>
      </section>
    `
  },
  'sainsburys': {
    title: 'Sainsburys Slough - Store Info, Hours & Offers',
    description: 'Sainsburys Slough store information. Opening hours, location, services, and current offers.',
    h1: '🛒 Sainsburys Slough',
    keywords: ['sainsburys slough', 'slough sainsburys', 'sainsburys SL1'],
    content: `
      <section class="intro-section">
        <p>Find everything about Sainsburys in Slough including opening times, services, and special offers.</p>
      </section>
    `
  },
  'asda': {
    title: 'ASDA Slough - Superstore Info & Opening Hours',
    description: 'ASDA Slough complete guide. Location, opening hours, services, pharmacy, and George clothing.',
    h1: '🛒 ASDA Slough',
    keywords: ['asda slough', 'slough asda', 'asda SL1'],
    content: `
      <section class="intro-section">
        <p>Your complete guide to ASDA Slough including all departments, services, and facilities.</p>
      </section>
    `
  }
  // Add more pages as needed
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = seoPages[params.slug]
  
  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    }
  }

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords.join(', '),
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
      locale: 'en_GB',
      siteName: 'Slough Directory'
    },
    alternates: {
      canonical: `https://www.slough.co/slough-${params.slug}`
    }
  }
}

// The main page component
export default function SloughSEOPage({ params }: { params: { slug: string } }) {
  const page = seoPages[params.slug]
  
  if (!page) {
    notFound()
  }

  return (
    <div className="seo-page">
      <nav className="breadcrumb">
        <a href="/">Home</a> › <a href="/categories">Directory</a> › {page.h1.replace(/[🍽️🛍️🦷💇💪🛒]/g, '').trim()}
      </nav>
      
      <div className="hero">
        <h1>{page.h1}</h1>
        <p className="subtitle">Your Complete Local Guide - Updated October 2025</p>
      </div>
      
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
      
      <div className="info-grid">
        <div className="info-card">
          <h3>📍 Location</h3>
          <p>Slough, Berkshire SL1/SL2</p>
        </div>
        <div className="info-card">
          <h3>🕐 Updated</h3>
          <p>October 2025</p>
        </div>
        <div className="info-card">
          <h3>📞 Support</h3>
          <p>Local business information</p>
        </div>
      </div>
      
      <section className="cta-section">
        <h2>Add Your Business</h2>
        <p>Are you a local business in Slough? Get listed in our directory today!</p>
      </section>
    </div>
  )
}

// Generate static params for all SEO pages
export async function generateStaticParams() {
  return Object.keys(seoPages).map((slug) => ({
    slug: slug,
  }))
}
