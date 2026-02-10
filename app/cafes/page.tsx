import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Best Cafes in Slough 2026 | Coffee Shops & Breakfast Spots',
  description: 'Find the 19 best cafes in Slough, from independent coffee shops to cosy breakfast spots. Real reviews, opening hours, and local recommendations for Langley, Horndean & Cippenham.',
  keywords: 'slough cafe, cafes slough, coffee shops slough, breakfast slough, slough coffee, cafe near me slough',
}

export const dynamic = 'force-dynamic'

// Cafe type categorization
const cafeTypes: Record<string, string[]> = {
  independent: ['grind', 'chandlers', 'little bay', 'olives', 'bakehouse', 'forge', 'brewsters', 'village bakery'],
  family: ['babyccinos', 'poppins', 'beechwood'],
  chains: ['costa', 'm&s'],
}

function getCafeType(name: string): string {
  const nameLower = name.toLowerCase()
  for (const [type, keywords] of Object.entries(cafeTypes)) {
    if (keywords.some(kw => nameLower.includes(kw))) return type
  }
  return 'other'
}

export default async function CafesPage() {
  const businesses = await getBusinesses('cafes', 'slough')
  
  const sorted = [...businesses].sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0)
    return (b.review_count || 0) - (a.review_count || 0)
  })
  
  const featured = sorted.slice(0, 3)
  const others = sorted.slice(3, 18)

  const totalReviews = sorted.reduce((sum, b) => sum + (b.review_count || 0), 0)
  const avgRating = sorted.length > 0 
    ? (sorted.reduce((sum, b) => sum + (b.rating || 0), 0) / sorted.length).toFixed(1)
    : '0'
  const highRated = sorted.filter(b => (b.rating || 0) >= 4.5).length

  // Group by type
  const byType = {
    independent: sorted.filter(b => getCafeType(b.name) === 'independent'),
    family: sorted.filter(b => getCafeType(b.name) === 'family'),
  }

  const guides = [
    { title: "Best Restaurants", href: "/restaurants", emoji: "🍽️" },
    { title: "Best Pubs", href: "/pubs", emoji: "🍺" },
    { title: "Fish & Chips", href: "/editorial/best-fish-chips-slough-2026", emoji: "🐟" },
    { title: "Sunday Roast Guide", href: "/editorial/ultimate-sunday-roast-guide-slough-horndean-purbrook-2025", emoji: "🥩" },
  ]

  // FAQ data for SEO
  const faqs = [
    {
      question: "What are the best cafes in Slough?",
      answer: `The highest-rated cafes in Slough include ${featured.map(c => c.name).join(', ')}. All About The Grind and The Old Forge Tea Room in Hambledon both hold impressive 4.9-star ratings, while Chandlers is a local favourite with over 280 Google reviews.`
    },
    {
      question: "Where can I find the best coffee in Slough?",
      answer: "For specialty coffee in Slough, locals recommend All About The Grind for expertly crafted espresso drinks, Chandlers for a cosy atmosphere, and Coffee Ville for a relaxed vibe. Many independent cafes source their beans from local roasters."
    },
    {
      question: "Are there family-friendly cafes in Slough?",
      answer: "Yes! Babyccinos Play Cafe is specifically designed for families with young children, featuring a soft play area. Poppins Slough is another family favourite with a kid-friendly menu, and Beechwood Kitchen at Queen Elizabeth Country Park is perfect for families after a walk."
    },
    {
      question: "Which Slough cafes are good for breakfast?",
      answer: "For breakfast in Slough, try Langley Cafe & Restaurant for a full English, Little Bay Eatery for brunch options, or Poppins for a traditional cafe breakfast. Most cafes open from 8-9am on weekdays."
    },
    {
      question: "Are there cafes with outdoor seating in Slough?",
      answer: "Several Slough cafes offer outdoor seating. Beechwood Kitchen & Kiosks at QE Country Park has lovely outdoor space, The Old Forge Tea Room in Hambledon has a garden area, and many town centre cafes have pavement seating in warmer months."
    },
    {
      question: "Which cafes in Slough have WiFi for working?",
      answer: "Most cafes in Slough offer free WiFi. Costa Coffee and Chandlers are popular choices for remote workers, while independent cafes like All About The Grind welcome laptop users during quieter periods."
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">
            Slough<span className="text-blue-600">.co</span>
          </Link>
          <Link href="/categories" className="text-sm text-slate-600 hover:text-slate-900">
            All Categories →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-amber-300 text-sm font-medium mb-4">
            <span>☕</span>
            <span>CAFES & COFFEE SHOPS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Cafes in Slough
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl">
            From cosy independent coffee shops to family-friendly breakfast spots. {sorted.length} cafes ranked by real Google reviews.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Intro Section - SEO Content */}
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Discover Slough's Cafe Scene
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              Slough and the surrounding areas of Langley, Horndean, Cippenham, and Chalvey are home to a fantastic selection of cafes and coffee shops. Whether you're after a quick espresso on London Road, a leisurely brunch with friends, or a family-friendly spot with space for the kids to play, you'll find it here.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our local cafe guide features <strong>{sorted.length} cafes</strong> in the Slough area, from beloved independent coffee shops to reliable high street chains. With <strong>{highRated} cafes rated 4.5 stars or above</strong> and over <strong>{totalReviews.toLocaleString()} combined reviews</strong>, the local coffee scene consistently delivers quality experiences.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Standout spots include The Old Forge Tea Room in nearby Hambledon (perfect for a countryside escape), All About The Grind for specialty coffee enthusiasts, and family favourites like Babyccinos Play Cafe. Many independent cafes offer loyalty cards, homemade cakes, and locally-sourced ingredients.
            </p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-amber-600">{sorted.length}</div>
            <div className="text-sm text-slate-600">Cafes Listed</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-amber-600">{highRated}</div>
            <div className="text-sm text-slate-600">Rated 4.5+</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-amber-600">{totalReviews.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Google Reviews</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-amber-600">{avgRating}★</div>
            <div className="text-sm text-slate-600">Average Rating</div>
          </div>
        </section>

        {/* Featured Cafes */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              🏆 Top Rated Cafes in Slough
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-48">
                    <img
                      src={biz.images?.[0] || '/images/placeholder.jpg'}
                      alt={`${biz.name} - Top rated cafe in Slough`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">
                      #{i + 1}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-yellow-400">★</span>
                        <span className="font-bold">{biz.rating?.toFixed(1)}</span>
                        <span className="text-slate-300 text-sm">({biz.review_count} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {biz.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                      {biz.address}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Independent Cafes Section */}
        {byType.independent.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              ☕ Independent Coffee Shops
            </h2>
            <p className="text-slate-600 mb-6">
              Support local! These independent cafes in Slough offer specialty coffee, homemade treats, and unique atmospheres you won't find in chain stores.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {byType.independent.slice(0, 6).map((biz) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-amber-100">
                    <img
                      src={biz.images?.[0] || '/images/placeholder.jpg'}
                      alt={biz.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-slate-700">{biz.rating?.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({biz.review_count})</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                      {biz.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Family-Friendly Section */}
        {byType.family.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              👨‍👩‍👧 Family-Friendly Cafes
            </h2>
            <p className="text-slate-600 mb-6">
              Taking the kids out for a coffee? These family-friendly cafes in Slough welcome children with open arms, with some offering play areas and kids' menus.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {byType.family.map((biz) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-pink-100">
                    <img
                      src={biz.images?.[0] || '/images/placeholder.jpg'}
                      alt={biz.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-slate-700">{biz.rating?.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({biz.review_count})</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                      {biz.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Cafes Grid */}
        {others.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              All Cafes in Slough
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={biz.images?.[0] || '/images/placeholder.jpg'}
                      alt={biz.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-400">#{i + 4}</span>
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-slate-700">{biz.rating?.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({biz.review_count})</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                      {biz.name}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {biz.address?.split(',')[0]}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions About Slough Cafes
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            📚 Related Slough Guides
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guides.map((guide) => (
              <Link 
                key={guide.href}
                href={guide.href}
                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-amber-50 transition-all"
              >
                <span className="text-2xl">{guide.emoji}</span>
                <span className="font-medium text-slate-900">{guide.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Own a Cafe in Slough?</h2>
          <p className="text-amber-100 mb-6">Get featured in our directory and reach more local customers</p>
          <Link 
            href="/register-business"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-900 hover:bg-amber-50 rounded-full font-medium transition-colors"
          >
            Get Listed →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <Link href="/" className="font-semibold text-slate-900 hover:text-amber-600">
            Slough.co
          </Link>
          <span className="mx-2">•</span>
          Your local business directory
        </div>
      </footer>
    </div>
  )
}
