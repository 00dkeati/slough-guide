import Breadcrumbs from '@/components/Breadcrumbs'
import TopNav from "@/app/(site)/components/TopNav"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact the Slough Directory team. Get your business listed, report issues, or ask questions about local services in Slough.',
}

export default function ContactPage() {
  return (
    <>
      <TopNav />
      <Breadcrumbs items={[
        { label: 'Contact' }
      ]} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-700">
            Get in touch with the Slough Directory team
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-700">
                    <a href="mailto:dean@slough.co" className="text-blue-600 hover:text-blue-800">
                      dean@slough.co
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Website</h3>
                  <p className="text-gray-700">
                    <a href="https://slough.co" className="text-blue-600 hover:text-blue-800">
                      slough.co
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Business Hours</h3>
                  <p className="text-gray-700">
                    Monday - Friday: 9:00 AM - 5:00 PM<br />
                    Saturday: 10:00 AM - 2:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Get Your Business Featured
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Are you a local business owner looking to be featured in our directory? 
                We'd love to help you reach more customers in Slough and surrounding areas.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Contact us at <a href="mailto:dean@slough.co" className="text-blue-600 hover:text-blue-800 font-medium">dean@slough.co</a> to learn more about listing your business and how we can help 
                you grow your local presence.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Send us a Message
            </h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a subject</option>
                  <option value="business-listing">Business Listing</option>
                  <option value="general-inquiry">General Inquiry</option>
                  <option value="technical-support">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Why Contact Us Section */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Why Contact Us?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-2">For Business Owners</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Get your business featured in our comprehensive directory. We provide detailed listings, 
                customer reviews, and marketing support to help local businesses thrive in Slough 
                and surrounding areas.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-2">For Customers</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Have a question about a local business? Need help finding a specific service? Our team 
                is here to assist you in discovering the best local businesses in your area.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-2">Report an Issue</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Found incorrect information or encountered a problem? Let us know so we can keep our 
                directory accurate and helpful for everyone.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-2">Partnership Opportunities</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Interested in partnering with us? We're always looking to collaborate with local 
                organizations, media outlets, and community groups.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced FAQs Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                How can I list my business?
              </h4>
              <p className="text-gray-700 text-sm">
                Contact us via email at <a href="mailto:dean@slough.co" className="text-blue-600 hover:underline">dean@slough.co</a> or use the contact form above. 
                We'll guide you through the simple process of adding your business to our directory. 
                Most listings are added within 24-48 hours.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a cost to list my business?
              </h4>
              <p className="text-gray-700 text-sm">
                Basic listings are completely free. We also offer enhanced listings with additional features 
                such as featured placement, priority in search results, and detailed business information for 
                businesses that want more visibility in the Slough area.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                How do I update my business information?
              </h4>
              <p className="text-gray-700 text-sm">
                Contact us with the updated information via email or the contact form, and we'll make the 
                changes promptly. We also regularly review listings for accuracy to ensure our directory 
                remains up-to-date and helpful for local residents.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                How quickly do you respond to inquiries?
              </h4>
              <p className="text-gray-700 text-sm">
                We typically respond to all inquiries within 24-48 hours during business hours. 
                For urgent matters related to business listings or technical issues, please mention 
                "urgent" in your message and we'll prioritize your request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
