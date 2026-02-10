import { Metadata } from 'next'
import TopNav from "../(site)/components/TopNav"

export const metadata: Metadata = {
  title: 'Get Your Business Featured',
  description: 'List your Slough business in our directory. Reach local customers and grow your business with our featured listings.',
  keywords: 'get featured, business listing, slough directory, local business, advertise',
  openGraph: {
    title: 'Get Your Business Featured',
    description: 'List your Slough business in our directory. Reach local customers and grow your business with our featured listings.',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Your Business Featured',
    description: 'List your Slough business in our directory. Reach local customers and grow your business with our featured listings.',
  },
}

export default function GetFeaturedPage() {
  return (
    <>
      <TopNav />
      
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get Your Business Featured</h1>
            <p className="text-xl text-gray-600">
              Join hundreds of local businesses already featured in our comprehensive Slough directory
            </p>
          </div>

          {/* Success Message */}
          <div id="success-message" className="hidden bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Thank you for your submission!</h3>
                <p className="text-green-800">We've received your business information and will contact you within 2-3 business days.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Benefits Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Get Featured?</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Increased Visibility</h3>
                    <p className="text-gray-600">Get discovered by thousands of local customers searching for your services</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Professional Listing</h3>
                    <p className="text-gray-600">Complete business profile with photos, contact details, and service information</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">SEO Benefits</h3>
                    <p className="text-gray-600">Improve your local search rankings and online presence</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Customer Reviews</h3>
                    <p className="text-gray-600">Showcase customer testimonials and build trust with potential clients</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-900">Free to List</h3>
                    <p className="text-gray-600">Basic listing is completely free with no hidden costs</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Started Today</h2>
              <form id="feature-form" action="/api/get-featured" method="POST" className="space-y-6">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your business name"
                  />
                </div>

                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="023 9200 0000"
                  />
                </div>

                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type *
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select business type</option>
                    <option value="restaurant">Restaurant & Food</option>
                    <option value="retail">Retail & Shopping</option>
                    <option value="healthcare">Healthcare & Medical</option>
                    <option value="beauty">Beauty & Wellness</option>
                    <option value="automotive">Automotive</option>
                    <option value="professional">Professional Services</option>
                    <option value="home">Home & Garden</option>
                    <option value="entertainment">Entertainment & Leisure</option>
                    <option value="education">Education & Training</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Street address, Slough, Berkshire"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Tell us about your business, services, and what makes you special..."
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>What happens next?</strong> We'll review your submission and contact you within 2-3 business days to discuss your listing and any additional features you might be interested in.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors text-lg"
                >
                  Submit Business Information
                </button>
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Questions?</h3>
              <p className="text-gray-600 mb-4">
                Need help or have questions about getting your business featured?
              </p>
              <a 
                href="mailto:dean@slough.co"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                dean@slough.co
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* JavaScript for form handling */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Check for success parameter in URL
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('success') === 'true') {
            document.getElementById('success-message').classList.remove('hidden');
            document.getElementById('feature-form').style.display = 'none';
            // Scroll to success message
            document.getElementById('success-message').scrollIntoView({ behavior: 'smooth' });
          }

          // Handle form submission
          document.getElementById('feature-form').addEventListener('submit', function(e) {
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            // Show loading state
            submitButton.textContent = 'Submitting...';
            submitButton.disabled = true;
            
            // Reset button after 3 seconds (in case of redirect delay)
            setTimeout(() => {
              submitButton.textContent = originalText;
              submitButton.disabled = false;
            }, 3000);
          });
        `
      }} />
    </>
  )
}
