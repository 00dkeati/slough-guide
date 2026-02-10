import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Walks with Water for Dogs Near Me - Slough Area',
  description: 'Find the best walks with water for dogs near Slough. Discover riverside trails, lakeside paths, and beach walks perfect for water-loving dogs in Berkshire.',
  keywords: 'walks with water for dogs near me, dog walks with water slough, riverside dog walks hampshire, lake walks for dogs, beach walks dogs slough',
  openGraph: {
    title: 'Walks with Water for Dogs Near Me - Slough Area',
    description: 'Find the best walks with water for dogs near Slough. Discover riverside trails, lakeside paths, and beach walks perfect for water-loving dogs in Berkshire.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Walks with Water for Dogs Near Me - Slough Area',
    description: 'Find the best walks with water for dogs near Slough. Discover riverside trails, lakeside paths, and beach walks perfect for water-loving dogs in Berkshire.',
  },
}

export default function WalksWithWaterForDogsNearMePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
              Walks with Water for Dogs Near Me
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover the best water-based walking routes near Slough. Perfect for dogs who love swimming, paddling, and splashing around in streams and lakes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">🏊 Swimming Spots</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">🌊 Riverside Walks</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">🏖️ Beach Access</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">8+</div>
            <div className="text-lg font-semibold text-gray-700">Water-Based Routes</div>
            <div className="text-sm text-gray-500">Within 30 minutes</div>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl sm:text-4xl font-black text-cyan-600 mb-2">3</div>
            <div className="text-lg font-semibold text-gray-700">Dog-Friendly Beaches</div>
            <div className="text-sm text-gray-500">South Coast Access</div>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl sm:text-4xl font-black text-teal-600 mb-2">5+</div>
            <div className="text-lg font-semibold text-gray-700">Lakes & Rivers</div>
            <div className="text-sm text-gray-500">Perfect for Swimming</div>
          </div>
        </div>

        {/* Top Water-Based Walks */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 text-center">
            🌊 Best Water Walks for Dogs Near Slough
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Chichester Harbour */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&q=80"
                  alt="Chichester Harbour dog walking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Chichester Harbour</h3>
                <p className="text-gray-600 mb-4">Extensive coastal walks with plenty of opportunities for dogs to paddle and swim. Mudflats and shallow waters perfect for water-loving dogs.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Tidal areas</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Mudflats</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Parking available</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <strong>Distance from Slough:</strong> 25 minutes drive<br/>
                  <strong>Route length:</strong> 2-6 miles available<br/>
                  <strong>Best time:</strong> Low tide for mudflat access
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800"><strong>💡 Tip:</strong> Check tide times before visiting for the best experience</p>
                </div>
              </div>
            </div>

            {/* Staunton Country Park Lakes */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80"
                  alt="Staunton Country Park lakes"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Staunton Country Park Lakes</h3>
                <p className="text-gray-600 mb-4">Beautiful lakeside walks with designated areas where dogs can swim. Clear, shallow waters perfect for dogs who love water activities.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Swimming allowed</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Shallow areas</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Café facilities</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <strong>Distance from Slough:</strong> 20 minutes drive<br/>
                  <strong>Route length:</strong> 1-3 mile loops<br/>
                  <strong>Entry fee:</strong> Small charge applies
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800"><strong>🐕 Perfect for:</strong> Dogs who love swimming and water play</p>
                </div>
              </div>
            </div>

            {/* River Hamble */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&q=80"
                  alt="River Hamble dog walking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">River Hamble</h3>
                <p className="text-gray-600 mb-4">Picturesque riverside walks with opportunities for dogs to paddle in the shallows. Beautiful scenery and peaceful walking paths.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Riverside paths</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Shallow paddling</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Historic area</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <strong>Distance from Slough:</strong> 30 minutes drive<br/>
                  <strong>Route length:</strong> 2-4 miles available<br/>
                  <strong>Terrain:</strong> Mix of paths and tracks
                </div>
                <div className="bg-cyan-50 p-3 rounded-lg">
                  <p className="text-sm text-cyan-800"><strong>🌊 Water access:</strong> Gentle slopes for easy water entry</p>
                </div>
              </div>
            </div>

            {/* Southsea Beach */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&q=80"
                  alt="Southsea Beach dog walking"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Southsea Beach</h3>
                <p className="text-gray-600 mb-4">Dog-friendly beach area with designated zones for year-round dog access. Great for dogs who love sand, sea, and swimming.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Beach access</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Year-round dogs</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Parking nearby</span>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  <strong>Distance from Slough:</strong> 35 minutes drive<br/>
                  <strong>Route length:</strong> 1-3 miles along beach<br/>
                  <strong>Restrictions:</strong> Some seasonal limits
                </div>
                <div className="bg-teal-50 p-3 rounded-lg">
                  <p className="text-sm text-teal-800"><strong>🏖️ Beach fun:</strong> Perfect for dogs who love sand and sea</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Water Safety Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🚨 Water Safety Tips for Dogs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Before Entering Water</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Check water quality and depth
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Ensure your dog can swim confidently
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Watch for strong currents or tides
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Check for sharp objects or debris
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">During Water Activities</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Stay close to your dog at all times
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Watch for signs of tiredness
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Rinse saltwater off after beach visits
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  Dry ears thoroughly to prevent infection
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seasonal Water Walks */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🌅 Seasonal Water Walks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">🌸</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Spring</h3>
              <p className="text-gray-600 mb-4">Perfect time for riverside walks as water levels are high</p>
              <div className="text-sm text-gray-500">March - May</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">☀️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Summer</h3>
              <p className="text-gray-600 mb-4">Best time for beach walks and lake swimming</p>
              <div className="text-sm text-gray-500">June - August</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">🍂</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Autumn</h3>
              <p className="text-gray-600 mb-4">Beautiful colors and cooler water temperatures</p>
              <div className="text-sm text-gray-500">September - November</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">❄️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Winter</h3>
              <p className="text-gray-600 mb-4">Shorter walks with paddling in sheltered areas</p>
              <div className="text-sm text-gray-500">December - February</div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-lg max-w-none bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Walks with Water for Dogs Near Slough: A Complete Guide
          </h2>
          <p className="text-gray-700 mb-4">
            Berkshire's diverse landscape offers numerous opportunities for water-based dog walks near Slough. From tranquil riverside paths to exciting coastal adventures, there's something for every water-loving dog.
          </p>
          <p className="text-gray-700 mb-4">
            The proximity to the South Coast means beach walks are easily accessible, while inland lakes and rivers provide year-round water activities. Each location offers unique experiences, from gentle paddling to full swimming adventures.
          </p>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Best Water Features for Dogs</h3>
          <p className="text-gray-700 mb-4">
            Chichester Harbour stands out as one of the best destinations for dogs who love water. The extensive mudflats and shallow waters provide safe areas for dogs to explore, while the changing tides offer variety in each visit.
          </p>
          <p className="text-gray-700 mb-4">
            For controlled water environments, Staunton Country Park's lakes offer the perfect balance of safety and fun. The designated swimming areas ensure dogs can enjoy water play in a supervised setting.
          </p>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Planning Your Water Walk</h3>
          <p className="text-gray-700 mb-4">
            Timing is crucial for water-based walks. Checking tide times for coastal areas and weather conditions for all locations ensures the best experience for both you and your dog. Early morning visits often provide the most peaceful conditions.
          </p>
          <p className="text-gray-700">
            Always bring towels, fresh water for drinking, and consider your dog's swimming ability when choosing locations. Some dogs are natural swimmers, while others prefer shallow paddling areas. Respect your dog's comfort level and never force water activities.
          </p>
        </div>
      </div>
    </div>
  )
}
