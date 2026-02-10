import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Best Estate Agents in Slough 2026 | Local Property Experts - Compare All',
  description: 'Compare top-rated estate agents in Slough, Langley & Horndean. Expert property sales, lettings, valuations. Read real customer reviews, compare fees & services. Find your perfect agent.',
  keywords: 'estate agents slough, slough estate agents, property agents, letting agents slough, valuations slough',
}

export const dynamic = 'force-dynamic'

export default async function EstateAgentsPage() {
  const businesses = await getBusinesses('estate-agents', 'slough')
  
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
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-4">
            <span>🏡</span>
            <span>PROPERTY</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Estate Agents in Slough
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mb-6">
            Trusted local estate agents for sales, lettings & valuations. {sorted.length} agents ranked by real Google reviews.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{sorted.length}</span>
              <span className="text-slate-400">Estate Agents</span>
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
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8">
          <p className="text-emerald-800 text-sm">
            💡 <strong>Tip:</strong> Compare at least 3 agents before listing. Check their recent sales, marketing strategy, and fee structure.
          </p>
        </div>

        {/* Featured Estate Agents */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              🏆 Top Rated Estate Agents
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 bg-gradient-to-br from-emerald-600 to-emerald-800">
                    {biz.images?.[0] ? (
                      <img
                        src={biz.images[0]}
                        alt={biz.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-50">🏡</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-bold">
                      #{i + 1} RATED
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
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

        {/* All Estate Agents */}
        {others.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              More Local Estate Agents
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
                      <span className="text-2xl">🏡</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {biz.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-yellow-500">★</span>
                      <span className="text-slate-600">{biz.rating?.toFixed(1)}</span>
                      <span className="text-slate-400">({biz.review_count} reviews)</span>
                    </div>
                  </div>
                  <span className="text-emerald-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
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
            Common Estate Agent Services
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: '🏠', title: 'Property Sales', desc: 'Full marketing & viewings' },
              { icon: '🔑', title: 'Lettings', desc: 'Tenant finding & management' },
              { icon: '📊', title: 'Valuations', desc: 'Free market appraisals' },
              { icon: '📝', title: 'Conveyancing', desc: 'Legal referral services' },
              { icon: '📸', title: 'Photography', desc: 'Professional property photos' },
              { icon: '🌐', title: 'Online Listings', desc: 'Rightmove, Zoopla & more' },
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

        {/* Choosing an Agent */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            🎯 How to Choose the Right Estate Agent
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed mb-4">
              Choosing the right estate agent is crucial to successfully selling or buying your home in Slough. The best agents combine local market knowledge, professional marketing, and excellent customer service to achieve the best outcomes for their clients.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">✓ What to Look For</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• <strong>Local Expertise:</strong> Deep knowledge of Slough, Langley, Horndean neighborhoods</li>
                  <li>• <strong>Recent Sales:</strong> Check their successful sales in your area and price range</li>
                  <li>• <strong>Marketing Quality:</strong> Professional photos, detailed descriptions, multi-platform listings</li>
                  <li>• <strong>Communication:</strong> Responsive, proactive updates throughout the process</li>
                  <li>• <strong>Reviews & Ratings:</strong> Consistently positive feedback from real customers</li>
                  <li>• <strong>Professional Accreditations:</strong> NAEA, ARLA, Ombudsman membership</li>
                </ul>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">❓ Questions to Ask</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>• What's your average time to sell properties like mine?</li>
                  <li>• How many properties do you have on your books currently?</li>
                  <li>• What's your sale price to asking price ratio?</li>
                  <li>• What marketing channels do you use? (Rightmove, Zoopla, etc.)</li>
                  <li>• What are your fees and are there any hidden costs?</li>
                  <li>• Will I have a dedicated agent or multiple contacts?</li>
                  <li>• How often will you provide updates?</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Fee Comparison */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            💰 Estate Agent Fees in Slough
          </h2>
          <div className="prose prose-amber max-w-none">
            <p className="text-slate-700 leading-relaxed mb-4">
              Estate agent fees in Slough typically range from <strong>0.9% to 1.8%</strong> of the sale price plus VAT, though this varies by service level and property value. Understanding fee structures helps you budget and choose the right agent for your needs.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Budget Service</h3>
                <div className="text-2xl font-bold text-orange-600 mb-2">0.9-1.2%</div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Online listing only</li>
                  <li>• DIY viewings</li>
                  <li>• Basic photos</li>
                  <li>• Pay upfront</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-emerald-500">
                <div className="text-xs font-bold text-emerald-600 mb-2">MOST POPULAR</div>
                <h3 className="font-semibold text-slate-900 mb-2">Standard Service</h3>
                <div className="text-2xl font-bold text-emerald-600 mb-2">1.2-1.5%</div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Professional photos</li>
                  <li>• Rightmove & Zoopla</li>
                  <li>• Agent conducts viewings</li>
                  <li>• No sale, no fee</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Premium Service</h3>
                <div className="text-2xl font-bold text-purple-600 mb-2">1.5-1.8%</div>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• Pro photography & video</li>
                  <li>• Floor plans & EPC</li>
                  <li>• Premium marketing</li>
                  <li>• Sole agency priority</li>
                </ul>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-slate-700 mb-2">
                <strong>Example:</strong> For a £300,000 property in Slough, expect to pay:
              </p>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Budget: £3,240-£4,320 inc VAT (1-1.2%)</li>
                <li>• Standard: £4,320-£5,400 inc VAT (1.2-1.5%)</li>
                <li>• Premium: £5,400-£6,480 inc VAT (1.5-1.8%)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Buying vs Selling Guide */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            📖 Complete Property Guide
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Selling Your Home in Slough</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>✓ Get 3 valuations from different agents to compare</li>
                <li>✓ Compare fee structures (% vs fixed, sole vs multi-agency)</li>
                <li>✓ Check their recent sales in your area and price bracket</li>
                <li>✓ Review their marketing quality (photos, descriptions, portals)</li>
                <li>✓ Ask about their average time to sell</li>
                <li>✓ Ensure they're members of property Ombudsman schemes</li>
                <li>✓ Understand the timeline: valuation → listing → offers → completion (8-12 weeks typical)</li>
              </ul>
              <div className="mt-4">
                <Link href="/houses-for-sale-slough" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  → View Slough Property Market Guide
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Buying a Home in Slough</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>✓ Register with multiple agents to see all available properties</li>
                <li>✓ Get mortgage agreement in principle before viewing</li>
                <li>✓ Research the local area thoroughly (schools, transport, amenities)</li>
                <li>✓ Book multiple viewings and visit at different times of day</li>
                <li>✓ Have a solicitor ready to act quickly when you find your home</li>
                <li>✓ Budget for surveys, legal fees, stamp duty, and moving costs</li>
                <li>✓ Consider areas: Slough, Langley, Horndean, Cippenham each offer different benefits</li>
              </ul>
              <div className="mt-4">
                <Link href="/houses-for-sale-slough" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  → Read Complete House Buying Guide
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Letting Agents Section */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            🔑 Looking for Letting Agents?
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Many estate agents in Slough also offer lettings services for landlords and tenants. Whether you're looking to rent out your property or searching for a rental home, local letting agents provide tenant finding, property management, and full compliance with rental regulations.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">For Landlords</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Tenant finding services</li>
                <li>• Full property management</li>
                <li>• Rent collection & arrears management</li>
                <li>• Property inspections & maintenance</li>
                <li>• Legal compliance & safety certificates</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">For Tenants</h3>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Wide selection of rental properties</li>
                <li>• Professional property viewings</li>
                <li>• Tenancy agreement support</li>
                <li>• Deposit protection schemes</li>
                <li>• 24/7 emergency maintenance</li>
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
            {['Slough', 'Langley', 'Horndean', 'Chalvey', 'Cippenham', 'Lovedean', 'Clanfield', 'Havant', 'Leigh Park'].map((area) => (
              <span key={area} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                {area}
              </span>
            ))}
          </div>
        </section>

        {/* Comprehensive FAQs */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            ❓ Estate Agent FAQs
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'How do I choose the best estate agent in Slough?',
                a: 'Compare at least 3 agents by requesting valuations. Check their recent sales in your area, review their marketing quality (photos, portal listings), read customer reviews, and compare fee structures. The best agent combines local expertise, professional marketing, transparent pricing, and excellent communication.'
              },
              {
                q: 'What are typical estate agent fees in Slough?',
                a: 'Fees typically range from 0.9% to 1.8% of the sale price plus VAT. Budget online-only services charge 0.9-1.2%, standard high street agents 1.2-1.5%, and premium services 1.5-1.8%. For a £300,000 property, expect £3,240-£6,480 inc VAT depending on service level.'
              },
              {
                q: 'Should I use sole agency or multiple agents?',
                a: 'Sole agency (one agent) usually offers lower fees (1-1.3%) and more commitment from the agent. Multiple agency (2+ agents) costs more (1.5-2%) but provides wider market exposure. Most sellers in Slough start with sole agency for 8-12 weeks, then consider multi-agency if needed.'
              },
              {
                q: 'How long does it take to sell a house in Slough?',
                a: 'The average property in Slough takes 4-8 weeks to find a buyer after listing, then 8-12 weeks to complete the legal process. Total time from listing to moving: 12-20 weeks. Well-priced properties in popular areas like Langley and Horndean often sell faster.'
              },
              {
                q: 'Do estate agents in Slough also do lettings?',
                a: 'Yes, many estate agents offer both sales and lettings services. They can help landlords find tenants, manage properties, and handle rent collection. For tenants, they provide access to rental properties and handle tenancy agreements. Letting agent fees for landlords are typically 8-12% of monthly rent.'
              },
              {
                q: 'What areas do Slough estate agents cover?',
                a: 'Local agents typically cover Slough town centre, Langley, Horndean, Cippenham, Chalvey, Leigh Park, Clanfield, and Widley. Many also extend to Havant, Petersfield, and surrounding Berkshire villages. Check with individual agents for their exact coverage area.'
              },
              {
                q: 'What should I prepare before contacting estate agents?',
                a: 'Have your property details ready (bedrooms, bathrooms, square footage, key features), know your desired timeline, understand your asking price expectations, and prepare questions about fees and services. If buying, get a mortgage agreement in principle first to show you\'re a serious buyer.'
              },
              {
                q: 'Can I negotiate estate agent fees?',
                a: 'Yes, fees are negotiable, especially in competitive markets or for higher-value properties. Agents may offer discounts for sole agency agreements, quick sales, or if you\'re also buying through them. However, choosing an agent solely on low fees may not deliver the best sale outcome.'
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">{faq.q}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Categories */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Related Services
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/houses-for-sale-slough" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🏡</span>
              <span className="font-medium text-slate-900">Houses for Sale</span>
            </Link>
            <Link href="/area/cowplain" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">📍</span>
              <span className="font-medium text-slate-900">Langley Area Guide</span>
            </Link>
            <Link href="/area/horndean" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🏘️</span>
              <span className="font-medium text-slate-900">Horndean Area Guide</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
