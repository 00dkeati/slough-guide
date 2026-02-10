import { Metadata } from 'next'
import TopNav from "../(site)/components/TopNav"
import Breadcrumbs from '@/components/Breadcrumbs'
import SeoInternalLinks from '@/components/SeoInternalLinks'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Local Business Guide',
  description: 'Complete guide to finding and choosing local businesses in Slough. Tips, reviews, and recommendations for services across Berkshire.',
}

export default function GuidePage() {
  return (
    <>
      <TopNav />
      <Breadcrumbs items={[
        { label: 'Guide' }
      ]} />
      
      <main className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Local Business Guide
          </h1>
          <p className="text-xl text-gray-700">
            Your complete guide to finding and choosing the best local businesses in Slough
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Choose the Right Local Business</h2>
            <p className="text-gray-700 mb-4">
              Finding the right local business in Slough can make all the difference to your experience. Whether you're looking for a restaurant, tradesperson, or service provider, there are several key factors to consider.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Check Reviews & Ratings</h3>
                <p className="text-gray-700">
                  Look for businesses with consistently high ratings and read recent reviews to understand the quality of service you can expect.
                </p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Consider Location & Convenience</h3>
                <p className="text-gray-700">
                  Choose businesses that are conveniently located for you, with good parking and easy access from your home or workplace.
                </p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Compare Prices & Services</h3>
                <p className="text-gray-700">
                  Get quotes from multiple businesses to ensure you're getting good value for money while meeting your specific needs.
                </p>
              </div>
              
              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ask for Recommendations</h3>
                <p className="text-gray-700">
                  Word-of-mouth recommendations from friends, family, and neighbors are often the most reliable way to find trusted local businesses.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Business Categories</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/restaurants" className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-gray-900 mb-2">Best Restaurants in Slough</h3>
                <p className="text-gray-600 text-sm">From fine dining to casual eateries, discover Slough's best restaurants and takeaways.</p>
              </Link>
              
              <Link href="/estate-agents" className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-gray-900 mb-2">Best Estate Agents in Slough</h3>
                <p className="text-gray-600 text-sm">Estate agents, conveyancing, and property management services for buying, selling, or renting.</p>
              </Link>
              
              <Link href="/hairdressers" className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-gray-900 mb-2">Best Hairdressers in Slough</h3>
                <p className="text-gray-600 text-sm">Hair salons, barbers, beauty treatments, and personal care services.</p>
              </Link>
              
              <Link href="/plumbers" className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-gray-900 mb-2">Best Plumbers in Slough</h3>
                <p className="text-gray-600 text-sm">Find the best plumbers in Slough for all your plumbing needs and emergency repairs.</p>
              </Link>
              
              <Link href="/electricians" className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-gray-900 mb-2">Best Electricians in Slough</h3>
                <p className="text-gray-600 text-sm">Trusted electricians for domestic and commercial electrical work in Slough.</p>
              </Link>
              
              <Link href="/cafes" className="block bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all">
                <h3 className="font-semibold text-gray-900 mb-2">Best Cafes in Slough</h3>
                <p className="text-gray-600 text-sm">Coffee shops, cafes, and places to meet friends or work remotely.</p>
              </Link>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Areas We Cover</h2>
            <p className="text-gray-700 mb-4">
              Our directory covers Slough and all surrounding areas, ensuring you can find local businesses wherever you are in the region.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Main Areas</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><Link href="/area/slough" className="text-green-600 hover:text-green-700">Slough</Link> - Town center and surrounding residential areas</li>
                  <li><Link href="/area/cowplain" className="text-green-600 hover:text-green-700">Langley</Link> - Residential area with local amenities</li>
                  <li><Link href="/area/denmead" className="text-green-600 hover:text-green-700">Cippenham</Link> - Village community with traditional character</li>
                  <li><Link href="/area/purbrook" className="text-green-600 hover:text-green-700">Chalvey</Link> - Suburban area with good transport links</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Nearby Areas</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><Link href="/area/horndean" className="text-green-600 hover:text-green-700">Horndean</Link> - Village with local shops and services</li>
                  <li><Link href="/area/clanfield" className="text-green-600 hover:text-green-700">Clanfield</Link> - Rural village with community facilities</li>
                  <li><Link href="/seo/leigh-park" className="text-green-600 hover:text-green-700">Leigh Park</Link> - Residential area with shopping facilities</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8 bg-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Local Businesses?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Community Support</h3>
                <p className="text-gray-700 mb-4">
                  Supporting local businesses helps strengthen the community and keeps money circulating locally, benefiting everyone in the area.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Service</h3>
                <p className="text-gray-700">
                  Local businesses often provide more personalized service and have a better understanding of the specific needs of the area.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Local Knowledge</h3>
                <p className="text-gray-700 mb-4">
                  Local businesses understand the area's unique characteristics and can provide more relevant advice and services.
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Response</h3>
                <p className="text-gray-700">
                  Being nearby means faster response times and easier communication for ongoing projects or service needs.
                </p>
              </div>
            </div>
          </section>

          <section className="text-center bg-blue-600 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Find Local Businesses?</h2>
            <p className="text-blue-100 mb-6">
              Browse our comprehensive directory to discover the best local businesses in Slough and surrounding areas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Browse Categories
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Search Businesses
              </Link>
            </div>
          </section>

          {/* SEO Internal Links */}
          <SeoInternalLinks title="Popular Services in Slough" maxLinks={8} />
        </div>
      </main>
    </>
  )
}
