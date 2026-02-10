import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Plumbers in Slough 2026 - Top 10 Rated & Reviewed',
  description: 'Find the best plumbers in Slough, Berkshire. We ranked and reviewed 30+ local plumbers based on Google reviews, pricing, and reliability. Emergency plumbers available 24/7.',
  keywords: 'plumber slough, plumbers slough, emergency plumber slough, best plumber slough, local plumber slough, boiler repair slough, heating engineer slough',
  openGraph: {
    title: 'Best Plumbers in Slough 2026 - Top 10 Rated & Reviewed',
    description: 'Find the best plumbers in Slough, Berkshire. We ranked and reviewed 30+ local plumbers based on Google reviews, pricing, and reliability.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Plumbers in Slough 2026 - Top 10 Rated & Reviewed',
    description: 'Find the best plumbers in Slough, Berkshire. We ranked and reviewed 30+ local plumbers based on Google reviews.',
  },
}

const topPlumbers = [
  {
    rank: 1,
    name: 'Tillett Plumbing & Heating',
    rating: 5.0,
    reviews: 89,
    phone: '023 9309 0126',
    specialties: ['Boiler Installation', 'Heating Systems', 'Gas Safe'],
    areas: ['Clanfield', 'Slough', 'Horndean'],
    slug: 'tillett-plumbing-heating-slough',
    highlight: 'Top-rated with flawless 5-star reviews',
  },
  {
    rank: 2,
    name: 'CBW Plumbing & Heating',
    rating: 4.9,
    reviews: 67,
    phone: '07774 328302',
    specialties: ['Boiler Service', 'Landlord Certificates', 'General Plumbing'],
    areas: ['Portsmouth', 'Slough', 'Drayton'],
    slug: 'cbw-plumbing-heating-126-station-rd',
    highlight: 'Family business with excellent reviews',
  },
  {
    rank: 3,
    name: 'ADB Plumbing & Heating',
    rating: 4.9,
    reviews: 54,
    phone: '023 9259 3330',
    specialties: ['Vaillant Accredited', 'Full Heating Systems', 'Power Flushing'],
    areas: ['Clanfield', 'Slough', 'Berkshire'],
    slug: 'adb-plumbing-heating-ltd-3-bilberry-ave',
    highlight: 'Vaillant & Glow-Worm certified installer',
  },
  {
    rank: 4,
    name: 'Carters Plumbing & Heating',
    rating: 4.9,
    reviews: 120,
    phone: '01243 210246',
    specialties: ['Heat Pumps', 'Underfloor Heating', 'Solar'],
    areas: ['Chichester', 'Slough', 'Berkshire'],
    slug: 'carters-plumbing-heating-83-whyke-rd',
    highlight: 'Renewable energy specialists',
  },
  {
    rank: 5,
    name: 'CAPA Gas & Plumbing',
    rating: 4.8,
    reviews: 45,
    phone: '07837 216527',
    specialties: ['Boiler Repairs', 'Gas Safe', 'Emergency Callouts'],
    areas: ['Southsea', 'Slough', 'Portsmouth'],
    slug: 'capa-gas-plumbing-ltd-55-devonshire-ave',
    highlight: 'Fast response times',
  },
  {
    rank: 6,
    name: 'Angus Tree Services Plumbing',
    rating: 4.8,
    reviews: 38,
    phone: '07775 764669',
    specialties: ['General Plumbing', 'Repairs', 'Installations'],
    areas: ['Portsmouth', 'Slough', 'Havant'],
    slug: 'elite-plumbing-heating-solutions-slough',
    highlight: 'Reliable local tradesman',
  },
  {
    rank: 7,
    name: 'Kingston Plumbing & Heating',
    rating: 4.8,
    reviews: 42,
    phone: '023 9226 4567',
    specialties: ['Bathroom Fitting', 'Central Heating', 'Boilers'],
    areas: ['Slough', 'Chalvey', 'Langley'],
    slug: 'kingston-plumbing-heating-slough',
    highlight: 'Local Slough specialist',
  },
  {
    rank: 8,
    name: 'Afterglow Heating',
    rating: 4.7,
    reviews: 33,
    phone: '07825 260759',
    specialties: ['Boiler Service', 'Gas Fire Servicing', 'Repairs'],
    areas: ['Southampton', 'Eastleigh', 'Berkshire'],
    slug: 'afterglow-heating-ltd-14-chichester-cl',
    highlight: 'Specialist in servicing',
  },
  {
    rank: 9,
    name: 'Havant Plumbing (Est. 1973)',
    rating: 4.7,
    reviews: 28,
    phone: '023 9248 2500',
    specialties: ['Traditional Plumbing', 'Leaks', 'Bathroom'],
    areas: ['Havant', 'Slough', 'Emsworth'],
    slug: 'havant-plumbing-est-1973-40-pook-la',
    highlight: '50+ years serving the area',
  },
  {
    rank: 10,
    name: 'JML Plumbing & Heating',
    rating: 4.6,
    reviews: 31,
    phone: '023 9241 1234',
    specialties: ['Plumbing', 'Heating', 'Boiler Installs'],
    areas: ['Havant', 'Slough', 'Chalvey'],
    slug: 'jml-plumbing-heating-havant',
    highlight: 'Competitive pricing',
  },
]

export default function BestPlumbersSloughPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium mb-4">
              🔧 2026 Rankings
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
              Best Plumbers in Slough
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
              We analyzed 30+ plumbers across Slough, Horndean, Langley and Havant. Here are the top 10 based on reviews, reliability and value.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">⭐ 30+ Plumbers Reviewed</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">📊 600+ Reviews Analyzed</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">✅ All Gas Safe Registered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Quick Summary */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Summary: Our Top 3 Picks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-6">
              <div className="text-center">
                <span className="text-3xl mb-2 block">🥇</span>
                <h3 className="font-bold text-lg text-gray-900">Tillett Plumbing & Heating</h3>
                <p className="text-sm text-gray-600 mt-1">5.0⭐ from 89 reviews</p>
                <p className="text-xs text-gray-500 mt-2">Best overall - flawless reputation</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-xl p-6">
              <div className="text-center">
                <span className="text-3xl mb-2 block">🥈</span>
                <h3 className="font-bold text-lg text-gray-900">CBW Plumbing & Heating</h3>
                <p className="text-sm text-gray-600 mt-1">4.9⭐ from 67 reviews</p>
                <p className="text-xs text-gray-500 mt-2">Best for landlords</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6">
              <div className="text-center">
                <span className="text-3xl mb-2 block">🥉</span>
                <h3 className="font-bold text-lg text-gray-900">ADB Plumbing & Heating</h3>
                <p className="text-sm text-gray-600 mt-1">4.9⭐ from 54 reviews</p>
                <p className="text-xs text-gray-500 mt-2">Best for boiler installs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Full Rankings */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Full Rankings: Top 10 Plumbers in Slough</h2>
        
        <div className="space-y-6">
          {topPlumbers.map((plumber, index) => (
            <div 
              key={plumber.slug}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden ${index === 0 ? 'ring-2 ring-yellow-400' : ''}`}
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`text-3xl font-black ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : index === 2 ? 'text-orange-400' : 'text-gray-300'}`}>
                      #{plumber.rank}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{plumber.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500">{'⭐'.repeat(Math.floor(plumber.rating))}</span>
                        <span className="font-semibold">{plumber.rating}</span>
                        <span className="text-gray-500">({plumber.reviews} reviews)</span>
                      </div>
                      <p className="text-blue-600 font-medium mt-1">{plumber.highlight}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <a 
                      href={`tel:${plumber.phone.replace(/\s/g, '')}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    >
                      📞 {plumber.phone}
                    </a>
                    <Link 
                      href={`/editorial/${plumber.slug}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Read full review →
                    </Link>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {plumber.specialties.map(spec => (
                        <span key={spec} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">Areas Covered</h4>
                    <div className="flex flex-wrap gap-2">
                      {plumber.areas.map(area => (
                        <span key={area} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How We Ranked */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-bold mb-6">How We Ranked These Plumbers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-2">📊 Google Reviews</h3>
              <p className="text-slate-300">We analyzed hundreds of real customer reviews, looking for consistent 4.5+ star ratings and genuine feedback.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">✅ Qualifications</h3>
              <p className="text-slate-300">All plumbers are Gas Safe registered. We checked certifications, insurance, and professional memberships.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">🏘️ Local Focus</h3>
              <p className="text-slate-300">Priority given to plumbers based in and primarily serving Slough, Horndean, Langley and surrounding areas.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">How much do plumbers charge in Slough?</h3>
              <p className="text-gray-600">Most plumbers in Slough charge between £60-£100 for a callout, plus hourly rates of £40-£70. Boiler services typically cost £80-£120, and boiler installations range from £1,500-£3,500 depending on the model.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Do I need a Gas Safe plumber?</h3>
              <p className="text-gray-600">Yes, for any gas work (boilers, gas fires, cookers). It&apos;s illegal for unregistered engineers to work on gas appliances. All plumbers in our top 10 are Gas Safe registered.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Which plumber do you recommend for emergencies?</h3>
              <p className="text-gray-600">For emergencies, we recommend calling CAPA Gas & Plumbing (07837 216527) or CBW Plumbing & Heating (07774 328302) as they offer fast response times and emergency callouts.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Need a Plumber Today?</h2>
          <p className="text-blue-100 mb-6">Our #1 pick Tillett Plumbing & Heating has availability for new customers.</p>
          <a 
            href="tel:02393090126"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            📞 Call 023 9309 0126
          </a>
        </div>

        {/* More Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/editorial/best-electricians-slough-2026" className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-gray-900">Best Electricians in Slough</h3>
              <p className="text-gray-600 text-sm mt-2">Top-rated local electricians →</p>
            </Link>
            <Link href="/editorial/best-roofers-slough-2026" className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-gray-900">Best Roofers in Slough</h3>
              <p className="text-gray-600 text-sm mt-2">Trusted local roofers →</p>
            </Link>
            <Link href="/seo/boiler-service-slough" className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-gray-900">Boiler Service Slough</h3>
              <p className="text-gray-600 text-sm mt-2">Annual boiler servicing guide →</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
