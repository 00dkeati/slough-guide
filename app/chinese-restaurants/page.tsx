import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Chinese Restaurants Slough | Best Chinese Takeaways 2026',
  description: 'Find the best Chinese restaurants and takeaways in Slough. From Cantonese classics to Szechuan dishes. 6+ Chinese restaurants with real reviews.',
  keywords: 'chinese restaurants slough, chinese takeaway slough, chinese food slough, best chinese slough',
}

export const dynamic = 'force-dynamic'

export default async function ChineseRestaurantsPage() {
  const allRestaurants = await getBusinesses('restaurants', 'slough')
  
  const chineseKeywords = ['dragon', 'china', 'peking', 'oriental', 'happy wok', 'chinese', 'wok', 'jade', 'golden']
  const businesses = allRestaurants.filter(b => 
    chineseKeywords.some(kw => b.name.toLowerCase().includes(kw))
  )
  
  const sorted = [...businesses].sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0)
    return (b.review_count || 0) - (a.review_count || 0)
  })

  const totalReviews = sorted.reduce((sum, b) => sum + (b.review_count || 0), 0)
  const avgRating = sorted.length > 0 
    ? (sorted.reduce((sum, b) => sum + (b.rating || 0), 0) / sorted.length).toFixed(1)
    : '0'

  const faqs = [
    {
      question: "What is the best Chinese restaurant in Slough?",
      answer: "China Express is the highest-rated Chinese restaurant in Slough with a 4.4-star rating and consistent praise for authentic flavours. The Golden Dragon on London Road is also highly recommended for its traditional Cantonese dishes and generous portions."
    },
    {
      question: "Which Chinese takeaways in Slough deliver?",
      answer: "Most Chinese restaurants in Slough offer delivery. China Express, Happy Wok, Dragon Palace, and Oriental Garden all deliver directly or through apps like Just Eat and Deliveroo. Delivery areas typically cover Slough, Langley, and Chalvey."
    },
    {
      question: "Are there any late-night Chinese takeaways in Slough?",
      answer: "Several Chinese takeaways in Slough stay open late, particularly on weekends. Dragon Palace and Happy Wok typically serve until 10-11pm. Check individual restaurant times as hours may vary."
    },
    {
      question: "Do Chinese restaurants in Slough offer vegetarian options?",
      answer: "Yes, all Chinese restaurants in Slough offer vegetarian dishes including tofu stir-fries, vegetable spring rolls, and meat-free versions of popular dishes. The Golden Dragon and China Express have extensive vegetarian sections on their menus."
    },
    {
      question: "Which Chinese restaurants in Slough are best for families?",
      answer: "Peking Garden and The Golden Dragon are both family-friendly with varied menus that appeal to all ages. Many Chinese restaurants in Slough offer set meals that are perfect for sharing with the family."
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">Slough<span className="text-blue-600">.co</span></Link>
          <Link href="/restaurants" className="text-sm text-slate-600 hover:text-slate-900">All Restaurants →</Link>
        </div>
      </header>

      <div className="bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-red-300 text-sm font-medium mb-4">
            <span>🥢</span><span>CUISINE GUIDE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Chinese Restaurants in Slough</h1>
          <p className="text-lg text-red-100 max-w-2xl">
            From Cantonese classics to Szechuan specialities. {sorted.length} Chinese restaurants and takeaways rated by locals.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Chinese Food in Slough</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              Craving Chinese food in Slough? Whether you're after a quick takeaway or a sit-down meal, the local Chinese restaurant scene has you covered. From traditional Cantonese dishes to spicy Szechuan cuisine, you'll find authentic flavours and generous portions throughout the area.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our directory features <strong>{sorted.length} Chinese restaurants and takeaways</strong> serving Slough, Langley, and Horndean. With an average rating of <strong>{avgRating} stars</strong> across <strong>{totalReviews.toLocaleString()} reviews</strong>, locals have plenty of quality options to choose from.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Popular choices include China Express for consistent quality, The Golden Dragon for traditional dishes, and Happy Wok for quick takeaway. Most offer both collection and delivery services.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">{sorted.length}</div>
            <div className="text-sm text-slate-600">Chinese Restaurants</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">{sorted.filter(b => (b.rating || 0) >= 4).length}</div>
            <div className="text-sm text-slate-600">Rated 4+</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">{totalReviews.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Reviews</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">{avgRating}★</div>
            <div className="text-sm text-slate-600">Avg Rating</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🥢 All Chinese Restaurants in Slough</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((biz, i) => (
              <Link key={biz.id} href={`/biz/${biz.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-48 bg-gradient-to-br from-red-400 to-red-600">
                  {biz.images?.[0] ? (
                    <img src={biz.images[0]} alt={biz.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-6xl">🥢</span></div>
                  )}
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">#{i + 1}</div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-yellow-400">★</span>
                      <span className="font-bold">{biz.rating?.toFixed(1)}</span>
                      <span className="text-slate-300 text-sm">({biz.review_count} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors">{biz.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{biz.address?.split(',')[0] || 'Slough'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">📚 Related Guides</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/restaurants" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🍽️</span><span className="font-medium text-slate-900">All Restaurants</span>
            </Link>
            <Link href="/indian-restaurants" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🍛</span><span className="font-medium text-slate-900">Indian Restaurants</span>
            </Link>
            <Link href="/editorial/best-fish-chips-slough-2026" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🐟</span><span className="font-medium text-slate-900">Fish & Chips</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <Link href="/" className="font-semibold text-slate-900 hover:text-red-600">Slough.co</Link>
          <span className="mx-2">•</span>Your local business directory
        </div>
      </footer>
    </div>
  )
}
