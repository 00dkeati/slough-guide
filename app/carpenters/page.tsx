import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessCard from '@/components/BusinessCard'
import FAQ from '@/components/FAQ'
import { getBusinesses } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Best Carpenters & Joiners in Slough | Expert Woodwork Services',
  description: 'Find the top-rated carpenters and joiners in Slough. Expert craftsmen with perfect ratings, specializing in bespoke furniture, kitchens, staircases, and extensions.',
  keywords: 'carpenters slough, joiners slough, bespoke furniture slough, kitchen fitters slough, staircase specialists slough, loft conversions slough, door hanging slough, woodwork slough',
  openGraph: {
    title: 'Best Carpenters & Joiners in Slough | Expert Woodwork Services',
    description: 'Find the top-rated carpenters and joiners in Slough. Expert craftsmen with perfect ratings, specializing in bespoke furniture, kitchens, staircases, and extensions.',
    url: 'https://slough.co/carpenters',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

async function getCarpenters() {
  try {
    const allBusinesses = await getBusinesses()
    return allBusinesses.filter(business => 
      business.category === 'carpenters'
    ).sort((a, b) => {
      // Sort by rating (descending), then by review count (descending)
      if (b.rating !== a.rating) return b.rating - a.rating
      return b.review_count - a.review_count
    })
  } catch (error) {
    return []
  }
}

export default async function CarpentersPage() {
  const carpenters = await getCarpenters()
  const featuredCarpenters = carpenters.filter(business => business.featured)
  const otherCarpenters = carpenters.filter(business => !business.featured)

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Carpenters & Joiners' }
  ]

  const faqs = [
    {
      question: "What are the best carpenters in Slough?",
      answer: "Our directory features the top-rated carpenters in Slough, including J Helm Property Maintenance (10.0/10, 243 reviews), McLean Carpentry (9.97/10, 231 reviews), and Lee Heppenstall Carpentry (10.0/10, 211 reviews). All have decades of experience and perfect track records."
    },
    {
      question: "Which carpenter should I choose for bespoke furniture?",
      answer: "For bespoke furniture and custom joinery, Lee Heppenstall Carpentry is the top choice. With a perfect 10.0/10 rating and described as 'a real craftsman' with 'attention to detail second to none', he specializes in custom wardrobes, window seats, and made-to-measure kitchens."
    },
    {
      question: "Who should I use for major projects like extensions?",
      answer: "McLean Carpentry is the recommended specialist for major projects. With 36+ years experience and a 9.97/10 rating, they specialize in extensions, loft conversions, and large-scale renovations. They're local to Slough and have extensive experience in structural work."
    },
    {
      question: "Which carpenter offers the best value for money?",
      answer: "Coombs Carpentry offers excellent value with a perfect 10.0/10 rating and consistently praised for 'reasonable prices' and 'great value for money'. They handle everything from small repairs to major structural work with transparent pricing."
    },
    {
      question: "Are these carpenters verified and reliable?",
      answer: "Yes, all carpenters in our directory are verified professionals with extensive track records. The top-rated carpenters have hundreds of verified reviews on Checkatrade, decades of experience, and perfect or near-perfect ratings. They're all fully insured and qualified tradespeople."
    }
  ]

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Best Carpenters & Joiners in Slough
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Discover Slough's most skilled craftsmen. From bespoke furniture to major extensions, 
            our verified carpenters deliver exceptional quality with perfect ratings and decades of experience.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Perfect 10.0/10 Ratings
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              1,000+ Verified Reviews
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              30+ Years Experience
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Fully Insured & Qualified
            </span>
          </div>
        </header>

        {/* Top Tier Carpenters */}
        {featuredCarpenters.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ⭐ Top-Tier Carpenters (Perfect Ratings)
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                These exceptional craftsmen have achieved perfect or near-perfect ratings across hundreds of verified reviews, 
                representing the absolute best carpentry services in Slough.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {featuredCarpenters.map((carpenter) => (
                <div key={carpenter.id} className="relative">
                  <BusinessCard business={carpenter} />
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    ⭐ Featured
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Carpenters */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Verified Carpenters & Joiners
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complete directory of professional carpenters serving Slough and surrounding areas. 
              Each has been verified for quality, reliability, and customer satisfaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carpenters.map((carpenter) => (
              <BusinessCard key={carpenter.id} business={carpenter} />
            ))}
          </div>
        </section>

        {/* Specialization Guide */}
        <section className="mb-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Choose the Right Carpenter for Your Project
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏠</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Bespoke Furniture</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Custom wardrobes, window seats, media walls, and made-to-measure furniture.
              </p>
              <div className="text-sm text-blue-600 font-semibold">
                Best Choice: Lee Heppenstall Carpentry
              </div>
              <div className="text-xs text-gray-500 mt-1">
                10.0/10 • "Real craftsman" • 211 reviews
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏗️</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Major Projects</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Extensions, loft conversions, barn conversions, and structural work.
              </p>
              <div className="text-sm text-green-600 font-semibold">
                Best Choice: McLean Carpentry
              </div>
              <div className="text-xs text-gray-500 mt-1">
                9.97/10 • Local • 36+ years experience
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔧</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">General Work</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Door hanging, flooring, repairs, and general carpentry services.
              </p>
              <div className="text-sm text-purple-600 font-semibold">
                Best Choice: J Helm Property Maintenance
              </div>
              <div className="text-xs text-gray-500 mt-1">
                10.0/10 • 38+ years • 243 reviews
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kitchen Installation</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Fitted kitchens, kitchen refurbishments, and complete installations.
              </p>
              <div className="text-sm text-orange-600 font-semibold">
                Best Choice: S L Turner Carpentry
              </div>
              <div className="text-xs text-gray-500 mt-1">
                9.90/10 • Kitchen specialist • 272 reviews
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🪜</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Staircases</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Bespoke staircases, refurbishments, and custom designs.
              </p>
              <div className="text-sm text-red-600 font-semibold">
                Best Choice: S L Turner Carpentry
              </div>
              <div className="text-xs text-gray-500 mt-1">
                9.90/10 • Staircase specialist • 30+ years
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Best Value</h3>
              </div>
              <p className="text-gray-600 mb-4">
                High-quality work at reasonable prices with transparent costing.
              </p>
              <div className="text-sm text-yellow-600 font-semibold">
                Best Choice: Coombs Carpentry
              </div>
              <div className="text-xs text-gray-500 mt-1">
                10.0/10 • Great value • 35 years experience
              </div>
            </div>
          </div>
        </section>

        {/* Quality Indicators */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Our Carpenters Are the Best
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">10.0</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Perfect Ratings</div>
              <div className="text-sm text-gray-600">Multiple carpenters with flawless 10.0/10 scores</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">1,000+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Verified Reviews</div>
              <div className="text-sm text-gray-600">Combined reviews across all platforms</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">30+</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Years Experience</div>
              <div className="text-sm text-gray-600">Decades of proven craftsmanship</div>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">100%</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">Insured & Qualified</div>
              <div className="text-sm text-gray-600">Fully licensed and protected</div>
            </div>
          </div>
        </section>

        {/* Local Insights */}
        <section className="mb-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Slough Carpentry Excellence
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Slough has become a hub for exceptional carpentry services, attracting skilled craftsmen 
              who have built outstanding reputations over decades. Our top-rated carpenters consistently deliver 
              work that exceeds expectations, earning perfect ratings and hundreds of glowing reviews.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">What Makes Them Special</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Exceptional attention to detail and craftsmanship</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Perfect communication and project management</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Reliable, punctual, and professional service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Clean, tidy work with thorough cleanup</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Competitive pricing with transparent costs</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Services Available</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Bespoke furniture and fitted wardrobes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Kitchen installations and refurbishments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Custom staircases and balustrades</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Extensions and loft conversions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>Door hanging and general carpentry</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <FAQ faqs={faqs} />
        </section>

        {/* Call to Action */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Carpentry Project?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Contact our top-rated carpenters today for a free quote and consultation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Free Quotes
            </Link>
            <Link 
              href="/search" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Search All Services
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
