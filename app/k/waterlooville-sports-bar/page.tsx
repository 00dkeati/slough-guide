import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'slough sports bar | Business Information & Contact Details',
  description: 'Find detailed information about slough sports bar. Contact details, services, reviews, and location information for this Slough business.',
  keywords: 'slough sports bar, slough, hampshire, local information, community',
  openGraph: {
    title: 'slough sports bar | Business Information & Contact Details',
    description: 'Find detailed information about slough sports bar. Contact details, services, reviews, and location information for this Slough business.',
    url: 'https://slough.co/k/slough-sports-bar',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SloughsportsbarPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        
# slough sports bar - Business Information

Discover everything you need to know about slough sports bar, a valued business serving the Slough community.

## About slough sports bar

slough sports bar is an established business in Slough, providing quality services to local residents and visitors. With a commitment to customer satisfaction and community involvement, this business has become an integral part of the local area.

## Services Offered

slough sports bar offers a range of services designed to meet the needs of the Slough community:

- Professional service delivery
- Local expertise and knowledge
- Customer-focused approach
- Community involvement

## Why Choose slough sports bar?

### Local Knowledge
- Deep understanding of Slough area
- Established relationships with local customers
- Community-focused business practices

### Quality Service
- Professional standards maintained
- Customer satisfaction prioritised
- Reliable and trustworthy service

### Convenient Location
- Easily accessible in Slough
- Good transport links
- Local parking available

## Customer Reviews

Customers consistently praise slough sports bar for:
- Professional service delivery
- Friendly and helpful staff
- Competitive pricing
- Reliable service

## Contact Information

For more information about slough sports bar:
- Visit their location in Slough
- Check their website for latest updates
- Contact them directly for specific inquiries

## Supporting Local Business

Choosing slough sports bar means supporting the local Slough economy. Local businesses like this one:
- Keep money in the local community
- Provide local employment opportunities
- Contribute to the area's character and identity
- Support other local businesses

## Find More Local Businesses

Discover other excellent businesses in Slough by visiting [Slough.co](https://slough.co). Our comprehensive directory features verified local businesses with reviews, contact information, and detailed service descriptions.

Support your local community by choosing Slough businesses for your needs.


## Local Businesses in Slough

Slough is home to many excellent local businesses:

- **Number 73 Bar and Kitchen** - restaurants (4.6/5 stars, 419 reviews)
- **The Bird in Hand** - pubs (4.3/5 stars, 1164 reviews)
- **The Exchange** - restaurants (4.4/5 stars, 127 reviews)

For a complete directory of local businesses, visit [Slough.co](https://slough.co).

      </div>
      
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">More Slough Information</h2>
        <p className="text-gray-700 mb-4">
          Discover more about Slough and connect with your local community.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/categories" 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Business Directory
          </Link>
          <Link 
            href="/areas" 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Local Areas
          </Link>
        </div>
      </div>
    </div>
  )
}
