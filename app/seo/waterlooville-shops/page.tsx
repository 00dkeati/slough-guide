
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Shops in Slough - Shopping Guide & Retail Directory',
  description: 'Explore the best shops in Slough including high street retailers, independent boutiques, and specialty stores. Complete shopping guide with opening hours and locations.',
  keywords: 'slough shops, shopping slough, retail slough, high street slough, independent shops slough',
  openGraph: {
    title: 'Best Shops in Slough - Shopping Guide & Retail Directory',
    description: 'Explore the best shops in Slough including high street retailers, independent boutiques, and specialty stores. Complete shopping guide with opening hours and locations.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Shops in Slough - Shopping Guide & Retail Directory',
    description: 'Explore the best shops in Slough including high street retailers, independent boutiques, and specialty stores. Complete shopping guide with opening hours and locations.',
  },
}

export default function SloughshopsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Slough Shops
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover the best services and information in Slough, Berkshire.
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
              alt="slough shops in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
              alt="slough shops in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Slough Shops</h1></p><p><strong>Target Keyword:</strong> slough shops</p><p>Slough, a vibrant town in Berkshire, offers a diverse and engaging shopping experience for both residents and visitors. From well-known retail parks to charming local boutiques and bustling markets, the town caters to a wide array of shopping needs and preferences.</p><p>One of the key shopping destinations is The Boulevard, which hosts a collection of local businesses and established brands, providing a convenient and pleasant environment for shoppers. Additionally, Wellington Retail Park, situated on the edge of Slough, features larger stores such as TK Maxx and Sainsbury's Superstore, making it ideal for those looking for fashion, homeware, and groceries all in one place. The presence of ample free parking, particularly near The Boulevard, significantly enhances the accessibility and appeal of Slough's shopping areas.</p><p>Beyond the larger retail hubs, Slough boasts unique independent shops that add character and a personal touch to the retail landscape. The Slough Market, for instance, offers a traditional shopping experience, while specialty stores like The Pink Party Shop and The Celebration Store cater to specific needs, from party supplies and balloons to cards and gifts. These local businesses contribute to the town's community feel and provide distinctive items not found in larger chains.</p><p>The town also sees initiatives like the Slough Pop Up Shop, supported by Havant Borough Council, which provides opportunities for emerging local businesses to showcase their products and services. This dynamic approach ensures that the shopping scene remains fresh and continues to evolve, offering new discoveries for shoppers.</p><p>Whether you're searching for everyday essentials, a unique gift, or simply enjoy browsing, Slough's shops provide a comprehensive and enjoyable retail journey, blending convenience with community spirit and variety.` }} />
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
        <p className="font-bold">Looking for slough shops services?</p>
        <p>Browse our directory of local businesses offering slough shops in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=slough%20shops" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
