
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Slough New Builds',
  description: 'Slough is rapidly becoming one of Berkshire\'s most sought-after locations for new build homes, and at the heart of this vibrant growth is Berewood Berkshire.',
  keywords: 'slough new builds, Slough, Berkshire, local guide, slough new builds in Slough',
  openGraph: {
    title: 'Slough New Builds',
    description: 'Slough is rapidly becoming one of Berkshire\'s most sought-after locations for new build homes, and at the heart of this vibrant growth is Berewood Berkshire.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slough New Builds',
    description: 'Slough is rapidly becoming one of Berkshire\'s most sought-after locations for new build homes, and at the heart of this vibrant growth is Berewood Berkshire.',
  },
}

export default function SloughnewbuildsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Slough New Builds
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Slough is rapidly becoming one of Berkshire's most sought-after locations for new build homes, and at the heart of this vibrant growth is Berewood Hampsh...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
              alt="slough new builds in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
              alt="slough new builds in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Slough New Builds</h1></p><p><strong>Target Keyword:</strong> slough new builds</p><h2>Discover Your Dream Home: Slough New Builds at Berewood Berkshire</h2></p><p>Slough is rapidly becoming one of Berkshire's most sought-after locations for new build homes, and at the heart of this vibrant growth is Berewood Berkshire. This blossoming new neighbourhood offers a unique blend of modern living and natural beauty, making it an ideal choice for families, first-time buyers, and those seeking a fresh start.</p><p>Berewood is more than just a collection of houses; it's a meticulously planned community designed for a better quality of life. Nestled on the edge of Slough and surrounded by picturesque Berkshire countryside, residents can enjoy beautifully designed homes to buy or rent, alongside an abundance of green open spaces and tranquil woodland walks. The strong sense of community already flourishing here is a testament to its welcoming atmosphere.</p><p>With over 1,100 new homes already occupied and a vision for over 2,500 homes upon completion, Berewood is a significant development. The master plan includes a comprehensive range of amenities to enhance daily living, such as play areas, a dedicated community nature reserve, local schools, a health centre, sports facilities, and convenient shops. Two new primary schools, allotments, and even a skate park are also part of this forward-thinking vision, ensuring all aspects of community life are catered for.</p><p>For those looking to purchase, Berewood offers a diverse range of high-quality homes to suit various lifestyles. Additionally, beautiful 1, 2, 3, and 4-bedroom homes are available for rent through Grainger plc, the UK’s largest professional landlord. Shared ownership options also make homeownership more accessible, allowing you to afford your own home sooner than you might expect.</p><p>One of Berewood's most compelling features is its commitment to the great outdoors. Green space is not merely a backdrop but an integral part of everyday life. Residents can explore acres of woodland and open fields within the Berewood Community Nature Reserve, discover the wild beauty of Newlands Meadow, or follow the River Wallington, which has been transformed into a thriving waterway. Fully accessible paths, benches, boardwalks, and bridges make these natural havens enjoyable for everyone, from dog walkers and cyclists to bird spotters and weekend wanderers. This seamless connection to nature allows residents to slow down, stretch out, and feel connected to their natural surroundings right on their doorstep.</p><p>If you're searching for Slough new builds that offer modern comfort, a strong community spirit, and an exceptional natural environment, Berewood Berkshire presents an unparalleled opportunity to put down roots and experience a truly wonderful place to live.` }} />
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
        <p className="font-bold">Looking for slough new builds services?</p>
        <p>Browse our directory of local businesses offering slough new builds in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=slough%20new%20builds" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
