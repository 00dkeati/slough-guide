import { Metadata } from 'next'
import Link from 'next/link'
import { getCategories } from '@/lib/db'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Property Services Directory',
  description: 'Find property-related services in Slough including estate agents, conveyancing, mortgage brokers, removal services, and more.',
  openGraph: {
    title: 'Property Services Directory',
    description: 'Find property-related services in Slough including estate agents, conveyancing, mortgage brokers, removal services, and more.',
  },
}

export default async function PropertyPage() {
  const categories = await getCategories()
  
  // Property-related categories
  const propertyCategories = {
    'Property Sales & Lettings': categories.filter(cat => 
      ['estate-agents', 'letting-agents'].includes(cat.slug)
    ),
    'Legal & Financial': categories.filter(cat => 
      ['solicitors', 'accountants', 'bookkeepers'].includes(cat.slug)
    ),
    'Property Services': categories.filter(cat => 
      ['removal-companies', 'locksmiths', 'domestic-cleaners', 'carpet-cleaning', 'pest-control'].includes(cat.slug)
    ),
    'Home Improvement': categories.filter(cat => 
      ['builders', 'carpenters', 'roofers', 'painters', 'handyman', 'heating-engineers', 'landscapers', 'garden-centers'].includes(cat.slug)
    ),
    'Utilities & Maintenance': categories.filter(cat => 
      ['plumbers', 'electricians'].includes(cat.slug)
    )
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Property Services Directory",
    "description": "Comprehensive directory of property-related services in Slough",
    "url": "https://www.slough.co/property",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Slough Property Services",
      "numberOfItems": Object.values(propertyCategories).flat().length,
      "itemListElement": Object.values(propertyCategories).flat().map((category, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "name": category.name,
          "url": `https://www.slough.co/property/${category.slug}-slough`,
          "description": category.description
        }
      }))
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Breadcrumbs items={[
        { label: 'Property', href: '/property' }
      ]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Property Services Directory
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Find all the property-related services you need in Slough. From buying and selling to maintenance and legal services, we've got you covered.
          </p>
        </header>

        {/* Property Services Grid */}
        <div className="space-y-12">
          {Object.entries(propertyCategories).map(([sectionTitle, sectionCategories]) => (
            sectionCategories.length > 0 && (
              <section key={sectionTitle} className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                  {sectionTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/property/${category.slug}-slough`}
                      className="group bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 hover:border-green-300 rounded-lg p-6 transition-all duration-200 hover:shadow-md"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {category.description}
                      </p>
                      <div className="mt-3 text-green-600 text-sm font-medium group-hover:text-green-700">
                        View Services →
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          ))}
        </div>

        {/* Property Market Overview */}
        <section className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Slough Property Market Overview
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Market Characteristics</h3>
              <p className="text-gray-700 mb-4">
                Slough offers a diverse property market with everything from modern new builds to traditional family homes. The area benefits from excellent transport links to Portsmouth and London, making it popular with commuters and families alike.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Popular Areas</h3>
              <p className="text-gray-700">
                Key residential areas include central Slough, Langley, Cippenham, and Chalvey, each offering distinct character and amenities while maintaining easy access to the town center.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Local Services</h3>
              <p className="text-gray-700 mb-4">
                The area is well-served by local professionals who understand the local market, regulations, and community needs. From estate agents to conveyancing solicitors, you'll find experienced professionals ready to help.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Community Benefits</h3>
              <p className="text-gray-700">
                Slough's strong sense of community, excellent schools, and range of amenities make it an attractive place to live, work, and invest in property.
              </p>
            </div>
          </div>
        </section>

        {/* Property Process Guide */}
        <section className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Property Process Guide
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Buying Property</h3>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Find an estate agent</li>
                <li>• Arrange mortgage advice</li>
                <li>• Instruct a solicitor</li>
                <li>• Arrange surveys</li>
                <li>• Complete conveyancing</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Selling Property</h3>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Property valuation</li>
                <li>• Choose estate agent</li>
                <li>• Prepare property</li>
                <li>• Marketing & viewings</li>
                <li>• Exchange & completion</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Property Management</h3>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Regular maintenance</li>
                <li>• Emergency repairs</li>
                <li>• Tenant management</li>
                <li>• Legal compliance</li>
                <li>• Financial management</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-12 text-center bg-green-600 text-white rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Start Your Property Journey?
          </h2>
          <p className="text-green-100 mb-6">
            Whether you're buying, selling, or managing property in Slough, our directory connects you with trusted local professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/estate-agents-slough"
              className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Find Estate Agents
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Get Advice
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

