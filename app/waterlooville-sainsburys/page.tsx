import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sainsbury\'s Slough | Opening Hours, Location & Services 2026',
  description: 'Complete guide to Sainsbury\'s Slough supermarket. Opening hours, location, services, parking, pharmacy, Argos, petrol station. Your local Sainsbury\'s store guide.',
  keywords: 'sainsburys slough, slough sainsburys, sainsbury opening hours, sainsburys pharmacy slough, supermarket slough',
}

export const dynamic = 'force-dynamic'

export default function SainsburysSloughPage() {
  const services = [
    { name: 'Groceries & Fresh Food', icon: '🛒', desc: 'Full range of groceries, fresh produce, bakery, and deli' },
    { name: 'Pharmacy', icon: '💊', desc: 'In-store pharmacy with prescription services' },
    { name: 'Argos', icon: '📦', desc: 'Argos collection point for online orders' },
    { name: 'Petrol Station', icon: '⛽', desc: 'Sainsbury\'s petrol station with Nectar points' },
    { name: 'Clothing', icon: '👕', desc: 'Tu clothing range for all the family' },
    { name: 'Café', icon: '☕', desc: 'In-store café for refreshments while you shop' },
    { name: 'Home & Living', icon: '🏠', desc: 'Homeware, kitchen, and household essentials' },
    { name: 'Banking', icon: '💳', desc: 'ATM and banking services available' },
  ]

  const departments = [
    { name: 'Fresh Food', items: ['Fruit & Vegetables', 'Meat & Poultry', 'Fish Counter', 'Bakery', 'Deli Counter'] },
    { name: 'Food Cupboard', items: ['Tinned Goods', 'Pasta & Rice', 'Cooking Ingredients', 'Snacks', 'Breakfast'] },
    { name: 'Drinks', items: ['Soft Drinks', 'Wine & Beer', 'Spirits', 'Hot Drinks', 'Water & Juice'] },
    { name: 'Frozen', items: ['Ice Cream', 'Frozen Vegetables', 'Ready Meals', 'Pizza', 'Desserts'] },
    { name: 'Health & Beauty', items: ['Toiletries', 'Cosmetics', 'Medications', 'Baby Products', 'Hair Care'] },
    { name: 'Household', items: ['Cleaning Products', 'Laundry', 'Kitchen Roll', 'Bins & Storage', 'Pet Food'] },
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
      <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-orange-200 text-sm font-medium mb-4">
            <span>🛒</span>
            <span>SUPERMARKET</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Sainsbury's Slough
          </h1>
          <p className="text-lg text-orange-50 max-w-3xl mb-6">
            Your complete guide to Sainsbury's supermarket in Slough. Find opening hours, services, departments, parking info, and everything you need to know about your local store.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Key Info */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            📍 Store Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-xl">📍</span>
                <span>Location & Address</span>
              </h3>
              <p className="text-slate-700 mb-2">
                <strong>Sainsbury's Slough</strong><br />
                Wellington Retail Park<br />
                Wellington Way<br />
                Slough<br />
                SL1 7UH
              </p>
              <a 
                href="https://www.google.com/maps/search/Sainsburys+Slough" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                View on Google Maps →
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <span className="text-xl">⏰</span>
                <span>Opening Hours</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Monday - Saturday:</span>
                  <span className="font-semibold text-slate-900">7:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Sunday:</span>
                  <span className="font-semibold text-slate-900">10:00 AM - 4:00 PM</span>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-900">
                    ℹ️ <strong>Bank Holidays:</strong> Hours may vary. Check Sainsbury's website for holiday opening times.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚗</span>
                <div>
                  <p className="font-semibold text-slate-900">Free Parking</p>
                  <p className="text-xs text-slate-600">Large car park available</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">♿</span>
                <div>
                  <p className="font-semibold text-slate-900">Accessible</p>
                  <p className="text-xs text-slate-600">Disabled parking & facilities</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <p className="font-semibold text-slate-900">Nectar Points</p>
                  <p className="text-xs text-slate-600">Collect & spend in-store</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            🏪 Store Services & Facilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div key={service.name} className="bg-white rounded-xl p-5 shadow-sm">
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{service.name}</h3>
                <p className="text-sm text-slate-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Departments */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            🗂️ Store Departments
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.name}>
                <h3 className="font-semibold text-slate-900 mb-3 text-lg">{dept.name}</h3>
                <ul className="space-y-2">
                  {dept.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Pharmacy */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            💊 Sainsbury's Pharmacy Slough
          </h2>
          <div className="prose prose-green max-w-none">
            <p className="text-slate-700 leading-relaxed mb-4">
              The in-store Sainsbury's Pharmacy provides a full range of prescription services, over-the-counter medications, health advice, and wellness products. Collect your prescriptions while you shop, saving time and trips.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Pharmacy Services</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>✓ NHS & Private Prescriptions</li>
                  <li>✓ Prescription Collection Service</li>
                  <li>✓ Medication Reviews</li>
                  <li>✓ Flu Vaccinations (seasonal)</li>
                  <li>✓ Health Advice & Consultations</li>
                  <li>✓ Medicine Use Reviews</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Pharmacy Opening Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Monday - Friday:</span>
                    <span className="font-semibold text-slate-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Saturday:</span>
                    <span className="font-semibold text-slate-900">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Sunday:</span>
                    <span className="font-semibold text-slate-900">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Argos Collection Point */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            📦 Argos Collection Point
          </h2>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed mb-4">
              Sainsbury's Slough features an Argos collection point, making it convenient to order online and collect in-store. Shop thousands of products from Argos and pick up during your grocery shop.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">How It Works</h3>
                <ol className="space-y-2 text-sm text-slate-700">
                  <li>1. Order online at argos.co.uk</li>
                  <li>2. Choose "Fast Track Collection" at Sainsbury's Slough</li>
                  <li>3. Receive ready-for-collection notification (usually 3 hours)</li>
                  <li>4. Collect from the Argos desk during store hours</li>
                  <li>5. Show your order confirmation and collect your items</li>
                </ol>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-3">Collection Hours</h3>
                <p className="text-sm text-slate-700 mb-3">Same as main store opening hours</p>
                <Link 
                  href="/slough-argos" 
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  More About Argos Slough →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Petrol Station */}
        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            ⛽ Sainsbury's Petrol Station
          </h2>
          <div className="prose prose-blue max-w-none">
            <p className="text-slate-700 leading-relaxed mb-4">
              The Sainsbury's petrol station at Slough offers competitive fuel prices with added benefits for Nectar card holders. Conveniently located in the same retail park, fuel up while you shop.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Fuel Types</h3>
                <ul className="space-y-1 text-sm text-slate-700">
                  <li>• Unleaded Petrol</li>
                  <li>• Super Unleaded</li>
                  <li>• Diesel</li>
                  <li>• Premium Diesel</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Opening Hours</h3>
                <p className="text-sm text-slate-700">
                  6:00 AM - 11:00 PM<br />
                  7 days a week
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Nectar Points</h3>
                <p className="text-sm text-slate-700">
                  Earn 1 point per litre<br />
                  Extra points promotions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Shopping Tips */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            💡 Shopping Tips & Money-Saving Advice
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Save Money</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>✓ <strong>Nectar Card:</strong> Collect points on every shop (1 point = 0.5p value)</li>
                <li>✓ <strong>Nectar Prices:</strong> Exclusive discounts for card holders</li>
                <li>✓ <strong>Reduced Items:</strong> Check reduced section for discounted fresh food</li>
                <li>✓ <strong>Weekly Offers:</strong> Look for weekly deals and multi-buy promotions</li>
                <li>✓ <strong>Own Brand:</strong> Sainsbury's own products offer great value</li>
                <li>✓ <strong>Fuel Save:</strong> Spend £60+ in-store, get 5p off per litre of fuel</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Best Times to Visit</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>📅 <strong>Weekday Mornings (8-10 AM):</strong> Quietest period, fresh stock</li>
                <li>📅 <strong>Late Evening (8-9 PM):</strong> Reduced food section well-stocked</li>
                <li>❌ <strong>Avoid Saturday Afternoon:</strong> Busiest time of the week</li>
                <li>❌ <strong>Avoid Sunday Opening (10-11 AM):</strong> Queue for opening</li>
                <li>✓ <strong>Sunday Afternoon (2-3 PM):</strong> Quieter before 4 PM close</li>
                <li>✓ <strong>Post-Work Lull (6-7 PM weekdays):</strong> Rush over, stock restocked</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Employment */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            💼 Work at Sainsbury's Slough
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Sainsbury's is one of Slough's major employers, regularly recruiting for part-time and full-time positions. Roles include store assistants, customer service colleagues, stock handlers, and management positions.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Typical Roles</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• Store Assistants</li>
                <li>• Customer Service Team Members</li>
                <li>• Checkout Colleagues</li>
                <li>• Stock Replenishment</li>
                <li>• Department Managers</li>
                <li>• Pharmacy Staff</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h3 className="font-semibold text-slate-900 mb-3">Benefits</h3>
              <ul className="space-y-1 text-sm text-slate-700">
                <li>• £10.50-£11.50 per hour</li>
                <li>• Staff discount</li>
                <li>• Flexible hours available</li>
                <li>• Pension scheme</li>
                <li>• Career development opportunities</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/part-time-jobs-slough" className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
              View All Part-Time Jobs in Slough →
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            ❓ Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'What time does Sainsbury\'s Slough open?',
                a: 'Sainsbury\'s Slough opens at 7:00 AM Monday to Saturday, and 10:00 AM on Sundays. The store closes at 10:00 PM Monday-Saturday and 4:00 PM on Sundays.'
              },
              {
                q: 'Is there parking at Sainsbury\'s Slough?',
                a: 'Yes, there\'s a large free car park available at the Wellington Retail Park location. Parking includes disabled bays, parent-and-child spaces, and EV charging points.'
              },
              {
                q: 'Does Sainsbury\'s Slough have a pharmacy?',
                a: 'Yes, there\'s an in-store pharmacy open Monday-Friday 9 AM-6 PM, Saturday 9 AM-5 PM, and closed Sundays. They provide NHS prescriptions, over-the-counter medications, and health consultations.'
              },
              {
                q: 'Can I collect Argos orders from Sainsbury\'s Slough?',
                a: 'Yes, Sainsbury\'s Slough has an Argos collection point. Order online choosing "Fast Track Collection" and collect your items usually within 3 hours during store opening times.'
              },
              {
                q: 'Does Sainsbury\'s Slough have a petrol station?',
                a: 'Yes, the petrol station is open 6 AM-11 PM daily, offering unleaded, super unleaded, diesel, and premium diesel. Nectar cardholders earn 1 point per litre.'
              },
              {
                q: 'What are the quietest times to shop at Sainsbury\'s Slough?',
                a: 'Weekday mornings (8-10 AM) and late evenings (8-9 PM) are typically quietest. Avoid Saturday afternoons which are the busiest time. Sunday afternoons (2-3 PM) are also relatively quiet.'
              },
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        <section className="bg-slate-100 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Related Information
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Link href="/slough-asda" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">🏪</span>
              <span className="font-medium text-slate-900">Asda Slough</span>
            </Link>
            <Link href="/slough-argos" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">📦</span>
              <span className="font-medium text-slate-900">Argos Slough</span>
            </Link>
            <Link href="/part-time-jobs-slough" className="flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <span className="text-2xl">💼</span>
              <span className="font-medium text-slate-900">Part-Time Jobs</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
