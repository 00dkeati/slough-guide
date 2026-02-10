export const dynamic = 'force-dynamic'
import { getAreas } from '@/lib/db'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import TopNav from "@/app/(site)/components/TopNav"
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Areas We Cover',
  description: 'Browse all areas covered by our directory, including Slough, Langley, Cippenham, and more.',
}

export default async function AreasPage() {
  const areas = await getAreas()

  return (
    <>
      <TopNav />
      <Breadcrumbs items={[
        { label: 'Areas' }
      ]} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Areas We Cover
          </h1>
          <p className="text-xl text-gray-700">
            Discover local businesses in Slough and all surrounding areas
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <Link
              key={area.id}
              href={`/area/${area.slug}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow group"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {area.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {area.description || `Find local businesses serving ${area.name} and surrounding areas.`}
              </p>
              <div className="text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                Browse {area.name} →
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">About Our Coverage</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Our directory covers Slough and all surrounding areas in Berkshire. 
            Whether you're in the town center or in one of the nearby villages, 
            you'll find local businesses that serve your area with professional, 
            reliable service.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Each area in our directory has been carefully researched to ensure we include the best local businesses and services. From the bustling town center of Slough to the quieter residential areas like Langley, Cippenham, and Chalvey, our comprehensive coverage means you can find what you need close to home.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We regularly update our listings to include new businesses and remove those that no longer meet our quality standards. Our goal is to provide you with the most current and reliable information about local services in your area.
          </p>
        </div>

        <div className="mt-8 bg-white border border-gray-200 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Local Businesses?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Community Support</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Supporting local businesses helps strengthen the community and keeps money circulating locally, benefiting everyone in the area.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Personal Service</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Local businesses often provide more personalized service and have a better understanding of the specific needs of the area.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Local Knowledge</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Local businesses understand the area's unique characteristics and can provide more relevant advice and services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Quick Response</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                Being nearby means faster response times and easier communication for ongoing projects or service needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

