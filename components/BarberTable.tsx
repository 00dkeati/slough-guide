'use client'

import Image from 'next/image'
import { Barber } from '@/lib/barbers'

interface BarberTableProps {
  barbers: Barber[]
}

export default function BarberTable({ barbers }: BarberTableProps) {
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
    <div className="hidden md:block bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Barber
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Reviews
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {barbers.map((barber) => (
              <tr key={barber.id} className="hover:bg-gray-50 transition-colors">
                {/* Rank */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      barber.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      barber.rank === 2 ? 'bg-gray-100 text-gray-800' :
                      barber.rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {barber.rank}
                    </span>
                  </div>
                </td>

                {/* Barber */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    {/* Image - only render if valid photo exists */}
                    {barber.imageUrl ? (
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={barber.imageUrl}
                          alt={`${barber.name} barbershop`}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-lg">✂️</span>
                      </div>
                    )}
                    
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {barber.name}
                      </div>
                      {barber.area && (
                        <div className="text-sm text-gray-500 truncate">
                          {barber.area}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Rating */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {barber.rating ? (
                      <>
                        <span className="text-sm font-medium text-gray-900">
                          {formatRating(barber.rating)}
                        </span>
                        <span className="ml-1 text-yellow-400">⭐</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </div>
                </td>

                {/* Reviews */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatReviewCount(barber.review_count)}
                </td>

                {/* Location */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {barber.area || 'N/A'}
                  </div>
                  {barber.address && (
                    <div className="text-sm text-gray-500 truncate max-w-32">
                      {barber.address}
                    </div>
                  )}
                </td>

                {/* Score */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatScore(barber.overallScore)}
                    </span>
                    {barber.overallScore && (
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${barber.overallScore}%` }}
                        />
                      </div>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {barber.phone && (
                      <a
                        href={`tel:${barber.phone}`}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        aria-label={`Call ${barber.name}`}
                      >
                        📞
                      </a>
                    )}
                    {barber.website && (
                      <a
                        href={barber.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        aria-label={`Visit ${barber.name} website`}
                      >
                        🌐
                      </a>
                    )}
                    {barber.lat && barber.lng && (
                      <a
                        href={`https://maps.google.com/?q=${barber.lat},${barber.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-900 transition-colors"
                        aria-label={`Get directions to ${barber.name}`}
                      >
                        🗺️
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
