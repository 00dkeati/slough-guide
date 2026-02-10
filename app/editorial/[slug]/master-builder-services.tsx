import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Master Builder Services – Trusted Builders in Slough & Gosport | Slough.co',
  description: 'Master Builder Services deliver quality building, refurbishment and maintenance across Slough, Gosport and Berkshire. Over 20 years experience.',
}

export default function MasterBuilderServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-slate-900 text-white py-4">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="font-bold">Slough<span className="text-blue-400">.co</span></Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/builders" className="hover:text-blue-600">Builders</Link>
          <span className="mx-2">›</span>
          <span>Master Builder Services</span>
        </nav>

        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold mb-4">Master Builder Services</h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="font-semibold text-blue-900">⭐ Highly Rated Builder in Slough & Gosport</p>
            <p className="text-blue-800">Over 20 years of experience in building, refurbishment and maintenance</p>
          </div>

          <p>
            Master Builder Services is a highly rated building company serving Slough, Gosport, and the wider Berkshire area. With over two decades of experience, they've built a reputation for quality workmanship and exceptional customer service.
          </p>

          <h2>Services Offered</h2>
          <ul>
            <li><strong>Building Maintenance</strong> – Domestic and commercial</li>
            <li><strong>Restoration & Refurbishment</strong> – Breathing new life into properties</li>
            <li><strong>Kitchens & Bathrooms</strong> – Complete installations</li>
            <li><strong>Extensions & Loft Conversions</strong> – Adding space to your home</li>
            <li><strong>Decorating & Decking</strong> – Interior and exterior finishing</li>
            <li><strong>Plumbing & Electrical</strong> – Fully covered by skilled tradespeople</li>
          </ul>

          <h2>Why Choose Master Builder Services?</h2>
          <ul>
            <li>✓ Over 20 years experience</li>
            <li>✓ One-stop project management from start to finish</li>
            <li>✓ Featured on More 4's "Floating Homes"</li>
            <li>✓ Clear communication throughout every project</li>
            <li>✓ Skilled, registered workforce covering all trades</li>
          </ul>

          <h2>Areas Covered</h2>
          <p>
            Master Builder Services covers Slough, Gosport, Fareham, Chichester, Portsmouth, and surrounding areas across Berkshire.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mt-8">
            <h3 className="font-bold text-lg mb-4">Contact Master Builder Services</h3>
            <p><strong>Website:</strong> <a href="https://www.master-builder-services.company" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">master-builder-services.company</a></p>
            <p><strong>Location:</strong> Gosport, Berkshire</p>
          </div>
        </article>

        <div className="mt-12 pt-8 border-t">
          <Link href="/builders" className="text-blue-600 hover:underline">← Back to Builders in Slough</Link>
        </div>
      </main>

      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-400">© 2026 Slough.co</p>
        </div>
      </footer>
    </div>
  )
}
