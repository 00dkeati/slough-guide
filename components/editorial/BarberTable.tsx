import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Barber } from '@/lib/barbers'

interface BarberTableProps {
  barbers: Barber[]
}

const BarberTable: React.FC<BarberTableProps> = ({ barbers }) => {
  return (
    <div className="hidden md:block overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[200px]">
                Barber
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Rating
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Reviews
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Area
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Score
              </th>
              <th scope="col" className="relative px-4 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {barbers.map((barber, index) => (
              <tr key={barber.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                    {barber.rank}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {barber.imageUrl ? (
                      <div className="flex-shrink-0 h-12 w-12 relative rounded-lg overflow-hidden ring-2 ring-gray-200">
                        <Image
                          src={barber.imageUrl}
                          alt={barber.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-semibold ring-2 ring-gray-200">
                        {barber.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="ml-4 min-w-0 flex-1">
                      <Link 
                        href={`/biz/${barber.slug}`} 
                        className="text-sm font-semibold text-gray-900 hover:text-green-600 transition-colors block truncate"
                        title={barber.name}
                      >
                        {barber.name}
                      </Link>
                      <p className="text-xs text-gray-500 capitalize truncate">{barber.area}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {barber.rating ? (
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-gray-900">{barber.rating}</span>
                      <span className="ml-1 text-yellow-400">⭐</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">N/A</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {barber.review_count !== undefined ? (
                    <span className="font-medium">{barber.review_count.toLocaleString()}</span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                  {barber.area}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-bold text-gray-900 min-w-[3rem]">
                      {barber.overallScore || 0}/100
                    </span>
                    <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${barber.overallScore || 0}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-1">
                    {barber.phone && (
                      <a
                        href={`tel:${barber.phone}`}
                        className="inline-flex items-center rounded-md bg-green-600 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors"
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
                        className="inline-flex items-center rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors"
                        aria-label={`Visit ${barber.name} website`}
                      >
                        🌐
                      </a>
                    )}
                    {(barber.lat && barber.lng) && (
                      <a
                        href={`https://maps.google.com/?q=${barber.lat},${barber.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
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

export default BarberTable
