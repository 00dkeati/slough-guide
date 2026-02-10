import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Barber } from '@/lib/barbers'

interface BarberCardsProps {
  barbers: Barber[]
}

const BarberCards: React.FC<BarberCardsProps> = ({ barbers }) => {
  return (
    <div className="md:hidden space-y-4">
      {barbers.map((barber) => (
        <div key={barber.id} className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-6">
            {/* Header with rank and score */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold bg-green-100 text-green-700">
                  {barber.rank}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{barber.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{barber.area}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-gray-900">{barber.overallScore || 0}/100</div>
                <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${barber.overallScore || 0}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Image (only if valid) */}
            {barber.imageUrl && (
              <div className="mb-4">
                <div className="relative h-32 w-full rounded-lg overflow-hidden ring-2 ring-gray-200">
                  <Image
                    src={barber.imageUrl}
                    alt={barber.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* Rating and Reviews */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Rating</div>
                <div className="flex items-center justify-center">
                  {barber.rating ? (
                    <>
                      <span className="text-lg font-semibold text-gray-900">{barber.rating}</span>
                      <span className="ml-1 text-yellow-400">⭐</span>
                    </>
                  ) : (
                    <span className="text-lg text-gray-400">N/A</span>
                  )}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Reviews</div>
                <div className="text-lg font-semibold text-gray-900">
                  {barber.review_count !== undefined ? barber.review_count.toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            {/* Address */}
            {barber.address && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500">Address</div>
                <div className="text-sm text-gray-900 mt-1">{barber.address}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {barber.phone && (
                <a
                  href={`tel:${barber.phone}`}
                  className="flex-1 bg-green-600 text-white text-center py-2.5 px-3 rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
                  aria-label={`Call ${barber.name}`}
                >
                  📞 Call
                </a>
              )}
              {barber.website && (
                <a
                  href={barber.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white text-center py-2.5 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm"
                  aria-label={`Visit ${barber.name} website`}
                >
                  🌐 Website
                </a>
              )}
              {(barber.lat && barber.lng) && (
                <a
                  href={`https://maps.google.com/?q=${barber.lat},${barber.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-red-600 text-white text-center py-2.5 px-3 rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm"
                  aria-label={`Get directions to ${barber.name}`}
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

export default BarberCards
