
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pubs In Slough',
  description: 'For those who appreciate classic British pub culture, Slough boasts several establishments steeped in history and community spirit. The **Cippenham Queen**...',
  keywords: 'pubs in slough, Slough, Berkshire, local guide, pubs in slough in Slough',
  openGraph: {
    title: 'Pubs In Slough',
    description: 'For those who appreciate classic British pub culture, Slough boasts several establishments steeped in history and community spirit. The **Cippenham Queen**...',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pubs In Slough',
    description: 'For those who appreciate classic British pub culture, Slough boasts several establishments steeped in history and community spirit. The **Cippenham Queen**...',
  },
}

export default function PubsinsloughPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Pubs In Slough
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          For those who appreciate classic British pub culture, Slough boasts several establishments steeped in history and community spirit. The **Cippenham Queen**...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop"
              alt="pubs in slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=400&fit=crop"
              alt="pubs in slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Pubs In Slough</h1></p><p><strong>Target Keyword:</strong> pubs in slough</p><h1>Discover the Best Pubs in Slough: Your Ultimate Guide</h1></p><p>Slough, a charming town nestled in Berkshire, offers a delightful array of pubs that cater to every taste and occasion. Whether you're a local seeking a familiar haunt or a visitor eager to explore the area's vibrant social scene, Slough's pubs promise a warm welcome, excellent drinks, and often, delicious food. From traditional real ale houses to modern establishments with live entertainment, there's a pub for everyone.</p><h2>A Taste of Tradition and Community Spirit</h2></p><p>For those who appreciate classic British pub culture, Slough boasts several establishments steeped in history and community spirit. The <strong>Cippenham Queen</strong>, a Wetherspoon pub, is a popular choice, known for its extensive range of regular and changing beers, making it a haven for real ale enthusiasts. Similarly, the <strong>Heroes</strong> pub offers a robust selection of five regular beers, providing a consistent quality experience for its patrons. These pubs often serve as the heart of their local communities, offering a relaxed atmosphere perfect for catching up with friends or enjoying a quiet pint.</p><h2>Family-Friendly Fun and Outdoor Spaces</h2></p><p>Many pubs in Slough understand the importance of catering to families and offer fantastic amenities for all ages. The <strong>Plough & Barleycorn</strong>, a Marston's pub, is frequently highlighted for its family-friendly environment and often features a large beer garden, ideal for sunny afternoons. The <strong>Spotted Cow</strong> in Langley is another excellent option for families, known for its welcoming atmosphere and sometimes even offering activities for children. These venues provide a perfect setting for a leisurely lunch or an early evening meal, allowing parents to relax while children are entertained.</p><h2>Live Entertainment and Modern Vibes</h2></p><p>If you're looking for a pub with a bit more buzz, Slough has options that offer live music, sports, and a more contemporary feel. The <strong>Falcon Inn</strong> is often recommended for its lively atmosphere and music nights, promising an entertaining evening out. While not strictly in Slough itself, nearby establishments like The Liquorist in Portsmouth offer a vibrant nightlife experience with glamorous cocktails and live sports, appealing to those seeking a more energetic environment. The <strong>Woodpecker</strong>, an Ember Inn, combines quality pub food with a warm welcome in a spacious setting, making it suitable for both casual dining and social gatherings.</p><h2>Beyond the Pint: Food and Features</h2></p><p>Slough's pubs are not just about drinks; many pride themselves on their culinary offerings. From classic pub fare to more refined dining experiences, you'll find a variety of menus to satisfy your cravings. Several pubs, such as the <strong>George Inn</strong> (though a little further afield in Drayton), are celebrated for their quality food and traditional settings. Look out for pubs that offer Sunday roasts, daily specials, and locally sourced ingredients to truly experience the best of Berkshire's hospitality.</p><p>In conclusion, Slough's pub scene is diverse and inviting, offering a rich tapestry of experiences for every visitor. Whether you prefer a quiet corner with a real ale, a bustling spot with live music, or a family-friendly garden, the pubs in Slough are ready to provide a memorable experience. So, next time you're in the area, be sure to explore these local gems and discover your new favourite spot.` }} />
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
        <p className="font-bold">Looking for pubs in slough services?</p>
        <p>Browse our directory of local businesses offering pubs in slough in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=pubs%20in%20slough" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
