import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import TopNav from '@/app/(site)/components/TopNav'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `slough health visiting team in Slough – Local Guide, Info & Tips`,
    description: `Everything you need to know about slough health visiting team in Slough. Local guide with practical information, tips, and insights for residents and visitors.`,
    openGraph: {
      title: `slough health visiting team in Slough – Local Guide, Info & Tips`,
      description: `Everything you need to know about slough health visiting team in Slough. Local guide with practical information, tips, and insights for residents and visitors.`,
      type: 'article',
    },
    alternates: {
      canonical: `/editorial/slough-health-visiting-team`,
    },
  }
}

export default function EditorialPage() {
  return (
    <>
      <TopNav />
      
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "slough health visiting team in Slough – Local Guide, Info & Tips",
            "description": "Everything you need to know about slough health visiting team in Slough. Local guide with practical information, tips, and insights for residents and visitors.",
            "author": {
              "@type": "Organization",
              "name": "Slough.co"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Slough Directory",
              "url": "https://www.slough.co"
            },
            "datePublished": "2025-10-18T19:15:01.051Z",
            "dateModified": "2025-10-18T19:15:01.051Z",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://www.slough.co/editorial/slough-health-visiting-team"
            }
          })
        }}
      />

      <main className="pt-20 lg:pt-24">
        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/editorial" className="hover:text-green-600 transition-colors">Editorial</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">slough health visiting team</span>
          </nav>

          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 overflow-hidden mb-8">
            <div className="p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight text-balance">
                slough health visiting team – Everything You Need to Know in Slough
              </h1>
              
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: `## slough health visiting team in Slough<br><br>Looking for slough health visiting team in Slough? You'll find excellent options throughout the town and surrounding areas. Whether you're a local resident or visiting the area, Slough offers convenient access to a wide range of services and amenities.<br><br>### What You Need to Know<br><br>Slough is well-connected with good transport links via bus routes 8, 37, and 39, making it easy to access from surrounding areas like Langley, Cippenham, and Chalvey. The town centre offers convenient parking and is easily accessible by car or public transport.<br><br>### Local Context<br><br>Slough serves as a hub for the local community, with many services and businesses catering to residents from the wider area. The town's central location makes it ideal for accessing various amenities and services.<br><br>### Practical Information<br><br>Most services in Slough operate standard business hours, typically 9am-6pm Monday to Saturday, with some offering Sunday services. The town centre has good parking facilities, and many establishments are accessible by public transport.<br><br>### About Slough<br><br>Slough is a thriving town in Berkshire, perfectly positioned between Portsmouth and Havant. With excellent transport links, quality schools, and a strong community spirit, it's an ideal place to live, work, and visit. The town offers a great mix of traditional charm and modern amenities, making it popular with families and professionals alike.<br><br>Whether you're looking for shopping, dining, leisure activities, or services, Slough has something to offer everyone. The town's central location makes it easy to access the South Coast, London, and other major destinations while enjoying the benefits of a close-knit community.` }} />
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div dangerouslySetInnerHTML={{ __html: `### Related Topics<br><br>- [slough](/editorial/slough)<br>- [slough horizon](/editorial/slough-horizon)<br>- [slough houses for sale](/editorial/slough-houses-for-sale)<br><br>- [Slough Directory Homepage](/)` }} />
              </div>
            </div>
          </article>

          {/* Back to Editorial */}
          <div className="text-center mb-12">
            <Link 
              href="/editorial"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium transition-colors"
            >
              ← Back to all articles
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}