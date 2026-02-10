import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Indian Restaurants Slough | Best Curry Houses & Takeaways 2026',
  description: 'Find the best Indian restaurants in Slough. From award-winning curry houses to quick takeaways. 7+ Indian restaurants rated by locals with real reviews.',
  keywords: 'indian restaurants slough, curry house slough, indian takeaway slough, best indian slough, tandoori slough',
}

export const dynamic = 'force-dynamic'

export default async function IndianRestaurantsPage() {
  const allRestaurants = await getBusinesses('restaurants', 'slough')
  
  // Filter to Indian restaurants
  const indianKeywords = ['shalimar', 'kassia', 'red rose', 'paprika', 'mela', 'indian cottage', 'pasha', 'tandoori', 'curry', 'indian']
  const businesses = allRestaurants.filter(b => 
    indianKeywords.some(kw => b.name.toLowerCase().includes(kw))
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
      question: "What is the best Indian restaurant in Slough?",
      answer: "Kassia Lounge in Cippenham is consistently rated the best Indian restaurant in the Slough area with a 4.8-star rating. For those in central Slough, Shalimar on Hambledon Parade is a local favourite with nearly 700 reviews, while Red Rose Lounge offers excellent modern Indian cuisine."
    },
    {
      question: "Which Indian restaurants in Slough do delivery?",
      answer: "Most Indian restaurants in Slough offer delivery through apps like Just Eat and Deliveroo. Shalimar, Red Rose Lounge, Paprika, and Indian Cottage all provide delivery services. Kassia Lounge in Cippenham also delivers to the wider Slough area."
    },
    {
      question: "Are there any Indian restaurants in Slough open late?",
      answer: "Yes, several Indian restaurants in Slough stay open late. Shalimar is open until 11:30pm daily, while Indian Cottage serves until 11:30pm on weekends. Red Rose Lounge also offers late-night dining for curry lovers."
    },
    {
      question: "Which Slough Indian restaurants are best for a special occasion?",
      answer: "For special occasions, Kassia Lounge in Cippenham offers an upmarket dining experience with elegant decor. Red Rose Lounge on London Road is also popular for celebrations with its modern atmosphere. Both take reservations for larger parties."
    },
    {
      question: "Do Indian restaurants in Slough cater for vegetarians and vegans?",
      answer: "All Indian restaurants in Slough offer extensive vegetarian options, as vegetarian dishes are a cornerstone of Indian cuisine. Shalimar, Mela, and Kassia Lounge have dedicated vegetarian sections on their menus, and most can accommodate vegan requests."
    },
    {
      question: "What's the best Indian takeaway in Slough?",
      answer: "For takeaway, Paprika in Horndean and Indian Cottage are popular choices with quick service. Shalimar offers both restaurant dining and an efficient takeaway service. Check our Best Indian Takeaways guide for detailed rankings."
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

      <div className="bg-gradient-to-br from-orange-900 via-orange-800 to-red-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-orange-300 text-sm font-medium mb-4">
            <span>🍛</span><span>CUISINE GUIDE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Indian Restaurants in Slough</h1>
          <p className="text-lg text-orange-100 max-w-2xl">
            From traditional curry houses to modern Indian dining. {sorted.length} Indian restaurants rated by real customers.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Discover Indian Cuisine in Slough</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              Slough and the surrounding areas boast an impressive selection of Indian restaurants, from traditional curry houses serving classic dishes to contemporary restaurants offering modern twists on Indian favourites. Whether you're craving a rich butter chicken, a fiery vindaloo, or authentic tandoori specialities, you'll find exceptional Indian cuisine right here.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our guide features <strong>{sorted.length} Indian restaurants</strong> across Slough, Langley, Horndean, and Cippenham. With an average rating of <strong>{avgRating} stars</strong> and over <strong>{totalReviews.toLocaleString()} reviews</strong>, the local Indian dining scene consistently delivers authentic flavours and generous portions.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Standout venues include the award-winning Kassia Lounge in Cippenham, the ever-popular Shalimar, and Mela for those seeking contemporary Indian dishes. Most restaurants offer both dine-in and takeaway options, with many available on delivery apps.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600">{sorted.length}</div>
            <div className="text-sm text-slate-600">Indian Restaurants</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600">{sorted.filter(b => (b.rating || 0) >= 4.5).length}</div>
            <div className="text-sm text-slate-600">Rated 4.5+</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600">{totalReviews.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Reviews</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600">{avgRating}★</div>
            <div className="text-sm text-slate-600">Avg Rating</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🍛 All Indian Restaurants in Slough</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((biz, i) => (
              <Link key={biz.id} href={`/biz/${biz.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500">
                  {biz.images?.[0] ? (
                    <img src={biz.images[0]} alt={biz.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center"><span className="text-6xl">🍛</span></div>
                  )}
                  <div className="absolute top-3 left-3 bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded">#{i + 1}</div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-yellow-400">★</span>
                      <span className="font-bold">{biz.rating?.toFixed(1)}</span>
                      <span className="text-slate-300 text-sm">({biz.review_count} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{biz.name}</h3>
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
            <Link href="/editorial/best-indian-takeaways-slough-2026" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🥡</span><span className="font-medium text-slate-900">Best Takeaways</span>
            </Link>
            <Link href="/chinese-restaurants" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🥢</span><span className="font-medium text-slate-900">Chinese Restaurants</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <Link href="/" className="font-semibold text-slate-900 hover:text-orange-600">Slough.co</Link>
          <span className="mx-2">•</span>Your local business directory
        </div>
      </footer>
    </div>
  )
}
