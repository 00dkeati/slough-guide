export const runtime = 'nodejs'
import NewsLayout from "@/components/NewsLayout";
import { getLatestArticles } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Local Businesses & News',
  description: 'Find local businesses, services, news and events in Slough, Berkshire. Your complete guide to shops, restaurants, tradespeople and more.',
}

export default async function HomePage() {
  const articles = await getLatestArticles(9);
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1, 7);

  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.slough.co/#website",
        "url": "https://www.slough.co",
        "name": "Slough.co",
        "description": "Local business directory and community guide for Slough, Berkshire",
        "publisher": {
          "@id": "https://www.slough.co/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.slough.co/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "en-GB"
      },
      {
        "@type": "Organization",
        "@id": "https://www.slough.co/#organization",
        "name": "Slough.co",
        "url": "https://www.slough.co",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.slough.co/logo.png"
        },
        "sameAs": [],
        "areaServed": {
          "@type": "GeoCircle",
          "geoMidpoint": {
            "@type": "GeoCoordinates",
            "latitude": 50.8808,
            "longitude": -1.0308
          },
          "geoRadius": "10000"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://www.slough.co/#localbusiness",
        "name": "Slough.co - Local Directory",
        "description": "Find trusted local businesses, services and tradespeople in Slough, Langley, Horndean and surrounding Berkshire areas.",
        "url": "https://www.slough.co",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Slough",
          "addressRegion": "Berkshire",
          "addressCountry": "GB",
          "postalCode": "SL1"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 50.8808,
          "longitude": -1.0308
        },
        "areaServed": [
          "Slough",
          "Langley", 
          "Horndean",
          "Cippenham",
          "Chalvey",
          "Clanfield"
        ]
      }
    ]
  };

  return (
    <NewsLayout showSidebar={true}>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Premium Banner Ad CTA */}
      <Link 
        href="/advertise"
        className="group block bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 rounded-xl p-4 mb-6 shadow-md hover:shadow-lg transition-all border-2 border-amber-500"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📣</span>
            <div>
              <p className="font-bold text-amber-900 text-sm sm:text-base">Get Your Business Featured Here</p>
              <p className="text-amber-800 text-xs sm:text-sm">Premium homepage banner • Seen by hundreds of local customers daily</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-lg font-semibold text-sm group-hover:bg-amber-800 transition-colors">
            From £299/year →
          </div>
        </div>
      </Link>

      {/* ⭐ Featured Business - JC Barbering (Paid Sponsor) */}
      <Link 
        href="/editorial/jc-barbering-slough"
        className="group block bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl overflow-hidden mb-6 shadow-lg hover:shadow-xl transition-all"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0">
            <Image
              src="/images/barbers/jc-barbering-1.jpg"
              alt="JC Barbering Slough"
              fill
              sizes="(max-width: 640px) 100vw, 192px"
              className="object-cover"
            />
          </div>
          <div className="p-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500 text-amber-900 text-xs font-bold px-2 py-0.5 rounded">⭐ FEATURED</span>
              <span className="text-slate-400 text-xs">Sponsored</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
              JC Barbering — Slough&apos;s Fade Specialists
            </h3>
            <p className="text-slate-300 text-sm mb-3">
              Precision skin fades, beard styling & expert cuts. 4.8★ from 40 reviews.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-amber-400 font-semibold">📍 Frogmore Lane</span>
              <span className="text-slate-400">📞 07487 602476</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Featured Article */}
      {featuredArticle && (
        <Link 
          href={`/editorial/${featuredArticle.slug}`}
          className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden mb-8"
        >
          <div className="relative h-64 md:h-80">
            <Image
              src={featuredArticle.imageUrl || '/images/placeholder.jpg'}
              alt={featuredArticle.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span className="inline-block bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                {featuredArticle.kicker || 'Featured'}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-blue-200 transition-colors">
                {featuredArticle.title}
              </h1>
              {featuredArticle.excerpt && (
                <p className="text-gray-200 line-clamp-2 text-sm md:text-base">{featuredArticle.excerpt}</p>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Latest Guides</h2>
        <Link href="/editorial" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View all →
        </Link>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {otherArticles.map((article) => (
          <Link 
            key={article.slug}
            href={`/editorial/${article.slug}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex"
          >
            <div className="relative w-32 h-32 flex-shrink-0">
              <Image
                src={article.imageUrl || '/images/placeholder.jpg'}
                alt={article.title}
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
            <div className="p-4 flex flex-col justify-center">
              <span className="text-xs text-blue-600 font-medium mb-1">
                {article.kicker || 'Guide'}
              </span>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Register Business CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <h2 className="text-xl font-bold mb-1">Own a Local Business?</h2>
            <p className="text-blue-100">Get found by customers in Slough, Langley & Horndean</p>
          </div>
          <Link 
            href="/register-business"
            className="flex-shrink-0 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Register Your Business →
          </Link>
        </div>
      </div>

      {/* About Slough - SEO Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Local Guide to Slough</h2>
        <div className="prose prose-slate max-w-none text-gray-600 space-y-4">
          <p>
            Welcome to Slough.co, the most comprehensive local directory for Slough, Berkshire and surrounding areas including Langley, Horndean, Cippenham, and Chalvey. Whether you're looking for trusted tradespeople, the best restaurants, or local services, we've got you covered.
          </p>
          <p>
            Our directory features hundreds of local businesses, from plumbers and electricians to hairdressers and estate agents. Each listing includes real Google reviews, contact details, and honest recommendations from locals who know the area. We've ranked the best businesses in every category so you can find exactly what you need.
          </p>
          <p>
            Slough is a thriving market town in Berkshire with a population of around 65,000 people. Located between Portsmouth and the South Downs National Park, it offers the perfect blend of suburban convenience and countryside access. Our guides cover everything from the best pubs and restaurants to essential services like dentists, garages, and pharmacies.
          </p>
          <p>
            Looking for something specific? Use our search to find local businesses, or browse our editorial guides featuring in-depth reviews and rankings. Business owners can <a href="/register-business" className="text-blue-600 hover:underline">register for free</a> to be included in our directory.
          </p>
        </div>
      </div>

      {/* Best Barbers Feature - JC Barbering Sponsor */}
      <Link 
        href="/editorial/best-barbers-slough-2026"
        className="group block bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 mb-8 shadow-lg hover:shadow-xl transition-all border border-slate-700"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">💈</span>
            <div>
              <p className="font-bold text-white text-lg sm:text-xl">Best Barbers in Slough 2026</p>
              <p className="text-slate-300 text-sm sm:text-base">We ranked every barber from Horndean to Langley. Find your new spot.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold text-sm group-hover:bg-blue-50 transition-colors">
            See Rankings →
          </div>
        </div>
      </Link>

      {/* Popular Guides - Internal Links for SEO */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🏠 Popular Home Improvement Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/seo/loft-conversions-hampshire"
            className="bg-white p-4 rounded-lg hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">Loft Conversions Berkshire</h3>
            <p className="text-sm text-gray-600">Costs, companies & free quotes 2026</p>
          </Link>
          <Link
            href="/seo/loft-conversions-portsmouth"
            className="bg-white p-4 rounded-lg hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">Loft Conversions Portsmouth</h3>
            <p className="text-sm text-gray-600">Top companies & prices 2026</p>
          </Link>
          <Link
            href="/seo/loft-conversion-slough"
            className="bg-white p-4 rounded-lg hover:shadow-md transition-all group"
          >
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-1">Loft Conversions Slough</h3>
            <p className="text-sm text-gray-600">Local specialists & quotes</p>
          </Link>
        </div>
        <div className="mt-4 text-center">
          <Link 
            href="/quotes/loft-conversion" 
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Get Free Loft Conversion Quotes →
          </Link>
        </div>
      </div>

      {/* Categories Quick Links */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Browse Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: '💈', label: 'Barbers', href: '/editorial/best-barbers-slough-2026' },
            { icon: '🍽️', label: 'Restaurants', href: '/restaurants' },
            { icon: '🔧', label: 'Plumbers', href: '/plumbers' },
            { icon: '💇', label: 'Hairdressers', href: '/hairdressers' },
            { icon: '🏠', label: 'Estate Agents', href: '/estate-agents' },
            { icon: '⚡', label: 'Electricians', href: '/electricians' },
          ].map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-medium text-sm">{cat.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link 
            href="/categories" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            View all categories →
          </Link>
        </div>
      </div>
    </NewsLayout>
  );
}
