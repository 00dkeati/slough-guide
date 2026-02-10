
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Slough News',
  description: 'Slough, a vibrant town nestled in Berkshire, England, continues to be a hub of activity and community engagement. Staying informed about local developmen...',
  keywords: 'slough news, Slough, Berkshire, local guide, slough news in Slough',
  openGraph: {
    title: 'Slough News',
    description: 'Slough, a vibrant town nestled in Berkshire, England, continues to be a hub of activity and community engagement. Staying informed about local developmen...',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slough News',
    description: 'Slough, a vibrant town nestled in Berkshire, England, continues to be a hub of activity and community engagement. Staying informed about local developmen...',
  },
}

export default function SloughnewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Slough News
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Slough, a vibrant town nestled in Berkshire, England, continues to be a hub of activity and community engagement. Staying informed about local developmen...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
              alt="slough news in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
              alt="slough news in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Slough News</h1></p><p><strong>Target Keyword:</strong> slough news</p><h2>Slough News: Your Latest Local Updates</h2></p><p>Slough, a vibrant town nestled in Berkshire, England, continues to be a hub of activity and community engagement. Staying informed about local developments is crucial for residents and those with an interest in the area. Here's a roundup of some of the significant news and events that have shaped Slough recently.</p><h3>Community Safety and Incidents</h3></p><p>Recent months have seen a focus on community safety. In September 2025, a tragic incident involving a 4-year-old boy seriously injured after being hit by a car prompted calls for witnesses and dashcam footage, highlighting ongoing concerns about road safety in the area. This followed a similar incident in July 2025, where a motorcyclist's death led to discussions about 'slippery road' conditions. Sadly, July also saw the report of a child killed in a village crash, further emphasizing the need for vigilance on local roads. In more serious crime news, a man was charged in May 2025 in connection with the murder and rape of a woman in 2023, while a murder inquiry concluded in January 2025 after an 87-year-old suspect died.</p><h3>Local Developments and Notable Mentions</h3></p><p>Beyond incidents, Slough has also been in the news for various local developments. A story in July 2025 reported on a couple facing local uproar and being asked to tear down a log cabin that reportedly impacted the view of the South Downs National Park, showcasing the community's passion for preserving its natural surroundings. On a more celebratory note, June 2025 saw former Portsmouth North MP Penny Mordaunt made a Dame in the King's Birthday Honours, an event that resonated with many in the broader Berkshire region.</p><h3>Unique Local Stories</h3></p><p>Slough is also home to unique and inspiring stories. In February 2025, an artist from the area gained attention for painting intricate Harry Potter scenes on teabags, demonstrating the creative talent thriving within the community.</p><h3>Slough: A Town with History and Character</h3></p><p>Historically, Slough's name is famously linked to the Battle of Waterloo, with its origins tracing back to the early 19th century when soldiers returning from the conflict settled in the area, leading to the establishment of ` }} />
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
        <p className="font-bold">Looking for slough news services?</p>
        <p>Browse our directory of local businesses offering slough news in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=slough%20news" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
