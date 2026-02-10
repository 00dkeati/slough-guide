import { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Welcome Aboard! | Slough.co',
  description: 'Thank you for becoming a featured business on Slough.co',
}

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Facebook Purchase Event */}
      <Script id="fb-purchase" strategy="afterInteractive">
        {`
          if (typeof fbq !== 'undefined') {
            fbq('track', 'Purchase', {
              content_name: '#1 Sponsored Listing - Slough.co',
              content_category: 'Sponsored Listing',
              content_ids: ['sponsored-listing-149'],
              content_type: 'product',
              value: 149.00,
              currency: 'GBP'
            });
          }
        `}
      </Script>
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">
            Slough<span className="text-blue-600">.co</span>
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-slate-600">
            Welcome to Slough.co's featured businesses. You've secured the #1 spot in your category for the next 12 months.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Tell Us About Your Business
          </h2>
          <p className="text-slate-600 mb-8">
            Fill in these details so we can create your spotlight article and get you featured across our platform.
          </p>

          <form 
            action="https://formspree.io/f/xovezpwl" 
            method="POST"
            className="space-y-6"
          >
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                name="business_name"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="e.g., Smith's Plumbing Services"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Category/Trade *
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="">Select your category...</option>
                <option value="plumber">Plumber</option>
                <option value="electrician">Electrician</option>
                <option value="roofer">Roofer</option>
                <option value="builder">Builder</option>
                <option value="painter">Painter & Decorator</option>
                <option value="landscaper">Landscaper</option>
                <option value="gardener">Gardener</option>
                <option value="heating">Heating Engineer</option>
                <option value="locksmith">Locksmith</option>
                <option value="carpet-cleaner">Carpet Cleaner</option>
                <option value="window-cleaner">Window Cleaner</option>
                <option value="handyman">Handyman</option>
                <option value="dog-groomer">Dog Groomer</option>
                <option value="personal-trainer">Personal Trainer</option>
                <option value="photographer">Photographer</option>
                <option value="driving-instructor">Driving Instructor</option>
                <option value="hairdresser">Hairdresser</option>
                <option value="beauty">Beauty Salon</option>
                <option value="nail-tech">Nail Technician</option>
                <option value="cafe">Café</option>
                <option value="restaurant">Restaurant</option>
                <option value="pub">Pub</option>
                <option value="takeaway">Takeaway</option>
                <option value="other">Other (specify below)</option>
              </select>
            </div>

            {/* Contact Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                name="contact_name"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="e.g., John Smith"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="e.g., 07700 900123"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="e.g., john@smithsplumbing.co.uk"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website (if you have one)
              </label>
              <input
                type="url"
                name="website"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="e.g., https://smithsplumbing.co.uk"
              />
            </div>

            {/* Google Reviews Link */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Google Business Profile Link
              </label>
              <input
                type="url"
                name="google_profile"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="e.g., https://g.page/your-business"
              />
              <p className="text-xs text-slate-500 mt-1">We'll pull your reviews and rating from here</p>
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tell us about your business *
              </label>
              <textarea
                name="about"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                placeholder="What makes your business special? How long have you been operating? What areas do you cover? Any awards or certifications?"
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Photos of your work (optional)
              </label>
              <p className="text-sm text-slate-500 mb-2">
                Email any photos to <a href="mailto:hello@slough.co" className="text-blue-600 hover:underline">hello@slough.co</a> and we'll add them to your article.
              </p>
            </div>

            {/* Hidden field for source */}
            <input type="hidden" name="_source" value="featured-listing-checkout" />

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              Submit My Details →
            </button>
          </form>
        </div>

        {/* What Happens Next */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
          <ol className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              <span>We'll review your details and create your spotlight article (usually within 48 hours)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              <span>You'll be added as #1 in all relevant ranking articles for your category</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              <span>We'll send you a confirmation email with links to your features</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              <span>Throughout the year, you'll be included in new content, Facebook posts, and newsletters</span>
            </li>
          </ol>
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          Questions? Email us at <a href="mailto:hello@slough.co" className="text-blue-600 hover:underline">hello@slough.co</a>
        </p>
      </main>
    </div>
  )
}
