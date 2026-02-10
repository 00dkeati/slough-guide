import { Metadata } from 'next'
import Link from 'next/link'
import { getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Gyms Slough | Best Fitness Centres & Health Clubs 2026',
  description: 'Find the best gyms in Slough. From budget-friendly PureGym to premium health clubs. 35+ gyms, CrossFit boxes & fitness centres rated by members.',
  keywords: 'gyms slough, gym slough, fitness centre slough, health club slough, crossfit slough, puregym slough',
}

export const dynamic = 'force-dynamic'

const gymTypes: Record<string, string[]> = {
  budget: ['puregym', 'pure gym'],
  crossfit: ['crossfit', 'unit 22'],
  specialist: ['kickbox', 'martial', 'yoga', 'pilates'],
  leisure: ['horizon', 'leisure'],
}

function getGymType(name: string): string {
  const nameLower = name.toLowerCase()
  for (const [type, keywords] of Object.entries(gymTypes)) {
    if (keywords.some(kw => nameLower.includes(kw))) return type
  }
  return 'general'
}

export default async function GymsPage() {
  const businesses = await getBusinesses('gyms', 'slough')
  
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

  const byType = {
    crossfit: sorted.filter(b => getGymType(b.name) === 'crossfit'),
    specialist: sorted.filter(b => getGymType(b.name) === 'specialist'),
  }

  const faqs = [
    {
      question: "What is the best gym in Slough?",
      answer: "The best gym depends on your needs. Horizon Slough is the top-rated leisure centre with excellent facilities including a pool. PureGym Slough offers 24/7 access at budget prices. For functional fitness, CrossFit Iron Duke and CrossFit Basepoint are highly rated by members."
    },
    {
      question: "Is there a 24-hour gym in Slough?",
      answer: "Yes, PureGym Slough offers 24/7 access for members. This makes it ideal for early risers and night owls who want to work out outside normal hours. The gym is located in the town centre with ample parking."
    },
    {
      question: "How much does gym membership cost in Slough?",
      answer: "Gym prices in Slough vary widely. PureGym offers budget memberships from around £20-25/month with no contract. Horizon Leisure Centre offers pay-as-you-go and monthly options. CrossFit boxes typically charge £80-120/month for unlimited classes."
    },
    {
      question: "Are there CrossFit gyms in Slough?",
      answer: "Yes, Slough has several CrossFit options. CrossFit Iron Duke and CrossFit Basepoint (Unit 22 Fitness) both offer CrossFit classes with qualified coaches. Both boxes welcome beginners and offer introductory sessions."
    },
    {
      question: "Which Slough gyms have swimming pools?",
      answer: "Horizon Slough is the main gym with a swimming pool in the area. It's a full leisure centre offering gym, pool, fitness classes, and more. Some residents also use the facilities at nearby Havant Leisure Centre."
    },
    {
      question: "Are there women-only gyms in Slough?",
      answer: "While there isn't a dedicated women-only gym in Slough, many gyms offer women-only sessions and classes. Check with individual gyms about their schedules. Some fitness studios specialising in yoga and Pilates also provide a comfortable environment."
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">Slough<span className="text-blue-600">.co</span></Link>
          <Link href="/categories" className="text-sm text-slate-600 hover:text-slate-900">All Categories →</Link>
        </div>
      </header>

      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-green-300 text-sm font-medium mb-4">
            <span>💪</span><span>FITNESS GUIDE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Gyms in Slough</h1>
          <p className="text-lg text-green-100 max-w-2xl">
            From budget-friendly 24/7 gyms to CrossFit boxes and leisure centres. {sorted.length} fitness options rated by real members.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Find Your Perfect Gym in Slough</h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed mb-4">
              Whether you're looking for a budget gym with 24/7 access, a CrossFit box to challenge yourself, or a leisure centre with a pool, Slough has fitness options for every goal and budget. From big chains to independent studios, the local fitness scene is thriving.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our guide features <strong>{sorted.length} gyms and fitness centres</strong> in the Slough area. With an average member rating of <strong>{avgRating} stars</strong> and over <strong>{totalReviews.toLocaleString()} reviews</strong>, you can find the right gym based on real member experiences.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Top choices include Horizon Slough for families wanting full leisure facilities, PureGym for budget-conscious gym-goers, and CrossFit Iron Duke for those seeking community-based functional fitness training.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{sorted.length}</div>
            <div className="text-sm text-slate-600">Gyms & Fitness</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{sorted.filter(b => (b.rating || 0) >= 4.5).length}</div>
            <div className="text-sm text-slate-600">Rated 4.5+</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{totalReviews.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Member Reviews</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{avgRating}★</div>
            <div className="text-sm text-slate-600">Avg Rating</div>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">🏆 Top Rated Gyms in Slough</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((biz, i) => (
                <Link key={biz.id} href={`/biz/${biz.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <div className="relative h-48 bg-gradient-to-br from-green-500 to-green-700">
                    {biz.images?.[0] ? (
                      <img src={biz.images[0]} alt={biz.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center"><span className="text-6xl">💪</span></div>
                    )}
                    <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">#{i + 1}</div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center gap-2 text-white">
                        <span className="text-yellow-400">★</span>
                        <span className="font-bold">{biz.rating?.toFixed(1)}</span>
                        <span className="text-slate-300 text-sm">({biz.review_count} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 group-hover:text-green-600 transition-colors">{biz.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{biz.address?.split(',')[0] || 'Slough'}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {byType.crossfit.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">🏋️ CrossFit & Functional Fitness</h2>
            <p className="text-slate-600 mb-6">High-intensity functional training with expert coaching and supportive communities.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {byType.crossfit.map((biz) => (
                <Link key={biz.id} href={`/biz/${biz.slug}`} className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏋️</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{biz.rating?.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({biz.review_count})</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-green-600">{biz.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">All Gyms in Slough</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {others.map((biz, i) => (
                <Link key={biz.id} href={`/biz/${biz.slug}`} className="group flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-16 h-16 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {biz.images?.[0] ? (
                      <img src={biz.images[0]} alt={biz.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">💪</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{biz.rating?.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({biz.review_count})</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-green-600 truncate">{biz.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12 bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions About Slough Gyms</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <Link href="/" className="font-semibold text-slate-900 hover:text-green-600">Slough.co</Link>
          <span className="mx-2">•</span>Your local business directory
        </div>
      </footer>
    </div>
  )
}
