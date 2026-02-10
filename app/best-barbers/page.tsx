import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Best Barbers in Slough 2026 | Ranked by Real Reviews',
  description: 'Find the best barber in Slough, Langley, Horndean & Chalvey. We analyzed 1,000+ Google reviews to rank every local barber. Real photos, honest verdicts.',
}

// Barber data with pros/cons
const barbers = [
  {
    rank: '⭐',
    name: 'JC Barbering',
    slug: 'jc-barbering-slough',
    area: 'Slough',
    rating: 4.8,
    reviews: 40,
    image: '/images/barbers/jc-barbering-1.jpg',
    featured: true,
    specialty: 'Fade Specialists',
    phone: '07487 602476',
    address: '4 Frogmore Lane, Slough SL2 9QQ',
    pros: ['Precision skin fades', 'Personal consultations', 'Consistent quality', 'Expert beard styling'],
    quote: '"Jordan is brilliant — a master of the hair"',
    verdict: 'The go-to choice for perfect fades and personal service. Jordan takes time to understand what you want.'
  },
  {
    rank: 1,
    name: 'Studio H',
    area: 'Horndean',
    rating: 5.0,
    reviews: 550,
    image: '/images/barbers/studio-h-1.jpg',
    featured: false,
    specialty: 'Best Overall',
    pros: ['Perfect 5-star rating', 'SEN-friendly', 'Named barbers (Jung & Baggy)', 'Inclusive atmosphere'],
    quote: '"Best barber I have ever been to"',
    verdict: '550 reviews with zero complaints. An anomaly in the barbering world.'
  },
  {
    rank: 2,
    name: 'Uppercutz',
    area: 'Chalvey',
    rating: 5.0,
    reviews: 68,
    image: '/images/barbers/uppercutz-1.jpg',
    featured: false,
    specialty: 'Hidden Gem',
    pros: ['Open 7 days including Sundays', 'Family-friendly', 'Remembers your style', 'Perfect 5.0 rating'],
    quote: '"Attention to detail is perfect"',
    verdict: 'Chalvey\'s best-kept secret. Perfect for families and weekend appointments.'
  },
  {
    rank: 3,
    name: 'Langley Barber Shop',
    area: 'Langley',
    rating: 4.7,
    reviews: 121,
    image: '/images/placeholder-barber.jpg',
    featured: false,
    specialty: 'Best Value',
    pros: ['Only £16 per cut', '121 verified reviews', 'No-frills quality', 'Quick service'],
    quote: '"Great value, good cuts"',
    verdict: 'Best value in the area. No-frills, reliable haircuts at honest prices.'
  },
  {
    rank: 4,
    name: 'L.A. Barbers',
    area: 'Widley',
    rating: 4.6,
    reviews: 90,
    image: '/images/placeholder-barber.jpg',
    featured: false,
    specialty: 'Kids & SEN',
    pros: ['Excellent with children', 'SEN trained staff', 'Patient approach', 'Calm environment'],
    quote: '"Amazing with my autistic son"',
    verdict: 'The best choice for children and customers with sensory needs.'
  },
  {
    rank: 5,
    name: "Jay's Barbers",
    area: 'Langley',
    rating: 4.5,
    reviews: 80,
    image: '/images/placeholder-barber.jpg',
    featured: false,
    specialty: 'Piercings Too',
    pros: ['Offers piercings', 'Trendy styles', 'Young vibe', 'Creative cuts'],
    quote: '"Great for something different"',
    verdict: 'More than just haircuts — good for piercings and edgier styles.'
  },
  {
    rank: 6,
    name: "Gino's",
    area: 'Langley',
    rating: 4.1,
    reviews: 36,
    image: '/images/placeholder-barber.jpg',
    featured: false,
    specialty: 'Traditional',
    pros: ['Traditional barbering', 'Established shop'],
    cons: ['Inconsistent reviews', 'Some quality concerns'],
    quote: '"Hit or miss"',
    verdict: 'Can be good, but quality varies. Check recent reviews first.'
  }
]

export default function BestBarbersPage() {
  const featured = barbers.find(b => b.featured)
  const ranked = barbers.filter(b => !b.featured)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-white">
            Slough<span className="text-blue-400">.co</span>
          </Link>
          <Link href="/editorial" className="text-sm text-slate-400 hover:text-white">
            More Guides →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <div className="text-center mb-8">
            <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              💈 2026 RANKINGS
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Best Barbers in Slough
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              We analyzed <span className="text-white font-semibold">1,000+ Google reviews</span> to find the best barbers in Slough, Langley, Horndean & Chalvey.
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">7</div>
              <div className="text-slate-400 text-sm">Barbers Ranked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1,000+</div>
              <div className="text-slate-400 text-sm">Reviews Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">4.6★</div>
              <div className="text-slate-400 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Featured Sponsor */}
        {featured && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl">⭐</span>
              <h2 className="text-2xl font-bold text-white">Featured Barber</h2>
              <span className="bg-amber-500/20 text-amber-400 text-xs px-2 py-1 rounded">SPONSORED</span>
            </div>
            
            <Link 
              href={`/editorial/${featured.slug}`}
              className="group block bg-gradient-to-r from-amber-900/30 to-slate-800 rounded-2xl overflow-hidden border border-amber-500/30 hover:border-amber-500/60 transition-all"
            >
              <div className="md:flex">
                <div className="relative w-full md:w-80 h-64 md:h-auto">
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-amber-500 text-amber-900 px-3 py-1 rounded-lg text-sm font-bold">
                    ⭐ FEATURED
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors">
                        {featured.name}
                      </h3>
                      <p className="text-amber-400 font-medium">{featured.specialty}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-400">{featured.rating}★</div>
                      <div className="text-slate-400 text-sm">{featured.reviews} reviews</div>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 mb-4 italic">"{featured.quote?.replace(/"/g, '')}"</p>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Why customers love it:</h4>
                    <div className="flex flex-wrap gap-2">
                      {featured.pros.map((pro, i) => (
                        <span key={i} className="bg-green-500/20 text-green-400 text-sm px-3 py-1 rounded-full">
                          ✓ {pro}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-400 mb-4">{featured.verdict}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-white">📍 {featured.address}</span>
                    <span className="text-amber-400 font-semibold">📞 {featured.phone}</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Rankings */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">🏆 The Full Rankings</h2>
          
          <div className="space-y-4">
            {ranked.map((barber) => (
              <div
                key={barber.name}
                className="group bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-600 transition-all"
              >
                <div className="md:flex">
                  <div className="relative w-full md:w-48 h-48 md:h-auto bg-slate-700">
                    {barber.image && !barber.image.includes('placeholder') ? (
                      <Image
                        src={barber.image}
                        alt={barber.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-30">💈</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-slate-900/80 text-white px-3 py-1 rounded-lg text-lg font-bold">
                      #{barber.rank}
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {barber.name}
                        </h3>
                        <p className="text-slate-400">{barber.area} • {barber.specialty}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-amber-400">{barber.rating}★</div>
                        <div className="text-slate-500 text-sm">{barber.reviews} reviews</div>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 italic mb-3 text-sm">"{barber.quote?.replace(/"/g, '')}"</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {barber.pros.slice(0, 3).map((pro, i) => (
                        <span key={i} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                          ✓ {pro}
                        </span>
                      ))}
                      {barber.cons?.map((con, i) => (
                        <span key={i} className="bg-red-900/30 text-red-400 text-xs px-2 py-1 rounded">
                          ✗ {con}
                        </span>
                      ))}
                    </div>
                    
                    <p className="text-slate-500 text-sm">{barber.verdict}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-12 text-center">
          <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-2">Own a barbershop in Slough?</h3>
            <p className="text-slate-400 mb-4">Get featured at the top of this page and drive more customers to your chair.</p>
            <Link 
              href="/advertise"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-amber-900 font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Get Featured →
            </Link>
          </div>
        </section>

        {/* Methodology */}
        <section className="mt-12">
          <h3 className="text-lg font-bold text-white mb-4">📊 How We Ranked</h3>
          <div className="bg-slate-800/30 rounded-xl p-6 text-slate-400 text-sm">
            <p className="mb-2">We analyzed every barber in the Slough area using Google Reviews data. Our ranking considers:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Overall star rating</li>
              <li>Number of reviews (more reviews = more reliable)</li>
              <li>Recency of reviews</li>
              <li>Specific praise and complaints mentioned</li>
              <li>Consistency across reviews</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">Last updated: February 2026. Featured listings are sponsored but must meet our quality standards.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 Slough.co — Your local directory</p>
        </div>
      </footer>
    </div>
  )
}
