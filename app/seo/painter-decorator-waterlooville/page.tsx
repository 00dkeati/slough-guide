
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Painters & Decorators in Slough - Interior & Exterior',
  description: 'Find skilled painters and decorators in Slough for interior and exterior painting, wallpapering, and home decoration. Professional decorators with quality finishes.',
  keywords: 'painter decorator slough, interior painting slough, exterior painting slough, wallpapering slough, home decoration slough',
  openGraph: {
    title: 'Best Painters & Decorators in Slough - Interior & Exterior',
    description: 'Find skilled painters and decorators in Slough for interior and exterior painting, wallpapering, and home decoration. Professional decorators with quality finishes.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Painters & Decorators in Slough - Interior & Exterior',
    description: 'Find skilled painters and decorators in Slough for interior and exterior painting, wallpapering, and home decoration. Professional decorators with quality finishes.',
  },
}

export default function PainterdecoratorsloughPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Painter Decorator Slough
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover the best services and information in Slough, Berkshire.
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop"
              alt="painter decorator slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop"
              alt="painter decorator slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Painter Decorator Slough</h1></p><p><strong>Target Keyword:</strong> painter decorator slough</p><h2>Expert Painter Decorator Services in Slough</h2></p><p><p>Are you searching for a reliable and professional <strong>painter decorator in Slough</strong>? Look no further. Transforming your home or commercial space requires skill, precision, and an eye for detail. In Slough and the surrounding Berkshire area, a quality painting and decorating service can breathe new life into your property, enhancing its aesthetic appeal and protecting its surfaces for years to come.</p></p><p><p>Our comprehensive services cover all aspects of interior and exterior decoration. From meticulous surface preparation, including sanding, filling, and priming walls, ceilings, and woodwork, to the flawless application of paint and wallpaper, we ensure a superior finish every time. We understand that every project is unique, and we pride ourselves on delivering bespoke solutions tailored to your specific vision and requirements.</p></p><p><p>Choosing the right <strong>painter decorator in Slough</strong> means selecting a team that is not only highly skilled but also committed to professionalism, cleanliness, and clear communication. We prioritize a seamless and stress-free experience, working efficiently to minimize disruption to your daily routine. Our dedication to high standards ensures that all work is completed to an exceptional level, providing lasting results that you’ll love.</p></p><p><p>Whether you're planning a complete home makeover, refreshing a single room, or need exterior painting to boost your property's curb appeal, our experienced decorators are equipped to handle projects of all sizes. We serve Slough, Horndean, and wider Berkshire, bringing expertise and a friendly approach to every job. Get in touch today for a free consultation and discover how we can help you achieve the perfect finish for your property.</p>` }} />
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
        <p className="font-bold">Looking for painter decorator slough services?</p>
        <p>Browse our directory of local businesses offering painter decorator slough in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=painter%20decorator%20slough" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
