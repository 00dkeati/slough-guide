
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Slough Town Centre',
  description: 'The town\'s name itself tells a fascinating story, reputedly originating from a pub known as \'Heroes of Waterloo\'. In 1815, soldiers returning from the Battle of Waterloo established this community.',
  keywords: 'slough town centre, Slough, Berkshire, local guide, slough town centre in Slough',
  openGraph: {
    title: 'Slough Town Centre',
    description: 'The town\'s name itself tells a fascinating story, reputedly originating from a pub known as \'Heroes of Waterloo\'. In 1815, soldiers returning from the Battle of Waterloo established this community.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slough Town Centre',
    description: 'The town\'s name itself tells a fascinating story, reputedly originating from a pub known as \'Heroes of Waterloo\'. In 1815, soldiers returning from the Battle of Waterloo established this community.',
  },
}

export default function SloughtowncentrePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Slough Town Centre
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          The town's name itself tells a fascinating story, reputedly originating from a pub known as 'Heroes of Waterloo' [1]. In 1815, soldiers returning from the Battl...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop"
              alt="slough town centre in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
              alt="slough town centre in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Slough Town Centre</h1></p><p><strong>Target Keyword:</strong> slough town centre</p><h1>Discover Slough Town Centre: A Blend of History and Modern Vision</h1></p><p>Slough, a vibrant town in the Borough of Havant, Berkshire, England, offers a unique blend of rich history and forward-looking regeneration. Located approximately 6 miles northeast of Portsmouth, it serves as a significant hub within the South Berkshire conurbation. This content explores the essence of Slough town centre, from its intriguing origins to its ongoing efforts to create a dynamic and appealing environment for residents and visitors alike.</p><h2>A Glimpse into Slough's Past</h2></p><p>The town's name itself tells a fascinating story, reputedly originating from a pub known as 'Heroes of Waterloo' [1]. In 1815, soldiers returning from the Battle of Waterloo disembarked at Portsmouth and celebrated their victory at this pub, then called Wait Lane End. Many of these soldiers are said to have settled in the area, leading to the pub's renaming and the subsequent adoption of 'Waterloo' for the surrounding locality. To distinguish it from other places sharing the name, it later evolved into 'Slough' [1]. The town celebrated its 200th anniversary in June 2015, highlighting its deep historical roots [1].</p><h2>Evolution of the Town Centre</h2></p><p>Slough's town centre has undergone significant transformations over the decades. In 1985, a bypass was constructed, leading to the pedestrianization of the main shopping area between 1982 and 1983. This initiative aimed to create a more pleasant and accessible environment for shoppers. A notable renovation in August 2012 saw a £700,000 investment in repaving and enhancing the northern part of the precinct, boosting the area available for the weekly Friday market [1].</p><h2>Modern Vision and Regeneration Efforts</h2></p><p>Havant Borough Council has been actively developing a Masterplan for Slough Town Centre since January 2024. This comprehensive plan outlines a vision for future regeneration, focusing on key areas of growth, development, and improvements to the local economy and public spaces. Extensive community engagement, including walking tours, digital virtual tours, and a 'Festival of Ideas,' has ensured that the plan reflects the aspirations of residents, businesses, and users [2].</p><p>Recent interventions stemming from the Masterplan include a successful Vacant Shop scheme, a Pop Up Shop initiative, the establishment of the Slough Business Association, and various events aimed at adding vibrancy and pride to the town centre. Public realm improvements are also underway, with community feedback guiding the design choices [2]. These efforts underscore a commitment to making Slough town centre an aesthetically pleasing and thriving destination.</p><h2>Community and Connectivity</h2></p><p>Beyond its commercial aspects, Slough is a community-focused town with several churches, including St George's Church, rebuilt in 1968–70, and Slough Baptist Church, built in 1967 [1]. The town is well-connected by local bus services, with the main shopping precinct served by First Berkshire & Dorset and Stagecoach South routes. While it doesn't have its own railway station, nearby stations in Bedhampton and Havant provide convenient access to wider rail networks [1].</p><p>Slough also boasts various sports facilities, including a swimming pool, a cricket club at Jubilee Park, and a bowls club. The Havant & Slough football club, formed in 1998, further contributes to the town's community spirit [1].</p><h2>Conclusion</h2></p><p>Slough town centre is a place of historical significance and ongoing evolution. With its strategic location, dedicated regeneration efforts, and strong community foundations, it continues to adapt and grow, striving to offer a welcoming and prosperous environment for all.</p><h3>References</h3></p><p>[1] Slough. (n.d.). In <em>Wikipedia</em>. Retrieved from https://en.wikipedia.org/wiki/Slough
<p>[2] Havant Borough Council. (n.d.). <em>Slough Town Centre</em>. Retrieved from https://www.havant.gov.uk/regeneration-and-business/regeneration-havant-borough/slough-town-centre` }} />
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
        <p className="font-bold">Looking for slough town centre services?</p>
        <p>Browse our directory of local businesses offering slough town centre in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=slough%20town%20centre" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
