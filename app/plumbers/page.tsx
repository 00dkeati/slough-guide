import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Plumber Slough | 20 Local Plumbers Rated & Reviewed 2026',
  description: 'Find trusted plumbers in Slough, Langley & Horndean. Emergency plumbers, boiler repairs, bathroom installations. 20 local plumbers with 5-star reviews. Free quotes available.',
  keywords: 'plumber slough, plumbers slough, emergency plumber slough, boiler repair slough, plumbing slough, heating engineer slough',
}

export const dynamic = 'force-dynamic'

// Service type categorization
const serviceTypes: Record<string, string[]> = {
  emergency: ['leakfix', 'drainage', '24'],
  heating: ['heating', 'gas', 'boiler', 'skan'],
  general: ['plumbing', 'plumber'],
}

function getServiceType(name: string): string {
  const nameLower = name.toLowerCase()
  for (const [type, keywords] of Object.entries(serviceTypes)) {
    if (keywords.some(kw => nameLower.includes(kw))) return type
  }
  return 'general'
}

export default async function PlumbersPage() {
  const businesses = await getBusinesses('plumbers', 'slough')
  
  const sorted = [...businesses].sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0)
    return (b.review_count || 0) - (a.review_count || 0)
  })
  
  const featured = sorted.slice(0, 3)
  const others = sorted.slice(3)

  const totalReviews = sorted.reduce((sum, b) => sum + (b.review_count || 0), 0)
  const avgRating = sorted.length > 0 
    ? (sorted.reduce((sum, b) => sum + (b.rating || 0), 0) / sorted.length).toFixed(1)
    : '0'
  const fiveStarCount = sorted.filter(b => (b.rating || 0) >= 4.9).length

  // Group by service type
  const byService = {
    heating: sorted.filter(b => getServiceType(b.name) === 'heating'),
    emergency: sorted.filter(b => getServiceType(b.name) === 'emergency'),
  }

  const guides = [
    { title: "Electricians", href: "/electricians", emoji: "⚡" },
    { title: "Car Mechanics", href: "/car-mechanics", emoji: "🚗" },
    { title: "All Tradespeople", href: "/categories", emoji: "🔧" },
  ]

  // FAQ data targeting AI prompts
  const faqs = [
    {
      question: "What are the best rated plumbers in Slough?",
      answer: `The highest-rated plumbers in Slough include Gas-Fix (5 stars, 451 reviews), SKAN Heating Ltd (5 stars, 188 reviews), and Panda Gas Services (5 stars, 81 reviews). In fact, ${fiveStarCount} of our ${sorted.length} listed plumbers have near-perfect 5-star ratings based on genuine Google reviews.`
    },
    {
      question: "Is there an emergency plumber in Slough available 24/7?",
      answer: "Yes, several Slough plumbers offer emergency and 24/7 services. LeakFix specialises in emergency callouts for water leaks, while Gas-Fix and SKAN Heating provide urgent boiler repairs. For blocked drains, Drainage Slough offers rapid response services. Always check availability when calling."
    },
    {
      question: "How much does a plumber cost in Slough?",
      answer: "Plumber rates in Slough typically range from £40-£80 per hour for general work, with callout fees varying by company. Many local plumbers offer free quotes - including Kingston Plumbing & Heating and H G Plumbing. Emergency and weekend rates may be higher. Always get a written quote before work begins."
    },
    {
      question: "Which Slough plumbers do boiler repairs and installations?",
      answer: "For boiler repairs in Slough, top-rated options include SKAN Heating Ltd (specialists in boiler and heating), Gas-Fix (451 reviews), Kingston Plumbing & Heating, and Panda Gas Services. All are Gas Safe registered for boiler work. Tillett Plumbing & Heating and HW Heating also offer boiler services."
    },
    {
      question: "Do Slough plumbers offer free quotes?",
      answer: "Many plumbers in Slough offer free, no-obligation quotes. This includes H G Plumbing and Heating Services, Kingston Plumbing & Heating, and Panda Gas Services. It's always worth asking when you call - most reputable local plumbers will provide a free estimate before starting work."
    },
    {
      question: "Can I find a plumber in Slough for bathroom installations?",
      answer: "Yes, several local plumbers specialise in bathroom installations. Horndean Plumbing (4.9 stars) handles full bathroom refits, while Wave Plumbing and pipePRO offer bathroom plumbing services. For larger projects, Hambledon Plumbing and Heating Ltd provides complete bathroom installation services."
    },
    {
      question: "Are Slough plumbers Gas Safe registered?",
      answer: "All plumbers working on gas appliances in Slough must be Gas Safe registered by law. Reputable local companies like SKAN Heating, Gas-Fix, Panda Gas Services, and Kingston Plumbing & Heating are fully registered. Always ask to see a Gas Safe ID card before allowing gas work."
    },
    {
      question: "Which plumbers cover Langley, Horndean and Chalvey?",
      answer: "Most Slough plumbers cover the surrounding areas including Langley, Horndean, Chalvey, Cippenham, and Havant. Horndean Plumbing is based in Horndean itself, while companies like H G Plumbing, SKAN Heating, and Panda Gas Services cover the entire SL1, SL2, and PO9 postcode areas."
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
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-blue-300 text-sm font-medium mb-4">
            <span>🔧</span>
            <span>LOCAL TRADESPEOPLE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Plumber Slough
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Find trusted local plumbers for emergency repairs, boiler servicing, and bathroom installations. {sorted.length} plumbers rated by real customers.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Intro Section - SEO Content */}
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Find a Trusted Plumber in Slough
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              Looking for a reliable plumber in Slough? Our directory features <strong>{sorted.length} local plumbing companies</strong> serving Slough, Langley, Horndean, Chalvey, and the surrounding Berkshire area. Whether you need an emergency plumber for a burst pipe, a heating engineer for boiler repairs, or a plumbing specialist for a new bathroom installation, you'll find the right tradesperson here.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              What sets Slough's plumbers apart is their quality of service — an impressive <strong>{fiveStarCount} companies have 5-star ratings</strong> based on over <strong>{totalReviews.toLocaleString()} genuine Google reviews</strong>. From established firms like Gas-Fix with hundreds of reviews to trusted family businesses like Horndean Plumbing, you'll find experienced professionals who take pride in their work.
            </p>
            <p className="text-slate-600 leading-relaxed">
              All gas work in the UK must be carried out by Gas Safe registered engineers. The plumbers listed here include Gas Safe registered heating engineers for boiler installations, servicing, and repairs. Many offer free quotes, competitive pricing, and cover the wider SL1, SL2, and PO9 postcode areas.
            </p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{sorted.length}</div>
            <div className="text-sm text-slate-600">Local Plumbers</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{fiveStarCount}</div>
            <div className="text-sm text-slate-600">5-Star Rated</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{totalReviews.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Google Reviews</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{avgRating}★</div>
            <div className="text-sm text-slate-600">Average Rating</div>
          </div>
        </section>

        {/* Featured Plumbers */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              🏆 Top Rated Plumbers in Slough
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
                        alt={`${biz.name} - Plumber in Slough`}
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
                      {biz.address || 'Slough, Berkshire'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Heating & Boiler Specialists */}
        {byService.heating.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              🔥 Heating Engineers & Boiler Specialists
            </h2>
            <p className="text-slate-600 mb-6">
              Gas Safe registered engineers for boiler installations, repairs, servicing, and central heating work in Slough.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {byService.heating.slice(0, 6).map((biz) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-orange-100 flex items-center justify-center">
                    {biz.images?.[0] ? (
                      <img src={biz.images[0]} alt={biz.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🔥</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-slate-700">{biz.rating?.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({biz.review_count})</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {biz.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Emergency Plumbers */}
        {byService.emergency.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              🚨 Emergency Plumbers & Drainage
            </h2>
            <p className="text-slate-600 mb-6">
              Rapid response plumbers for burst pipes, water leaks, blocked drains, and plumbing emergencies in Slough.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {byService.emergency.map((biz) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border-l-4 border-red-500"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-red-100 flex items-center justify-center">
                    {biz.images?.[0] ? (
                      <img src={biz.images[0]} alt={biz.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🚨</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-slate-700">{biz.rating?.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({biz.review_count})</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {biz.name}
                    </h3>
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
              All Plumbers in Slough
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-blue-100 flex items-center justify-center">
                    {biz.images?.[0] ? (
                      <img src={biz.images[0]} alt={biz.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🔧</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-slate-700">{biz.rating?.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({biz.review_count})</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {biz.name}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {biz.phone || 'Slough'}
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
            Frequently Asked Questions About Plumbers in Slough
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

        {/* Service Areas */}
        <section className="mb-12 bg-blue-50 rounded-2xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Areas Covered by Slough Plumbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">SL1 Postcode</h3>
              <ul className="text-slate-600 space-y-1">
                <li>Slough</li>
                <li>Chalvey</li>
                <li>Widley</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">SL2 Postcode</h3>
              <ul className="text-slate-600 space-y-1">
                <li>Horndean</li>
                <li>Clanfield</li>
                <li>Catherington</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">PO9 Postcode</h3>
              <ul className="text-slate-600 space-y-1">
                <li>Langley</li>
                <li>Havant</li>
                <li>Rowlands Castle</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 mb-2">Nearby Areas</h3>
              <ul className="text-slate-600 space-y-1">
                <li>Cippenham</li>
                <li>Hambledon</li>
                <li>Lovedean</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Related Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            📚 Other Tradespeople in Slough
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
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

        {/* CTA */}
        <section className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Are You a Plumber in Slough?</h2>
          <p className="text-blue-100 mb-6">Get featured in our directory and reach more local customers looking for plumbing services</p>
          <Link 
            href="/register-business"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-900 hover:bg-blue-50 rounded-full font-medium transition-colors"
          >
            Get Listed →
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
