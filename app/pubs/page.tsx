import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Best Pubs in Slough 2026 | Local Pubs, Bars & Gastropubs',
  description: 'Find the best pubs in Slough, Langley, Horndean & Cippenham. Traditional pubs, gastropubs, sports bars. 40+ pubs rated by locals.',
  keywords: 'pubs slough, pubs in slough, slough pubs, best pubs slough',
}

export const dynamic = 'force-dynamic'

export default async function PubsPage() {
  const businesses = await getBusinesses('pubs', 'slough')
  
  const sorted = [...businesses].sort((a, b) => {
    if (b.rating !== a.rating) return (b.rating || 0) - (a.rating || 0)
    return (b.review_count || 0) - (a.review_count || 0)
  })
  
  const featured = sorted.slice(0, 3)
  const others = sorted.slice(3, 18)

  const totalReviews = sorted.reduce((sum, b) => sum + (b.review_count || 0), 0)
  const avgRating = sorted.length > 0 
    ? (sorted.reduce((sum, b) => sum + (b.rating || 0), 0) / sorted.length).toFixed(1)
    : '0'

  const guides = [
    { title: "Best Sunday Roasts", href: "/editorial/ultimate-sunday-roast-guide-slough-horndean-purbrook-2025", emoji: "🥩" },
    { title: "Best Restaurants", href: "/restaurants", emoji: "🍽️" },
    { title: "Best Cafes", href: "/cafes", emoji: "☕" },
    { title: "Pub Guide", href: "/editorial/best-pubs-slough-2026", emoji: "🍺" },
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
      <div className="bg-gradient-to-br from-amber-950 via-amber-900 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-4">
            <span>🍺</span>
            <span>PUBS & BARS</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Best Pubs in Slough
          </h1>
          <p className="text-lg md:text-xl text-amber-100 max-w-2xl mb-8">
            Traditional local pubs, gastropubs with great food, and sports bars. Find your perfect local for a pint, Sunday roast, or night out.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">{sorted.length}</div>
              <div className="text-amber-200 text-sm">Pubs Listed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">{totalReviews.toLocaleString()}</div>
              <div className="text-amber-200 text-sm">Google Reviews</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">{avgRating}★</div>
              <div className="text-amber-200 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Local Tip */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-amber-900 text-sm">
            🍺 <strong>Local tip:</strong> Many Slough pubs offer excellent Sunday roasts - booking recommended! Check out our <Link href="/editorial/ultimate-sunday-roast-guide-slough-horndean-purbrook-2025" className="underline font-medium">Sunday Roast Guide</Link> for the best spots.
          </p>
        </div>

        {/* Top Rated */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              🏆 Top Rated Pubs
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100"
                >
                  <div className="relative h-48 bg-gradient-to-br from-amber-700 to-amber-900">
                    {biz.images?.[0] ? (
                      <img
                        src={biz.images[0]}
                        alt={biz.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">🍺</div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        #{i + 1} TOP RATED
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-amber-700 transition-colors">
                      {biz.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-3">{biz.area || 'Slough'}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-600 font-bold">{biz.rating?.toFixed(1)}</span>
                        <span className="text-amber-500">★</span>
                        <span className="text-slate-400 text-sm">({biz.review_count})</span>
                      </div>
                      <span className="text-amber-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                        View →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Pubs */}
        {others.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              All Pubs in Slough & Surrounding Areas
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((biz, i) => (
                <Link 
                  key={biz.id} 
                  href={`/biz/${biz.slug}`}
                  className="group flex items-center gap-4 bg-white rounded-xl p-4 hover:shadow-md transition-all border border-slate-100"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-amber-100 flex-shrink-0">
                    {biz.images?.[0] ? (
                      <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">🍺</div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate group-hover:text-amber-700">
                      {biz.name}
                    </h3>
                    <p className="text-slate-500 text-sm">{biz.area || 'Slough'}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-amber-600 text-sm font-medium">{biz.rating?.toFixed(1)}★</span>
                      <span className="text-slate-400 text-xs">({biz.review_count} reviews)</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Related Guides
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {guides.map(guide => (
              <Link 
                key={guide.href}
                href={guide.href}
                className="flex items-center gap-3 bg-white rounded-xl p-4 hover:shadow-md transition-all border border-slate-100 group"
              >
                <span className="text-2xl">{guide.emoji}</span>
                <span className="font-medium text-slate-700 group-hover:text-amber-700">{guide.title}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200 mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Guide to Pubs in Slough
          </h2>
          <div className="prose prose-slate max-w-none">
            <p>
              Slough and the surrounding villages have a fantastic selection of pubs, from traditional locals to 
              modern gastropubs. Whether you're after a quiet pint, live sports, or a hearty Sunday roast, there's a pub for you.
            </p>
            <h3>Types of pubs in Slough:</h3>
            <ul>
              <li><strong>Traditional pubs</strong> - Classic locals with darts, pool, and a friendly atmosphere</li>
              <li><strong>Gastropubs</strong> - Great food alongside quality drinks</li>
              <li><strong>Sports bars</strong> - Multiple screens for football, rugby, and more</li>
              <li><strong>Family-friendly pubs</strong> - Beer gardens and kids' menus</li>
            </ul>
            <h3>Popular pub areas:</h3>
            <ul>
              <li><strong>Slough Town Centre</strong> - The Exchange, Number 73</li>
              <li><strong>Langley</strong> - The Spotted Cow, Plough & Barleycorn</li>
              <li><strong>Horndean</strong> - The Ship & Bell, The Brewers Arms</li>
              <li><strong>Cippenham</strong> - The White Hart, The Chairmakers</li>
            </ul>
            <p>
              Most pubs in the area serve food, with Sunday roasts being particularly popular. 
              We recommend booking ahead for Sunday lunch at popular venues.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl p-8 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions About Slough Pubs
          </h2>
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">What are the best pubs in Slough?</h3>
              <p className="text-slate-600">The top-rated pubs in Slough include The Chairmakers in Cippenham (excellent food and atmosphere), The White Hart for traditional pub vibes, and Number 73 Bar and Kitchen in the town centre. The Horse & Jockey is also highly rated with over 700 reviews.</p>
            </div>
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Which pubs in Slough do the best Sunday roast?</h3>
              <p className="text-slate-600">For Sunday roasts, locals recommend The Chairmakers, Four London Road, Horse & Jockey, and Number 73. Most pubs serve roasts from noon onwards - booking is strongly recommended, especially for groups.</p>
            </div>
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Are there any dog-friendly pubs in Slough?</h3>
              <p className="text-slate-600">Yes, many Slough pubs welcome dogs, particularly in bar areas and beer gardens. The Forest of Bere, The Bat & Ball in Hambledon, and The White Hart are known to be dog-friendly. Always check with the pub before visiting.</p>
            </div>
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Which Slough pubs show live sports?</h3>
              <p className="text-slate-600">Several pubs in Slough show live football and rugby. The Heroes, The Spotted Cow in Langley, and The Centurion are popular for watching matches. Check with individual pubs for Sky Sports and BT Sport availability.</p>
            </div>
            <div className="border-b border-slate-100 pb-6">
              <h3 className="font-semibold text-slate-900 mb-2">Are there any pubs with beer gardens in Slough?</h3>
              <p className="text-slate-600">Many local pubs have outdoor seating. The Forest of Bere has a large garden, The Chairmakers offers a lovely outdoor area, and The Bat & Ball in Hambledon has an iconic cricket ground setting. Perfect for summer drinks!</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Do Slough pubs serve food?</h3>
              <p className="text-slate-600">Most pubs in Slough serve food, ranging from bar snacks to full restaurant menus. Gastropubs like Four London Road and The Chairmakers are known for quality dining, while traditional pubs offer pub classics and Sunday roasts.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer CTA */}
      <div className="bg-slate-900 text-white py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Own a Pub in Slough?</h2>
          <p className="text-slate-300 mb-6">Get featured in our directory and reach more local customers.</p>
          <Link href="/register-business" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            Get Listed →
          </Link>
        </div>
      </div>
    </div>
  )
}
