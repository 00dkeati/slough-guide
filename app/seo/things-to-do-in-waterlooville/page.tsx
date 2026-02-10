
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Things To Do In Slough',
  description: 'For those who love the great outdoors, **Queen Elizabeth Country Park** is a must-visit. This expansive park provides numerous walking trails, stunning viewpoin...',
  keywords: 'things to do in slough, Slough, Berkshire, local guide, things to do in slough in Slough',
  openGraph: {
    title: 'Things To Do In Slough',
    description: 'For those who love the great outdoors, **Queen Elizabeth Country Park** is a must-visit. This expansive park provides numerous walking trails, stunning viewpoin...',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Things To Do In Slough',
    description: 'For those who love the great outdoors, **Queen Elizabeth Country Park** is a must-visit. This expansive park provides numerous walking trails, stunning viewpoin...',
  },
}

export default function ThingstodoinsloughPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Things To Do In Slough
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          For those who love the great outdoors, **Queen Elizabeth Country Park** is a must-visit. This expansive park provides numerous walking trails, stunning viewpoin...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
              alt="things to do in slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
              alt="things to do in slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Things To Do In Slough</h1></p><p><strong>Target Keyword:</strong> things to do in slough</p><h1>Discover the Best Things to Do in Slough</h1></p><p>Slough, a charming town in Berkshire, offers a delightful array of activities and attractions for all ages. Whether you're a nature enthusiast, an adventure seeker, or looking for family-friendly fun, there are plenty of things to do in Slough to fill your days.</p><h2>Embrace Nature and the Outdoors</h2></p><p>For those who love the great outdoors, <strong>Queen Elizabeth Country Park</strong> is a must-visit. This expansive park provides numerous walking trails, stunning viewpoints, and opportunities for wildlife spotting. It's an ideal spot for a leisurely stroll or a more challenging hike. Nearby, <strong>Creech Wood</strong> offers additional hiking trails, perfect for exploring the local woodlands. Another serene escape is the <strong>Hazelton Common Nature Reserve</strong>, a peaceful area with crisscrossing paths, ideal for a quiet walk amidst nature.</p><h2>Fun and Entertainment for Everyone</h2></p><p>If you're seeking excitement, <strong>Laser Squad Laser Tag</strong> promises an action-packed experience in an outdoor woodland setting, perfect for groups and families. For younger children, <strong>Play Planet</strong> offers a vibrant indoor playground, while <strong>Jubilee Park Playground</strong> provides outdoor fun. For a unique sporting activity, try <strong>Go Zorb Football</strong>, where you can enjoy a game with a fun, bouncy twist.</p><h2>Arts, Culture, and Community</h2></p><p>Slough also boasts local cultural gems. <strong>The Langley Gate</strong> is a local street art project featuring a different mural painting each month, offering a dynamic artistic experience. The <strong>Slough Market</strong> provides a chance to explore local produce and goods, fostering a sense of community. For those looking to unwind, the <strong>Plough & Barleycorn Slough</strong> is a welcoming pub with a beer garden and a kids' play area, making it a great spot for families and friends.</p><h2>Sports and Recreation</h2></p><p>For swimming and other sports, the <strong>Horizon Leisure Centre Slough</strong> is a popular choice, featuring a large pool and hosting various events throughout the year. It's a fantastic facility for both serious swimmers and those looking for a casual dip.</p><p>From tranquil parks to thrilling laser tag, Slough truly has something for everyone. Plan your visit today and discover all the wonderful things to do in this vibrant Berkshire town.` }} />
      </div>

      {/* Related Links */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Explore More in Slough</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/categories" className="block bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
            <h3 className="text-xl font-bold text-blue-700">Browse Categories</h3>
            <p className="text-gray-600">Discover all business categories in Slough</p>
          </Link>
          <Link href="/areas" className="block bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
            <h3 className="text-xl font-bold text-blue-700">Explore Areas</h3>
            <p className="text-gray-600">Find businesses in different areas of Slough</p>
          </Link>
          <Link href="/search" className="block bg-white hover:bg-gray-100 p-4 rounded-lg shadow transition-colors">
            <h3 className="text-xl font-bold text-blue-700">Search Directory</h3>
            <p className="text-gray-600">Search for specific businesses and services</p>
          </Link>
        </div>
      </div>

      {/* Local Business CTA */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded">
        <p className="font-bold">Looking for things to do in slough services?</p>
        <p>Browse our directory of local businesses offering things to do in slough in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=things%20to%20do%20in%20slough" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
