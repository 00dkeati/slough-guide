
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pet Shops Slough',
  description: 'Located in Wellington Retail Park, Jollyes Slough stands out as a comprehensive pet care destination. Known as \'The Pet People,\' Jollyes offers an extensive range of pet supplies and services.',
  keywords: 'pet shops slough, Slough, Berkshire, local guide, pet shops slough in Slough',
  openGraph: {
    title: 'Pet Shops Slough',
    description: 'Located in Wellington Retail Park, Jollyes Slough stands out as a comprehensive pet care destination. Known as \'The Pet People,\' Jollyes offers an extensive range of pet supplies and services.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pet Shops Slough',
    description: 'Located in Wellington Retail Park, Jollyes Slough stands out as a comprehensive pet care destination. Known as \'The Pet People,\' Jollyes offers an extensive range of pet supplies and services.',
  },
}

export default function PetshopssloughPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Pet Shops Slough
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Located in Wellington Retail Park, Jollyes Slough stands out as a comprehensive pet care destination. Known as 'The Pet People,' Jollyes offers an extens...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400&fit=crop"
              alt="pet shops slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=400&fit=crop"
              alt="pet shops slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Pet Shops Slough</h1></p><p><strong>Target Keyword:</strong> pet shops slough</p><h1>Discover the Best Pet Shops in Slough: Your Ultimate Guide</h1></p><p>Slough, a bustling town in Berkshire, offers a fantastic selection of pet shops catering to every pet owner's needs. Whether you're a proud parent of a playful pup, a curious cat, a chirpy bird, or an exotic reptile, you'll find dedicated stores providing high-quality products, expert advice, and essential services. This guide explores some of the top pet destinations in Slough, ensuring your beloved companions receive the best care.</p><h2>Jollyes Slough: The Pet People</h2></p><p>Located in Wellington Retail Park, Jollyes Slough stands out as a comprehensive pet care destination. Known as 'The Pet People,' Jollyes offers an extensive range of pet supplies, from premium food brands to affordable options, toys for all sizes, and habitats for various creatures. They cater to dogs, cats, birds, small pets, reptiles, and fish, ensuring every animal's needs are met. Beyond products, Jollyes provides valuable services such as a Community Pet Clinic for essential health checks and a convenient Wash & Go station for dog grooming. Their commitment to customer service is evident through features like Click & Collect, free parking, expert advice, and a 'Carry to Car' service, making shopping a breeze for pet owners.</p><h2>Pets at Home Slough: A One-Stop Pet Care Centre</h2></p><p>Also situated in Wellington Retail Park, Pets at Home Slough is another prominent establishment offering a wide array of pet products and services. This pet care centre is a true one-stop-shop, providing everything from nutrition consultations and licensed medicines to an adoption centre. They feature in-store grooming services, including bath, brush & blow dry, dog grooming, nail clipping, and spa treatments. For veterinary needs, their in-store vets offer dental care, health checks, microchipping, and neutering. Pets at Home also emphasizes convenience with Click & Collect, free harness fitting, and free weight checks, making it a reliable choice for comprehensive pet care.</p><h2>Other Notable Mentions</h2></p><p>While Jollyes and Pets at Home are major players, Slough is also home to other specialized pet retailers. 'Your Pets Naturally' focuses on natural and raw pet food, offering a large selection of raw brands for dogs and cats, along with natural treats. For those seeking unique pet accessories and natural products, 'Pawsome Bowteeq' provides a local, independent boutique experience. These diverse options ensure that pet owners in Slough can find exactly what they need, whether it's specialized dietary requirements or unique pet products.</p><h2>Why Choose Local Pet Shops?</h2></p><p>Supporting local pet shops in Slough not only benefits the community but also provides pet owners with personalized service and expert knowledge. Staff often possess in-depth understanding of pet nutrition, behavior, and health, offering tailored advice that online retailers cannot match. Furthermore, local shops often stock a curated selection of high-quality products and can introduce you to unique items that might not be available elsewhere.</p><p>In conclusion, Slough boasts a vibrant pet retail scene, with a variety of shops dedicated to the well-being of your animal companions. From extensive product ranges to specialized services, these local establishments are committed to helping you provide the best possible life for your pets.` }} />
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
        <p className="font-bold">Looking for pet shops slough services?</p>
        <p>Browse our directory of local businesses offering pet shops slough in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=pet%20shops%20slough" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
