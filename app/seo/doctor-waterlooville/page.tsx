
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Doctor Slough',
  description: 'One of the prominent healthcare providers in the area is the Vine Medical Group, an NHS GP Practice known for its patient-focused approach and diverse range of ...',
  keywords: 'doctor slough, Slough, Berkshire, local guide, doctor slough in Slough',
  openGraph: {
    title: 'Doctor Slough',
    description: 'One of the prominent healthcare providers in the area is the Vine Medical Group, an NHS GP Practice known for its patient-focused approach and diverse range of ...',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doctor Slough',
    description: 'One of the prominent healthcare providers in the area is the Vine Medical Group, an NHS GP Practice known for its patient-focused approach and diverse range of ...',
  },
}

export default function DoctorsloughPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Doctor Slough
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          One of the prominent healthcare providers in the area is the Vine Medical Group, an NHS GP Practice known for its patient-focused approach and diverse range of ...
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=400&fit=crop"
              alt="doctor slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop"
              alt="doctor slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Doctor Slough</h1></p><p><strong>Target Keyword:</strong> doctor slough</p><h1>Finding a Doctor in Slough: Your Guide to Local GP Services</h1></p><p>For residents of Slough, accessing reliable and high-quality healthcare is a top priority. When searching for a "doctor Slough", it's essential to understand the local General Practitioner (GP) services available to meet your medical needs. Slough is served by several dedicated medical practices, committed to providing comprehensive care to the community.</p><h2>Vine Medical Group: Comprehensive Care in Slough</h2></p><p>One of the prominent healthcare providers in the area is the Vine Medical Group, an NHS GP Practice known for its patient-focused approach and diverse range of services [1]. They operate from multiple sites, including their main Forest End Site located at Forest End, Slough, Berkshire, SL1 7AH [1]. Vine Medical Group offers a broad spectrum of services designed to support the health and wellbeing of its patients. These include managing referrals, offering non-NHS services, and providing specialized support for conditions such as adult frailty, cancer, long-term conditions, and menopause. They also provide crucial resources for mental health wellbeing and new parents, alongside general wellbeing support. The practice is recognized as both an Armed Forces Veteran Friendly and a Learning Disability Friendly GP Practice, highlighting their commitment to inclusive care. They also serve as a teaching practice [1].</p><p>Booking appointments with Vine Medical Group is designed to be accessible. Patients can make, change, or cancel appointments directly. Furthermore, the practice utilizes an online consultation service and offers a convenient Self-Service Surgery Pod at their Stakes Lodge and Forest End surgeries for quick and efficient health checks. For general inquiries, the Vine Medical Group can be reached at 023 9226 3089 [1]. They also facilitate repeat prescriptions, fit (sick) notes, and test results, streamlining essential patient services.</p><h2>Slough Health Centre: A Key Local Facility</h2></p><p>Another vital healthcare facility in the area is the Slough Health Centre, situated at Dryden Close, Slough, Berkshire, SL1 6AL [2]. This centre plays a crucial role in providing local health services, with information supplied by Portsmouth Hospitals NHS Trust [2]. While specific service details for Slough Health Centre were not extensively detailed on its direct NHS page, its presence signifies another important point of access for medical care within the community.</p><h2>General Guidance for Healthcare Access</h2></p><p>For urgent medical advice when your GP practice is closed or for non-life-threatening concerns, residents are encouraged to visit 111.nhs.uk or call 111. In the event of a life-threatening emergency, always call 999 immediately. These services ensure that residents of Slough have access to appropriate medical assistance around the clock.</p><h2>Conclusion</h2></p><p>Slough is well-equipped with dedicated medical professionals and facilities to cater to the healthcare needs of its residents. Whether you are seeking comprehensive GP services from the Vine Medical Group or utilizing the facilities at Slough Health Centre, understanding your local options is the first step towards maintaining good health. Explore these resources to find the "doctor Slough" that best suits your requirements and ensure you receive the care you need.</p><h2>References</h2></p><p>[1] Vine Medical Group. (n.d.). <em>Vine Medical Group - NHS GP Practice in Slough, Berkshire</em>. Retrieved from https://www.vinemedicalgroup.co.uk/
<p>[2] NHS. (n.d.). <em>Slough Health Centre - NHS</em>. Retrieved from https://www.nhs.uk/services/clinic/slough-health-centre/RHU13` }} />
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
        <p className="font-bold">Looking for doctor slough services?</p>
        <p>Browse our directory of local businesses offering doctor slough in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=doctor%20slough" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
