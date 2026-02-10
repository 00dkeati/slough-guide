import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Best Restaurants in Slough 2026 | Local Dining Guide',
  description: 'Discover the 22 best restaurants in Slough, from award-winning Indian cuisine to cosy British gastropubs. Real reviews, opening hours, and local recommendations.',
  keywords: 'slough restaurants, restaurants slough, indian restaurants slough, chinese restaurants slough, best restaurants slough, places to eat slough',
}

export const dynamic = 'force-dynamic'

// Cuisine categorization
const cuisineKeywords: Record<string, string[]> = {
  indian: ['shalimar', 'kassia', 'red rose', 'paprika', 'mela', 'indian cottage', 'pasha', 'tandoori', 'curry'],
  chinese: ['dragon', 'china', 'peking', 'oriental', 'happy wok', 'chinese', 'wok'],
  british: ['bar and kitchen', 'exchange', 'jockey', 'four london', 'barnard', 'inn', 'pub'],
}

function getCuisineType(name: string): string {
  const nameLower = name.toLowerCase()
  for (const [cuisine, keywords] of Object.entries(cuisineKeywords)) {
    if (keywords.some(kw => nameLower.includes(kw))) return cuisine
  }
  return 'other'
}

export default async function RestaurantsPage() {
  const businesses = await getBusinesses('restaurants', 'slough')
  
  // Sort by rating then review count
  const sorted = [...businesses].sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0)
    return (b.review_count || 0) - (a.review_count || 0)
  })
  
  const featured = sorted.slice(0, 3)
  const others = sorted.slice(3, 15)

  // Group by cuisine
  const byCuisine = {
    indian: sorted.filter(b => getCuisineType(b.name) === 'indian'),
    chinese: sorted.filter(b => getCuisineType(b.name) === 'chinese'),
    british: sorted.filter(b => getCuisineType(b.name) === 'british'),
  }

  // Related guides
  const guides = [
    { title: "Best Indian Takeaways", href: "/editorial/best-indian-takeaways-slough-2026", emoji: "🍛" },
    { title: "Best Fish & Chips", href: "/editorial/best-fish-chips-slough-2026", emoji: "🐟" },
    { title: "Best Pubs", href: "/editorial/best-pubs-slough-2026", emoji: "🍺" },
    { title: "Best Barbers", href: "/editorial/best-mens-hairdressers-slough-2025", emoji: "💈" },
  ]

  // FAQ data
  const faqs = [
    {
      question: "What are the best-rated restaurants in Slough?",
      answer: `The highest-rated restaurants in Slough are ${featured.map(r => r.name).join(', ')}, all with ratings above 4.7 stars based on real Google reviews. ${featured[0]?.name} leads with ${featured[0]?.review_count} reviews and consistently receives praise for its exceptional food and service.`
    },
    {
      question: "Which Slough restaurants are open late on weekends?",
      answer: "Several Slough restaurants stay open late on Friday and Saturday nights. Four London Road serves until 11pm, while Indian restaurants like Shalimar and Indian Cottage are open until 11:30pm. Koop+Kraft also offers late dining until 11:30pm on weekends."
    },
    {
      question: "Where can I find family-friendly restaurants in Slough?",
      answer: "Many Slough restaurants welcome families. The Exchange offers an all-day menu from 8am with a relaxed atmosphere. Number 73 Bar and Kitchen is popular with families for Sunday lunch, and Four London Road has a dedicated children's menu."
    },
    {
      question: "What are the best Indian restaurants in Slough?",
      answer: `Slough has ${byCuisine.indian.length} excellent Indian restaurants. Kassia Lounge in Cippenham tops the list with a 4.8 rating, followed by Red Rose Lounge and Mela. Shalimar is the most reviewed with nearly 700 Google reviews.`
    },
    {
      question: "Are there Chinese restaurants in Slough?",
      answer: `Yes, there are ${byCuisine.chinese.length} Chinese restaurants in Slough. China Express is the highest-rated at 4.4 stars. Other popular choices include The Golden Dragon on London Road, Dragon Palace, and Oriental Garden for authentic Chinese cuisine.`
    },
    {
      question: "Do any Slough restaurants offer takeaway or delivery?",
      answer: "Most restaurants in Slough offer takeaway, and many are available on delivery apps like Deliveroo and Just Eat. Indian restaurants like Shalimar and Kassia Lounge are particularly popular for delivery, as are the Chinese restaurants including China Express and Happy Wok."
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
          <Link href="/editorial" className="text-sm text-slate-600 hover:text-slate-900">
            All Guides →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
            <span>🍽️</span>
            <span>LOCAL DINING GUIDE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Restaurants in Slough
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            From award-winning Indian cuisine to cosy gastropubs. {sorted.length} restaurants ranked by real Google reviews.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Intro Section - SEO Content */}
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Discover Slough's Restaurant Scene
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              Slough has evolved into a fantastic destination for food lovers, offering an impressive variety of dining options along London Road and throughout the surrounding areas of Langley, Horndean, and Cippenham. Whether you're craving authentic Indian cuisine, fresh Chinese dishes, traditional British gastropub fare, or a quick family-friendly meal, you'll find it here.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our local restaurant guide features <strong>{sorted.length} restaurants</strong> in the Slough area, all ranked by genuine Google reviews from real customers. With an average rating of <strong>{(sorted.reduce((sum, b) => sum + (b.rating || 0), 0) / sorted.length).toFixed(1)} stars</strong> across more than <strong>{sorted.reduce((sum, b) => sum + (b.review_count || 0), 0).toLocaleString()} reviews</strong>, Slough's restaurants consistently deliver quality dining experiences.
            </p>
            <p className="text-slate-600 leading-relaxed">
              From the award-winning Kassia Lounge in Cippenham to the bustling Four London Road in the town centre, there's something for every taste and budget. Many restaurants offer both dine-in and takeaway options, with several available on popular delivery apps.
            </p>
          </div>
        </section>

        {/* Featured Restaurants */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              🏆 Top Rated Restaurants in Slough
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
                      alt={`${biz.name} - Top rated restaurant in Slough`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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
                      {biz.address}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Cuisine Sections */}
        {byCuisine.indian.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              🍛 Indian Restaurants in Slough
            </h2>
            <p className="text-slate-600 mb-6">
              Slough is home to {byCuisine.indian.length} excellent Indian restaurants, from fine dining to casual takeaways. Whether you prefer traditional curries, modern fusion dishes, or classic tandoori specialities, you'll find it here.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {byCuisine.indian.slice(0, 6).map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-orange-100">
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
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {biz.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {byCuisine.chinese.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              🥢 Chinese Restaurants in Slough
            </h2>
            <p className="text-slate-600 mb-6">
              Craving Chinese food in Slough? Choose from {byCuisine.chinese.length} Chinese restaurants and takeaways offering everything from Cantonese classics to Szechuan specialities. Most offer both dine-in and delivery options.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {byCuisine.chinese.slice(0, 6).map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-red-100">
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
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {biz.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {byCuisine.british.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              🍺 British Gastropubs & Restaurants
            </h2>
            <p className="text-slate-600 mb-6">
              For classic British cuisine, Slough's gastropubs and restaurants deliver excellent Sunday roasts, steaks, and seasonal menus. Perfect for family gatherings and special occasions.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {byCuisine.british.slice(0, 6).map((biz, i) => (
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
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                      {biz.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Restaurants Grid */}
        {others.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              All Slough Restaurants
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

        {/* FAQ Section */}
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions About Slough Restaurants
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
            Slough Dining at a Glance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-3xl font-bold text-blue-600">{sorted.length}</div>
              <div className="text-sm text-slate-600">Restaurants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {sorted.filter(b => (b.rating || 0) >= 4.5).length}
              </div>
              <div className="text-sm text-slate-600">Rated 4.5+</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {sorted.reduce((sum, b) => sum + (b.review_count || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Total Reviews</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {(sorted.reduce((sum, b) => sum + (b.rating || 0), 0) / sorted.length).toFixed(1)}
              </div>
              <div className="text-sm text-slate-600">Avg Rating</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Looking for something specific?</h2>
          <p className="text-slate-300 mb-6">Check out our detailed guides with real reviews and photos</p>
          <Link 
            href="/editorial"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors"
          >
            View all guides →
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
