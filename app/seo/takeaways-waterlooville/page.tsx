import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Best Takeaways in Slough 2026 | Chinese, Indian, Fish & Chips',
  description: 'Find the best takeaways in Slough. Chinese, Indian, Fish & Chips, Pizza and more — all ranked by real Google reviews from local customers.',
  keywords: 'takeaway slough, chinese takeaway slough, indian takeaway slough, fish and chips slough, pizza slough',
}

export const dynamic = 'force-dynamic'

// Cuisine type detection
function getCuisineType(name: string, category: string): string {
  const n = name.toLowerCase()
  if (n.includes('chinese') || n.includes('dragon') || n.includes('oriental') || n.includes('wok') || n.includes('peking') || n.includes('palace') || n.includes('express') && n.includes('china')) return 'chinese'
  if (n.includes('indian') || n.includes('cottage') || n.includes('shalimar') || n.includes('mela') || n.includes('kassia') || n.includes('paprika') || n.includes('tandoori') || n.includes('curry')) return 'indian'
  if (category === 'fish-chips' || n.includes('fish') || n.includes('chippy') || n.includes('fry')) return 'fish-chips'
  if (n.includes('pizza') || n.includes('domino') || n.includes('papa')) return 'pizza'
  if (n.includes('kebab') || n.includes('grill')) return 'kebab'
  return 'other'
}

function getCuisineEmoji(type: string): string {
  const emojis: Record<string, string> = {
    'chinese': '🥡',
    'indian': '🍛',
    'fish-chips': '🐟',
    'pizza': '🍕',
    'kebab': '🥙',
    'other': '🍴'
  }
  return emojis[type] || '🍴'
}

function getCuisineLabel(type: string): string {
  const labels: Record<string, string> = {
    'chinese': 'Chinese',
    'indian': 'Indian',
    'fish-chips': 'Fish & Chips',
    'pizza': 'Pizza',
    'kebab': 'Kebab',
    'other': 'Takeaway'
  }
  return labels[type] || 'Takeaway'
}

export default async function TakeawaysSloughPage() {
  // Get all food-related businesses
  const [takeaways, fishChips, restaurants] = await Promise.all([
    getBusinesses('takeaways', 'slough'),
    getBusinesses('fish-chips', 'slough'),
    getBusinesses('restaurants', 'slough'),
  ])
  
  // Combine and filter for takeaway-style places
  const allFood = [...takeaways, ...fishChips, ...restaurants]
  
  // Filter for takeaway-focused businesses
  const takeawayKeywords = /chinese|dragon|oriental|wok|peking|palace|express|indian|cottage|shalimar|mela|kassia|tandoori|curry|kebab|pizza|fish|chip|fry|takeaway|grill/i
  
  const filtered = allFood.filter(b => {
    // Skip obvious non-takeaways
    if (b.name.toLowerCase().includes('tesco') || b.name.toLowerCase().includes('costa')) return false
    if (b.name.toLowerCase().includes('premier inn')) return false
    if (b.name.toLowerCase().includes('bar and kitchen')) return false
    // Include if matches keywords or is in takeaway/fish-chips category
    return b.category === 'takeaways' || b.category === 'fish-chips' || takeawayKeywords.test(b.name)
  })
  
  // Remove duplicates and sort
  const seen = new Set<string>()
  const unique = filtered.filter(b => {
    const key = b.name.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0)
    return (b.review_count || 0) - (a.review_count || 0)
  })
  
  // Group by cuisine
  const byCuisine = unique.reduce((acc, biz) => {
    const type = getCuisineType(biz.name, biz.category)
    if (!acc[type]) acc[type] = []
    acc[type].push(biz)
    return acc
  }, {} as Record<string, typeof unique>)
  
  const featured = unique.slice(0, 3)
  const totalReviews = unique.reduce((sum, b) => sum + (b.review_count || 0), 0)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">
            Slough<span className="text-blue-600">.co</span>
          </Link>
          <Link href="/editorial" className="text-sm text-slate-600 hover:text-slate-900">
            All Guides →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-600 via-red-600 to-red-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-orange-200 text-sm font-medium mb-4">
            <span>🥡</span>
            <span>TAKEAWAY BATTLE ROYALE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Takeaways in Slough
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl">
            Chinese vs Indian vs Fish & Chips — {unique.length} takeaways ranked by {totalReviews.toLocaleString()} real Google reviews. Who takes the crown?
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Cuisine Jump */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(byCuisine).map(([type, items]) => (
            <a 
              key={type}
              href={`#${type}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-sm font-medium"
            >
              <span>{getCuisineEmoji(type)}</span>
              <span>{getCuisineLabel(type)}</span>
              <span className="text-slate-400">({items.length})</span>
            </a>
          ))}
        </div>

        {/* Top 3 Overall */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            🏆 Top Rated Overall
          </h2>
          <p className="text-slate-600 mb-6">The champions across all cuisines</p>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((biz, i) => {
              const cuisine = getCuisineType(biz.name, biz.category)
              return (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 bg-gradient-to-br from-orange-500 to-red-600">
                    {biz.images?.[0] ? (
                      <img
                        src={biz.images[0]}
                        alt={biz.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">{getCuisineEmoji(cuisine)}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                      #{i + 1}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 text-slate-800 text-xs font-bold px-2 py-1 rounded">
                      {getCuisineEmoji(cuisine)} {getCuisineLabel(cuisine)}
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
                    <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {biz.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                      {biz.address}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* By Cuisine Sections */}
        {['indian', 'chinese', 'fish-chips', 'kebab', 'pizza', 'other'].map(cuisineType => {
          const items = byCuisine[cuisineType]
          if (!items || items.length === 0) return null
          
          return (
            <section key={cuisineType} id={cuisineType} className="mb-12 scroll-mt-20">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {getCuisineEmoji(cuisineType)} Best {getCuisineLabel(cuisineType)}
              </h2>
              <p className="text-slate-600 mb-6">
                {items.length} {getCuisineLabel(cuisineType).toLowerCase()} spots ranked
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.slice(0, 6).map((biz, i) => (
                  <Link 
                    key={biz.id} 
                    href={`/biz/${biz.slug}`}
                    className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                      {biz.images?.[0] ? (
                        <img
                          src={biz.images[0]}
                          alt={biz.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{getCuisineEmoji(cuisineType)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-slate-400">#{i + 1}</span>
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium text-slate-700">{biz.rating?.toFixed(1)}</span>
                        <span className="text-xs text-slate-400">({biz.review_count})</span>
                      </div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors truncate">
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
          )
        })}

        {/* Battle Stats */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 mb-12 text-white">
          <h2 className="text-xl font-bold mb-6">
            📊 The Slough Takeaway Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-orange-400">{unique.length}</div>
              <div className="text-sm text-slate-300">Total Takeaways</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">
                {(unique.reduce((sum, b) => sum + (b.rating || 0), 0) / unique.length).toFixed(1)}
              </div>
              <div className="text-sm text-slate-300">Avg Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">
                {totalReviews.toLocaleString()}
              </div>
              <div className="text-sm text-slate-300">Total Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400">
                {unique.filter(b => (b.rating || 0) >= 4.5).length}
              </div>
              <div className="text-sm text-slate-300">Rated 4.5+</div>
            </div>
          </div>
          
          {/* Cuisine Breakdown */}
          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="font-bold mb-4">Cuisine Breakdown</h3>
            <div className="flex flex-wrap gap-4">
              {Object.entries(byCuisine).sort((a, b) => b[1].length - a[1].length).map(([type, items]) => (
                <div key={type} className="flex items-center gap-2">
                  <span>{getCuisineEmoji(type)}</span>
                  <span className="text-slate-300">{getCuisineLabel(type)}:</span>
                  <span className="font-bold text-orange-400">{items.length}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            📚 Related Guides
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Best Indian Takeaways", href: "/editorial/best-indian-takeaways-slough-2026", emoji: "🍛" },
              { title: "Best Fish & Chips", href: "/editorial/best-fish-chips-slough-2026", emoji: "🐟" },
              { title: "Best Restaurants", href: "/restaurants", emoji: "🍽️" },
              { title: "Best Pubs", href: "/editorial/best-pubs-slough-2026", emoji: "🍺" },
            ].map((guide) => (
              <Link 
                key={guide.href}
                href={guide.href}
                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-orange-50 transition-all"
              >
                <span className="text-2xl">{guide.emoji}</span>
                <span className="font-medium text-slate-900">{guide.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Hungry now?</h2>
          <p className="text-orange-100 mb-6">Click any takeaway above to see their menu, phone number and full details</p>
          <Link 
            href="/search?q=takeaway"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 rounded-full font-medium transition-colors"
          >
            Search all food →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <Link href="/" className="font-semibold text-slate-900 hover:text-orange-600">
            Slough.co
          </Link>
          <span className="mx-2">•</span>
          Your local business directory
        </div>
      </footer>
    </div>
  )
}
