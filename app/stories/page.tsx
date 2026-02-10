import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcrumbs'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export const metadata: Metadata = {
  title: 'Local Business Stories - Slough Spotlights',
  description: 'Discover the stories behind Slough\'s best local businesses. From cosy pubs to vibrant restaurants, meet the people making our community great.',
  openGraph: {
    title: 'Local Business Stories - Slough Spotlights',
    description: 'Discover the stories behind Slough\'s best local businesses.',
    url: 'https://slough.co/stories',
    type: 'website',
  },
}

interface Story {
  slug: string
  title: string
  description: string
  publishedAt: string
  heroImage?: string
  business?: {
    name: string
    category: string
  }
}

async function getStories(): Promise<Story[]> {
  const storiesDir = path.join(process.cwd(), 'content/stories')
  
  if (!fs.existsSync(storiesDir)) {
    return []
  }
  
  const files = fs.readdirSync(storiesDir).filter(f => f.endsWith('.mdx'))
  
  const stories = files.map(file => {
    const filePath = path.join(storiesDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)
    
    return {
      slug: data.slug || file.replace('.mdx', ''),
      title: data.title,
      description: data.description,
      publishedAt: data.publishedAt,
      heroImage: data.heroImage,
      business: data.business,
    }
  })
  
  // Sort by date, newest first
  return stories.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function StoriesPage() {
  const stories = await getStories()

  return (
    <>
      <Breadcrumbs items={[{ label: 'Stories' }]} />

      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏪 Local Business Spotlights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the stories behind Slough's best local businesses. 
            From cosy pubs to vibrant restaurants, meet the people making our community great.
          </p>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Stories coming soon! Check back for local business spotlights.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <article 
                key={story.slug} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <Link href={`/stories/${story.slug}`} className="block">
                  {story.heroImage && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={story.heroImage}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {story.business && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          {story.business.category}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {story.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
                      {story.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <time className="text-gray-400" dateTime={story.publishedAt}>
                        {formatDate(story.publishedAt)}
                      </time>
                      <span className="text-red-600 font-medium group-hover:underline">
                        Read Story →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">
            Want Your Business Featured?
          </h2>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            We love sharing stories about local Slough businesses. 
            Get in touch and we'll write about you next!
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-white text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-red-50 transition-colors"
          >
            Get Featured →
          </Link>
        </div>
      </div>
    </>
  )
}
