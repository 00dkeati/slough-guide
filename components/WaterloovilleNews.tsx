'use client'

import { useState, useEffect } from 'react'

interface NewsItem {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
}

export default function SloughNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/news')
      if (!response.ok) throw new Error('Failed to fetch news')
      const data = await response.json()
      setNews(data.articles || [])
    } catch (err) {
      console.error('Error fetching news:', err)
      setError('Unable to load news at this time')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📰</span>
          <h2 className="text-2xl font-bold text-gray-900">Latest Slough News</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📰</span>
          <h2 className="text-2xl font-bold text-gray-900">Latest Slough News</h2>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-600">
            Stay updated with the latest news from Slough and surrounding areas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📰</span>
          <h2 className="text-2xl font-bold text-gray-900">Latest Slough News</h2>
        </div>
        <button
          onClick={fetchNews}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          <span className="text-lg">🔄</span>
          Refresh
        </button>
      </div>

      {news.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-600">
            No recent news available. Check back soon for updates!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {news.slice(0, 5).map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {item.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium">{item.source}</span>
                    <span>•</span>
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>
                <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          News updates automatically from local and regional sources
        </p>
      </div>
    </div>
  )
}

