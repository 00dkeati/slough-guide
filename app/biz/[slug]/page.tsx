import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBusinessBySlug, getCategoryBySlug, getAreaBySlug, getFeaturedBusinesses, getBusinessesByCategoryAndArea, Business } from '@/lib/db'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedLinks from '@/components/RelatedLinks'
import FAQ from '@/components/FAQ'
import BusinessMap from '@/components/BusinessMap'
import BusinessGallery from '@/components/BusinessGallery'
import BusinessCard from '@/components/BusinessCard'
import SocialMediaFeed from '@/components/SocialMediaFeed'
import MessageBoard from '@/components/MessageBoard'
import { Metadata } from 'next'

export const runtime = 'nodejs'

interface BusinessPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  try {
    const business: Business | null = await getBusinessBySlug(params.slug)
    
    if (!business) {
      return {
        title: 'Business Not Found'
      }
    }

    const [category, area] = await Promise.all([
      getCategoryBySlug(business.category),
      getAreaBySlug(business.area)
    ])

    // Shorten title to under 60 characters for SEO
    const businessName = business.name.length > 25 ? business.name.substring(0, 22) + '...' : business.name
    const categoryName = category?.name || business.category
    const areaName = area?.name || business.area
    
    const title = `${businessName} - ${categoryName} ${areaName}`
    const description = business.description || `${business.name} is a professional ${business.category} service in ${business.area}. Contact us for quality service and expert advice.`

    return {
      title: `${title}`,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
      },
    }
  } catch (error) {
    console.error('[METADATA_ERROR]', { 
      path: `/biz/${params.slug}`, 
      error: error instanceof Error ? error.message : String(error) 
    })
    return {
      title: 'Business Not Found'
    }
  }
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  try {
    const business: Business | null = await getBusinessBySlug(params.slug)
    
    if (!business) {
      notFound()
    }

  const [category, area, featuredBusinesses, similarBusinesses] = await Promise.all([
    getCategoryBySlug(business.category),
    getAreaBySlug(business.area),
    getFeaturedBusinesses(3),
    getBusinessesByCategoryAndArea(business.category, business.area, 4)
  ])

  // Filter out current business from similar businesses
  const filteredSimilarBusinesses = similarBusinesses.filter(b => b.id !== business.id).slice(0, 3)

  // Debug logging for similar businesses
  console.log('[SIMILAR_BUSINESSES_DEBUG]', {
    businessCategory: business.category,
    businessArea: business.area,
    similarBusinessesCount: similarBusinesses.length,
    filteredCount: filteredSimilarBusinesses.length,
    sampleBusiness: filteredSimilarBusinesses[0] ? {
      id: filteredSimilarBusinesses[0].id,
      name: filteredSimilarBusinesses[0].name,
      hasImages: !!filteredSimilarBusinesses[0].images,
      hasRating: !!filteredSimilarBusinesses[0].rating
    } : null
  })

  const formatRating = (rating: number) => {
    // Ensure rating is between 0 and 5
    const safeRating = Math.max(0, Math.min(5, rating || 0))
    return '★'.repeat(Math.floor(safeRating)) + '☆'.repeat(5 - Math.floor(safeRating))
  }

  // Generate AI Overview
  const generateBusinessOverview = () => {
    const rating = business.rating || 0
    const reviewCount = business.review_count || 0
    
    let qualityText = ''
    if (rating >= 4.8) qualityText = 'exceptional quality and outstanding customer satisfaction'
    else if (rating >= 4.5) qualityText = 'excellent service and high customer satisfaction'
    else if (rating >= 4.0) qualityText = 'quality service and positive customer feedback'
    else qualityText = 'professional service'
    
    let experienceText = ''
    if (reviewCount > 200) experienceText = 'extensive experience serving hundreds of satisfied customers'
    else if (reviewCount > 100) experienceText = 'proven track record with over a hundred happy customers'
    else if (reviewCount > 50) experienceText = 'growing reputation in the local community'
    else experienceText = 'commitment to customer satisfaction'
    
    return `${business.name} is a trusted ${category?.name || business.category} in ${area?.name || business.area}, known for ${qualityText}. With ${experienceText}, they have established themselves as a reliable choice for local residents. ${business.description || ''}`
  }

  // Generate review highlights
  const generateReviewHighlights = () => {
    const highlights = []
    if (business.rating >= 4.5) {
      highlights.push('⭐ Consistently high ratings')
      highlights.push('👍 Highly recommended by customers')
    }
    if (business.review_count > 100) {
      highlights.push('💯 Trusted by hundreds of customers')
    }
    if (business.review_count > 50) {
      highlights.push('📈 Growing positive reputation')
    }
    highlights.push('✓ Verified local business')
    highlights.push('📍 Conveniently located in ' + (area?.name || business.area))
    
    return highlights
  }

  // Format opening hours nicely
  const formatOpeningHours = () => {
    if (!business.opening_hours_json) return null
    try {
      const hours = JSON.parse(business.opening_hours_json)
      return hours
    } catch {
      return null
    }
  }

  const openingHours = formatOpeningHours()
  const isOpenNow = () => {
    if (!openingHours) return null
    const now = new Date()
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const todayHours = openingHours[dayName]
    if (todayHours === 'Closed') return false
    // Simplified - just check if not closed
    return todayHours && todayHours !== 'Closed'
  }

  // Generate FAQ content
  const faqs = [
    {
      question: `What services does ${business.name} offer?`,
      answer: business.description || `${business.name} provides professional ${business.category} services in ${business.area}. Contact them directly for specific service details and pricing.`
    },
    {
      question: `How can I contact ${business.name}?`,
      answer: business.phone ? `You can reach ${business.name} by phone at ${business.phone}. ${business.website ? `You can also visit their website at ${business.website}.` : ''}` : `Contact information for ${business.name} is available in their listing.`
    },
    {
      question: `Where is ${business.name} located?`,
      answer: business.address ? `${business.name} is located at ${business.address}, ${business.area}.` : `${business.name} serves the ${business.area} area.`
    }
  ]

  // Format opening hours for Schema.org (e.g., "Mo-Fr 09:00-17:00")
  const formatSchemaOpeningHours = () => {
    if (!openingHours) return undefined
    const dayMap: Record<string, string> = {
      monday: 'Mo', tuesday: 'Tu', wednesday: 'We', thursday: 'Th',
      friday: 'Fr', saturday: 'Sa', sunday: 'Su'
    }
    const hoursArray: string[] = []
    for (const [day, hours] of Object.entries(openingHours)) {
      const hoursStr = String(hours)
      if (hoursStr && hoursStr !== 'Closed' && dayMap[day]) {
        // Try to parse hours like "9am-5pm" or "09:00-17:00"
        const match = hoursStr.match(/(\d{1,2}(?::\d{2})?)\s*(?:am|AM)?\s*[-–]\s*(\d{1,2}(?::\d{2})?)\s*(?:pm|PM)?/i)
        if (match) {
          hoursArray.push(`${dayMap[day]} ${hoursStr}`)
        }
      }
    }
    return hoursArray.length > 0 ? hoursArray : undefined
  }

  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "url": `https://www.slough.co/biz/${business.slug}`,
    "telephone": business.phone,
    "address": business.address ? {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": area?.name || business.area,
      "addressRegion": "Berkshire",
      "postalCode": business.postcode,
      "addressCountry": "GB"
    } : undefined,
    "geo": business.lat && business.lng ? {
      "@type": "GeoCoordinates",
      "latitude": business.lat,
      "longitude": business.lng
    } : undefined,
    "aggregateRating": (business.rating || 0) > 0 && (business.review_count || 0) > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": Math.max(0, Math.min(5, business.rating || 0)).toFixed(1),
      "reviewCount": business.review_count,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "openingHoursSpecification": openingHours ? Object.entries(openingHours).map(([day, hours]) => {
      const hoursStr = String(hours)
      if (hoursStr === 'Closed') return null
      const dayMap: Record<string, string> = {
        monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday',
        friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday'
      }
      return {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": dayMap[day] || day,
        "opens": "09:00",
        "closes": "17:00"
      }
    }).filter(Boolean) : undefined,
    "image": business.images?.[0] || undefined,
    "priceRange": "££"
  }

  // Clean up undefined values from structured data
  const cleanStructuredData = JSON.parse(JSON.stringify(structuredData, (_, v) => v === undefined ? undefined : v))

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanStructuredData) }}
      />
      
      <Breadcrumbs items={[
        { label: category?.name || business.category, href: `/${business.category}` },
        { label: area?.name || business.area, href: `/${business.category}/${business.area}` },
        { label: business.name }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <header className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {business.name}
                </h1>
                <p className="text-xl text-gray-600">
                  {category?.name || business.category} in {area?.name || business.area}
                </p>
              </div>
              {business.featured && (
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                  Featured Business
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="flex items-center">
                <span className="text-yellow-400 text-lg mr-2">
                  {formatRating(business.rating)}
                </span>
                <span className="text-gray-700 font-semibold">
                  {(business.rating || 0).toFixed(1)} ({business.review_count || 0} reviews)
                </span>
              </div>
              {isOpenNow() !== null && (
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${isOpenNow() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isOpenNow() ? '🟢 Open Now' : '🔴 Closed'}
                </span>
              )}
            </div>
          </header>

          {/* AI Business Overview */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">✨</span>
              <h2 className="text-xl font-bold text-gray-900">AI Business Overview</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              {generateBusinessOverview()}
            </p>
          </section>

          {/* About This Category */}
          <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {category?.name || business.category} in {area?.name || business.area}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Looking for {category?.name || business.category} services in {area?.name || business.area}? The local market offers various options, but choosing the right provider is important. Consider factors like experience, customer reviews, pricing, and location convenience when making your decision.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                {area?.name || business.area} is home to a diverse range of local businesses including restaurants, shops, professional services, and tradespeople. The area benefits from excellent transport links and local amenities, making it convenient for residents to access quality services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                When selecting a {category?.name || business.category} provider, it's essential to verify their credentials, check their portfolio of work, and read customer testimonials. Local businesses often provide more personalized service and have a better understanding of the specific needs of the area.
              </p>
            </div>
          </section>

          {/* Customer Information */}
          <section className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                {business.name} can be reached at {business.phone || 'their contact number'} or visit their website for more information. {business.opening_hours_json ? 'Opening hours and' : ''} Full service details are available. The business is conveniently located in {area?.name || business.area}, making it accessible for local residents.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                The business serves customers throughout {area?.name || business.area} and surrounding areas, providing professional {category?.name || business.category} services. With a focus on customer satisfaction and quality work, they have built a reputation in the local community.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Whether you're a new customer or returning client, {business.name} is committed to providing excellent service and meeting your specific needs. Contact them today to discuss your requirements and get a personalized quote.
              </p>
            </div>
          </section>

          {/* Related Services */}
          <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Services</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Explore other {category?.name || business.category} in Slough or browse our complete directory of local services. We feature hundreds of verified businesses across all categories, helping you find the perfect match for your needs.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our directory includes businesses in categories such as restaurants, retail, professional services, trades, healthcare, and more. Each listing includes detailed information, customer reviews, contact details, and location information to help you make informed decisions.
              </p>
            </div>
          </section>

          {/* Review Highlights */}
          <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose {business.name}?</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {generateReviewHighlights().map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 font-bold text-lg">✓</span>
                  <span className="text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Customer Reviews Section */}
          {business.aggregated_reviews && business.aggregated_reviews.length > 0 && (
            <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>💬</span>
                  Customer Reviews
                </h2>
                <div className="text-sm text-gray-600">
                  {business.aggregated_reviews.filter(r => r.rating >= 4).length} positive • {business.aggregated_reviews.filter(r => r.rating <= 2).length} negative
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Positive Reviews */}
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                    <span>👍</span>
                    Positive Reviews
                  </h3>
                  <div className="space-y-4">
                    {business.aggregated_reviews
                      .filter(review => review.rating >= 4)
                      .slice(0, 3)
                      .map((review, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-green-800">{review.author_name}</span>
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span key={i} className={`text-sm ${i < review.rating ? 'text-green-500' : 'text-gray-300'}`}>★</span>
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                              {review.source}
                            </span>
                          </div>
                          <p className="text-green-700 text-sm leading-relaxed mb-2">
                            "{review.text}"
                          </p>
                          <div className="text-xs text-green-600">
                            {new Date(review.date).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Negative Reviews */}
                <div>
                  <h3 className="text-lg font-semibold text-orange-700 mb-4 flex items-center gap-2">
                    <span>⚠️</span>
                    Areas for Improvement
                  </h3>
                  <div className="space-y-4">
                    {business.aggregated_reviews
                      .filter(review => review.rating <= 2)
                      .slice(0, 3)
                      .map((review, index) => (
                        <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-orange-800">{review.author_name}</span>
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <span key={i} className={`text-sm ${i < review.rating ? 'text-orange-500' : 'text-gray-300'}`}>★</span>
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded">
                              {review.source}
                            </span>
                          </div>
                          <p className="text-orange-700 text-sm leading-relaxed mb-2">
                            "{review.text}"
                          </p>
                          <div className="text-xs text-orange-600">
                            {new Date(review.date).toLocaleDateString('en-GB', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Review Summary */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <strong>Review Summary:</strong> Based on {business.aggregated_reviews.length} customer reviews from Google, Trustpilot, and other platforms
                  </div>
                  <div className="text-xs text-gray-500">
                    Balanced perspective
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Business Images */}
          {business.images && business.images.length > 0 && (
            <BusinessGallery 
              businessName={business.name}
              images={business.images}
            />
          )}

          {/* Contact Information */}
          <section className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-4">
              {business.phone && (
                <a 
                  href={`tel:${business.phone}`}
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all group"
                >
                  <span className="text-3xl">📞</span>
                  <div>
                    <div className="text-sm text-blue-100">Call Us</div>
                    <div className="text-lg font-semibold group-hover:text-blue-100">{business.phone}</div>
                  </div>
                </a>
              )}
              
              {business.website && (
                <a 
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all group"
                >
                  <span className="text-3xl">🌐</span>
                  <div>
                    <div className="text-sm text-blue-100">Visit Website</div>
                    <div className="text-lg font-semibold group-hover:text-blue-100 truncate">View Online →</div>
                  </div>
                </a>
              )}
              
              {business.address && (
                <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                  <span className="text-3xl">📍</span>
                  <div>
                    <div className="text-sm text-blue-100">Address</div>
                    <div className="text-lg font-semibold">
                      {business.address}
                      {business.postcode && <><br />{business.postcode}</>}
                    </div>
                  </div>
                </div>
              )}

              {business.lat && business.lng ? (
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${business.lat},${business.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-white text-blue-600 py-3 px-6 rounded-lg font-bold hover:bg-blue-50 transition-colors"
                >
                  Get Directions →
                </a>
              ) : (
                <div className="block w-full text-center bg-gray-100 text-gray-400 py-3 px-6 rounded-lg font-bold cursor-not-allowed">
                  Directions Unavailable
                </div>
              )}
            </div>
          </section>

          {/* Map Section */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Location</h2>
            <BusinessMap 
              businesses={[business]} 
              center={business.lat && business.lng ? { lat: business.lat, lng: business.lng } : undefined}
              zoom={15}
            />
          </section>

          {/* Opening Hours */}
          {openingHours && (
            <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Opening Hours</h2>
              <div className="space-y-2">
                {Object.entries(openingHours).map(([day, hours]) => {
                  const hoursStr = String(hours)
                  const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day
                  const isClosed = hoursStr === 'Closed'
                  
                  return (
                    <div 
                      key={day}
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        isToday ? 'bg-blue-50 border-2 border-blue-200 font-semibold' : 'bg-gray-50'
                      }`}
                    >
                      <span className="capitalize text-gray-900">
                        {isToday && '→ '}{day}
                        {isToday && ' (Today)'}
                      </span>
                      <span className={isClosed ? 'text-red-600 font-medium' : 'text-green-700 font-medium'}>
                        {hoursStr}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Social Media Updates */}
          <SocialMediaFeed 
            businessName={business.name}
            facebookUrl={business.facebook_url}
            instagramUrl={business.instagram_url}
            twitterUrl={business.twitter_url}
          />

          {/* Community Reviews / Message Board */}
          <MessageBoard 
            businessName={business.name}
            businessSlug={business.slug}
          />

          {/* Similar Businesses */}
          {filteredSimilarBusinesses.length > 0 ? (
            <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Similar {category?.name || business.category} in {area?.name || business.area}
              </h2>
              <div className="grid gap-6">
                {filteredSimilarBusinesses.map((similarBusiness) => (
                  <BusinessCard key={similarBusiness.id} business={similarBusiness} />
                ))}
              </div>
            </section>
          ) : (
            <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                More {category?.name || business.category} in Slough
              </h2>
              <p className="text-gray-600">
                Browse our <Link href={`/${business.category}`} className="text-blue-600 hover:underline">complete directory of {business.category}</Link> to find more options.
              </p>
            </section>
          )}

          <FAQ faqs={faqs} />
        </div>

        <div className="lg:col-span-1">
          <RelatedLinks
            currentCategory={business.category}
            currentArea={business.area}
            featuredBusinesses={featuredBusinesses}
          />
        </div>
      </div>
    </>
  )
  } catch (error) {
    console.error('[PAGE_ERROR]', { 
      path: `/biz/${params.slug}`, 
      slug: params.slug,
      error: error instanceof Error ? error.message : String(error) 
    })
    throw error // This will trigger the error.tsx boundary
  }
}

