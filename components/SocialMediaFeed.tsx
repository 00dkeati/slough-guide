'use client'

import { useState, useEffect } from 'react'

interface SocialMediaFeedProps {
  businessName: string
  facebookUrl?: string
  instagramUrl?: string
  twitterUrl?: string
}

interface SocialPost {
  platform: string
  text: string
  timestamp: string
  icon: string
}

export default function SocialMediaFeed({ businessName, facebookUrl, instagramUrl, twitterUrl }: SocialMediaFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([])

  useEffect(() => {
    // Generate sample social posts based on available platforms
    const samplePosts: SocialPost[] = []
    
    if (facebookUrl) {
      samplePosts.push({
        platform: 'Facebook',
        text: `Check out our latest updates and special offers! Follow us on Facebook for daily news and exclusive deals.`,
        timestamp: '2 days ago',
        icon: '📘'
      })
    }
    
    if (instagramUrl) {
      samplePosts.push({
        platform: 'Instagram',
        text: `See our latest photos and behind-the-scenes content! Follow us on Instagram for visual updates.`,
        timestamp: '3 days ago',
        icon: '📸'
      })
    }
    
    if (twitterUrl) {
      samplePosts.push({
        platform: 'Twitter/X',
        text: `Stay updated with our latest news and announcements! Follow us for real-time updates.`,
        timestamp: '1 week ago',
        icon: '🐦'
      })
    }

    setPosts(samplePosts)
  }, [facebookUrl, instagramUrl, twitterUrl])

  // If no social media links, show CTA
  if (!facebookUrl && !instagramUrl && !twitterUrl) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📱</span>
          <h3 className="text-lg font-bold text-gray-900">Connect on Social Media</h3>
        </div>
        <p className="text-gray-600 text-sm">
          Follow {businessName} on social media for updates, offers and news.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">📱</span>
        <h2 className="text-2xl font-bold text-gray-900">Social Media Updates</h2>
      </div>

      {/* Social Links */}
      <div className="flex flex-wrap gap-3 mb-6">
        {facebookUrl && (
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <span>📘</span>
            <span>Facebook</span>
          </a>
        )}
        {instagramUrl && (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors"
          >
            <span>📸</span>
            <span>Instagram</span>
          </a>
        )}
        {twitterUrl && (
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
          >
            <span>𝕏</span>
            <span>Twitter/X</span>
          </a>
        )}
      </div>

      {/* Recent Posts */}
      {posts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Updates</h3>
          {posts.map((post, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{post.icon}</span>
                <span className="font-semibold text-gray-900">{post.platform}</span>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">{post.timestamp}</span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {post.text}
              </p>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              💡 Follow {businessName} on social media for the latest updates, offers, and news
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

