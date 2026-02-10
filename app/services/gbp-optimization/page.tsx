import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Google Business Profile Optimization | Slough.co',
  description: 'Get more customers from Google. We optimize your Google Business Profile to rank higher in local searches.',
}

export default function GBPOptimizationPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get More Customers From Google
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We optimize your Google Business Profile so you rank higher when locals search for your services.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            ✓ One-time £49 · No subscriptions · Results in 7 days
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1">✓ 300+ local businesses featured</span>
            <span className="flex items-center gap-1">✓ VAT Registered</span>
            <span className="flex items-center gap-1">✓ 100% Money-back guarantee</span>
          </div>
          
          {/* Trust Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl mx-auto">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">300+</div>
              <div className="text-xs text-gray-500">Businesses Featured</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">5</div>
              <div className="text-xs text-gray-500">Years Experience</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-xs text-gray-500">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Fix */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What We Fix</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Review Strategy', desc: 'Help you get more 5-star reviews that boost rankings' },
              { title: 'Keyword Optimization', desc: 'Add the right keywords to your business description' },
              { title: 'Google Posts', desc: 'Create fresh content that Google loves to see' },
              { title: 'Service Areas', desc: 'Properly configure your service locations' },
              { title: 'Photo Optimization', desc: 'Geo-tag and optimize your business photos' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl">✓</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Trust */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Who We Are</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Dean */}
            <div className="text-center">
              <div className="w-32 h-32 relative rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg">
                <Image
                  src="/images/team/dean-headshot.jpg"
                  alt="Dean Keating - CEO"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-gray-900">Dean Keating</h3>
              <p className="text-blue-600 font-medium">CEO & Founder</p>
              <p className="text-gray-600 text-sm mt-2">Featured in local press. Helping small businesses compete with the big players since 2020.</p>
            </div>
            {/* Zack */}
            <div className="text-center">
              <div className="w-32 h-32 relative rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg">
                <Image
                  src="/images/team/zack-headshot.jpg"
                  alt="Zack - Slough.co"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-gray-900">Zack</h3>
              <p className="text-blue-600 font-medium">Junior Partner</p>
              <p className="text-gray-600 text-sm mt-2">Handles outreach and Google Business Profile optimization for local trades.</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm mt-8">
            <span className="bg-white px-3 py-1 rounded-full border">📍 Based in Horndean</span>
            <span className="bg-white px-3 py-1 rounded-full border">✓ VAT Registered</span>
            <span className="bg-white px-3 py-1 rounded-full border">💳 Secure Stripe Payments</span>
          </div>
        </div>
      </section>

      {/* Real Samples */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">See Real Results</h2>
          <p className="text-gray-600 text-center mb-10">Actual examples from our work with local businesses</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Google Ranking Sample */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">📈 Improved Google Rankings</h3>
              <div className="border rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/samples/google-ranking-sample.png"
                  alt="Google ranking improvement example"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Example of improved local search visibility</p>
            </div>
            
            {/* SMS Conversation */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">💬 How Our Chats Go</h3>
              <div className="border rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/samples/sms-conversation-sample.png"
                  alt="SMS conversation example"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Real conversations with local business owners</p>
            </div>
          </div>

          {/* Invoice Sample */}
          <div className="mt-10">
            <h3 className="font-semibold text-gray-900 mb-3 text-center">🧾 Professional VAT Invoice</h3>
            <div className="max-w-md mx-auto border rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/samples/invoice-sample.png"
                alt="Sample VAT invoice"
                width={500}
                height={600}
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">You'll receive a proper VAT invoice for your records</p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Real Results</h2>
          <p className="text-gray-600 text-center mb-8">What our GBP optimization delivers for local businesses</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { metric: '73%', label: 'Average increase in profile views', icon: '👁️' },
              { metric: '2.4x', label: 'More calls from Google', icon: '📞' },
              { metric: '48hrs', label: 'To see first improvements', icon: '⚡' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="p-6 bg-white border rounded-lg text-center"
              >
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <span className="text-3xl font-bold text-blue-600 block">{item.metric}</span>
                <span className="text-sm text-gray-600 mt-2 block">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">90-Day Money-Back Guarantee</h3>
            <p className="text-gray-600">
              If you don't see improvement in your Google visibility within 90 days, we'll refund every penny.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              <Link href="/terms" className="underline">Terms and conditions apply</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Press / Media */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">As Featured In</h2>
          <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
            <Image
              src="/images/team/dean-press.jpg"
              alt="Dean Keating: Local Marketer Giving Small Businesses AI Power to Grow"
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">January 2023</p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What Clients Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { quote: "Looks great, much appreciated, kudos to you!", business: "Local Locksmith, Slough" },
              { quote: "That's brilliant, thank you 🙏", business: "Village Bakery, Chalvey" },
              { quote: "Nice one thank you so much.", business: "Carpenter, Horndean" },
              { quote: "Really impressed with the results. My calls have increased since the optimization.", business: "Plumber, Portsmouth" },
              { quote: "Professional service, would recommend to any local business.", business: "Electrician, Havant" },
              { quote: "Finally showing up when people search for my trade!", business: "Landscaper, Berkshire" },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-white border rounded-lg shadow-sm">
                <p className="text-gray-700 italic mb-3">"{item.quote}"</p>
                <p className="text-sm text-gray-500">— {item.business}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Verification */}
      <section className="py-12 px-4 bg-gray-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Official & Verified</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg border">
              <div className="font-semibold text-gray-900 mb-1">🏛️ Registered Business</div>
              <p className="text-gray-600">Registered in England & Wales</p>
              <p className="text-gray-500 text-xs">Companies House verified</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="font-semibold text-gray-900 mb-1">📋 VAT Registered</div>
              <p className="text-gray-600">Full VAT invoices provided</p>
              <p className="text-gray-500 text-xs">Claim back on your business expenses</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="font-semibold text-gray-900 mb-1">💳 Secure Payments</div>
              <p className="text-gray-600">Powered by Stripe</p>
              <p className="text-gray-500 text-xs">Bank-level encryption, buyer protection</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="font-semibold text-gray-900 mb-1">📍 Local Business</div>
              <p className="text-gray-600">Based in Horndean, Berkshire</p>
              <p className="text-gray-500 text-xs">Real people, real address, real phone</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - Objection Handling */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How do I know this isn't a scam?", a: "We're a registered UK business, VAT registered, and based locally in Horndean. You can see 300+ live articles we've written on Slough.co. Plus, Stripe protects every payment - if we don't deliver, you can dispute the charge." },
              { q: "What exactly do I get for £49?", a: "We optimize 5 key areas of your Google Business Profile: review strategy, keyword optimization, Google Posts, service areas, and photo optimization. These are the factors Google uses to rank local businesses." },
              { q: "What if it doesn't work?", a: "90-day money-back guarantee. If you don't see improvement within 90 days, we refund every penny. Terms and conditions apply." },
              { q: "Why is it so cheap?", a: "We're building Slough.co as a local directory. Helping you rank better means more people use our site. It's win-win, so we keep prices low." },
              { q: "Can I speak to someone first?", a: "Absolutely! Text us on 07414 200457 anytime. We're real people and happy to chat through any questions." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{item.q}</h3>
                <p className="text-gray-600 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>
          <div className="space-y-6">
            {[
              { step: 1, title: "You Pay £49", desc: "Secure payment via Stripe. Takes 30 seconds." },
              { step: 2, title: "We Audit Your Profile", desc: "Within 24 hours, we analyze your Google Business Profile and identify all improvement areas." },
              { step: 3, title: "We Optimize Everything", desc: "We implement all 5 optimization areas - you don't need to do anything." },
              { step: 4, title: "You See Results", desc: "Within 7 days, you'll see improved visibility. We send you a before/after report." },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Trust Banner */}
      <section className="py-8 px-4 bg-green-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg font-medium">
            🛡️ 90-Day Money-Back Guarantee · 💳 Secure Stripe Payments · 📋 VAT Invoice Included · 📍 Local Berkshire Business
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Rank Higher?</h2>
          <p className="text-xl mb-4 opacity-90">
            £49 one-time. No subscriptions. Results within 7 days.
          </p>
          <p className="text-2xl font-bold mb-6">
            That's just 13p per day for a whole year of visibility.
          </p>
          <p className="mb-4 opacity-75">
            Text us on <strong>07414 200457</strong> or reply to your SMS to get started.
          </p>
          <p className="text-sm opacity-60">
            Still not sure? Text us your questions - we reply within minutes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-500 text-sm">
        <p>Slough.co · Local Business Directory · VAT Registered</p>
        <p className="mt-2">
          <Link href="/" className="underline">Back to Slough.co</Link>
        </p>
      </footer>
    </main>
  )
}
