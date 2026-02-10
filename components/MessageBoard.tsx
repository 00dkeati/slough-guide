'use client'

import { useState, useEffect } from 'react'

interface Review {
  id: string
  businessName: string
  businessSlug: string
  userName: string
  rating: number
  message: string
  createdAt: string
}

interface MessageBoardProps {
  businessName?: string
  businessSlug?: string
  pageSlug?: string
  pageTitle?: string
}

export default function MessageBoard({ businessName, businessSlug, pageSlug, pageTitle }: MessageBoardProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  
  // Form state
  const [userName, setUserName] = useState('')
  const [rating, setRating] = useState(5)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const targetName = businessName || pageTitle || 'this page'
  const targetSlug = businessSlug || pageSlug || ''

  useEffect(() => {
    loadReviews()
  }, [targetSlug])

  const loadReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?target=${encodeURIComponent(targetSlug)}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (err) {
      console.error('Error loading reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!userName.trim() || !message.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (message.length < 10) {
      setError('Message must be at least 10 characters long')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: targetName,
          businessSlug: targetSlug,
          userName: userName.trim(),
          rating,
          message: message.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Thank you! Your review has been submitted.')
        setUserName('')
        setRating(5)
        setMessage('')
        setShowForm(false)
        loadReviews() // Reload reviews
      } else {
        setError(data.error || 'Failed to submit review')
      }
    } catch (err) {
      setError('Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
            className={`text-2xl ${
              star <= rating 
                ? 'text-yellow-400' 
                : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400 cursor-pointer transition-colors' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0'

  return (
    <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="font-bold text-lg">{averageRating}</span>
              </div>
              <span className="text-gray-600">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          {showForm ? 'Cancel' : 'Leave a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Share Your Experience</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
                maxLength={50}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(rating, true, setRating)}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                placeholder={`Share your experience with ${targetName}...`}
                maxLength={500}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/500 characters
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 px-6 rounded-lg font-bold text-white transition-colors ${
                submitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div 
              key={review.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-lg">{review.userName}</p>
                  <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="font-semibold text-gray-700">{review.rating}.0</span>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.message}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg mb-2">No reviews yet</p>
          <p className="text-gray-500">Be the first to share your experience!</p>
        </div>
      )}
    </section>
  )
}

