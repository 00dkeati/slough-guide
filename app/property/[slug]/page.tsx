export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getBusinesses, getCategories, getAreas, getFeaturedBusinesses } from '@/lib/db'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessCard from '@/components/BusinessCard'
import RelatedLinks from '@/components/RelatedLinks'
import FAQ from '@/components/FAQ'
import { Metadata } from 'next'

interface PropertyPageProps {
  params: {
    slug: string
  }
}

// Property slug mappings for broken links
const propertyMappings: Record<string, string> = {
  'houses-for-sale-slough': 'estate-agents',
  'properties-to-rent-slough': 'letting-agents',
  'conveyancing-slough': 'solicitors',
  'mortgage-brokers-slough': 'accountants',
  'property-management-slough': 'letting-agents',
  'removal-services-slough': 'removal-companies',
  'surveyors-slough': 'surveyors'
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  // Extract category from slug (remove -slough suffix)
  const baseSlug = params.slug.replace('-slough', '')
  const mappedCategory = propertyMappings[params.slug]
  const categorySlug = mappedCategory || baseSlug
  
  const category = await getCategoryBySlug(categorySlug)
  
  if (!category) {
    return {
      title: 'Property Service Not Found'
    }
  }

  return {
    title: `${category.name} Slough | Directory`,
    description: `Find the best ${category.name.toLowerCase()} in Slough and surrounding areas. Professional property services, reviews, and contact information.`,
    openGraph: {
      title: `${category.name} Slough`,
      description: `Find the best ${category.name.toLowerCase()} in Slough and surrounding areas.`,
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  // Extract category from slug (remove -slough suffix)
  const baseSlug = params.slug.replace('-slough', '')
  const mappedCategory = propertyMappings[params.slug]
  const categorySlug = mappedCategory || baseSlug
  
  const category = await getCategoryBySlug(categorySlug)
  
  if (!category) {
    notFound()
  }

  const [businesses, allCategories, allAreas, featuredBusinesses] = await Promise.all([
    getBusinesses(categorySlug, 'slough'),
    getCategories(),
    getAreas(),
    getFeaturedBusinesses(3)
  ])

  // Generate FAQ content
  const faqs = [
    {
      question: `What are the best ${category.name.toLowerCase()} in Slough?`,
      answer: `Our directory features top-rated ${category.name.toLowerCase()} in Slough, carefully selected based on customer reviews, service quality, and local reputation. Each business has been verified for quality and reliability.`
    },
    {
      question: `How do I choose the right ${category.name.toLowerCase()} for my property needs?`,
      answer: `Consider factors like experience with local properties, pricing, customer reviews, and specific services offered. Our directory provides detailed information including ratings, contact details, and service descriptions to help you make an informed decision.`
    },
    {
      question: `Are these ${category.name.toLowerCase()} verified and reliable?`,
      answer: `Yes, all businesses in our directory are verified local establishments with genuine customer reviews. We regularly update our listings to ensure accuracy and quality.`
    }
  ]

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Best ${category.name} in Slough`,
    "description": `A curated list of the best ${category.name.toLowerCase()} in Slough and surrounding areas`,
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
        { label: 'Property', href: '/property' },
        { label: category.name, href: `/property/${params.slug}` }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Best {category.name} in Slough
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              {category.description || `Discover the finest ${category.name.toLowerCase()} in Slough and surrounding areas. Our carefully curated directory features top-rated professionals who deliver exceptional service and quality results.`}
            </p>
            <div className="mt-4 text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </div>
          </header>

          {/* Property Service Overview */}
          <section className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Professional {category.name} Services in Slough
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Slough's property market benefits from a network of experienced {category.name.toLowerCase()} who understand the local area's unique characteristics, regulations, and community needs. Our directory showcases the most trusted and highly-rated professionals who have built their reputation through consistent quality and customer satisfaction.
              </p>
              <p className="mb-4">
                Whether you're buying, selling, renting, or managing property in Slough, our curated selection of {category.name.toLowerCase()} ensures you'll find professionals who meet your specific requirements and budget. Each business has been carefully vetted for reliability, professionalism, and customer service excellence.
              </p>
            </div>
          </section>

          {/* Property Service Benefits */}
          <section className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Professional {category.name} Services?
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Local Expertise</h3>
                <p className="text-gray-700 text-sm">
                  Professional {category.name.toLowerCase()} understand Slough's property market, local regulations, and community preferences.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Quality Assurance</h3>
                <p className="text-gray-700 text-sm">
                  Licensed and insured professionals provide warranties and guarantees, ensuring your property investment is protected.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Market Knowledge</h3>
                <p className="text-gray-700 text-sm">
                  Local {category.name.toLowerCase()} have deep knowledge of property values, market trends, and area-specific considerations.
                </p>
              </div>
            </div>
          </section>

          {/* Area Coverage */}
          <section className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {category.name} Services Across Slough Areas
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Central Slough</h3>
                <p className="text-gray-700 mb-4">
                  The town center offers convenient access to {category.name.toLowerCase()} services, with many professionals located within walking distance of major shopping areas and transport links.
                </p>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Langley & Cippenham</h3>
                <p className="text-gray-700">
                  These residential areas are well-served by local {category.name.toLowerCase()} who understand the specific needs of suburban communities and family homes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Chalvey & Surrounding Areas</h3>
                <p className="text-gray-700 mb-4">
                  Extended service areas ensure that residents in outlying villages have access to quality {category.name.toLowerCase()} services without having to travel far from home.
                </p>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Commercial Properties</h3>
                <p className="text-gray-700">
                  Many {category.name.toLowerCase()} in our directory also serve local businesses, providing commercial-grade services for offices, retail spaces, and industrial facilities.
                </p>
              </div>
            </div>
          </section>

          {businesses.length > 0 ? (
            <>
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Top {businesses.length} {category.name} in Slough
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {businesses.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              </section>

              {/* Local Insights */}
              <section className="bg-green-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Property Insights</h3>
                <p className="text-gray-700 leading-relaxed">
                  Slough has a thriving community of {category.name.toLowerCase()}, serving residents and businesses across the area. 
                  From the town center to surrounding villages like Langley and Cippenham, you'll find experienced professionals 
                  who understand the local property market and provide personalized service to their customers.
                </p>
              </section>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                No {category.name.toLowerCase()} found
              </h2>
              <p className="text-gray-600">
                We're working on adding more businesses to this category. Check back soon!
              </p>
            </div>
          )}

          <FAQ faqs={faqs} />
        </div>

        <div className="lg:col-span-1">
          <RelatedLinks
            currentCategory={categorySlug}
            categories={allCategories}
            areas={allAreas}
            featuredBusinesses={featuredBusinesses}
          />
        </div>
      </div>
    </>
  )
}
