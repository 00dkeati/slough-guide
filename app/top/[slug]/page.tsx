import { notFound } from 'next/navigation'
import { getBusinesses, getCategoryBySlug, getAreaBySlug, getCategories, getAreas, getFeaturedBusinesses } from '@/lib/db'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessCard from '@/components/BusinessCard'
import RelatedLinks from '@/components/RelatedLinks'
import FAQ from '@/components/FAQ'
import { Metadata } from 'next'

interface TopPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: TopPageProps): Promise<Metadata> {
  // Parse the slug to extract number, category, and area
  // Format: "10-plumbers-in-slough"
  const slugParts = params.slug.split('-')
  const number = slugParts[0]
  const categorySlug = slugParts[1]
  const areaSlug = slugParts[slugParts.length - 1] // Last part is area
  
  const [category, area] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getAreaBySlug(areaSlug)
  ])
  
  if (!category || !area) {
    return {
      title: 'Page Not Found'
    }
  }

  const title = `Top ${number} ${category.name} in ${area.name}`
  const description = `Discover the top ${number} rated ${category.name.toLowerCase()} in ${area.name}. Expert reviews, ratings, and contact information for the best local businesses.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function TopPage({ params }: TopPageProps) {
  // Parse the slug to extract number, category, and area
  const slugParts = params.slug.split('-')
  const number = parseInt(slugParts[0])
  const categorySlug = slugParts[1]
  const areaSlug = slugParts[slugParts.length - 1] // Last part is area
  
  const [category, area, businesses] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getAreaBySlug(areaSlug),
    getBusinesses(categorySlug, areaSlug)
  ])
  
  if (!category || !area || isNaN(number)) {
    notFound()
  }

  // Take only the requested number of businesses
  const topBusinesses = businesses.slice(0, number)

  const [allCategories, allAreas, featuredBusinesses] = await Promise.all([
    getCategories(),
    getAreas(),
    getFeaturedBusinesses(3)
  ])

  // Generate FAQ content
  const faqs = [
    {
      question: `What makes these the top ${number} ${category.name.toLowerCase()} in ${area.name}?`,
      answer: `Our top ${number} list is based on customer ratings, review counts, service quality, and local reputation. Each business has been carefully evaluated to ensure they meet our high standards for excellence.`
    },
    {
      question: `How often is this list updated?`,
      answer: `We regularly review and update our top lists to ensure they reflect the current best businesses in the area. New reviews and ratings are continuously monitored to maintain accuracy.`
    },
    {
      question: `Can I trust these ${category.name.toLowerCase()}?`,
      answer: `Yes, all businesses on our top ${number} list are verified local establishments with genuine customer reviews and proven track records. We only feature businesses that consistently deliver quality service.`
    }
  ]

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Top ${number} ${category.name} in ${area.name}`,
    "description": `The best ${number} rated ${category.name.toLowerCase()} in ${area.name}`,
    "numberOfItems": topBusinesses.length,
    "itemListElement": topBusinesses.map((business, index) => ({
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
        { label: 'Top Lists' },
        { label: `Top ${number} ${category.name} in ${area.name}` }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Top {number} {category.name} in {area.name}
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Discover the highest-rated {category.name.toLowerCase()} serving {area.name} and surrounding areas. 
              Our carefully curated list features the most trusted and well-reviewed professionals in the area.
            </p>
            <div className="mt-4 text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </div>
          </header>

          {topBusinesses.length > 0 ? (
            <>
              <section className="mb-8">
                <div className="space-y-6">
                  {topBusinesses.map((business, index) => (
                    <div key={business.id} className="relative">
                      <div className="absolute -left-8 top-6 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="ml-8">
                        <BusinessCard business={business} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Local Insights */}
              <section className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why These Are The Best</h3>
                <p className="text-gray-700 leading-relaxed">
                  The businesses on this list have been selected based on their exceptional customer service, 
                  positive reviews, and proven track record in {area.name}. Each professional has demonstrated 
                  consistent quality and reliability, making them the top choice for residents and businesses in the area.
                </p>
              </section>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No {category.name.toLowerCase()} found in {area.name}
              </h2>
              <p className="text-gray-600">
                We're working on adding more businesses to this area. Check back soon!
              </p>
            </div>
          )}

          <FAQ faqs={faqs} />
        </div>

        <div className="lg:col-span-1">
          <RelatedLinks
            currentCategory={category.slug}
            currentArea={area.slug}
            categories={allCategories}
            areas={allAreas}
            featuredBusinesses={featuredBusinesses}
          />
        </div>
      </div>
    </>
  )
}
