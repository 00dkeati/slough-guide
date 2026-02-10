import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcrumbs'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface StoryData {
  title: string
  description: string
  publishedAt: string
  heroImage?: string
  business?: {
    name: string
    slug: string
    category: string
    website: string
    email: string
  }
}

async function getStory(slug: string): Promise<{ data: StoryData; content: string } | null> {
  const storiesDir = path.join(process.cwd(), 'content/stories')
  const files = fs.readdirSync(storiesDir).filter(f => f.endsWith('.mdx'))
  
  for (const file of files) {
    const filePath = path.join(storiesDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    if (data.slug === slug || file.replace('.mdx', '') === slug) {
      return { data: data as StoryData, content }
    }
  }
  
  return null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const story = await getStory(params.slug)
  
  if (!story) {
    return { title: 'Story Not Found' }
  }
  
  return {
    title: story.data.title,
    description: story.data.description,
    openGraph: {
      title: story.data.title,
      description: story.data.description,
      url: `https://slough.co/stories/${params.slug}`,
      type: 'article',
      images: story.data.heroImage ? [story.data.heroImage] : [],
    },
  }
}

export async function generateStaticParams() {
  const storiesDir = path.join(process.cwd(), 'content/stories')
  
  if (!fs.existsSync(storiesDir)) {
    return []
  }
  
  const files = fs.readdirSync(storiesDir).filter(f => f.endsWith('.mdx'))
  
  return files.map(file => {
    const filePath = path.join(storiesDir, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)
    
    return { slug: data.slug || file.replace('.mdx', '') }
  })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function StoryPage({ params }: { params: { slug: string } }) {
  const story = await getStory(params.slug)
  
  if (!story) {
    notFound()
  }
  
  const { data, content } = story

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Stories', href: '/stories' },
        { label: data.business?.name || data.title }
      ]} />

      <article className="max-w-4xl mx-auto">
        {/* Hero Image */}
        {data.heroImage && (
          <div className="relative h-64 md:h-96 w-full rounded-2xl overflow-hidden mb-8">
            <Image
              src={data.heroImage}
              alt={data.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              {data.business && (
                <span className="bg-red-600 text-xs font-semibold px-2 py-1 rounded mb-2 inline-block">
                  Business Spotlight
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold">
                {data.title}
              </h1>
              <p className="text-gray-200 mt-2">
                {formatDate(data.publishedAt)}
              </p>
            </div>
          </div>
        )}

        {/* Business Quick Info */}
        {data.business && (
          <div className="bg-slate-50 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Featured Business</p>
              <p className="text-xl font-bold text-gray-900">{data.business.name}</p>
              <p className="text-gray-600 capitalize">{data.business.category}</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/biz/${data.business.slug}`}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                View Listing
              </Link>
              {data.business.website && (
                <a
                  href={data.business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Website →
                </a>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline">
          <MDXRemote source={content} />
        </div>

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600">
              Know this business? Share their story! 👇
            </p>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(data.title)}&url=${encodeURIComponent(`https://slough.co/stories/${params.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
              >
                Share on X
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://slough.co/stories/${params.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#4267B2] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
              >
                Share on Facebook
              </a>
            </div>
          </div>
        </div>

        {/* More Stories CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/stories"
            className="text-red-600 font-medium hover:underline"
          >
            ← Read More Business Spotlights
          </Link>
        </div>
      </article>
    </>
  )
}
