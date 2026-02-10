import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dog Walks Near Slough - Best Walking Routes for Dogs',
  description: 'Discover the best dog walks near Slough. Explore scenic routes, dog-friendly parks, and walking trails perfect for your furry friend in Berkshire.',
  keywords: 'dog walks near slough, dog friendly walks slough, dog walking routes hampshire, slough dog parks, dog exercise areas slough',
  openGraph: {
    title: 'Dog Walks Near Slough - Best Walking Routes for Dogs',
    description: 'Discover the best dog walks near Slough. Explore scenic routes, dog-friendly parks, and walking trails perfect for your furry friend in Berkshire.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dog Walks Near Slough - Best Walking Routes for Dogs',
    description: 'Discover the best dog walks near Slough. Explore scenic routes, dog-friendly parks, and walking trails perfect for your furry friend in Berkshire.',
  },
}

export default function DogWalksNearSloughPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-teal-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
              Dog Walks Near Slough
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-green-100 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover the best dog-friendly walking routes, parks, and trails in and around Slough. Perfect for keeping your furry friend happy and healthy.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">🐕 Dog-Friendly</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">🌳 Scenic Routes</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">📍 Local Areas</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl sm:text-4xl font-black text-green-600 mb-2">15+</div>
            <div className="text-lg font-semibold text-gray-700">Dog-Friendly Routes</div>
            <div className="text-sm text-gray-500">Around Slough</div>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">5</div>
            <div className="text-lg font-semibold text-gray-700">Dog Parks</div>
            <div className="text-sm text-gray-500">With Secure Areas</div>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl sm:text-4xl font-black text-teal-600 mb-2">10+</div>
            <div className="text-lg font-semibold text-gray-700">Walking Trails</div>
            <div className="text-sm text-gray-500">Perfect for Dogs</div>
          </div>
        </div>

        {/* Top Dog Walking Locations */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 text-center">
            🐕 Best Dog Walks Near Slough
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Queen Elizabeth Country Park */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&q=80"
                  alt="Queen Elizabeth Country Park dog walking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Queen Elizabeth Country Park</h3>
                <p className="text-gray-600 mb-4">Extensive woodland trails and open spaces perfect for energetic dogs. Multiple routes from easy strolls to challenging hikes.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">On-lead areas</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Off-lead areas</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Parking available</span>
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Distance from Slough:</strong> 15 minutes drive<br/>
                  <strong>Route length:</strong> 1-8 miles available
                </div>
              </div>
            </div>

            {/* Staunton Country Park */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80"
                  alt="Staunton Country Park dog walking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Staunton Country Park</h3>
                <p className="text-gray-600 mb-4">Beautiful parkland with lakes, woodland, and open fields. Great for dogs who love water and varied terrain.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Water features</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Multiple routes</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Café nearby</span>
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Distance from Slough:</strong> 20 minutes drive<br/>
                  <strong>Route length:</strong> 2-4 miles available
                </div>
              </div>
            </div>

            {/* Slough Recreation Ground */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop&q=80"
                  alt="Slough Recreation Ground"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Slough Recreation Ground</h3>
                <p className="text-gray-600 mb-4">Local park perfect for quick walks and exercise. Open spaces and walking paths ideal for daily dog exercise.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Local access</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Open spaces</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Easy parking</span>
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Distance from Slough:</strong> Walking distance<br/>
                  <strong>Route length:</strong> 0.5-1 mile loops
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dog Walking Tips */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🐾 Dog Walking Tips for Slough
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Before You Go</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Check weather conditions and dress appropriately
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Bring water and a collapsible bowl for your dog
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Pack poop bags and dispose of waste responsibly
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Ensure your dog is microchipped and has ID tags
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">During Your Walk</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Keep your dog on a lead in designated areas
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Watch for other dogs, wildlife, and livestock
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Take breaks in hot weather and provide water
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Respect other walkers and keep paths clear
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Local Dog Services */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🏪 Dog Services Near Slough
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Veterinary Services</h3>
              <p className="text-gray-600 mb-4">Local vets for health checks and emergencies</p>
              <Link href="/search?q=veterinary" className="text-blue-600 hover:text-blue-800 font-medium">
                Find Vets →
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">🛁</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Grooming Services</h3>
              <p className="text-gray-600 mb-4">Professional dog grooming and bathing</p>
              <Link href="/search?q=dog+grooming" className="text-blue-600 hover:text-blue-800 font-medium">
                Find Groomers →
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Pet Supplies</h3>
              <p className="text-gray-600 mb-4">Food, toys, and accessories for your dog</p>
              <Link href="/search?q=pet+supplies" className="text-blue-600 hover:text-blue-800 font-medium">
                Find Pet Shops →
              </Link>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-lg max-w-none bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Dog Walks Near Slough: Your Complete Guide
          </h2>
          <p className="text-gray-700 mb-4">
            Slough and its surrounding areas offer some of the best dog walking opportunities in Berkshire. Whether you're looking for a quick 30-minute stroll or a full day adventure, there are plenty of dog-friendly routes to explore.
          </p>
          <p className="text-gray-700 mb-4">
            The South Downs National Park is just a short drive away, offering extensive trails through ancient woodlands and open countryside. Closer to home, local parks and recreation grounds provide convenient options for daily exercise.
          </p>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Popular Dog Walking Areas</h3>
          <p className="text-gray-700 mb-4">
            Queen Elizabeth Country Park remains one of the most popular destinations for dog walkers, with its extensive network of trails and designated dog exercise areas. The park's varied terrain provides excellent exercise for dogs of all energy levels.
          </p>
          <p className="text-gray-700 mb-4">
            For those seeking water-based activities, Staunton Country Park offers lakeside walks where dogs can enjoy paddling and swimming. The park's well-maintained paths make it accessible for dogs and owners of all abilities.
          </p>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Seasonal Considerations</h3>
          <p className="text-gray-700 mb-4">
            Berkshire's mild climate makes dog walking enjoyable year-round, but it's important to consider seasonal factors. In summer, early morning or evening walks help avoid the hottest parts of the day. During winter, shorter daylight hours mean planning routes carefully.
          </p>
          <p className="text-gray-700">
            Always check local conditions and be prepared for changing weather. Many of the routes near Slough can become muddy after rain, so appropriate footwear is essential for both you and your dog.
          </p>
        </div>
      </div>
    </div>
  )
}
