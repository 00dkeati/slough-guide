export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getAreaBySlug, getBusinesses, getCategories, getAreas, getFeaturedBusinesses } from '@/lib/db'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessCard from '@/components/BusinessCard'
import RelatedLinks from '@/components/RelatedLinks'
import FAQ from '@/components/FAQ'
import { Metadata } from 'next'

interface AreaPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: AreaPageProps): Promise<Metadata> {
  const area = await getAreaBySlug(params.slug)
  
  if (!area) {
    return {
      title: 'Area Not Found'
    }
  }

  return {
    title: `Businesses in ${area.name}`,
    description: `Discover the best local businesses in ${area.name}. From restaurants to services, find everything you need in ${area.name}.`,
    openGraph: {
      title: `Businesses in ${area.name}`,
      description: `Discover the best local businesses in ${area.name}.`,
    },
  }
}

export default async function AreaPage({ params }: AreaPageProps) {
  const area = await getAreaBySlug(params.slug)
  
  if (!area) {
    notFound()
  }

  const [businesses, categories, allAreas, featuredBusinesses] = await Promise.all([
    getBusinesses(undefined, params.slug),
    getCategories(),
    getAreas(),
    getFeaturedBusinesses(3)
  ])

  // Group businesses by category
  const businessesByCategory = businesses.reduce((acc, business) => {
    if (!acc[business.category]) {
      acc[business.category] = []
    }
    acc[business.category].push(business)
    return acc
  }, {} as Record<string, typeof businesses>)

  // Generate FAQ content
  const faqs = [
    {
      question: `What businesses are available in ${area.name}?`,
      answer: `${area.name} has a diverse range of local businesses including restaurants, professional services, retail shops, and more. Our directory helps you find the best options for your needs.`
    },
    {
      question: `How do I find specific services in ${area.name}?`,
      answer: `Use our category filters to browse businesses by type, or search for specific services. Each business listing includes contact information, reviews, and detailed descriptions.`
    },
    {
      question: `Are these businesses verified and reliable?`,
      answer: `Yes, all businesses in our directory are verified local establishments with genuine customer reviews and ratings. We regularly monitor and update our listings to ensure quality.`
    }
  ]

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Local Businesses in ${area.name}`,
    "description": `A comprehensive directory of local businesses in ${area.name}`,
    "numberOfItems": businesses.length,
    "itemListElement": businesses.map((business, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": business.name,
        "url": `https://sloughdirectory.co.uk/biz/${business.slug}`,
        "telephone": business.phone,
        "address": business.address,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": business.rating,
          "reviewCount": business.review_count
        }
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <Breadcrumbs items={[
        { label: area.name, href: `/area/${area.slug}` }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Local Businesses in {area.name}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              {area.description || `Discover the best local businesses serving ${area.name} and surrounding areas. From professional services to dining and entertainment, find everything you need in our comprehensive directory.`}
            </p>
            <div className="mt-4 text-sm text-gray-600">
              {businesses.length} businesses found • Last updated: {new Date().toLocaleDateString('en-GB')}
            </div>
          </header>

          {businesses.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(businessesByCategory).map(([categorySlug, categoryBusinesses]) => {
                const category = categories.find(c => c.slug === categorySlug)
                return (
                  <section key={categorySlug} className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {category?.name || categorySlug}
                      </h2>
                      <a 
                        href={`/${categorySlug}/${params.slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View All ({categoryBusinesses.length}) →
                      </a>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {categoryBusinesses.slice(0, 4).map((business) => (
                        <BusinessCard key={business.id} business={business} />
                      ))}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No businesses found in {area.name}
              </h2>
              <p className="text-gray-600">
                We're working on adding more businesses to this area. Check back soon!
              </p>
            </div>
          )}

          {/* Local Insights */}
          <section className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About {area.name}</h3>
            <p className="text-gray-700 leading-relaxed">
              {area.description || `${area.name} is a vibrant community with a diverse range of local businesses serving residents and visitors. The area benefits from experienced professionals and established businesses that understand the local market and provide personalized service.`}
            </p>
          </section>

          {/* Area Overview */}
          <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Area Overview</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {area.name} is a vibrant community in the Slough area, known for its friendly atmosphere and diverse local amenities. With a mix of residential areas, local businesses, and community facilities, it offers residents and visitors a welcoming environment with everything they need close at hand.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The area benefits from excellent transport links, making it easily accessible from surrounding towns and cities. Whether you're looking for shopping, dining, professional services, or entertainment, {area.name} has a variety of options to suit different needs and preferences.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Local businesses in {area.name} are known for their commitment to customer service and community involvement. Many establishments have been serving the area for years, building strong relationships with residents and contributing to the area's character and charm.
              </p>
            </div>
          </section>

          {/* Local Services */}
          <section className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Local Services</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {area.name} is home to a diverse range of local businesses including restaurants, shops, professional services, and tradespeople. The area benefits from excellent transport links and local amenities, making it convenient for residents to access quality services.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                From family-run restaurants serving traditional British cuisine to modern cafes and international dining options, the food scene in {area.name} caters to all tastes and budgets. Local shops provide essential goods and services, while professional services offer expert advice and support for both personal and business needs.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The tradespeople and service providers in {area.name} are known for their reliability and quality workmanship. Whether you need home improvements, vehicle services, or professional consultations, you'll find experienced local businesses ready to help with competitive pricing and personalized service.
              </p>
            </div>
          </section>

          {/* Community & Lifestyle */}
          <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Community & Lifestyle</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Residents of {area.name} enjoy access to excellent schools, parks and green spaces, and community facilities. The area is well-connected with public transport and major road networks, making it ideal for both families and professionals who need to commute to nearby towns and cities.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The community spirit in {area.name} is strong, with regular events and activities bringing residents together. Local businesses often sponsor community initiatives and support local causes, creating a sense of belonging and mutual support among residents and business owners.
              </p>
              <p className="text-gray-700 leading-relaxed">
                What makes {area.name} special is its perfect balance of urban convenience and community charm. You can enjoy the benefits of being close to major shopping centers and transport links while still experiencing the personal service and friendly atmosphere that only local businesses can provide.
              </p>
            </div>
          </section>

          {/* Property & Housing */}
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Property & Housing</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {area.name} features a mix of housing types including traditional family homes, modern apartments, and period properties, with prices typically reflecting the area's desirability and convenience. The area is popular with families due to its excellent schools, safe environment, and community facilities.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The property market in {area.name} benefits from the area's strong local economy and excellent transport links. Whether you're looking to buy your first home, upgrade to a larger property, or invest in rental accommodation, the area offers good value and strong potential for capital growth.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Local estate agents in {area.name} have extensive knowledge of the area and can provide expert advice on property values, market trends, and the best neighborhoods to suit your lifestyle and budget. Their local expertise ensures you make informed decisions about your property investment.
              </p>
            </div>
          </section>

          <FAQ faqs={faqs} />
        </div>

        <div className="lg:col-span-1">
          <RelatedLinks
            currentArea={area.slug}
            categories={categories}
            areas={allAreas}
            featuredBusinesses={featuredBusinesses}
          />
        </div>
      </div>
    </>
  )
}

