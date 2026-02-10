
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Leigh Park',
  description: 'The history of Leigh Park stretches back centuries, with mentions of a farm on the site as early as 1750. The Leigh Park Estate, a notable feature in its early ...',
  keywords: 'leigh park, Slough, Berkshire, local guide, leigh park in Slough',
  openGraph: {
    title: 'Leigh Park',
    description: 'The history of Leigh Park stretches back centuries, with mentions of a farm on the site as early as 1750. The Leigh Park Estate, a notable feature in its early ...',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leigh Park',
    description: 'The history of Leigh Park stretches back centuries, with mentions of a farm on the site as early as 1750. The Leigh Park Estate, a notable feature in its early ...',
  },
}

export default function LeighparkPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Leigh Park
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          The history of Leigh Park stretches back centuries, with mentions of a farm on the site as early as 1750. The Leigh Park Estate, a notable feature in its early ...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
              alt="leigh park in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
              alt="leigh park in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Leigh Park</h1></p><p><strong>Target Keyword:</strong> leigh park</p><h1>Discovering Leigh Park: A Vibrant Community in Berkshire</h1></p><p>Leigh Park, a prominent suburb of Havant in Berkshire, England, is a community rich in history and local character. With an approximate population of 27,500 residents, it forms a significant part of the local landscape, encompassing electoral wards such as Battins, Bondfields, Barncroft, and Warren Park. This area, once a collection of farms and estates, has evolved into a bustling residential hub with a unique story.</p><h2>A Glimpse into Leigh Park's Past</h2></p><p>The history of Leigh Park stretches back centuries, with mentions of a farm on the site as early as 1750. The Leigh Park Estate, a notable feature in its early days, was celebrated for its beauty, described in 1826 as "one of the most beautiful spots in the county" [3]. This estate boasted decorative planting, serene lakes, and intriguing follies, remnants of which can still be found within Staunton Country Park today [2].</p><p>The most transformative period for Leigh Park occurred in the aftermath of the Second World War. The area was re-developed to provide housing for those displaced and left homeless by the extensive bomb damage in nearby Portsmouth. In 1944, Portsmouth City Council acquired the land from the Fitzwygram family, initiating construction in 1947, with the first residents moving into their new homes by 1949. The rapid development continued, and by the early 1970s, the estate was largely complete [1]. Initially conceived as a wholly council estate, the landscape of Leigh Park has shifted over time, with many properties now privately owned due to the 'right to buy' scheme.</p><h2>Geography and Natural Surroundings</h2></p><p>Geographically, Leigh Park is bordered to the east by the Havant to Petersfield railway line and its northern extent is broadly defined by the A3M and B2150 junction. The area is largely flat, with gentle rises towards the north. Two notable streams, the Hermitage Stream and the Lavant Stream, meander through parts of Leigh Park, eventually flowing into Langstone Harbour, which lies approximately a mile to the south [8, 9]. Staunton Country Park, with its historical significance and natural beauty, lies on the northern edge of Leigh Park, offering residents and visitors alike a tranquil escape.</p><h2>Community Life and Facilities</h2></p><p>Leigh Park is a self-sufficient community with a range of facilities. The main shopping precinct, featuring Park Parade and Greywell Shopping, has been serving residents since 1955 [1]. For education, the area is home to several primary schools, including Front Lawn, Trosnant, and Warren Park, as well as secondary schools like Havant Academy and Park Community School [11, 12].</p><p>Sports play a significant role in the community, with Havant & Slough Football Club, a non-league side, being a local point of pride. The area also hosts Havant Hockey Club and the Leigh Park Bowls Club. The Front Lawn Community Hub, following a £1.5 million upgrade, offers state-of-the-art facilities including a 3G artificial football pitch, multisport courts for tennis, basketball, and netball, and community spaces [13]. Leigh Park Boxing Club is also based at the local community centre.</p><p>Leigh Park's transport links are robust, with Stagecoach South bus routes connecting the suburb to central Havant, Portsmouth, and other surrounding areas. Havant railway station serves as the nearest major train station, with smaller stations at Bedhampton and Rowlands Castle also accessible [1]. The A3(M) motorway and A27 Havant bypass provide crucial road connections to the wider region.</p><h2>Conclusion</h2></p><p>From its origins as a rural estate to its development as a significant post-war housing project, Leigh Park has grown into a vibrant and well-equipped community. Its blend of historical roots, natural surroundings, comprehensive facilities, and strong community spirit makes it a distinctive and important part of Berkshire.</p><h2>References</h2></p><p>[1] "Leigh Park." <em>Wikipedia</em>, Wikimedia Foundation, 16 Oct. 2025, en.wikipedia.org/wiki/Leigh_Park.
<p>[2] "History of Staunton Country Park." <em>Berkshire County Council</em>, www.hants.gov.uk/thingstodo/countryparks/staunton-country-park/our-story/history.
<p>[3] Scott, Richard. <em>A Topographical and Historical Account of Hayling Island, Hants</em>. I. Skelton, 1826.
<p>[8] "The Lavant Stream at Havant, Rowlands Castle and Finchdean." <em>Havant Borough Council</em>, www.havant.gov.uk/sites/default/files/documents/The%20Lavant%20Stream%20at%20Havant%2C%20Rowlands%20Castle%20and%20Finchdean.pdf.
<p>[9] "A History of the Hermitage Stream and its Tributaries — Restoration and Enhancement Projects." <em>Havant Borough Council</em>, www.havant.gov.uk/sites/default/files/documents/A%20History%20of%20the%20Hermitage%20Stream%20and%20its%20Tributaries%20-%20Restoration%20and%20Enhancement%20Projects.pdf.
<p>[11] "Havant Borough Council Timeline 2012." <em>Havant Borough Council</em>, www.havant.gov.uk/sites/default/files/documents/Havant%20Borough%20Council%20Timeline%202012.pdf.
<p>[12] "A History of Havant." <em>Local Histories</em>, www.localhistories.org/havant.html.
<p>[13] "Leigh Park community Centre is saved by charity." <em>The News (Portsmouth)</em>, 8 Mar. 2016, www.portsmouth.co.uk/news/leigh-park-community-centre-saved-charity-1-7253592.` }} />
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
        <p className="font-bold">Looking for leigh park services?</p>
        <p>Browse our directory of local businesses offering leigh park in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=leigh%20park" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
