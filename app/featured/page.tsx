import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import CheckoutButton from '@/components/CheckoutButton'

export const metadata: Metadata = {
  title: 'Be #1 In Your Category | Slough.co Sponsored Listings',
  description: 'Claim the exclusive #1 spot for your trade in Slough. One business per category. Featured in all rankings, articles, and promotions for just £149/year.',
}

// Category availability - update this when spots are sold
const categories = [
  { name: 'Barber', slug: 'barber', status: 'sold', soldTo: 'JC Barbering' },
  { name: 'Plumber', slug: 'plumber', status: 'available' },
  { name: 'Electrician', slug: 'electrician', status: 'available' },
  { name: 'Roofer', slug: 'roofer', status: 'available' },
  { name: 'Builder', slug: 'builder', status: 'available' },
  { name: 'Painter & Decorator', slug: 'painter', status: 'available' },
  { name: 'Landscaper', slug: 'landscaper', status: 'available' },
  { name: 'Gardener', slug: 'gardener', status: 'available' },
  { name: 'Heating Engineer', slug: 'heating', status: 'available' },
  { name: 'Locksmith', slug: 'locksmith', status: 'available' },
  { name: 'Carpet Cleaner', slug: 'carpet-cleaner', status: 'available' },
  { name: 'Window Cleaner', slug: 'window-cleaner', status: 'available' },
  { name: 'Handyman', slug: 'handyman', status: 'available' },
  { name: 'Dog Groomer', slug: 'dog-groomer', status: 'available' },
  { name: 'Personal Trainer', slug: 'personal-trainer', status: 'available' },
  { name: 'Photographer', slug: 'photographer', status: 'available' },
  { name: 'Driving Instructor', slug: 'driving-instructor', status: 'available' },
  { name: 'Hairdresser', slug: 'hairdresser', status: 'available' },
  { name: 'Beauty Salon', slug: 'beauty', status: 'available' },
  { name: 'Nail Technician', slug: 'nail-tech', status: 'available' },
  { name: 'Café', slug: 'cafe', status: 'available' },
  { name: 'Restaurant', slug: 'restaurant', status: 'available' },
  { name: 'Pub', slug: 'pub', status: 'available' },
  { name: 'Takeaway', slug: 'takeaway', status: 'available' },
]

const soldCount = categories.filter(c => c.status === 'sold').length
const availableCount = categories.filter(c => c.status === 'available').length
const totalSlots = categories.length

export default function FeaturedPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Scarcity Bar - Premium Navy with Pulse */}
      <div className="bg-[#0a1628] text-white py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-medium tracking-wide">
            LIVE: <span className="font-bold text-white">{availableCount}/{totalSlots}</span> Category Slots Remaining for 2026
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">
            Slough<span className="text-blue-600">.co</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">
              <span>📍</span> Based in Horndean
            </span>
          </div>
        </div>
      </header>

      {/* Hero with Premium Typography */}
      <section className="relative text-white py-20 md:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#0a1628]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-transparent to-blue-900/30" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-amber-300 text-sm font-medium">{soldCount} category claimed • {availableCount} remaining</span>
          </div>
          
          {/* Premium Serif Headline */}
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tight">
            Own the <span className="text-blue-400">#1 Spot</span><br className="hidden md:block" /> in Slough
          </h1>
          
          <p className="text-xl md:text-2xl text-amber-300 font-medium mb-4 tracking-wide">
            Before Your Competitor Does
          </p>
          
          <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            One business per trade. Featured across 2,000+ pages, Facebook, and email newsletters.
          </p>
          
          {/* Price Cards */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-10 py-6 border border-white/10">
              <div className="text-5xl font-bold font-serif">£149</div>
              <div className="text-slate-500 text-sm mt-1">per year</div>
            </div>
            <div className="text-slate-600 text-3xl font-light">=</div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl px-10 py-6 border border-white/10">
              <div className="text-5xl font-bold font-serif text-emerald-400">41p</div>
              <div className="text-slate-500 text-sm mt-1">per day</div>
            </div>
          </div>

          <a 
            href="#categories" 
            className="inline-flex items-center gap-2 bg-[#004225] hover:bg-[#005530] text-white px-10 py-4 rounded-full font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-emerald-900/20"
          >
            Check Your Category ↓
          </a>
        </div>
      </section>

      {/* Social Proof Bar */}
      <div className="bg-amber-50 border-y border-amber-200 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-amber-600">👥</span>
              <span className="text-amber-900 font-medium">Hundreds of locals visit daily</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-amber-300"></div>
            <div className="flex items-center gap-2">
              <span className="text-amber-600">📈</span>
              <span className="text-amber-900 font-medium">Growing every week</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-amber-300"></div>
            <div className="flex items-center gap-2">
              <span className="text-amber-600">📄</span>
              <span className="text-amber-900 font-medium">2,000+ pages indexed</span>
            </div>
          </div>
        </div>
      </div>

      {/* No Brainer Math */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Why This Is a No-Brainer</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="text-4xl mb-3">💷</div>
              <div className="text-4xl font-bold font-serif text-[#004225] mb-2">£149</div>
              <div className="text-slate-600">Total cost for the year</div>
              <div className="text-sm text-emerald-600 mt-3 font-medium">One payment, done.</div>
            </div>
            <div className="p-8 bg-blue-50 rounded-2xl border border-blue-100">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-4xl font-bold font-serif text-blue-700 mb-2">1 Customer</div>
              <div className="text-slate-600">Pays for itself</div>
              <div className="text-sm text-blue-600 mt-3 font-medium">Most jobs are £150+</div>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-4xl mb-3">🚫</div>
              <div className="text-4xl font-bold font-serif text-slate-700 mb-2">No Ads</div>
              <div className="text-slate-600">No Facebook. No Google.</div>
              <div className="text-sm text-slate-500 mt-3 font-medium">No wasted money.</div>
            </div>
          </div>
          <p className="text-center text-slate-700 mt-12 max-w-2xl mx-auto text-lg">
            <span className="font-semibold text-slate-900">⚠️ If you don't claim your category, your competitor will.</span><br />
            <span className="text-slate-500">And they'll be the one customers find first.</span>
          </p>
        </div>
      </section>

      {/* Why This Beats Facebook/Google */}
      <section className="py-16 bg-[#0a1628] text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">Tired of Throwing Money at Facebook & Google?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-900/20 border border-red-500/20 rounded-2xl p-8">
              <h3 className="font-semibold text-red-300 mb-6 text-lg">❌ Facebook & Google Ads</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  Burns through cash with no guarantee
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  Complicated to set up properly
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  Stops working the second you stop paying
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  Competing against big companies with big budgets
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">•</span>
                  Most local businesses lose money
                </li>
              </ul>
            </div>
            <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-8">
              <h3 className="font-semibold text-emerald-300 mb-6 text-lg">✅ Slough.co Featured Listing</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">•</span>
                  One payment, works all year
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">•</span>
                  We do all the work for you
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">•</span>
                  Year-round editorial coverage
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">•</span>
                  No competition — you're THE #1
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">•</span>
                  Real articles, real trust, real customers
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-4">What You Get</h2>
          <p className="text-slate-500 text-center mb-16 max-w-xl mx-auto">
            Complete domination of your category on Slough's fastest-growing local platform
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '🥇',
                title: '#1 Position in All Rankings',
                desc: 'Top spot in every "Best [Your Trade] in Slough" article. Above all competitors, every time.'
              },
              {
                icon: '📝',
                title: 'Your Own Spotlight Article',
                desc: 'A professionally written feature about your business, optimized for Google and shared across our channels.'
              },
              {
                icon: '📱',
                title: 'Facebook Promotion',
                desc: 'Featured posts to our 2,000+ local followers throughout the year. Real engagement from Slough residents.'
              },
              {
                icon: '📧',
                title: 'Email Newsletter Features',
                desc: 'Included in our local newsletter sent to Slough homeowners actively looking for services.'
              },
              {
                icon: '🔄',
                title: 'Ongoing Content Updates',
                desc: 'Fresh mentions in new articles as we publish. Your visibility grows as our site grows.'
              },
              {
                icon: '🛡️',
                title: 'Category Exclusivity',
                desc: 'No other business in your trade can buy this spot. You own it for the full year.'
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-6">
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2 text-lg">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Grid - Premium Design */}
      <section id="categories" className="py-20 bg-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-4">Category Availability</h2>
          <p className="text-slate-500 text-center mb-12">
            Select your trade below. <span className="text-[#004225] font-medium">Green = available</span>. <span className="text-slate-400">Grey = already taken</span>.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat) => 
              cat.status === 'available' ? (
                <a
                  key={cat.slug}
                  href="https://buy.stripe.com/eVq28l1m4bAsbw47mR3Ru0l"
                  className="relative p-5 rounded-xl transition-all bg-[#004225] hover:bg-[#005530] text-white cursor-pointer block hover:scale-105 hover:shadow-xl shadow-lg"
                >
                  <div className="absolute -top-2 -right-2 bg-emerald-400 text-emerald-900 text-xs font-bold px-2.5 py-1 rounded-full">
                    OPEN
                  </div>
                  <div className="font-semibold text-lg mb-1">{cat.name}</div>
                  <div className="text-emerald-200 text-sm font-medium">Claim Your Spot →</div>
                </a>
              ) : (
                <div
                  key={cat.slug}
                  className="relative"
                >
                  {/* Sold Category Card */}
                  <div className="p-5 rounded-xl bg-slate-300 text-slate-500">
                    <div className="absolute -top-2 -right-2 bg-slate-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      SOLD
                    </div>
                    <div className="font-semibold text-lg text-slate-600">{cat.name}</div>
                    {cat.soldTo && (
                      <div className="text-sm mt-1">→ {cat.soldTo}</div>
                    )}
                  </div>
                  
                  {/* Partner Spotlight Card - Only for JC Barbering */}
                  {cat.soldTo === 'JC Barbering' && (
                    <div className="mt-3 bg-white rounded-xl p-4 shadow-md border border-slate-200">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          JC
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">JC Barbering</div>
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                            <span className="text-xs text-blue-600 font-medium">Verified Partner</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic leading-relaxed">
                        "First to claim the #1 Barber spot — now featured across all Slough.co rankings."
                      </p>
                    </div>
                  )}
                </div>
              )
            )}
          </div>

          <div className="mt-12 text-center text-slate-500 text-sm">
            Don't see your category? <a href="mailto:zack@slough.co" className="text-[#004225] font-medium hover:underline">Email Zack</a> or <a href="sms:+447414200457" className="text-[#004225] font-medium hover:underline">text us</a> — we can add it.
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0a1628] to-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            Ready to Claim Your Spot?
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
            Once your category is gone, it's gone for the year. Lock in your #1 position today.
          </p>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-10 border border-white/10 max-w-md mx-auto">
            <div className="text-6xl font-bold font-serif mb-2">£149</div>
            <div className="text-slate-400 mb-8">One payment. Full year. No recurring fees.</div>
            
            <CheckoutButton 
              href="https://buy.stripe.com/eVq28l1m4bAsbw47mR3Ru0l"
              className="block w-full bg-[#004225] hover:bg-[#005530] text-white font-bold py-5 px-8 rounded-full text-lg transition-all hover:scale-105 mb-6"
            >
              Claim Your Category Now →
            </CheckoutButton>
            
            <p className="text-slate-500 text-sm">
              💳 Secure payment via Stripe
            </p>
            
            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-6 mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                256-bit SSL
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Local Business
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                VAT Registered
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* This Is For You If... */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-12">This Is For You If...</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "You're a tradesperson in Slough, Langley, Horndean, or Chalvey",
              "You're tired of paying for Facebook ads that don't convert",
              "You want customers to find YOU instead of chasing leads",
              "You believe in your work and have good reviews",
              "You want to be seen as THE go-to in your trade",
              "You're ready to invest £149 to dominate for a full year",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white p-5 rounded-xl border border-slate-200">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#004225] text-white flex items-center justify-center text-sm">✓</span>
                <span className="text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-16">Common Questions</h2>
          
          <div className="space-y-8">
            {[
              {
                q: 'What if my category is already taken?',
                a: 'We process payments instantly. If someone claims your category before you, we\'ll refund you immediately — no questions asked.'
              },
              {
                q: 'What exactly do I get for £149?',
                a: 'The #1 spot in all our ranking articles for your trade, a dedicated spotlight article, Facebook promotions, email newsletter features, and ongoing mentions in new content — all for 12 months.'
              },
              {
                q: 'How do you determine rankings?',
                a: 'We analyze real Google reviews and local reputation. As a sponsored #1, you\'re featured at the top of every relevant article with a "Featured" badge — clearly the recommended choice.'
              },
              {
                q: 'What happens after 12 months?',
                a: 'You get first right of renewal at the same price before we offer the spot to anyone else. No price increases for existing sponsors.'
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-8">
                <h3 className="font-semibold text-slate-900 mb-3 text-lg">{faq.q}</h3>
                <p className="text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who's Behind This */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900 mb-6">Who's Behind Slough.co?</h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Hey, I'm Zack. I'm based in <strong>Horndean</strong> and I've lived in the area my whole life. I built Slough.co because I wanted to create something that actually helps local businesses get found — without the hassle of Facebook ads or SEO agencies charging thousands.
          </p>
          <p className="text-slate-600 mb-8 leading-relaxed">
            This isn't some faceless company. If you have questions, you can text me directly. I'm VAT registered, I use proper invoicing, and I genuinely want local businesses to succeed.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span>📍 Horndean</span>
            <span className="text-slate-300">•</span>
            <span>📱 07414 200457</span>
            <span className="text-slate-300">•</span>
            <span>✉️ zack@slough.co</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-[#0a1628] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-500 mb-4 text-sm tracking-wide uppercase">Still thinking about it?</p>
          <h2 className="font-serif text-3xl font-bold mb-8">
            Your competitor might not be.
          </h2>
          <a 
            href="#categories"
            className="inline-flex items-center gap-2 bg-[#004225] hover:bg-[#005530] text-white px-10 py-4 rounded-full font-semibold transition-all hover:scale-105"
          >
            Check Category Availability →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-10">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm">
          <Link href="/" className="text-white font-semibold hover:text-blue-400">
            Slough.co
          </Link>
          <span className="mx-3 text-slate-700">•</span>
          <span>Slough's Local Business Directory</span>
          <div className="mt-4 text-slate-600">
            Questions? Email <a href="mailto:zack@slough.co" className="text-slate-400 hover:text-white">zack@slough.co</a> or text <a href="sms:+447414200457" className="text-slate-400 hover:text-white">07414 200457</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
