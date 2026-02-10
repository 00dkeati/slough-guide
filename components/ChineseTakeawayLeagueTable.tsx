import Image from 'next/image'

interface Review {
  author: string
  rating: number
  text: string
  date?: string
}

interface Takeaway {
  rank: number
  name: string
  location: string
  address: string
  phone: string
  rating: number
  reviewCount: number
  weightedScore: number
  priceRange: string
  image: string
  positiveReviews: Review[]
  negativeReviews: Review[]
  strengths: string[]
  weaknesses: string[]
}

interface Props {
  takeaways: Takeaway[]
}

export default function ChineseTakeawayLeagueTable({ takeaways }: Props) {
  return (
    <div className="space-y-6">
      {/* League Table Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl p-6 mb-8">
        <h2 className="text-3xl font-bold mb-2">🏆 Chinese Takeaway League Table 2025</h2>
        <p className="text-red-100">Ranked by weighted score (rating × review volume)</p>
      </div>

      {/* League Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Takeaway
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {takeaways.map((takeaway, index) => (
                <tr 
                  key={takeaway.name}
                  className={`hover:bg-gray-50 transition-colors ${
                    index === 0 ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {index === 0 && <span className="text-2xl mr-2">🏆</span>}
                      {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                      {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                      <span className="text-lg font-bold text-gray-900">
                        #{takeaway.rank}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 relative">
                        <Image
                          src={takeaway.image}
                          alt={takeaway.name}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{takeaway.name}</div>
                        <div className="text-sm text-gray-500">{takeaway.location}</div>
                        <div className="text-xs text-gray-400">{takeaway.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-2xl font-bold text-yellow-500">⭐</span>
                      <span className="ml-1 text-lg font-semibold text-gray-900">
                        {takeaway.rating}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                    {takeaway.reviewCount}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      {takeaway.weightedScore.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-600">
                    {takeaway.priceRange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Cards for Each Takeaway */}
      <div className="space-y-8">
        {takeaways.map((takeaway, index) => (
          <div 
            key={takeaway.name}
            className={`bg-white rounded-xl shadow-lg overflow-hidden ${
              index === 0 ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 border-b-2 border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="text-4xl font-bold text-gray-300 mr-4">
                    #{takeaway.rank}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{takeaway.name}</h3>
                    <p className="text-gray-600">{takeaway.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-3xl font-bold text-yellow-500">
                    ⭐ {takeaway.rating}
                  </div>
                  <div className="text-sm text-gray-500">{takeaway.reviewCount} reviews</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Left Column - Image and Info */}
              <div>
                <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
                  <Image
                    src={takeaway.image}
                    alt={takeaway.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">📍 Location & Contact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="text-gray-500 w-20">Address:</span>
                      <span className="text-gray-700">{takeaway.address}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 w-20">Phone:</span>
                      <span className="text-gray-700">{takeaway.phone}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 w-20">Price:</span>
                      <span className="text-gray-700">{takeaway.priceRange}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Reviews */}
              <div className="space-y-6">
                {/* Positive Reviews */}
                <div>
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                    <span className="mr-2">✓</span>
                    What Customers Love
                  </h4>
                  <div className="space-y-3">
                    {takeaway.positiveReviews.slice(0, 2).map((review, idx) => (
                      <div key={idx} className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {'⭐'.repeat(review.rating)}
                          </div>
                          <span className="ml-2 text-sm font-semibold text-gray-700">
                            {review.author}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 italic">"{review.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Negative Reviews */}
                <div>
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center">
                    <span className="mr-2">⚠️</span>
                    Areas for Improvement
                  </h4>
                  <div className="space-y-3">
                    {takeaway.negativeReviews.slice(0, 1).map((review, idx) => (
                      <div key={idx} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {'⭐'.repeat(review.rating)}
                          </div>
                          <span className="ml-2 text-sm font-semibold text-gray-700">
                            {review.author}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 italic">"{review.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}




