
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Slough Soft Play',
  description: 'Slough, a vibrant town in Berkshire, offers a fantastic array of soft play centers, providing endless fun and safe environments for children to explore, ...',
  keywords: 'slough soft play, Slough, Berkshire, local guide, slough soft play in Slough',
  openGraph: {
    title: 'Slough Soft Play',
    description: 'Slough, a vibrant town in Berkshire, offers a fantastic array of soft play centers, providing endless fun and safe environments for children to explore, ...',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slough Soft Play',
    description: 'Slough, a vibrant town in Berkshire, offers a fantastic array of soft play centers, providing endless fun and safe environments for children to explore, ...',
  },
}

export default function SloughsoftplayPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Slough Soft Play
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Slough, a vibrant town in Berkshire, offers a fantastic array of soft play centers, providing endless fun and safe environments for children to explore, ...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
              alt="slough soft play in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
              alt="slough soft play in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Slough Soft Play</h1></p><p><strong>Target Keyword:</strong> slough soft play</p><h2>Discover the Best Soft Play Experiences in Slough</h2></p><p>Slough, a vibrant town in Berkshire, offers a fantastic array of soft play centers, providing endless fun and safe environments for children to explore, learn, and burn off energy. Whether you're a local parent or visiting the area, finding the perfect soft play venue is key to a memorable family day out, especially on those rainy days or when the kids just need to let loose.</p><p>Soft play centers are more than just playgrounds; they are dynamic spaces designed to encourage physical activity, develop motor skills, and foster social interaction among young children. From multi-level climbing frames and exhilarating slides to ball pits and dedicated toddler zones, these facilities cater to various age groups, ensuring a stimulating experience for everyone.</p><p>In Slough and its surrounding areas, you'll find several highly-rated options. <strong>Babyccinos Play Cafe</strong> stands out as a modern, engaging, and safe play cafe, specifically designed for children aged 0-6 years. Parents can enjoy beautifully-made coffee and great food while their little ones play. Another popular choice is <strong>Mini Town Role Play</strong>, a unique role-play village recommended for under 5s, featuring eight exciting areas for imaginative exploration and learning. For those seeking a larger adventure, <strong>Horizon Havant's Ultimate Soft Play</strong> offers an immersive world of excitement across four thrilling levels.</p><p>These venues often provide additional amenities such as comfortable seating for parents, on-site cafes serving refreshments and meals, and even party packages for special occasions. When choosing a soft play center, consider factors like age appropriateness, cleanliness, safety measures, and the variety of play equipment available.</p><p>Slough's soft play scene ensures that children have access to stimulating and secure environments, promoting healthy development while providing parents with a much-needed break. So, next time you're looking for an engaging activity for your kids, explore the wonderful soft play options available right here in Slough.` }} />
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
        <p className="font-bold">Looking for slough soft play services?</p>
        <p>Browse our directory of local businesses offering slough soft play in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=slough%20soft%20play" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
