import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Best Hairdressers in Slough 2026 | Hair Salons & Barbers',
  description: 'Find top-rated hairdressers and hair salons in Slough. Cuts, colours, styling & treatments. Rated by local customers.',
}

export const dynamic = 'force-dynamic'

export default async function HairdressersPage() {
  // Get hairdressers from all nearby areas
  const allBusinesses = await Promise.all([
    getBusinesses('hairdressers', 'slough'),
    getBusinesses('hairdressers', 'cowplain'),
    getBusinesses('hairdressers', 'havant'),
    getBusinesses('hairdressers', 'horndean'),
    getBusinesses('hairdressers', 'denmead'),
    getBusinesses('hairdressers', 'purbrook'),
  ])
  const businesses = allBusinesses.flat()
  
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
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-purple-300 text-sm font-medium mb-4">
            <span>💇</span>
            <span>HAIR & BEAUTY</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Hairdressers in Slough
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl">
            Top-rated salons for cuts, colour & styling. {sorted.length} hairdressers ranked by real Google reviews.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Featured Hairdressers */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              🏆 Top Rated Hairdressers
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600">
                    {biz.images?.[0] ? (
                      <img
                        src={biz.images[0]}
                        alt={biz.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-50">💇</span>
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

        {/* All Hairdressers */}
        {others.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              More Local Hairdressers
            </h2>
            <div className="grid gap-4">
              {others.map((biz) => (
                <Link
                  key={biz.id}
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {biz.images?.[0] ? (
                      <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">💇</span>
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
            Popular Services
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '✂️', title: 'Cuts & Styling', desc: 'Women, men & children' },
              { icon: '🎨', title: 'Colour', desc: 'Highlights, balayage & more' },
              { icon: '💆', title: 'Treatments', desc: 'Conditioning & repair' },
              { icon: '👰', title: 'Bridal', desc: 'Wedding hair & trials' },
              { icon: '💅', title: 'Blow Dry', desc: 'Special occasion styling' },
              { icon: '✨', title: 'Extensions', desc: 'Tape-in & bonded' },
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

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions About Hairdressers in Slough
          </h2>
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">What are the best hairdressers in Slough?</h3>
              <p className="text-slate-600">Top-rated hairdressers in Slough include Salon Dolly (4.9 stars, 183 reviews), Hair Addiction Salons, and Review Hair. For specialist colour work, Chandlers and Headromance are highly recommended by locals.</p>
            </div>
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">How much does a haircut cost in Slough?</h3>
              <p className="text-slate-600">Prices vary by salon. A women's cut and blow dry typically ranges from £35-60, while men's cuts are usually £12-25. Colour services start from around £50 for a basic tint up to £150+ for full head highlights or balayage.</p>
            </div>
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Which Slough hair salons do balayage?</h3>
              <p className="text-slate-600">Many salons in Slough offer balayage colouring. Hair Ott, Review Hair, and Salon Dolly are known for their colour expertise. Always book a consultation first to discuss your desired look.</p>
            </div>
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Are there children's hairdressers in Slough?</h3>
              <p className="text-slate-600">Most hair salons in Slough welcome children. Some salons offer special kids' pricing. For a relaxed experience for younger children, phone ahead to book a quieter time slot.</p>
            </div>
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Do Slough salons offer bridal hair services?</h3>
              <p className="text-slate-600">Yes, several salons offer bridal hair styling including trials. Salon Dolly, Hair Addiction, and Headromance all provide wedding hair services. Book well in advance, especially for peak wedding season.</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Can I get hair extensions in Slough?</h3>
              <p className="text-slate-600">Several salons offer hair extension services including tape-in, bonded, and clip-in options. Hair Ott and specialist salons provide consultations to match your hair type and desired look.</p>
            </div>
          </div>
        </section>

        {/* Looking for barbers? */}
        <section className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">💈 Looking for a Barber?</h2>
              <p className="text-slate-300">Check out our guide to the best men's barbers in Slough</p>
            </div>
            <Link 
              href="/editorial/best-mens-hairdressers-slough-2025"
              className="flex-shrink-0 bg-white text-slate-900 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              View Barbers →
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
