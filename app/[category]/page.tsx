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
    title: `Best ${category.name} in Slough`,
    description: `Find the best ${category.name.toLowerCase()} in Slough and surrounding areas. Professional services, reviews, and contact information.`,
    openGraph: {
      title: `Best ${category.name} in Slough`,
      description: `Find the best ${category.name.toLowerCase()} in Slough and surrounding areas.`,
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Exclude specific pages from being treated as categories to avoid routing conflicts
  const excludedPaths = ['seo', 'driving-guide', 'guide-driving-instructors-slough', 'driving-instructors-slough', 'guides', 'sainsburys-slough', 'dentist-slough', 'estate-agents-slough', 'restaurants-slough', 'painter-decorator-slough', 'plumber-slough', 'category', 'services', 'property']
  if (excludedPaths.includes(params.category)) {
    notFound()
  }
  
  const category = await getCategoryBySlug(params.category)
  
  if (!category) {
    notFound()
  }

  const [businesses, allCategories, allAreas, featuredBusinesses] = await Promise.all([
    getBusinesses(params.category, 'slough'), // Only show Slough businesses on category pages
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
        { label: category.name, href: `/${category.slug}` }
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

          {/* Comprehensive Content Section */}
          <section className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose {category.name} in Slough?
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Slough has established itself as a hub for quality {category.name.toLowerCase()} services, with professionals who have been serving the local community for years. Our directory features {category.name.toLowerCase()} who have demonstrated excellence through consistent customer satisfaction, positive reviews, and reliable service delivery across the Slough area.
              </p>
              <p className="mb-4">
                The {category.name.toLowerCase()} industry in Slough benefits from a diverse range of service providers, each offering unique specializations and approaches. Whether you're looking for traditional methods or modern innovations, our curated selection ensures you'll find professionals who meet your specific needs and budget requirements.
              </p>
              <p className="mb-4">
                All {category.name.toLowerCase()} in our Slough directory have been carefully vetted for quality, reliability, and customer satisfaction. We regularly monitor reviews, verify credentials, and update our listings to ensure you have access to the most current and trustworthy information available.
              </p>
            </div>
          </section>

          {/* Local Market Overview */}
          <section className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Slough {category.name} Market Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Local Expertise</h3>
                <p className="text-gray-700 mb-4">
                  {category.name} professionals in Slough bring deep local knowledge and understanding of the area's unique characteristics. They're familiar with local regulations, building codes, and community preferences, ensuring your project meets all requirements and expectations.
                </p>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Community Connections</h3>
                <p className="text-gray-700">
                  Many of our listed {category.name.toLowerCase()} have been serving Slough for years, building strong relationships with local suppliers, contractors, and customers. This network often translates to better pricing, faster service, and more reliable results.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quality Standards</h3>
                <p className="text-gray-700 mb-4">
                  The {category.name.toLowerCase()} in our Slough directory maintain high standards of professionalism and quality. They're committed to ongoing education, staying current with industry best practices, and continuously improving their services.
                </p>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Focus</h3>
                <p className="text-gray-700">
                  Customer satisfaction is paramount for all {category.name.toLowerCase()} in our directory. They prioritize clear communication, transparent pricing, and delivering results that exceed expectations, as evidenced by their consistently high ratings and positive reviews.
                </p>
              </div>
            </div>
          </section>

          {/* Service Benefits */}
          <section className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Benefits of Professional {category.name} Services in Slough
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Expert Knowledge</h3>
                <p className="text-gray-700 text-sm">
                  Professional {category.name.toLowerCase()} bring years of experience and specialized knowledge to every project, ensuring optimal results and avoiding common pitfalls.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Time Efficiency</h3>
                <p className="text-gray-700 text-sm">
                  Experienced professionals work efficiently, completing projects on time and within budget while maintaining the highest quality standards.
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-2">Peace of Mind</h3>
                <p className="text-gray-700 text-sm">
                  Professional {category.name.toLowerCase()} provide warranties, insurance coverage, and ongoing support, giving you confidence in your investment.
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
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Commercial Services</h3>
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
              <section className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Insights</h3>
                <p className="text-gray-700 leading-relaxed">
                  Slough has a thriving community of {category.name.toLowerCase()}, serving residents and businesses across the area. 
                  From the town center to surrounding villages like Langley and Cippenham, you'll find experienced professionals 
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

