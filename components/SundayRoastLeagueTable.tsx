import Image from 'next/image'
import Link from 'next/link'

interface Review {
  author: string
  rating: number
  text: string
}

interface Venue {
  rank: number
  name: string
  location: string
  address: string
  phone: string
  rating: number
  reviewCount: number
  overallScore: number
  priceRange: string
  image: string
  positiveReviews: Review[]
  negativeReviews: Review[]
  strengths: string[]
  weaknesses: string[]
  meatOptions: string[]
  specialFeatures: string[]
}

interface SundayRoastLeagueTableProps {
  venues: Venue[]
}

const getMedal = (rank: number) => {
  if (rank === 1) return '🏆'
  if (rank === 2) return '🥈'
  if (rank === 3) return '🥉'
  return ''
}

const getScoreColor = (score: number) => {
  if (score >= 8) return 'text-green-600'
  if (score >= 6) return 'text-blue-600'
  if (score >= 4) return 'text-yellow-600'
  return 'text-red-600'
}

export default function SundayRoastLeagueTable({ venues }: SundayRoastLeagueTableProps) {
  return (
    <div className="space-y-12">
      {/* League Table Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <h2 className="text-2xl font-bold text-center">🏆 Sunday Roast League Table 2025</h2>
          <p className="text-center text-red-100 mt-2">Ranked by overall score considering food quality, service, value for money, and consistency</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rank</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Venue</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Reviews</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Score</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {venues.map((venue) => (
                <tr key={venue.rank} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="text-2xl font-bold text-red-600">
                      {venue.rank}{getMedal(venue.rank)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{venue.name}</div>
                    <div className="text-sm text-gray-600">{venue.location}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-lg mr-1">⭐</span>
                      <span className="font-semibold">{venue.rating}/5.0</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{venue.reviewCount}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-lg ${getScoreColor(venue.overallScore)}`}>
                      {venue.overallScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{venue.priceRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Venue Profiles */}
      {venues.map((venue) => (
        <div key={venue.rank} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6 md:p-8">
            <div className="flex items-center mb-6">
              <span className="text-5xl font-extrabold text-red-600 mr-4">
                {venue.rank}
              </span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                  {venue.name} {getMedal(venue.rank)}
                </h2>
                <p className="text-lg text-gray-600">{venue.location}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  width={400}
                  height={300}
                  className="rounded-lg object-cover w-full h-48 md:h-full"
                />
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center text-gray-700">
                  <span className="text-yellow-500 text-xl mr-2">⭐</span>
                  <span className="font-semibold">{venue.rating}/5.0</span>
                  <span className="ml-2 text-sm text-gray-500">({venue.reviewCount} reviews)</span>
                  <span className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Score: {venue.overallScore}
                  </span>
                </div>
                <p className="text-gray-700">
                  <span className="font-semibold">Address:</span> {venue.address}
                </p>
                {venue.phone !== "Not specified" && (
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone:</span> {venue.phone}
                  </p>
                )}
                <p className="text-gray-700">
                  <span className="font-semibold">Price Range:</span> {venue.priceRange}
                </p>
                
                {/* Meat Options */}
                <div className="mt-4">
                  <p className="font-semibold text-gray-700 mb-2">Available Meats:</p>
                  <div className="flex flex-wrap gap-2">
                    {venue.meatOptions.map((meat, i) => (
                      <span key={i} className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        🥩 {meat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Special Features */}
                {venue.specialFeatures.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-700 mb-2">Special Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {venue.specialFeatures.map((feature, i) => (
                        <span key={i} className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          ✨ {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths and Weaknesses */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {venue.strengths.map((strength, i) => (
                      <span key={i} className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        ✅ {strength}
                      </span>
                    ))}
                    {venue.weaknesses.map((weakness, i) => (
                      <span key={i} className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        ❌ {weakness}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {venue.positiveReviews.map((review, i) => (
                  <div key={`pos-${i}`} className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 italic mb-2">"{review.text}"</p>
                    <p className="text-xs font-medium text-green-800">— {review.author} ({review.rating}⭐)</p>
                  </div>
                ))}
                {venue.negativeReviews.map((review, i) => (
                  <div key={`neg-${i}`} className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-gray-600 italic mb-2">"{review.text}"</p>
                    <p className="text-xs font-medium text-red-800">— {review.author} ({review.rating}⭐)</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
