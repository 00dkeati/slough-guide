
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Beauty Salons in Slough - Hair, Nails & Spa Services',
  description: 'Find top-rated beauty salons in Slough offering hair styling, nail art, facials, and spa treatments. Professional beauty services with excellent reviews.',
  keywords: 'beauty salon slough, hair salon slough, nail salon slough, spa slough, beauty treatments slough',
  openGraph: {
    title: 'Best Beauty Salons in Slough - Hair, Nails & Spa Services',
    description: 'Find top-rated beauty salons in Slough offering hair styling, nail art, facials, and spa treatments. Professional beauty services with excellent reviews.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Beauty Salons in Slough - Hair, Nails & Spa Services',
    description: 'Find top-rated beauty salons in Slough offering hair styling, nail art, facials, and spa treatments. Professional beauty services with excellent reviews.',
  },
}

export default function BeautysalonsloughPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Beauty Salon Slough
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover the best services and information in Slough, Berkshire.
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=400&fit=crop"
              alt="beauty salon slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=400&fit=crop"
              alt="beauty salon slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Beauty Salon Slough</h1></p><p><strong>Target Keyword:</strong> beauty salon slough</p><p>Discovering the perfect <strong>beauty salon in Slough</strong> can transform your self-care routine, offering a sanctuary where expert treatments meet personalized attention. Slough boasts a vibrant selection of salons, each providing a unique blend of services designed to enhance your natural beauty and promote relaxation. Whether you're seeking a quick refresh or a comprehensive pampering session, the local beauty scene has something for everyone.</p><p>From luxurious <strong>facials</strong> tailored to your skin type, including popular options like ELEMIS treatments, to meticulous <strong>nail services</strong> such as gel nails and manicures, salons in Slough prioritize precision and quality. Many establishments also specialize in <strong>eye treatments</strong>, offering lash lifts, tinting, and brow shaping to frame your features perfectly. For those looking for smooth, radiant skin, professional <strong>waxing</strong> and <strong>threading</strong> services are readily available, performed by experienced therapists.</p><p>Beyond these essentials, you'll find salons providing indulgent <strong>massages</strong> to melt away stress, advanced <strong>aesthetic treatments</strong> for rejuvenation, and even comprehensive <strong>hair services</strong> ranging from cuts and coloring to extensions. Some local gems, like Salon One, go a step further by offering accredited beauty academy courses, showcasing a deep commitment to expertise and continuous improvement within the industry.</p><p>When choosing a beauty salon in Slough, consider factors such as the range of services, therapist expertise, client reviews, and the overall ambiance. Many salons, including Diamonds Beauty Rooms and Pretty Lilly's Beauty Salon, are highly rated for their exceptional customer service and diverse treatment menus. With convenient booking options often available online, finding your ideal beauty destination in Slough is easier than ever. Embrace the opportunity to indulge in top-tier beauty care right on your doorstep, and experience the difference that professional attention can make.` }} />
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
        <p className="font-bold">Looking for beauty salon slough services?</p>
        <p>Browse our directory of local businesses offering beauty salon slough in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=beauty%20salon%20slough" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
