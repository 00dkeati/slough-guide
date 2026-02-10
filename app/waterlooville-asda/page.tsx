import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Asda Slough | Opening Hours, Location & Services 2026',
  description: 'Complete guide to Asda Slough superstore. 24-hour opening, location, services, parking, pharmacy, George clothing, petrol station. Your local Asda guide.',
  keywords: 'asda slough, slough asda, asda opening hours, asda 24 hour, supermarket slough, george clothing',
}

export default function AsdaSloughPage() {
  return (
    <div className="min-h-screen bg-slate-50">
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

      <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-green-200 text-sm font-medium mb-4">
            <span>🏪</span>
            <span>SUPERSTORE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Asda Slough
          </h1>
          <p className="text-lg text-green-50 max-w-3xl">
            Your complete guide to Asda Slough superstore. Find opening hours (open 24 hours Mon-Sat!), services, George clothing, petrol station, and everything you need to know.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">📍 Store Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Location & Address</h3>
              <p className="text-slate-700 mb-2">
                <strong>Asda Slough Superstore</strong><br />
                Hambledon Road<br />
                Slough<br />
                Berkshire<br />
                SL1 7TS
              </p>
              <a href="https://www.google.com/maps/search/Asda+Slough" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-700 font-medium">
                View on Google Maps →
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">⏰ Opening Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-slate-600">Monday - Saturday:</span>
                  <span className="font-bold text-green-700">24 HOURS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Sunday:</span>
                  <span className="font-semibold text-slate-900">10:00 AM - 4:00 PM</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-900">
                    ℹ️ <strong>24-Hour Shopping:</strong> Shop anytime Monday-Saturday! Perfect for late-night or early-morning convenience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">🏪 Store Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Groceries & Fresh Food', icon: '🛒', desc: 'Full superstore with all departments' },
              { name: 'George Clothing', icon: '👕', desc: 'Wide range of affordable fashion' },
              { name: 'Pharmacy', icon: '💊', desc: 'NHS prescriptions & health advice' },
              { name: 'Petrol Station', icon: '⛽', desc: '24-hour fuel station' },
              { name: 'Opticians', icon: '👓', desc: 'Eye tests & glasses' },
              { name: 'Photo Centre', icon: '📸', desc: 'Photo printing & gifts' },
              { name: 'Home & Living', icon: '🏠', desc: 'Homeware & electronics' },
              { name: 'Café', icon: '☕', desc: 'In-store café & seating area' },
            ].map((service) => (
              <div key={service.name} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{service.name}</h3>
                <p className="text-sm text-slate-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">🛍️ Why Shop at Asda Slough?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">💷 Price Match Guarantee</h3>
              <p className="text-sm text-slate-700 mb-2">
                Asda's Price Guarantee means you're guaranteed low prices. If a branded product is cheaper at Sainsbury's, Tesco, or Morrisons, Asda will be at least the same price.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">⏰ 24-Hour Convenience</h3>
              <p className="text-sm text-slate-700 mb-2">
                Shop anytime Monday-Saturday! Perfect for shift workers, parents with young children, or anyone who prefers to avoid busy periods. Late-night shopping means minimal queues.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">👕 George Clothing</h3>
              <p className="text-sm text-slate-700 mb-2">
                Asda's exclusive George brand offers stylish, affordable clothing for all the family. From school uniforms to workwear to weekend fashion, all at great value prices.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">🚗 Free Parking</h3>
              <p className="text-sm text-slate-700 mb-2">
                Large car park with ample spaces, disabled bays, parent-and-child parking, and EV charging points. Easy loading bays near the entrance.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">💼 Work at Asda Slough</h2>
          <p className="text-slate-700 mb-4">
            Asda is a major employer in Slough with regular vacancies for customer service colleagues, stock assistants, and department managers. Offering competitive pay (£10.42-£11.20/hr), staff discounts, and flexible hours including nights.
          </p>
          <Link href="/part-time-jobs-slough" className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium">
            View Part-Time Jobs in Slough →
          </Link>
        </section>

        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">❓ FAQs</h2>
          <div className="space-y-6">
            {[
              { q: 'Is Asda Slough open 24 hours?', a: 'Yes! Asda Slough is open 24 hours Monday to Saturday, meaning you can shop any time from 12:00 AM Monday through to 10:00 PM Saturday. Sunday hours are 10:00 AM - 4:00 PM.' },
              { q: 'Does Asda Slough have a petrol station?', a: 'Yes, the petrol station is open 24 hours daily, offering unleaded, super unleaded, diesel, and premium diesel with competitive prices.' },
              { q: 'Can I buy George clothing at Asda Slough?', a: 'Yes, there\'s a large George clothing department with clothes for women, men, children, and babies, plus shoes, accessories, and school uniforms.' },
              { q: 'What are the best times to shop to avoid crowds?', a: 'Late evening (after 8 PM) and early morning (before 8 AM) weekdays are quietest. Avoid Saturday daytime and Sunday opening time (10 AM) which are busiest.' },
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
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/slough-sainsburys" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🛒</span>
              <span className="font-medium text-slate-900">Sainsbury's</span>
            </Link>
            <Link href="/slough-argos" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">📦</span>
              <span className="font-medium text-slate-900">Argos</span>
            </Link>
            <Link href="/part-time-jobs-slough" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">💼</span>
              <span className="font-medium text-slate-900">Jobs</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
