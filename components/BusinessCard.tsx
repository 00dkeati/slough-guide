import Link from 'next/link'
import Image from 'next/image'
import { Business } from '@/lib/db'

interface BusinessCardProps {
  business: Business
}

export default function BusinessCard({ business }: BusinessCardProps) {
  // Add validation at component start
  if (!business || !business.name || !business.category || !business.area) {
    console.error('[BusinessCard] Invalid business data:', business)
    return null
  }

  const formatRating = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating))
  }

  // Safe defaults for business properties
  const rating = business.rating || 0
  const reviewCount = business.review_count || 0
  const area = business.area || 'local area'
  const category = business.category || 'business'

  // Generate detailed AI-style overview based on available data
  const generateOverview = () => {
    
    // Detailed category insights
    const categoryInsights: { [key: string]: { type: string, qualities: string[], what: string } } = {
      'restaurants': { 
        type: 'restaurant',
        qualities: ['quality food', 'excellent service', 'welcoming atmosphere'],
        what: 'offering a diverse menu and memorable dining experiences'
      },
      'pubs': { 
        type: 'pub',
        qualities: ['great drinks', 'friendly atmosphere', 'local charm'],
        what: 'providing a perfect spot for drinks and socializing'
      },
      'cafes': { 
        type: 'café',
        qualities: ['quality coffee', 'cozy ambiance', 'friendly service'],
        what: 'serving fresh coffee and light meals in a relaxed setting'
      },
      'plumbers': { 
        type: 'plumbing service',
        qualities: ['reliable service', 'professional expertise', 'prompt response'],
        what: 'handling all your plumbing needs with skilled technicians'
      },
      'electricians': { 
        type: 'electrical service',
        qualities: ['certified expertise', 'safety-focused', 'reliable work'],
        what: 'providing expert electrical installations and repairs'
      },
      'health': { 
        type: 'healthcare provider',
        qualities: ['professional care', 'experienced staff', 'patient-focused'],
        what: 'delivering quality healthcare services to the community'
      },
      'shopping': { 
        type: 'retail store',
        qualities: ['wide selection', 'competitive prices', 'helpful staff'],
        what: 'offering quality products and excellent customer service'
      },
      'beauty': { 
        type: 'beauty salon',
        qualities: ['skilled stylists', 'relaxing atmosphere', 'quality treatments'],
        what: 'providing professional beauty and wellness services'
      },
      'automotive': { 
        type: 'automotive service',
        qualities: ['expert mechanics', 'honest pricing', 'quality repairs'],
        what: 'keeping your vehicle running smoothly with professional care'
      },
      'estate-agents': { 
        type: 'estate agent',
        qualities: ['professional service', 'local expertise', 'market knowledge'],
        what: 'helping you buy, sell, or rent properties with expert guidance'
      }
    }

    const insight = categoryInsights[category] || { 
      type: 'local business',
      qualities: ['professional service', 'local expertise', 'reliable'],
      what: 'serving the community with dedication'
    }

    // Rating-based descriptions
    let ratingDesc = ''
    let socialProof = ''
    
    if (rating >= 4.7) {
      ratingDesc = 'Exceptional'
      socialProof = reviewCount > 100 ? 'consistently praised by hundreds of satisfied customers' :
                    reviewCount > 50 ? 'highly recommended by dozens of happy customers' :
                    'earning outstanding reviews from customers'
    } else if (rating >= 4.3) {
      ratingDesc = 'Excellent'
      socialProof = reviewCount > 100 ? 'trusted by over a hundred customers' :
                    reviewCount > 50 ? 'well-regarded by many local customers' :
                    'building a strong reputation in the area'
    } else if (rating >= 4.0) {
      ratingDesc = 'Highly rated'
      socialProof = reviewCount > 50 ? 'appreciated by many customers' :
                    'gaining positive feedback from customers'
    } else if (rating >= 3.5) {
      ratingDesc = 'Popular'
      socialProof = 'serving the local community'
    } else {
      ratingDesc = 'Established'
      socialProof = 'operating in the area'
    }

    // Build comprehensive overview (use safe variables from component scope)
    const parts = [
      `${ratingDesc} ${insight.type} in ${(area.charAt(0).toUpperCase() + area.slice(1))},`,
      socialProof + '.',
      `Known for ${insight.qualities[0]}, ${insight.qualities[1]}, and ${insight.qualities[2]},`,
      `${insight.what}.`
    ]

    // Add business description if available and relevant
    if (business.description && business.description.length > 50 && !business.description.includes('Professional')) {
      parts.push(business.description)
    }

    return parts.join(' ')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Business Image */}
      {business.images && business.images.length > 0 && (
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={business.images[0]}
            alt={`${business.name} business image`}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Rating Badge Overlay */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-lg">★</span>
              <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
              <span className="text-gray-500 text-sm">({reviewCount})</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-5">
        {/* Business Name and Badge */}
        <div className="flex items-start justify-between mb-3">
          <Link 
            href={`/biz/${business.slug}`}
            className="group"
          >
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {business.name}
            </h3>
          </Link>
          {business.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex-shrink-0 ml-2">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Category and Location */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">
            {business.category}
          </span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-600 capitalize">{business.area}</span>
        </div>

        {/* AI Overview */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 text-sm font-semibold flex-shrink-0 mt-0.5">✨ AI Overview</span>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed mt-1.5">
            {generateOverview()}
          </p>
        </div>

        {/* Customer Reviews for Estate Agents */}
        {business.category === 'estate-agents' && business.aggregated_reviews && business.aggregated_reviews.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span>💬</span>
              Customer Reviews
            </h4>
            <div className="grid grid-cols-1 gap-3">
              {/* Positive Reviews */}
              {business.aggregated_reviews.filter(review => review.rating >= 4).slice(0, 2).map((review, index) => (
                <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-green-800 text-sm">{review.author_name}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`text-xs ${i < review.rating ? 'text-green-500' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-green-600 font-medium">{review.source}</span>
                  </div>
                  <p className="text-green-700 text-xs leading-relaxed line-clamp-2">
                    "{review.text}"
                  </p>
                </div>
              ))}
              
              {/* Negative Reviews */}
              {business.aggregated_reviews.filter(review => review.rating <= 2).slice(0, 1).map((review, index) => (
                <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-orange-800 text-sm">{review.author_name}</span>
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`text-xs ${i < review.rating ? 'text-orange-500' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-orange-600 font-medium">{review.source}</span>
                  </div>
                  <p className="text-orange-700 text-xs leading-relaxed line-clamp-2">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>
            
            {/* Review Summary */}
            <div className="mt-3 p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>
                  <span className="font-medium text-green-700">{business.aggregated_reviews.filter(r => r.rating >= 4).length}</span> positive, 
                  <span className="font-medium text-orange-700 ml-1">{business.aggregated_reviews.filter(r => r.rating <= 2).length}</span> negative reviews
                </span>
                <span className="text-gray-500">Balanced view</span>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-2.5 mb-4">
          {business.phone && (
            <a 
              href={`tel:${business.phone}`}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <span className="text-blue-500 group-hover:scale-110 transition-transform">📞</span>
              <span className="text-sm font-medium">{business.phone}</span>
            </a>
          )}
          {business.website && (
            <a 
              href={business.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors group"
            >
              <span className="text-blue-500 group-hover:scale-110 transition-transform">🌐</span>
              <span className="text-sm font-medium truncate">Visit Website</span>
            </a>
          )}
          {business.address && (
            <div className="flex items-start gap-2 text-gray-600">
              <span className="text-gray-400 mt-0.5">📍</span>
              <span className="text-sm">{business.address}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link 
          href={`/biz/${business.slug}`}
          className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          View Full Details →
        </Link>
      </div>
    </div>
  )
}

