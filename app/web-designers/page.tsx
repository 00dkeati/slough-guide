import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Best Web Designers in Slough 2026 | Digital Agencies & Developers',
  description: 'Find trusted web designers and digital agencies in Slough. Website design, SEO, e-commerce & app development. Rated by local businesses.',
}

export const dynamic = 'force-dynamic'

export default async function WebDesignersPage() {
  const businesses = await getBusinesses('web-designers', 'slough')
  
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
          <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mb-4">
            <span>💻</span>
            <span>DIGITAL SERVICES</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Web Designers in Slough
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-6">
            Professional web design, development & digital marketing. {sorted.length > 0 ? `${sorted.length} agencies` : 'Local agencies'} ranked by real reviews.
          </p>
          
          {/* Stats */}
          {sorted.length > 0 && (
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">{sorted.length}</span>
                <span className="text-slate-400">Web Designers</span>
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
          )}
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-8">
          <p className="text-purple-800 text-sm">
            💡 <strong>Tip:</strong> Get quotes from 2-3 agencies. Ask about their process, timeline, and ongoing support before committing.
          </p>
        </div>

        {/* Featured Web Designers */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              🏆 Top Rated Web Designers
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 bg-gradient-to-br from-purple-600 to-purple-800">
                    {biz.images?.[0] ? (
                      <img
                        src={biz.images[0]}
                        alt={biz.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-50">💻</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-bold">
                      #{i + 1} RATED
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors mb-2">
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

        {/* All Web Designers */}
        {others.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              More Local Web Designers
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
                      <span className="text-2xl">💻</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-purple-600 transition-colors">
                      {biz.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="text-slate-600">{biz.rating?.toFixed(1)}</span>
                      <span className="text-slate-400">({biz.review_count} reviews)</span>
                    </div>
                  </div>
                  <span className="text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
            Digital Services Available
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '🌐', title: 'Website Design', desc: 'Custom & template sites' },
              { icon: '🛒', title: 'E-commerce', desc: 'Online shops & payments' },
              { icon: '📱', title: 'Mobile Apps', desc: 'iOS & Android development' },
              { icon: '🔍', title: 'SEO', desc: 'Search engine optimisation' },
              { icon: '📣', title: 'Digital Marketing', desc: 'Social media & PPC ads' },
              { icon: '🎨', title: 'Branding', desc: 'Logos & visual identity' },
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

        {/* Choosing a Web Designer */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            📖 Choosing a Web Designer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">What to Look For</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>✓ Portfolio of previous work</li>
                <li>✓ Clear pricing & no hidden costs</li>
                <li>✓ Good communication</li>
                <li>✓ Ongoing support & maintenance</li>
                <li>✓ Mobile-responsive designs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Questions to Ask</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• What's included in the price?</li>
                <li>• What's the typical timeline?</li>
                <li>• Who owns the website/code?</li>
                <li>• What ongoing costs are there?</li>
                <li>• Do you provide hosting & domain?</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing Guide */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            💷 Typical Price Ranges
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Website Types</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between"><span>Basic brochure site</span><span className="font-medium">£500-2,000</span></li>
                <li className="flex justify-between"><span>Business website</span><span className="font-medium">£2,000-5,000</span></li>
                <li className="flex justify-between"><span>E-commerce store</span><span className="font-medium">£3,000-10,000+</span></li>
                <li className="flex justify-between"><span>Custom web app</span><span className="font-medium">£5,000-30,000+</span></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Ongoing Costs</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex justify-between"><span>Hosting</span><span className="font-medium">£50-300/year</span></li>
                <li className="flex justify-between"><span>Domain name</span><span className="font-medium">£10-50/year</span></li>
                <li className="flex justify-between"><span>Maintenance</span><span className="font-medium">£50-200/month</span></li>
                <li className="flex justify-between"><span>SSL certificate</span><span className="font-medium">Free-£100/year</span></li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">Prices vary significantly based on requirements - always get detailed quotes.</p>
        </section>

        {/* Areas Covered */}
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Areas Served
          </h2>
          <div className="flex flex-wrap gap-2">
            {['Slough', 'Portsmouth', 'Havant', 'Chichester', 'Southampton', 'Berkshire', 'UK-wide'].map((area) => (
              <span key={area} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                {area}
              </span>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-3">Most web designers work remotely and can serve clients anywhere in the UK.</p>
        </section>

        {/* Related Categories */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Related Services
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/photographers" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">📷</span>
              <span className="font-medium text-slate-900">Photographers</span>
            </Link>
            <Link href="/printers" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🖨️</span>
              <span className="font-medium text-slate-900">Printers</span>
            </Link>
            <Link href="/marketing" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">📣</span>
              <span className="font-medium text-slate-900">Marketing Agencies</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
