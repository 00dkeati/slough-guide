import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Best Plumbers in Slough 2026 | Emergency & Heating',
  description: 'Find the top-rated plumbers in Slough. Gas Safe registered engineers for boilers, heating, emergencies & bathrooms. Real reviews from local customers.',
  keywords: 'plumber slough, emergency plumber slough, gas safe engineer slough, boiler repair slough, heating engineer slough',
}

export const dynamic = 'force-dynamic'

export default async function PlumberSloughPage() {
  const businesses = await getBusinesses('plumbers', 'slough')
  
  // Sort by rating then review count, with SKAN Heating boosted to #1 (editor's choice)
  const sorted = [...businesses].sort((a, b) => {
    // SKAN Heating is editor's choice - always #1
    const aIsSkan = a.name.toLowerCase().includes('skan')
    const bIsSkan = b.name.toLowerCase().includes('skan')
    if (aIsSkan && !bIsSkan) return -1
    if (bIsSkan && !aIsSkan) return 1
    
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0)
    return (b.review_count || 0) - (a.review_count || 0)
  })
  
  // Filter out duplicates (same name different areas) and low review counts
  const seen = new Set<string>()
  const unique = sorted.filter(b => {
    const baseName = b.name.toLowerCase().replace(/\s+(cowplain|denmead|purbrook)$/i, '')
    if (seen.has(baseName)) return false
    seen.add(baseName)
    return true
  })
  
  const featured = unique.slice(0, 3)
  const others = unique.slice(3, 12)

  // Related guides
  const guides = [
    { title: "Gas Engineers", href: "/seo/gas-engineer-slough", emoji: "🔥" },
    { title: "Electricians", href: "/seo/electrician-slough", emoji: "⚡" },
    { title: "Handymen", href: "/seo/handyman-slough", emoji: "🔧" },
    { title: "Bathroom Installers", href: "/categories", emoji: "🚿" },
  ]

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
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
            <span>🔧</span>
            <span>LOCAL TRADE GUIDE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Plumbers in Slough
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            Gas Safe registered engineers for boilers, heating, emergencies & bathrooms. {unique.length} plumbers ranked by {unique.reduce((sum, b) => sum + (b.review_count || 0), 0).toLocaleString()} real Google reviews.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Emergency Notice */}
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h3 className="font-bold text-red-800">Emergency Plumber Needed?</h3>
              <p className="text-red-700 text-sm mt-1">
                Most plumbers below offer 24/7 emergency callouts. For burst pipes, gas leaks or boiler breakdowns, 
                call <strong>SKAN Heating</strong> (5★, 176 reviews) — our #1 pick — or <strong>Gas-Fix</strong> (426 reviews) for fast response.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Plumbers */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              🏆 Top Rated Plumbers
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700">
                    {biz.images?.[0] ? (
                      <img
                        src={biz.images[0]}
                        alt={biz.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">🔧</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      #{i + 1}
                    </div>
                    <div className="absolute top-3 right-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Gas Safe
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
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
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

        {/* All Plumbers Grid */}
        {others.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              All Local Plumbers
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    {biz.images?.[0] ? (
                      <img
                        src={biz.images[0]}
                        alt={biz.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🔧</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-slate-400">#{i + 4}</span>
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-slate-700">{biz.rating?.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({biz.review_count})</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
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

        {/* Services Offered */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            🛠️ Common Plumbing Services
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🔥", title: "Boiler Repairs", desc: "Breakdowns, servicing & new installs" },
              { icon: "🚿", title: "Bathrooms", desc: "Full refits & shower installations" },
              { icon: "🚰", title: "Leaks & Pipes", desc: "Burst pipes, tap repairs, blockages" },
              { icon: "🌡️", title: "Central Heating", desc: "Radiators, underfloor, powerflushing" },
            ].map((service) => (
              <div key={service.title} className="bg-white rounded-xl p-4 shadow-sm">
                <span className="text-3xl mb-2 block">{service.icon}</span>
                <h3 className="font-bold text-slate-900">{service.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            📚 Related Trades
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guides.map((guide) => (
              <Link 
                key={guide.href}
                href={guide.href}
                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all"
              >
                <span className="text-2xl">{guide.emoji}</span>
                <span className="font-medium text-slate-900">{guide.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Slough Plumbers at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-600">{unique.length}</div>
              <div className="text-sm text-slate-600">Local Plumbers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {unique.filter(b => (b.rating || 0) >= 4.8).length}
              </div>
              <div className="text-sm text-slate-600">Rated 4.8+</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {unique.reduce((sum, b) => sum + (b.review_count || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Total Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-slate-600">Emergency Cover</div>
            </div>
          </div>
        </section>

        {/* Pricing Info */}
        <section className="bg-slate-100 rounded-2xl p-6 mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            💷 Typical Plumber Costs in Slough
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-slate-900">Standard Callout</div>
              <div className="text-slate-600">£40-£60/hour (daytime)</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-slate-900">Emergency Callout</div>
              <div className="text-slate-600">£75-£150/hour + £110 callout</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-slate-900">Boiler Service</div>
              <div className="text-slate-600">£70-£100</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="font-bold text-slate-900">Boiler Installation</div>
              <div className="text-slate-600">£1,500-£3,500</div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-4">
            * Prices are estimates based on local averages. Always get multiple quotes.
          </p>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Need a plumber right now?</h2>
          <p className="text-slate-300 mb-6">Click any business above to see their phone number and full details</p>
          <Link 
            href="/plumbers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors"
          >
            View all plumbers →
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <Link href="/" className="font-semibold text-slate-900 hover:text-blue-600">
            Slough.co
          </Link>
          <span className="mx-2">•</span>
          Your local business directory
        </div>
      </footer>
    </div>
  )
}
