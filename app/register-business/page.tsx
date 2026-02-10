import { Metadata } from 'next'
import Link from 'next/link'
import RegisterBusinessForm from '@/components/RegisterBusinessForm'
import StripeCheckoutButton from '@/components/StripeCheckoutButton'

export const metadata: Metadata = {
  title: 'Register Your Business | Slough.co',
  description: 'Get your business listed on Slough\'s #1 local directory. Choose from free basic listing or premium story-based listing with Google ranking.',
}

export default function RegisterBusinessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">Slough</span>
            <span className="text-xl font-light text-blue-600">.co</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Get Your Business Found Locally
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join 500+ Slough businesses. Reach customers in SL1, SL2 & PO9 who are actively searching for your services.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {/* Free Tier */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 relative">
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">Free</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Basic Listing</h3>
            <p className="text-slate-600 text-sm mb-4">
              Get found in our directory.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              {[
                'Name & contact details',
                'Category listing',
                'Link to website',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
            <Link 
              href="#free-form"
              className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              Add Free Listing
            </Link>
          </div>

          {/* Sponsored Tier */}
          <div className="bg-white rounded-2xl border-2 border-amber-400 p-6 relative">
            <div className="absolute -top-3 left-4 bg-amber-400 text-amber-900 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              ⭐ Limited Slots
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">£14.99</span>
              <span className="text-slate-500 text-sm">/mo</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Sponsored</h3>
            <p className="text-slate-600 text-sm mb-4">
              Top of your category page.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              {[
                'Everything in Basic',
                '🥇 Top of category',
                '⭐ "Sponsored" badge',
                'Only 2-3 slots/category',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
            <StripeCheckoutButton 
              product="sponsored"
              className="block w-full text-center bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              Get Sponsored →
            </StripeCheckoutButton>
          </div>

          {/* Story Tier */}
          <div className="bg-white rounded-2xl border-2 border-blue-500 p-6 relative shadow-lg shadow-blue-100">
            <div className="absolute -top-3 left-4 bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
              Most Popular
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">£199</span>
              <span className="text-slate-500 text-sm"> once</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Story Listing</h3>
            <p className="text-slate-600 text-sm mb-4">
              Full article that ranks on Google.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              {[
                'Everything in Basic',
                '📝 Written article',
                '🔍 SEO optimised',
                '📱 Social media feature',
                '📧 Newsletter feature',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
            <StripeCheckoutButton 
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              Get Story Listing →
            </StripeCheckoutButton>
          </div>

          {/* Homepage Banner */}
          <div className="bg-white rounded-2xl border-2 border-purple-400 p-6 relative">
            <div className="absolute -top-3 left-4 bg-purple-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
              🏠 1 Slot Only
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-slate-900">£299</span>
              <span className="text-slate-500 text-sm">/year</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Homepage Banner</h3>
            <p className="text-slate-600 text-sm mb-4">
              Prime spot on our homepage.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              {[
                'Banner on homepage',
                '🎯 Maximum visibility',
                '🔗 Direct link to you',
                'Exclusive — 1 business',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
            <StripeCheckoutButton 
              product="homepage-banner"
              className="block w-full text-center bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
            >
              Get Banner Spot →
            </StripeCheckoutButton>
          </div>
        </div>

        {/* Social Proof */}
        <div className="bg-slate-50 rounded-2xl p-8 mb-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
            What Business Owners Say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "We've had 3 new bookings this week from the article alone. Worth every penny.",
                name: "Sarah",
                business: "Local Hair Salon"
              },
              {
                quote: "Showing up on Google when people search 'barber Slough' has been huge for us.",
                name: "Mike",
                business: "Men's Barber"
              },
              {
                quote: "The article they wrote really captured what makes our restaurant special.",
                name: "Tony",
                business: "Italian Restaurant"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <p className="text-slate-600 mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.business}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free Form */}
        <div id="free-form" className="scroll-mt-8">
          <RegisterBusinessForm />
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            {[
              {
                q: "What's included in the Story Listing?",
                a: "We write a 500-800 word article about your business, including your story, what makes you different, and why locals should choose you. It's SEO-optimised to rank on Google for searches like 'best [your service] Slough'."
              },
              {
                q: "How long until my article is live?",
                a: "Story Listings are typically written and published within 5-7 business days. We'll contact you to gather info and photos."
              },
              {
                q: "Can I update my listing later?",
                a: "Yes! Basic listings can be updated anytime. Story Listings include one round of revisions, and you can request updates for a small fee."
              },
              {
                q: "Do you share my business on social media?",
                a: "Story Listings are featured in our weekly newsletter (1,000+ local subscribers) and shared across our social media channels."
              }
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-slate-200 p-6 group">
                <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between items-center">
                  {faq.q}
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="text-slate-600 mt-4">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16 py-8">
        <div className="container mx-auto max-w-5xl px-4 text-center text-slate-400">
          <p>© {new Date().getFullYear()} Slough.co — Your local directory</p>
        </div>
      </footer>
    </div>
  )
}
