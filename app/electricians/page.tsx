import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Best Electricians in Slough 2026 | Local Electrical Services',
  description: 'Find trusted electricians in Slough, Langley & Horndean. Rewiring, fuse boards, lighting & emergency callouts. NICEIC certified.',
}

export const dynamic = 'force-dynamic'

export default async function ElectriciansPage() {
  const businesses = await getBusinesses('electricians', 'slough')
  
  // Sort by rating then review count
  const sorted = [...businesses].sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0)
    return (b.review_count || 0) - (a.review_count || 0)
  })
  
  const featured = sorted.slice(0, 3)
  const others = sorted.slice(3, 15)

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
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-amber-200 text-sm font-medium mb-4">
            <span>⚡</span>
            <span>LOCAL TRADESPEOPLE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Electricians in Slough
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl">
            Trusted local electricians for all your electrical needs. {sorted.length} electricians ranked by real Google reviews.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-amber-800 text-sm">
            ⚠️ <strong>Safety First:</strong> Always use qualified electricians for electrical work. Look for NICEIC or NAPIT certification.
          </p>
        </div>

        {/* Featured Electricians */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              🏆 Top Rated Electricians
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 bg-gradient-to-br from-amber-500 to-orange-600">
                    {biz.images?.[0] ? (
                      <img
                        src={biz.images[0]}
                        alt={biz.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-50">⚡</span>
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

        {/* All Electricians */}
        {others.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              More Local Electricians
            </h2>
            <div className="grid gap-4">
              {others.map((biz) => (
                <Link
                  key={biz.id}
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {biz.images?.[0] ? (
                      <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">⚡</span>
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

        {/* Services Info */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Common Electrical Services
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '🔌', title: 'Rewiring', desc: 'Full & partial house rewires' },
              { icon: '📦', title: 'Fuse Boards', desc: 'Consumer unit upgrades' },
              { icon: '💡', title: 'Lighting', desc: 'Indoor & outdoor installation' },
              { icon: '🔋', title: 'EV Chargers', desc: 'Home charging points' },
              { icon: '🏠', title: 'Testing', desc: 'EICR certificates' },
              { icon: '🆘', title: '24/7 Emergency', desc: 'Fault finding & repairs' },
            ].map((service) => (
              <div key={service.title} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <p className="font-medium text-slate-900">{service.title}</p>
                  <p className="text-sm text-slate-500">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Certifications to Look For
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="font-bold text-green-800">NICEIC</p>
              <p className="text-sm text-green-600">National Inspection Council</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="font-bold text-blue-800">NAPIT</p>
              <p className="text-sm text-blue-600">National Association</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="font-bold text-purple-800">Part P</p>
              <p className="text-sm text-purple-600">Building Regulations</p>
            </div>
          </div>
        </section>

        {/* Areas Covered */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Areas Covered
          </h2>
          <div className="flex flex-wrap gap-2">
            {['Slough', 'Langley', 'Horndean', 'Chalvey', 'Cippenham', 'Lovedean', 'Clanfield', 'Havant'].map((area) => (
              <span key={area} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                {area}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
