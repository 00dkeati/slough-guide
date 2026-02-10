import { Metadata } from 'next'
import Link from 'next/link'
import { getCategories } from '@/lib/db'
import Breadcrumbs from '@/components/Breadcrumbs'

export const metadata: Metadata = {
  title: 'Services Directory',
  description: 'Find professional services in Slough including trades, healthcare, beauty, and more. Comprehensive directory of local service providers.',
  openGraph: {
    title: 'Services Directory',
    description: 'Find professional services in Slough including trades, healthcare, beauty, and more.',
  },
}

export default async function ServicesPage() {
  const categories = await getCategories()
  
  // Group categories by type for better organization
  const serviceCategories = {
    'Health & Beauty': categories.filter(cat => 
      ['hair-salons', 'beauty-salons', 'nail-technicians', 'massage-therapists', 'barbers', 'dentists', 'physiotherapists', 'chiropractors'].includes(cat.slug)
    ),
    'Home & Garden': categories.filter(cat => 
      ['plumbers', 'electricians', 'builders', 'carpenters', 'roofers', 'painters', 'handyman', 'heating-engineers', 'landscapers', 'garden-centers', 'locksmiths', 'domestic-cleaners', 'carpet-cleaning', 'pest-control'].includes(cat.slug)
    ),
    'Automotive': categories.filter(cat => 
      ['car-mechanics', 'mot-centres', 'car-wash', 'mobile-mechanics', 'tyre-shops', 'driving-instructors', 'driving-schools'].includes(cat.slug)
    ),
    'Professional Services': categories.filter(cat => 
      ['solicitors', 'accountants', 'bookkeepers', 'estate-agents', 'letting-agents', 'it-services', 'web-designers', 'marketing-agencies', 'printers', 'photographers', 'graphic-designers'].includes(cat.slug)
    ),
    'Food & Dining': categories.filter(cat => 
      ['restaurants', 'cafes', 'coffee-shops', 'pubs', 'takeaways', 'fish-chips', 'catering-services', 'butchers', 'bakeries'].includes(cat.slug)
    ),
    'Retail & Shopping': categories.filter(cat => 
      ['supermarkets', 'convenience-stores', 'gift-shops', 'florists', 'pet-shops'].includes(cat.slug)
    ),
    'Childcare & Education': categories.filter(cat => 
      ['nurseries', 'tutors', 'childminders'].includes(cat.slug)
    ),
    'Pet Services': categories.filter(cat => 
      ['vets', 'dog-walkers', 'dog-groomers', 'pet-shops'].includes(cat.slug)
    ),
    'Fitness & Wellness': categories.filter(cat => 
      ['gyms', 'personal-trainers', 'yoga-studios'].includes(cat.slug)
    ),
    'Events & Entertainment': categories.filter(cat => 
      ['wedding-planners', 'djs', 'taxi-firms'].includes(cat.slug)
    ),
    'Community': categories.filter(cat => 
      ['community-centres', 'charities'].includes(cat.slug)
    )
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Services Directory",
    "description": "Comprehensive directory of professional services in Slough",
    "url": "https://www.slough.co/services",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Slough Services",
      "numberOfItems": categories.length,
      "itemListElement": categories.map((category, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "name": category.name,
          "url": `https://www.slough.co/services/${category.slug}-slough`,
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
        { label: 'Services', href: '/services' }
      ]} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Services Directory
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Find professional services in Slough and surrounding areas. Our comprehensive directory features verified local service providers across all industries.
          </p>
        </header>

        {/* Service Categories Grid */}
        <div className="space-y-12">
          {Object.entries(serviceCategories).map(([sectionTitle, sectionCategories]) => (
            sectionCategories.length > 0 && (
              <section key={sectionTitle} className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
                  {sectionTitle}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionCategories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/services/${category.slug}-slough`}
                      className="group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 hover:border-blue-300 rounded-lg p-6 transition-all duration-200 hover:shadow-md"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {category.description}
                      </p>
                      <div className="mt-3 text-blue-600 text-sm font-medium group-hover:text-blue-700">
                        View Services →
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          ))}
        </div>

        {/* Additional Information */}
        <section className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose Our Services Directory?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Verified Professionals</h3>
              <p className="text-gray-700 text-sm">
                All service providers in our directory are verified local businesses with genuine customer reviews and proven track records.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Local Expertise</h3>
              <p className="text-gray-700 text-sm">
                Our service providers understand the Slough area and are familiar with local regulations, preferences, and community needs.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-3">Quality Assured</h3>
              <p className="text-gray-700 text-sm">
                We regularly monitor reviews and update our listings to ensure you have access to the most reliable and highest-rated services.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-12 text-center bg-blue-600 text-white rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-blue-100 mb-6">
            If you need a specific service not listed here, contact us and we'll help you find the right professional.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </>
  )
}

