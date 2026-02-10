
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Dentists in Slough - NHS & Private Dental Care',
  description: 'Find trusted dentists in Slough offering NHS and private dental care. Compare practices, read reviews, and book appointments for general and cosmetic dentistry.',
  keywords: 'dentist slough, NHS dentist slough, private dentist slough, dental practice slough, cosmetic dentist slough',
  openGraph: {
    title: 'Best Dentists in Slough - NHS & Private Dental Care',
    description: 'Find trusted dentists in Slough offering NHS and private dental care. Compare practices, read reviews, and book appointments for general and cosmetic dentistry.',
    type: 'article',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Dentists in Slough - NHS & Private Dental Care',
    description: 'Find trusted dentists in Slough offering NHS and private dental care. Compare practices, read reviews, and book appointments for general and cosmetic dentistry.',
  },
}

export default function DentistsloughPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Dentist Slough
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Discover the best services and information in Slough, Berkshire.
        </p>
        
        {/* Featured Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1606811841689-23dfddceeee3?w=800&h=400&fit=crop"
              alt="dentist slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          <div className="relative h-48 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=400&fit=crop"
              alt="dentist slough in Slough"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: `<h1>Dentist Slough</h1></p><p><strong>Target Keyword:</strong> dentist slough</p><p>Finding a reliable and compassionate <strong>dentist in Slough</strong> is crucial for maintaining optimal oral health. Slough is home to several well-established dental practices, each offering a comprehensive range of services designed to meet the diverse needs of individuals and families in the community. Whether you're seeking routine check-ups, emergency dental care, or advanced cosmetic treatments, the local dental clinics are equipped with modern technology and experienced professionals to provide high-quality care.</p><p>Many practices in Slough emphasize a patient-centric approach, ensuring a comfortable and welcoming environment. Services typically include general dentistry such as examinations, cleanings, fillings, and root canal therapy. For those looking to enhance their smile, cosmetic dentistry options like teeth whitening, veneers, and orthodontics (including traditional braces and clear aligners) are widely available. Practices often cater to both NHS and private patients, offering flexible appointment times to accommodate busy schedules.</p><p>When choosing a <strong>dentist in Slough</strong>, consider factors such as the range of treatments offered, the experience and qualifications of the dental team, patient testimonials, and the overall atmosphere of the clinic. Some practices have been serving the Slough community for decades, building a strong reputation for trust and excellence. Emergency dental appointments are also a common offering, providing prompt relief for unexpected dental issues. Ultimately, selecting a local Slough dentist means choosing a partner in your long-term oral health journey, dedicated to providing personalized and effective dental solutions.` }} />
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
        <p className="font-bold">Looking for dentist slough services?</p>
        <p>Browse our directory of local businesses offering dentist slough in Slough and surrounding areas.</p>
        <Link 
          href="/search?q=dentist%20slough" 
          className="inline-block mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Find Local Businesses →
        </Link>
      </div>
    </div>
  )
}
