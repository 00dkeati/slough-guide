'use client'

import Image from 'next/image'
import { Barber } from '@/lib/barbers'

interface BarberCardsProps {
  barbers: Barber[]
}

export default function BarberCards({ barbers }: BarberCardsProps) {
  const formatRating = (rating?: number) => {
    if (!rating) return 'N/A'
    return rating.toFixed(1)
  }

  const formatReviewCount = (count?: number) => {
    if (!count) return 'N/A'
    return count.toLocaleString()
  }

  const formatScore = (score?: number) => {
    if (!score) return 'N/A'
    return `${score}/100`
  }

  return (
    <div className="md:hidden space-y-4">
      {barbers.map((barber) => (
        <div key={barber.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Header with rank and name */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  barber.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                  barber.rank === 2 ? 'bg-gray-100 text-gray-800' :
                  barber.rank === 3 ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {barber.rank}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {barber.name}
                  </h3>
                  {barber.area && (
                    <p className="text-sm text-gray-500">
                      {barber.area}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Score */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatScore(barber.overallScore)}
                </div>
                {barber.overallScore && (
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${barber.overallScore}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Image - only render if valid photo exists */}
            {barber.imageUrl && (
              <div className="mb-4">
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={barber.imageUrl}
                    alt={`${barber.name} barbershop`}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Rating</div>
                <div className="flex items-center justify-center mt-1">
                  {barber.rating ? (
                    <>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatRating(barber.rating)}
                      </span>
                      <span className="ml-1 text-yellow-400">⭐</span>
                    </>
                  ) : (
                    <span className="text-lg text-gray-500">N/A</span>
                  )}
                </div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Reviews</div>
                <div className="text-lg font-semibold text-gray-900 mt-1">
                  {formatReviewCount(barber.review_count)}
                </div>
              </div>
            </div>

            {/* Location */}
            {barber.address && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Address</div>
                <div className="text-sm text-gray-900 mt-1">
                  {barber.address}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3">
              {barber.phone && (
                <a
                  href={`tel:${barber.phone}`}
                  className="flex-1 bg-green-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  📞 Call
                </a>
              )}
              {barber.website && (
                <a
                  href={barber.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  🌐 Website
                </a>
              )}
              {barber.lat && barber.lng && (
                <a
                  href={`https://maps.google.com/?q=${barber.lat},${barber.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-red-600 text-white text-center py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  🗺️ Directions
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
