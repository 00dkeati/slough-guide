import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Wickes Slough | DIY Store Opening Hours & Location 2026',
  description: 'Wickes Slough DIY store guide. Opening hours, location, products, trade services, Click & Collect. Your local DIY and building supplies store.',
  keywords: 'wickes slough, diy slough, building supplies, trade counter, wickes opening hours',
}

export default function WickesSloughPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">Slough<span className="text-blue-600">.co</span></Link>
        </div>
      </header>

      <div className="bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Wickes Slough</h1>
          <p className="text-lg text-amber-50 max-w-3xl">Your local DIY and building supplies store. Opening hours, location, product range, and trade services.</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">📍 Store Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Location</h3>
              <p className="text-slate-700 mb-2"><strong>Wickes Slough</strong><br />Wellington Way<br />Slough<br />SL1 7UG</p>
              <a href="https://www.google.com/maps/search/Wickes+Slough" target="_blank" rel="noopener noreferrer" className="text-sm text-amber-600 hover:text-amber-700 font-medium">View on Google Maps →</a>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">⏰ Opening Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-600">Monday - Friday:</span><span className="font-semibold text-slate-900">7:00 AM - 8:00 PM</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Saturday:</span><span className="font-semibold text-slate-900">7:00 AM - 7:00 PM</span></div>
                <div className="flex justify-between"><span className="text-slate-600">Sunday:</span><span className="font-semibold text-slate-900">10:00 AM - 4:00 PM</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🛠️ Products & Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Timber & Sheet Materials', icon: '🪵' },
              { name: 'Plumbing & Heating', icon: '🚿' },
              { name: 'Electrical & Lighting', icon: '💡' },
              { name: 'Kitchens & Bathrooms', icon: '🚰' },
              { name: 'Paints & Decorating', icon: '🎨' },
              { name: 'Tools & Workwear', icon: '🔧' },
              { name: 'Building Materials', icon: '🧱' },
              { name: 'Doors & Windows', icon: '🚪' },
            ].map((product) => (
              <div key={product.name} className="bg-white rounded-xl p-5 shadow-sm text-center">
                <div className="text-4xl mb-2">{product.icon}</div>
                <h3 className="font-semibold text-slate-900">{product.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">🔨 Trade Services</h2>
          <p className="text-slate-700 mb-4">Wickes Slough offers specialist trade services for professional builders, electricians, plumbers, and decorators.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Trade Counter</h3>
              <p className="text-sm text-slate-700">Dedicated trade counter for fast service, bulk orders, and trade pricing.</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">TradePro Account</h3>
              <p className="text-sm text-slate-700">Sign up for a trade account for exclusive discounts, flexible payment terms, and priority service.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">💼 Jobs at Wickes</h2>
          <p className="text-slate-700 mb-4">Wickes regularly recruits customer advisors, trade counter staff, and warehouse assistants. Pay typically £10.50-£12.00/hr with staff discounts.</p>
          <Link href="/part-time-jobs-slough" className="text-sm text-amber-600 hover:text-amber-700 font-medium">View Part-Time Jobs →</Link>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">❓ FAQs</h2>
          <div className="space-y-6">
            {[
              { q: 'Does Wickes Slough do Click & Collect?', a: 'Yes, order online at wickes.co.uk and select Click & Collect at Slough. Most items ready within 2 hours.' },
              { q: 'Can I hire tools from Wickes Slough?', a: 'Yes, Wickes offers tool hire including power tools, ladders, and specialist equipment. Book online or in-store.' },
              { q: 'Does Wickes cut timber to size?', a: 'Yes, Wickes offers a free timber cutting service in-store. Bring your measurements and they\'ll cut to size while you wait.' },
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
