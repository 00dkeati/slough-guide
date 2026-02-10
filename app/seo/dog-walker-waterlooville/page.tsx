import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dog Walker Slough - Professional Dog Walking Services',
  description: 'Find the best professional dog walkers in Slough. Reliable, insured, and experienced dog walking services for your furry friend in Berkshire.',
  keywords: 'dog walker slough, professional dog walking slough, dog walking services hampshire, reliable dog walker slough, insured dog walker slough',
  openGraph: {
    title: 'Dog Walker Slough - Professional Dog Walking Services',
    description: 'Find the best professional dog walkers in Slough. Reliable, insured, and experienced dog walking services for your furry friend in Berkshire.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dog Walker Slough - Professional Dog Walking Services',
    description: 'Find the best professional dog walkers in Slough. Reliable, insured, and experienced dog walking services for your furry friend in Berkshire.',
  },
}

export default function DogWalkerSloughPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6">
              Dog Walker Slough
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-amber-100 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed">
              Find trusted, professional dog walking services in Slough. Experienced walkers who care for your dog as much as you do.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">🛡️ Fully Insured</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">⭐ Experienced</span>
              <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold">💝 Trusted Care</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl sm:text-4xl font-black text-amber-600 mb-2">15+</div>
            <div className="text-lg font-semibold text-gray-700">Professional Walkers</div>
            <div className="text-sm text-gray-500">In Slough Area</div>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl sm:text-4xl font-black text-orange-600 mb-2">5⭐</div>
            <div className="text-lg font-semibold text-gray-700">Average Rating</div>
            <div className="text-sm text-gray-500">From Happy Customers</div>
          </div>
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 text-center">
            <div className="text-3xl sm:text-4xl font-black text-red-600 mb-2">100%</div>
            <div className="text-lg font-semibold text-gray-700">Fully Insured</div>
            <div className="text-sm text-gray-500">Peace of Mind</div>
          </div>
        </div>

        {/* Why Choose Professional Dog Walking */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 text-center">
            🐕 Why Choose a Professional Dog Walker in Slough?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fully Insured & Bonded</h3>
              <p className="text-gray-600">All professional dog walkers are fully insured and bonded, giving you complete peace of mind when your dog is in their care.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reliable & Consistent</h3>
              <p className="text-gray-600">Professional walkers provide consistent, reliable service with regular schedules that fit your dog's needs and your lifestyle.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Experienced & Trained</h3>
              <p className="text-gray-600">Professional walkers have experience with different dog breeds, temperaments, and special needs, ensuring your dog receives expert care.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Local Knowledge</h3>
              <p className="text-gray-600">Local walkers know the best routes, parks, and safe areas around Slough, providing varied and stimulating walks for your dog.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Regular Updates</h3>
              <p className="text-gray-600">Most professional walkers provide photos and updates from your dog's walk, keeping you connected and informed.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Emergency Prepared</h3>
              <p className="text-gray-600">Professional walkers are trained in pet first aid and know local veterinary contacts, ensuring your dog's safety at all times.</p>
            </div>
          </div>
        </div>

        {/* Types of Dog Walking Services */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 text-center">
            🚶‍♀️ Dog Walking Services Available in Slough
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Solo Walks */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&q=80"
                  alt="Solo dog walking service"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Solo Walks</h3>
                <p className="text-gray-600 mb-4">One-on-one attention for dogs who prefer individual walks or need special care. Perfect for nervous dogs, puppies, or senior dogs.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Individual attention</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Customized pace</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Special needs</span>
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Duration:</strong> 30-60 minutes<br/>
                  <strong>Best for:</strong> Nervous dogs, puppies, seniors<br/>
                  <strong>Price range:</strong> £15-25 per walk
                </div>
              </div>
            </div>

            {/* Group Walks */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&q=80"
                  alt="Group dog walking service"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Group Walks</h3>
                <p className="text-gray-600 mb-4">Social walks with other friendly dogs. Great for socialization, exercise, and making new furry friends while exploring local areas.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Socialization</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Cost effective</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Fun & energetic</span>
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Duration:</strong> 45-90 minutes<br/>
                  <strong>Group size:</strong> 3-6 dogs maximum<br/>
                  <strong>Price range:</strong> £10-18 per walk
                </div>
              </div>
            </div>

            {/* Puppy Visits */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop&q=80"
                  alt="Puppy visiting service"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Puppy Visits</h3>
                <p className="text-gray-600 mb-4">Specialized care for puppies including short walks, playtime, feeding, and toilet breaks. Perfect for young dogs who need frequent attention.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Puppy specialist</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Multiple visits</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Training support</span>
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Duration:</strong> 30-45 minutes<br/>
                  <strong>Frequency:</strong> 2-4 times daily<br/>
                  <strong>Price range:</strong> £12-20 per visit
                </div>
              </div>
            </div>

            {/* Holiday Care */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&q=80"
                  alt="Holiday dog care service"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Holiday Care</h3>
                <p className="text-gray-600 mb-4">Extended care services including multiple daily walks, feeding, medication, and companionship while you're away on holiday or business.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Extended care</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Home stays</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Peace of mind</span>
                </div>
                <div className="text-sm text-gray-500">
                  <strong>Duration:</strong> 1 day to 2 weeks<br/>
                  <strong>Services:</strong> Walks, feeding, medication<br/>
                  <strong>Price range:</strong> £40-80 per day
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Choose the Right Dog Walker */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🎯 How to Choose the Right Dog Walker in Slough
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Questions to Ask</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Are you fully insured and bonded?
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  What experience do you have with my dog's breed?
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Can you provide references from other clients?
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  What happens in case of emergency?
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Do you provide updates during walks?
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">What to Look For</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Genuine love and understanding of dogs
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Professional communication and reliability
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Knowledge of local walking areas
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Flexibility to accommodate your schedule
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2">•</span>
                  Competitive pricing and clear policies
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Find Dog Walkers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            🔍 Find Professional Dog Walkers in Slough
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Search Online</h3>
              <p className="text-gray-600 mb-4">Use our directory to find local dog walkers with reviews and ratings</p>
              <Link href="/search?q=dog+walker" className="text-amber-600 hover:text-amber-800 font-medium">
                Search Now →
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ask Locals</h3>
              <p className="text-gray-600 mb-4">Check with other dog owners at local parks and vet clinics</p>
              <Link href="/areas" className="text-amber-600 hover:text-amber-800 font-medium">
                Find Areas →
              </Link>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-lg text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Vet Recommendations</h3>
              <p className="text-gray-600 mb-4">Ask your local veterinary practice for trusted walker recommendations</p>
              <Link href="/search?q=veterinary" className="text-amber-600 hover:text-amber-800 font-medium">
                Find Vets →
              </Link>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="prose prose-lg max-w-none bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Professional Dog Walking Services in Slough
          </h2>
          <p className="text-gray-700 mb-4">
            Finding a reliable dog walker in Slough is essential for busy pet owners who want to ensure their dogs receive regular exercise and companionship. The local area offers numerous professional dog walking services, each with their own specialities and approaches to canine care.
          </p>
          <p className="text-gray-700 mb-4">
            Professional dog walkers in Slough understand the importance of regular exercise for dogs' physical and mental wellbeing. They provide structured walks that cater to different dog breeds, ages, and energy levels, ensuring each dog receives appropriate exercise and stimulation.
          </p>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Benefits of Professional Dog Walking</h3>
          <p className="text-gray-700 mb-4">
            Professional dog walkers offer more than just exercise; they provide socialization opportunities, mental stimulation, and consistent routine that dogs thrive on. Many walkers are trained in canine behavior and can identify and address behavioral issues during walks.
          </p>
          <p className="text-gray-700 mb-4">
            The convenience factor cannot be overstated. Professional walkers handle everything from pick-up to drop-off, providing updates and photos so owners can see their dogs enjoying their time outdoors. This service is particularly valuable for working professionals and elderly dog owners.
          </p>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Local Walking Areas</h3>
          <p className="text-gray-700 mb-4">
            Slough's location provides access to excellent walking areas including Queen Elizabeth Country Park, local recreation grounds, and numerous footpaths through Berkshire's countryside. Professional walkers know these areas well and can vary routes to keep walks interesting for dogs.
          </p>
          <p className="text-gray-700">
            When choosing a dog walker, consider their knowledge of local areas, their approach to safety, and their ability to match your dog's personality and needs. A good relationship between your dog and their walker is essential for a successful service.
          </p>
        </div>
      </div>
    </div>
  )
}
