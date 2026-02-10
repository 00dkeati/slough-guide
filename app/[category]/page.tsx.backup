export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getBusinesses, getCategories, getAreas, getFeaturedBusinesses } from '@/lib/db'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessCard from '@/components/BusinessCard'
import RelatedLinks from '@/components/RelatedLinks'
import FAQ from '@/components/FAQ'
import { Metadata } from 'next'

interface CategoryPageProps {
  params: {
    category: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category)
  
  if (!category) {
    return {
      title: 'Category Not Found'
    }
  }

  return {
    title: `Best ${category.name} in Waterlooville | Waterlooville Directory`,
    description: `Find the best ${category.name.toLowerCase()} in Waterlooville and surrounding areas. Professional services, reviews, and contact information.`,
    openGraph: {
      title: `Best ${category.name} in Waterlooville`,
      description: `Find the best ${category.name.toLowerCase()} in Waterlooville and surrounding areas.`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.category)
  
  if (!category) {
    notFound()
  }

  const [businesses, allCategories, allAreas, featuredBusinesses] = await Promise.all([
    getBusinesses(params.category),
    getCategories(),
    getAreas(),
    getFeaturedBusinesses(3)
  ])

  // Generate FAQ content
  const faqs = [
    {
      question: `What are the best ${category.name.toLowerCase()} in Waterlooville?`,
      answer: `Our directory features top-rated ${category.name.toLowerCase()} in Waterlooville, carefully selected based on customer reviews, service quality, and local reputation. Each business has been verified for quality and reliability.`
    },
    {
      question: `How do I choose the right ${category.name.toLowerCase()} for my needs?`,
      answer: `Consider factors like location, pricing, customer reviews, and specific services offered. Our directory provides detailed information including ratings, contact details, and service descriptions to help you make an informed decision.`
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
    "name": `Best ${category.name} in Waterlooville`,
    "description": `A curated list of the best ${category.name.toLowerCase()} in Waterlooville and surrounding areas`,
    "numberOfItems": businesses.length,
    "itemListElement": businesses.map((business, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LocalBusiness",
        "name": business.name,
        "url": `https://waterloovilledirectory.co.uk/biz/${business.slug}`,
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
        { label: category.name, href: `/${category.slug}` }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Best {category.name} in Waterlooville
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              {category.description || `Discover the finest ${category.name.toLowerCase()} in Waterlooville and surrounding areas. Our carefully curated directory features top-rated professionals who deliver exceptional service and quality results.`}
            </p>
            <div className="mt-4 text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-GB')}
            </div>
          </header>

          {businesses.length > 0 ? (
            <>
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Top {businesses.length} {category.name} in Waterlooville
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {businesses.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
              </section>

              {/* Local Insights */}
              <section className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Insights</h3>
                <p className="text-gray-700 leading-relaxed">
                  Waterlooville has a thriving community of {category.name.toLowerCase()}, serving residents and businesses across the area. 
                  From the town center to surrounding villages like Cowplain and Denmead, you'll find experienced professionals 
                  who understand the local market and provide personalized service to their customers.
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
            currentCategory={category.slug}
            categories={allCategories}
            areas={allAreas}
            featuredBusinesses={featuredBusinesses}
          />
        </div>
      </div>
    </>
  )
}

