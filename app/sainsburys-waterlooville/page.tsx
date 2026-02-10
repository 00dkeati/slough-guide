import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import TopNav from '../(site)/components/TopNav'

export const metadata: Metadata = {
  title: 'Sainsbury\'s Slough: Your Guide to Shopping, Groceries & More | 2025',
  description: 'Planning a trip to Sainsbury\'s in Slough? Get opening times, store information, in-store services like Argos, and local shopping tips for the Hambledon Road superstore.',
  keywords: 'Sainsbury\'s Slough, supermarket Slough, grocery shopping SL1, Hambledon Road, Argos Slough',
  openGraph: {
    title: 'Sainsbury\'s Slough: Your Guide to Shopping, Groceries & More',
    description: 'Everything you need to know about the Slough Sainsbury\'s superstore - opening hours, services, and local shopping tips.',
    type: 'website',
    url: 'https://www.slough.co/sainsburys-slough',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sainsbury\'s Slough: Your Guide to Shopping, Groceries & More',
    description: 'Everything you need to know about the Slough Sainsbury\'s superstore - opening hours, services, and local shopping tips.',
  },
}

export default function SainsburysPage() {
  return (
    <>
      <TopNav />
      <main className="pt-20 lg:pt-24">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li><Link href="/" className="hover:text-green-600">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">Sainsbury's Slough</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight text-balance">
              Your Essential Guide to the Slough Sainsbury's Superstore
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl">
              For many residents of Slough, the local Sainsbury's is more than just a supermarket; it's a central hub for weekly shops, household essentials, and even a quick coffee break.
            </p>
          </div>

          {/* Introduction */}
          <section className="mb-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                The <strong>Slough Sainsbury's</strong> superstore, conveniently located on Hambledon Road, serves as a cornerstone of the local community, offering a vast range of products and services that cater to the diverse needs of the town. Whether you're planning a big family grocery haul, looking for inspiration for tonight's dinner, or need to pick up a last-minute gift, this store is a one-stop-shop.
              </p>
            </div>
          </section>

          {/* Store Overview */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">More Than Just Groceries at Your Local Sainsbury's</h2>
            
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  The modern supermarket has evolved far beyond just selling food, and the <strong>Slough Sainsbury's</strong> is a prime example. This large superstore offers an extensive selection of fresh produce, baked goods, and international foods, but its offerings don't stop there.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Inside, you'll find a Tu clothing department with fashion for the whole family, a homeware section with stylish and affordable items for every room, and a well-stocked health and beauty aisle. One of the most convenient features is the in-store Argos, allowing you to click and collect a huge range of products, from toys to technology, while you do your grocery shopping.
                </p>
              </div>
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Store Highlights</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    <span className="text-gray-700">Large superstore with extensive product range</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    <span className="text-gray-700">In-store Argos Click & Collect</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    <span className="text-gray-700">Tu clothing department</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    <span className="text-gray-700">Sainsbury's Café for refreshments</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                    <span className="text-gray-700">On-site petrol station</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Store Details */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Store Details & Facilities</h2>
            
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden">
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Essential Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-900">Address:</span>
                        <span className="text-gray-700 ml-2">Hambledon Road, Slough, Berkshire, SL1 7UL</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Opening Hours:</span>
                        <span className="text-gray-700 ml-2">8am - 10pm Monday to Saturday, 10am - 4pm Sundays</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Parking:</span>
                        <span className="text-gray-700 ml-2">Ample free parking available</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">In-Store Services</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                        <span className="text-gray-700">Argos Click & Collect</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                        <span className="text-gray-700">Sainsbury's Café</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                        <span className="text-gray-700">Tu Clothing Department</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                        <span className="text-gray-700">Homeware Section</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                        <span className="text-gray-700">Petrol Station</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Local Context */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">A Hub for Slough and Beyond</h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                The <strong>Slough Sainsbury's</strong> is not just a resource for the immediate town; its large size and extensive range of services attract shoppers from all the surrounding areas. It's a regular destination for people living in <strong>Horndean</strong>, <strong>Chalvey</strong>, <strong>Langley</strong>, and even further afield.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For many, it represents the 'big shop' of the week, where they can get everything they need under one roof. Its location on a major road makes it easily accessible, and the ample parking is a significant draw for those travelling by car. This central role in the local shopping landscape makes the <strong>Sainsbury's in Slough</strong> a vital part of the region's infrastructure, supporting the daily lives of thousands of local residents.
              </p>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is there a petrol station at the Slough Sainsbury's?</h3>
                <p className="text-gray-700">Yes, there is a petrol station on-site, making it easy to fill up your car while you're out for your shopping.</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I collect my Argos order at this store?</h3>
                <p className="text-gray-700">Absolutely. The Slough Sainsbury's has an Argos collection point inside, which is perfect for picking up your orders conveniently.</p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Does the store have facilities for disabled customers?</h3>
                <p className="text-gray-700">Yes, the store is equipped with accessible parking, toilets, and is designed to be easy to navigate for customers with mobility needs.</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="mb-12">
            <div className="bg-green-600 rounded-2xl p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Plan Your Visit Today</h2>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Whether you need to stock up on essentials, browse the latest fashion from Tu, or pick up an order from Argos, the Slough Sainsbury's is ready to welcome you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://www.sainsburys.co.uk/store-locator/store/slough-hambledon-road"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  View Store Details
                </a>
                <Link 
                  href="/contact"
                  className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                >
                  Get Directions
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Sainsbury's Slough: Your Guide to Shopping, Groceries & More",
            "description": "Everything you need to know about the Slough Sainsbury's superstore - opening hours, services, and local shopping tips.",
            "url": "https://www.slough.co/sainsburys-slough",
            "mainEntity": {
              "@type": "Store",
              "name": "Sainsbury's Slough",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Hambledon Road",
                "addressLocality": "Slough",
                "addressRegion": "Berkshire",
                "postalCode": "SL1 7UL",
                "addressCountry": "GB"
              },
              "openingHours": [
                "Mo-Sa 08:00-22:00",
                "Su 10:00-16:00"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Sainsbury's Services",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Grocery Shopping"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Argos Click & Collect"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Tu Clothing"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Petrol Station"
                    }
                  }
                ]
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://www.slough.co"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Sainsbury's Slough",
                  "item": "https://www.slough.co/sainsburys-slough"
                }
              ]
            },
            "faq": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Is there a petrol station at the Slough Sainsbury's?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, there is a petrol station on-site, making it easy to fill up your car while you're out for your shopping."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I collect my Argos order at this store?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. The Slough Sainsbury's has an Argos collection point inside, which is perfect for picking up your orders conveniently."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does the store have facilities for disabled customers?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, the store is equipped with accessible parking, toilets, and is designed to be easy to navigate for customers with mobility needs."
                  }
                }
              ]
            }
          })
        }}
      />
    </>
  )
}
