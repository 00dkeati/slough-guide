import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Argos Slough | Opening Hours, Location & Click & Collect 2026',
  description: 'Argos Slough - Fast Track collection, opening hours, location, services. Order online, collect in-store. Your local Argos guide.',
  keywords: 'argos slough, slough argos, argos click and collect, argos opening hours slough',
}

export default function ArgosSloughPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">Slough<span className="text-blue-600">.co</span></Link>
        </div>
      </header>

      <div className="bg-gradient-to-br from-red-600 via-red-500 to-red-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Argos Slough</h1>
          <p className="text-lg text-red-50 max-w-3xl">Complete guide to Argos in Slough. Fast Track collection, opening hours, product range, and how to shop.</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">📍 Argos Location in Slough</h2>
          <p className="text-slate-700 mb-4">Argos operates collection points at both Sainsbury's locations in Slough:</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Argos in Sainsbury's - Wellington Retail Park</h3>
              <p className="text-sm text-slate-700 mb-2">Wellington Way, Slough SL1 7UH</p>
              <p className="text-sm text-slate-600 mb-2"><strong>Hours:</strong> Mon-Sat 7 AM-10 PM, Sun 10 AM-4 PM</p>
              <Link href="/slough-sainsburys" className="text-sm text-blue-600 hover:underline">View Sainsbury's Details →</Link>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-2">Fast Track Collection</h3>
              <p className="text-sm text-slate-700">Order online at argos.co.uk and select Fast Track Collection at Slough. Most items ready in 3 hours!</p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">🛍️ How to Shop Argos Slough</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-slate-900 mb-2">1. Browse & Order</h3>
              <p className="text-sm text-slate-700">Shop 1000s of products on argos.co.uk or the Argos app</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl mb-2">⏱️</div>
              <h3 className="font-semibold text-slate-900 mb-2">2. Fast Track Collection</h3>
              <p className="text-sm text-slate-700">Select Sainsbury's Slough as your collection point</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-semibold text-slate-900 mb-2">3. Collect</h3>
              <p className="text-sm text-slate-700">Receive notification (usually 3 hours), then collect in-store</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">🎁 What Can You Buy at Argos?</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { cat: 'Technology', items: 'TVs, laptops, tablets, phones, gaming consoles' },
              { cat: 'Home & Garden', items: 'Furniture, DIY, garden equipment, kitchenware' },
              { cat: 'Toys & Games', items: 'LEGO, board games, action figures, dolls' },
              { cat: 'Sports & Leisure', items: 'Fitness equipment, bikes, camping gear' },
              { cat: 'Clothing & Jewellery', items: 'Watches, jewellery, accessories' },
              { cat: 'Baby & Nursery', items: 'Prams, car seats, cots, monitors' },
              { cat: 'Health & Beauty', items: 'Electricals, grooming, beauty products' },
              { cat: 'Office & Stationery', items: 'Desks, chairs, printers, supplies' },
            ].map((cat) => (
              <div key={cat.cat} className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-2">{cat.cat}</h3>
                <p className="text-xs text-slate-600">{cat.items}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">❓ FAQs</h2>
          <div className="space-y-6">
            {[
              { q: 'Where is Argos in Slough?', a: 'Argos operates collection points inside Sainsbury\'s stores in Slough. The main location is at Sainsbury\'s Wellington Retail Park.' },
              { q: 'How long does Fast Track Collection take?', a: 'Most Fast Track items are ready to collect within 3 hours. You\'ll receive an email or text notification when your order is ready.' },
              { q: 'Can I return Argos items to Slough?', a: 'Yes, you can return most Argos items to the Sainsbury\'s collection point within 30 days, with proof of purchase.' },
              { q: 'Do I need an Argos account?', a: 'No, you can checkout as a guest. However, having an account lets you track orders and save favourites more easily.' },
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-100 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Related Information</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/slough-sainsburys" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🛒</span>
              <span className="font-medium text-slate-900">Sainsbury's</span>
            </Link>
            <Link href="/slough-wickes" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🔨</span>
              <span className="font-medium text-slate-900">Wickes</span>
            </Link>
            <Link href="/slough-asda" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🏪</span>
              <span className="font-medium text-slate-900">Asda</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
