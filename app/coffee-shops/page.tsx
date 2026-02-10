import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Best Coffee Shops in Slough 2026 | Cafes & Coffee Near You',
  description: 'Find the best coffee shops and cafes in Slough, Langley & Horndean. Independent cafes, chains, breakfast spots. Rated by local customers.',
}

export const dynamic = 'force-dynamic'

export default async function CoffeeShopsPage() {
  const businesses = await getBusinesses('cafes', 'slough')
  
  // Sort by rating then review count
  const sorted = [...businesses].sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0)
    return (b.review_count || 0) - (a.review_count || 0)
  })
  
  const featured = sorted.slice(0, 3)
  const others = sorted.slice(3, 15)

  // Calculate stats
  const totalReviews = sorted.reduce((sum, b) => sum + (b.review_count || 0), 0)
  const avgRating = sorted.length > 0 
    ? (sorted.reduce((sum, b) => sum + (b.rating || 0), 0) / sorted.length).toFixed(1)
    : '0'

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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-4">
            <span>☕</span>
            <span>CAFES & COFFEE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Coffee Shops in Slough
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-6">
            Great coffee, cosy cafes & tasty treats. {sorted.length} coffee shops ranked by real Google reviews.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{sorted.length}</span>
              <span className="text-slate-400">Coffee Shops</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{totalReviews.toLocaleString()}</span>
              <span className="text-slate-400">Total Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{avgRating}★</span>
              <span className="text-slate-400">Avg Rating</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-amber-800 text-sm">
            ☕ <strong>Local tip:</strong> Many independent cafes offer loyalty cards - ask at the counter! Support local and save.
          </p>
        </div>

        {/* Featured Coffee Shops */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              🏆 Top Rated Coffee Shops
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 bg-gradient-to-br from-amber-600 to-amber-800">
                    {biz.images?.[0] ? (
                      <img
                        src={biz.images[0]}
                        alt={biz.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-50">☕</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-bold">
                      #{i + 1} RATED
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors mb-2">
                      {biz.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center text-yellow-500">
                        {'★'.repeat(Math.round(biz.rating || 0))}
                      </div>
                      <span className="text-sm text-slate-600">
                        {biz.rating?.toFixed(1)} ({biz.review_count} reviews)
                      </span>
                    </div>
                    {biz.address && (
                      <p className="text-sm text-slate-500 line-clamp-1">
                        📍 {biz.address}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Coffee Shops */}
        {others.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              More Local Coffee Shops
            </h2>
            <div className="grid gap-4">
              {others.map((biz) => (
                <Link
                  key={biz.id}
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {biz.images?.[0] ? (
                      <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">☕</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {biz.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="text-slate-600">{biz.rating?.toFixed(1)}</span>
                      <span className="text-slate-400">({biz.review_count} reviews)</span>
                    </div>
                  </div>
                  <span className="text-amber-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* What's On Offer */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            What You'll Find
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '☕', title: 'Specialty Coffee', desc: 'Lattes, flat whites & more' },
              { icon: '🥐', title: 'Fresh Pastries', desc: 'Croissants & baked treats' },
              { icon: '🥪', title: 'Light Lunches', desc: 'Sandwiches, soups & salads' },
              { icon: '🍰', title: 'Cakes & Desserts', desc: 'Homemade sweet treats' },
              { icon: '🌱', title: 'Vegan Options', desc: 'Plant-based drinks & food' },
              { icon: '📶', title: 'Free WiFi', desc: 'Work-friendly spaces' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coffee Guide */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            ☕ Coffee Guide
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Popular Drinks</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><strong>Flat White</strong> - Espresso with velvety steamed milk</li>
                <li><strong>Americano</strong> - Espresso topped with hot water</li>
                <li><strong>Latte</strong> - Espresso with lots of steamed milk</li>
                <li><strong>Cappuccino</strong> - Equal parts espresso, milk & foam</li>
                <li><strong>Mocha</strong> - Chocolate meets coffee</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Good to Know</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>✓ Most cafes offer oat, soy & almond milk</li>
                <li>✓ Ask about decaf options</li>
                <li>✓ Many offer takeaway discounts for reusable cups</li>
                <li>✓ Check opening times - some close early!</li>
                <li>✓ Dog-friendly cafes are marked on their pages</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Areas Covered */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Areas Covered
          </h2>
          <div className="flex flex-wrap gap-2">
            {['Slough', 'Langley', 'Horndean', 'Chalvey', 'Cippenham', 'Lovedean', 'Havant'].map((area) => (
              <span key={area} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                {area}
              </span>
            ))}
          </div>
        </section>

        {/* Related Categories */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Related Categories
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/restaurants" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🍽️</span>
              <span className="font-medium text-slate-900">Restaurants</span>
            </Link>
            <Link href="/bakeries" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🥖</span>
              <span className="font-medium text-slate-900">Bakeries</span>
            </Link>
            <Link href="/takeaways" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🥡</span>
              <span className="font-medium text-slate-900">Takeaways</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
