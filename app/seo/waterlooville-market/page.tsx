
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Slough Market - Local Shopping & Fresh Produce',
  description: 'Discover Slough Market with fresh local produce, artisan goods, and unique finds. Find market days, times, and vendors offering quality products from local suppliers.',
  keywords: 'slough market, local market slough, fresh produce slough, artisan market slough, Slough shopping',
  openGraph: {
    title: 'Slough Market - Local Shopping & Fresh Produce',
    description: 'Discover Slough Market with fresh local produce, artisan goods, and unique finds. Find market days, times, and vendors offering quality products from local suppliers.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slough Market - Local Shopping & Fresh Produce',
    description: 'Discover Slough Market with fresh local produce, artisan goods, and unique finds. Find market days, times, and vendors offering quality products from local suppliers.',
  },
}

export default function SloughmarketPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Slough Market
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover the best services and information in Slough, Berkshire.
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
              alt="slough market in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
              alt="slough market in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Slough Market</h1></p><p><strong>Target Keyword:</strong> slough market</p><h1>Discover the Vibrant Slough Market: A Local Gem</h1></p><p>Nestled in the heart of Slough, Berkshire, the Slough Market stands as a bustling hub of local commerce and community spirit. Operating every Friday from 8 AM to 4 PM on London Road, this vibrant outdoor general retail market offers a delightful array of goods, making it a must-visit destination for residents and visitors alike.</p><p>The market’s origins are intertwined with the rich history of Slough itself. The town, which celebrated its bicentenary in 2015, traces its roots back to 1815 when foot soldiers returning from the Battle of Waterloo settled in the area. This historical backdrop lends a unique character to the town and, by extension, its market, which has evolved over the years to reflect the changing needs and tastes of the community.</p><p>Visitors to Slough Market can expect a diverse selection of stalls. From fresh, locally sourced produce, including fruits and vegetables, to an impressive display of fresh flowers, the market prides itself on quality and variety. Shoppers can also browse through stalls offering clothes, make-up, plants, and specialty items. The market is particularly known for its friendly vendors and the opportunity to find unique merchandise at competitive prices, fostering a strong sense of local engagement.</p><p>Beyond the tangible goods, the Slough Market offers an experience. It’s a place where conversations flow freely, where the aroma of fresh produce fills the air, and where the community gathers. It supports local businesses and provides a platform for artisans and traders to connect directly with their customers. The market\'s accessibility and welcoming atmosphere contribute to its charm, making every visit a pleasant and rewarding outing.</p><p>Whether you\'re searching for fresh ingredients for your weekly meals, a unique gift, or simply wish to soak in the local atmosphere, the Slough Market provides a genuine taste of local life. It\'s more than just a place to shop; it\'s a vibrant tradition that continues to thrive in the heart of Berkshire.` }} />
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
        <p className="font-bold">Looking for slough market services?</p>
        <p>Browse our directory of local businesses offering slough market in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=slough%20market" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
