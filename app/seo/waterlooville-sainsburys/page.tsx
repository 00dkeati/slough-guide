
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Slough Sainsburys',
  description: 'For residents and visitors alike, Sainsbury\'s Slough stands as a cornerstone of convenience and quality, offering a comprehensive shopping experience.',
  keywords: 'slough sainsburys, Slough, Berkshire, local guide, slough sainsburys in Slough',
  openGraph: {
    title: 'Slough Sainsburys',
    description: 'For residents and visitors alike, Sainsbury\'s Slough stands as a cornerstone of convenience and quality, offering a comprehensive shopping experience.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slough Sainsburys',
    description: 'For residents and visitors alike, Sainsbury\'s Slough stands as a cornerstone of convenience and quality, offering a comprehensive shopping experience.',
  },
}

export default function SloughsainsburysPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Slough Sainsburys
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          For residents and visitors alike, **Sainsbury's Slough** stands as a cornerstone of convenience and quality, offering a comprehensive shopping experience...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
              alt="slough sainsburys in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
              alt="slough sainsburys in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Slough Sainsburys</h1></p><p><strong>Target Keyword:</strong> slough sainsburys</p><h2>Discover Sainsbury's Slough: Your Ultimate Shopping Destination</h2></p><p>For residents and visitors alike, <strong>Sainsbury's Slough</strong> stands as a cornerstone of convenience and quality, offering a comprehensive shopping experience right in the heart of Berkshire. Located prominently on Hambledon Road, this superstore is more than just a grocery stop; it's a hub for a wide array of products and services designed to meet every need.</p><h3>Extensive Product Range and Fresh Groceries</h3></p><p>At Sainsbury's Slough, you'll find an extensive selection of fresh groceries, from daily essentials to gourmet ingredients. The store prides itself on providing high-quality produce, baked goods, meats, and dairy, ensuring that your weekly shop is both satisfying and inspiring. Beyond food, the superstore also stocks a diverse range of clothing, homewares, and electricals, making it a true one-stop-shop for household necessities and personal treats.</p><h3>Convenient Services and Facilities</h3></p><p>Understanding the busy lives of its customers, Sainsbury's Slough offers a suite of convenient services. Inside the store, you'll discover a dedicated <strong>Argos</strong> concession, allowing you to seamlessly pick up your online orders or browse their extensive catalogue of products. For a quick bite or a relaxing coffee break, the <strong>Sainsbury's Cafe</strong> provides a comfortable spot to refuel during your shopping trip. Additionally, the store features a <strong>Click & Collect</strong> service for online grocery orders, streamlining your shopping process, and a <strong>Travel Money Bureau</strong> for all your foreign currency needs, ensuring you're prepared for your next adventure.</p><h3>Opening Hours and Accessibility</h3></p><p>The Slough superstore is designed to accommodate various schedules. Typically, the store operates from <strong>8:00 AM to 10:00 PM</strong> on weekdays and Saturdays, providing ample time for early morning shoppers and late evening errands. On Sundays, the hours are generally <strong>11:00 AM to 5:00 PM</strong>. It's always advisable to check the official Sainsbury's website for specific bank holiday opening times, as these can vary. With its accessible location on Hambledon Road, the store is easy to reach, offering ample parking for a hassle-free visit.</p><p>Whether you're stocking up on groceries, looking for household items, or utilizing its convenient services, Sainsbury's Slough is committed to providing a high-quality and efficient shopping experience for the local community. Its comprehensive offerings and customer-focused facilities make it an indispensable part of Slough's retail landscape.` }} />
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
        <p className="font-bold">Looking for slough sainsburys services?</p>
        <p>Browse our directory of local businesses offering slough sainsburys in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=slough%20sainsburys" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
