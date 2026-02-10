'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface EditorialArticle {
  id: string
  slug: string
  title: string
  subtitle: string
  category: string
  author: string
  publishedAt: string
  featured: boolean
  heroImage: string
  excerpt: string
  readTime: number
  tags: string[]
}

export default function EditorialFeed() {
  const [articles, setArticles] = useState<EditorialArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/editorial?featured=true&limit=3')
      if (!response.ok) throw new Error('Failed to fetch articles')
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (err) {
      console.error('Error fetching articles:', err)
      setError('Unable to load articles at this time')
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
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📝</span>
          <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
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
          <span className="text-2xl">📝</span>
          <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-600">
            Check back soon for interesting stories about Slough businesses!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-600">
            No featured articles available. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/editorial/${article.slug}`}
              className="block group"
            >
              <article className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    {/* Category Badge */}
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded mb-2">
                      {article.category}
                    </span>
                    
                    {/* Title */}
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 text-lg leading-snug">
                      {article.title}
                    </h3>
                    
                    {/* Subtitle */}
                    {article.subtitle && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {article.subtitle}
                      </p>
                    )}
                    
                    {/* Excerpt */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                    
                    {/* Meta Information */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="font-medium">{article.author}</span>
                      <span>•</span>
                      <span>{formatDate(article.publishedAt)}</span>
                      <span>•</span>
                      <span>{article.readTime} min read</span>
                    </div>
                  </div>
                  
                  {/* Arrow Icon */}
                  <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-xl">
                    →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link 
          href="/editorial"
          className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 transition-colors"
        >
          View all articles
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}

