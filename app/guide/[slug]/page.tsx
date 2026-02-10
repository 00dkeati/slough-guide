export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { getAreas, getBusinesses, getCategories } from '@/lib/db'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import BusinessCard from '@/components/BusinessCard'
import TopNav from "@/app/(site)/components/TopNav"
import { Metadata } from 'next'

// Define guide content for different slugs
const guideContent: Record<string, {
  title: string
  metaTitle: string
  metaDescription: string
  intro: string
  sections: { heading: string; content: string }[]
  type: 'area' | 'business'
  areaSlug?: string
}> = {
  'purbrook': {
    title: 'Chalvey Area Guide',
    metaTitle: 'Chalvey Guide | Local Services & Businesses',
    metaDescription: 'Complete guide to Chalvey, Berkshire. Find local businesses, services, shops, restaurants, and everything you need in this popular Slough suburb.',
    intro: 'Chalvey is a charming residential suburb located just south of Slough in Berkshire. Known for its excellent schools, green spaces, and strong community spirit, Chalvey offers residents easy access to both urban amenities and countryside walks.',
    sections: [
      {
        heading: 'About Chalvey',
        content: 'Chalvey sits between Slough and Portsmouth, making it an ideal location for commuters. The area features a mix of traditional and modern housing, with Chalvey Heath providing lovely green space for recreation. The local high street offers a selection of independent shops, cafes, and essential services.'
      },
      {
        heading: 'Local Amenities',
        content: 'Residents enjoy excellent local amenities including Chalvey Heath, several well-regarded schools including Chalvey Park School, local convenience stores, takeaways, and professional services. The area is well-connected by bus routes to Slough town centre and Portsmouth.'
      },
      {
        heading: 'Things to Do',
        content: 'Chalvey Heath is perfect for dog walking and family picnics. The area has several pubs and restaurants for dining out, and easy access to Slough\'s shopping facilities. For outdoor enthusiasts, the South Downs National Park is just a short drive away.'
      }
    ],
    type: 'area',
    areaSlug: 'purbrook'
  },
  'widley': {
    title: 'Widley Area Guide',
    metaTitle: 'Widley Guide | Local Services & Businesses',
    metaDescription: 'Complete guide to Widley, Berkshire. Discover local businesses, services, and what makes this quiet village a great place to live near Slough.',
    intro: 'Widley is a small, peaceful village nestled between Slough and Cosham. Despite its compact size, Widley offers residents a quiet, rural feel while remaining conveniently close to major amenities and transport links.',
    sections: [
      {
        heading: 'About Widley',
        content: 'Widley maintains a village atmosphere with its historic church and traditional cottages. The area is primarily residential, appealing to those who prefer a quieter lifestyle while still having easy access to Slough, Cosham, and Portsmouth.'
      },
      {
        heading: 'Local Features',
        content: 'The village is home to St Mary\'s Church, a historic landmark dating back centuries. Widley Walk provides scenic routes for walkers, and the area benefits from good bus connections to surrounding towns. Local residents typically travel to Slough or Cosham for shops and services.'
      },
      {
        heading: 'Getting Around',
        content: 'Widley is well-positioned for commuters, with the A3(M) providing quick access to Portsmouth and beyond. Cosham railway station is nearby for train travel, and regular bus services connect the village to Slough town centre.'
      }
    ],
    type: 'area',
    areaSlug: 'slough' // No specific area data, show Slough businesses
  },
  'cowplain': {
    title: 'Langley Area Guide',
    metaTitle: 'Langley Guide | Local Services & Businesses',
    metaDescription: 'Complete guide to Langley, Berkshire. Find local shops, restaurants, services, and everything you need in this popular Slough suburb.',
    intro: 'Langley is a vibrant suburb located just north of Slough, forming part of the larger Slough urban area. With its own high street, community facilities, and excellent transport links, Langley is a popular choice for families and professionals alike.',
    sections: [
      {
        heading: 'About Langley',
        content: 'Langley has developed from a small village into a thriving suburb with its own distinct character. The area features a mix of housing from different eras, good schools, and a strong sense of community. London Road serves as the main shopping street with a variety of local businesses.'
      },
      {
        heading: 'Shopping & Services',
        content: 'Langley\'s high street offers supermarkets, pharmacies, takeaways, hairdressers, and various professional services. For larger shopping needs, Slough town centre and its retail parks are just minutes away. The area also has several pubs and restaurants for dining out.'
      },
      {
        heading: 'Community & Recreation',
        content: 'Langley Community Centre hosts events and activities for all ages. The area has several parks and green spaces, and is close to the Queen Elizabeth Country Park for outdoor adventures. Local schools include Padnell Infant and Junior Schools, serving families in the area.'
      }
    ],
    type: 'area',
    areaSlug: 'cowplain'
  },
  'slough-wickes': {
    title: 'Wickes Slough Store Guide',
    metaTitle: 'Wickes Slough | DIY & Building Supplies | Store Information',
    metaDescription: 'Everything you need to know about Wickes Slough. Opening hours, location, services, and how to make the most of your visit to this popular DIY store.',
    intro: 'Wickes in Slough is a popular destination for DIY enthusiasts, tradespeople, and homeowners undertaking renovation projects. Located on the Wellington Retail Park, this store offers an extensive range of building materials, kitchens, bathrooms, and garden supplies.',
    sections: [
      {
        heading: 'Store Location',
        content: 'Wickes Slough is situated on the Wellington Retail Park, just off the A3(M). The store benefits from ample free parking and is easily accessible from Slough town centre and surrounding areas including Langley, Chalvey, and Horndean.'
      },
      {
        heading: 'Products & Services',
        content: 'The store stocks everything from timber and sheet materials to plumbing supplies, electrical fittings, paint, and decorating materials. Their kitchen and bathroom showroom displays the latest designs, and staff can help with planning and design consultations.'
      },
      {
        heading: 'Tips for Shoppers',
        content: 'Click and collect services make it easy to order online and pick up in-store. The store offers bulk delivery for larger orders, and trade accounts are available for regular business customers. Check their website for current promotions and offers before visiting.'
      }
    ],
    type: 'business'
  },
  'slough-argos': {
    title: 'Argos Slough Store Guide',
    metaTitle: 'Argos Slough | Click & Collect | Store Information',
    metaDescription: 'Everything you need to know about Argos Slough. Store location, opening hours, click and collect services, and shopping tips.',
    intro: 'Argos in Slough provides convenient access to thousands of products across electronics, home, toys, and more. Whether you prefer to browse the catalogue in-store or use their popular click and collect service, Argos offers flexible shopping options for local residents.',
    sections: [
      {
        heading: 'Store Location',
        content: 'Argos is located within the Slough shopping area, providing easy access for residents of Slough, Langley, Chalvey, and surrounding villages. The store offers parking nearby and is accessible by public transport.'
      },
      {
        heading: 'Click & Collect',
        content: 'One of the most popular features is Argos\'s Fast Track Click & Collect service. Order online, select your collection time, and your items will be ready and waiting. Many items are available for same-day collection, making it perfect for last-minute purchases.'
      },
      {
        heading: 'Product Range',
        content: 'From the latest tech and gaming consoles to furniture, toys, and household essentials, Argos carries a comprehensive range. The store is particularly popular during gift-giving seasons, and their TU clothing range by Sainsbury\'s is also available at selected locations.'
      }
    ],
    type: 'business'
  }
}

interface GuidePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const guide = guideContent[params.slug]
  
  if (!guide) {
    return {
      title: 'Guide Not Found'
    }
  }

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
  }
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = guideContent[params.slug]
  
  if (!guide) {
    notFound()
  }

  // Get businesses and categories for area guides
  let businesses: any[] = []
  let categories: any[] = []
  
  if (guide.type === 'area' && guide.areaSlug) {
    const [businessesData, categoriesData] = await Promise.all([
      getBusinesses(undefined, guide.areaSlug),
      getCategories()
    ])
    businesses = businessesData.slice(0, 6) // Show first 6 businesses
    categories = categoriesData.slice(0, 12) // Show first 12 categories
  }

  return (
    <>
      <TopNav />
      <Breadcrumbs items={[
        { label: 'Guides', href: '/guide' },
        { label: guide.title }
      ]} />

      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {guide.title}
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            {guide.intro}
          </p>
        </header>

        {/* Main content sections */}
        <div className="prose prose-lg max-w-none mb-12">
          {guide.sections.map((section, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                {section.heading}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        {/* Area-specific content */}
        {guide.type === 'area' && (
          <>
            {/* Popular categories */}
            {categories.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Find Services in {guide.title.replace(' Area Guide', '')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/${category.slug}`}
                      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
                    >
                      <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Featured businesses */}
            {businesses.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Popular Businesses Nearby
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {businesses.map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    href="/categories"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Browse All Categories
                  </Link>
                </div>
              </section>
            )}
          </>
        )}

        {/* Business-specific CTA */}
        {guide.type === 'business' && (
          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Looking for Local Alternatives?
            </h2>
            <p className="text-gray-700 mb-4">
              Support local businesses in Slough! Our directory features hundreds of local shops and services.
            </p>
            <Link
              href="/categories"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Local Businesses
            </Link>
          </section>
        )}

        {/* Back to guides */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <Link
            href="/guide"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to All Guides
          </Link>
        </div>
      </article>
    </>
  )
}
