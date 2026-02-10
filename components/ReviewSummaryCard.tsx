interface ReviewSummaryCardProps {
  totalReviews: number
  averageRating: number
  recommendationRate: number
}

export default function ReviewSummaryCard({ 
  totalReviews, 
  averageRating,
  recommendationRate 
}: ReviewSummaryCardProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 rounded-lg p-4 text-center border-2 border-blue-200">
        <div className="text-3xl font-bold text-blue-600">{totalReviews}</div>
        <div className="text-sm text-gray-600 mt-1">Total Reviews</div>
      </div>
      
      <div className="bg-yellow-50 rounded-lg p-4 text-center border-2 border-yellow-200">
        <div className="text-3xl font-bold text-yellow-600">{averageRating.toFixed(1)}</div>
        <div className="text-sm text-gray-600 mt-1">Avg Rating</div>
      </div>
      
      <div className="bg-green-50 rounded-lg p-4 text-center border-2 border-green-200">
        <div className="text-3xl font-bold text-green-600">{recommendationRate}%</div>
        <div className="text-sm text-gray-600 mt-1">Would Recommend</div>
      </div>
    </div>
  )
}
