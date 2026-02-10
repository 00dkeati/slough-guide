
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Car Hire Slough',
  description: 'Slough, a vibrant town nestled in Berkshire, UK, serves as an excellent starting point for exploring the picturesque south coast and its surrounding attr...',
  keywords: 'car hire slough, Slough, Berkshire, local guide, car hire slough in Slough',
  openGraph: {
    title: 'Car Hire Slough',
    description: 'Slough, a vibrant town nestled in Berkshire, UK, serves as an excellent starting point for exploring the picturesque south coast and its surrounding attr...',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Car Hire Slough',
    description: 'Slough, a vibrant town nestled in Berkshire, UK, serves as an excellent starting point for exploring the picturesque south coast and its surrounding attr...',
  },
}

export default function CarhiresloughPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Car Hire Slough
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Slough, a vibrant town nestled in Berkshire, UK, serves as an excellent starting point for exploring the picturesque south coast and its surrounding attr...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=400&fit=crop"
              alt="car hire slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=400&fit=crop"
              alt="car hire slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Car Hire Slough</h1></p><p><strong>Target Keyword:</strong> car hire slough</p><h2>Car Hire Slough: Your Gateway to Exploration</h2></p><p>Slough, a vibrant town nestled in Berkshire, UK, serves as an excellent starting point for exploring the picturesque south coast and its surrounding attractions. Whether you're visiting for business, leisure, or need a temporary vehicle, <strong>car hire in Slough</strong> offers the flexibility and convenience to make the most of your journey.</p><p>Opting for <strong>car rental in Slough</strong> provides immediate access to a range of vehicles, from economical compact cars perfect for solo travellers or couples, to spacious multi-passenger vehicles ideal for families or groups. Companies like Enterprise, Practical Car & Van Rental, and SSD Hire offer diverse fleets, including saloons, SUVs, and even vans, catering to various needs and preferences. For those seeking competitive rates, platforms like KAYAK, Booking.com, Rentalcars.com, and StressFreeCarRental.com allow you to compare deals from multiple providers, ensuring you find the best option for your budget.</p><p>Having a <strong>hire car in Slough</strong> opens up a world of possibilities. You can effortlessly visit nearby cities such as Portsmouth with its historic dockyard, or explore the charming market towns and scenic countryside of Berkshire. The New Forest National Park, the South Downs National Park, and the stunning coastline are all within easy driving distance, making day trips and extended excursions a breeze. Furthermore, for those arriving by air, convenient car hire services ensure a smooth transition from arrival to your destination.</p><p>When considering <strong>Slough car hire</strong>, it's advisable to compare prices, check insurance options, and review any age restrictions or specific requirements from different rental agencies. Many providers offer flexible booking options, including short-term and long-term rentals, allowing you to tailor the service to your exact schedule. With a reliable vehicle at your disposal, navigating Slough and the wider region becomes a seamless and enjoyable experience, enhancing your travel freedom and ensuring you don't miss out on any local gems or regional highlights.` }} />
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
        <p className="font-bold">Looking for car hire slough services?</p>
        <p>Browse our directory of local businesses offering car hire slough in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=car%20hire%20slough" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
