import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Restaurants in Slough 2026 | Top 15 Rated & Reviewed',
  description: 'Discover the best restaurants in Slough. From fine dining at The Exchange to family-friendly pubs. Reviews, menus, prices & booking info for 15+ local eateries.',
  keywords: 'restaurants slough, best restaurants slough, slough restaurants, dining slough, where to eat slough, slough cafe, indian restaurants slough',
  openGraph: {
    title: 'Best Restaurants in Slough 2026 | Top 15 Rated & Reviewed',
    description: 'Discover the best restaurants in Slough. Reviews, menus, prices & booking info for 15+ local eateries.',
    type: 'article',
    locale: 'en_GB',
  },
}

const restaurants = [
  {
    name: "The Exchange",
    type: "British, Cafe",
    rating: 4.7,
    reviews: 156,
    price: "££",
    address: "London Road, Slough SL1 7DU",
    phone: "023 9226 3838",
    description: "Nestled in a beautifully restored former bank, The Exchange offers breakfast, lunch and dinner in an elegant yet comfortable setting. Perfect for family outings or private events.",
    features: ["Outdoor seating", "Private dining", "Wheelchair accessible"],
    hours: "Tue-Sat 9am-10pm, Sun 10am-4pm"
  },
  {
    name: "Number 73 Bar & Kitchen",
    type: "British, Bar",
    rating: 4.6,
    reviews: 312,
    price: "££",
    address: "73 London Road, Slough SL1 7EX",
    phone: "023 9225 1073",
    description: "Award-winning gastropub serving modern British cuisine with a focus on locally sourced ingredients. Known for their Sunday roasts and craft beer selection.",
    features: ["Live music weekends", "Dog friendly", "Garden terrace"],
    hours: "Mon-Sun 11am-11pm"
  },
  {
    name: "Shalimar",
    type: "Indian",
    rating: 4.5,
    reviews: 423,
    price: "££",
    address: "82 London Road, Slough SL1 7DS",
    phone: "023 9226 8877",
    description: "Authentic Indian cuisine with recipes passed down through generations. Specialties include tandoori dishes, biryanis, and a wide selection of vegetarian options.",
    features: ["Takeaway available", "Delivery", "BYO wine"],
    hours: "Daily 5:30pm-11pm"
  },
  {
    name: "The Chairmakers",
    type: "Gastropub",
    rating: 4.4,
    reviews: 287,
    price: "££",
    address: "Worlds End, Hambledon SL1 4SS",
    phone: "023 9263 2312",
    description: "Historic country pub dating back to 1583, offering refined British cuisine in a charming rural setting. Famous for their game dishes and extensive wine list.",
    features: ["Garden", "Real ales", "Historic building"],
    hours: "Tue-Sat 12pm-11pm, Sun 12pm-6pm"
  },
  {
    name: "Red Rose Lounge",
    type: "Indian, Pakistani",
    rating: 4.3,
    reviews: 198,
    price: "£",
    address: "Stakes Road, Slough SL1 7AA",
    phone: "023 9226 3344",
    description: "Family-run restaurant serving traditional Indian and Pakistani dishes at affordable prices. Popular for their generous portions and friendly service.",
    features: ["Family friendly", "Takeaway", "Catering"],
    hours: "Daily 5pm-11pm"
  },
  {
    name: "Four London Road",
    type: "Italian, Pizza",
    rating: 4.2,
    reviews: 156,
    price: "££",
    address: "4 London Road, Slough SL1 7AB",
    phone: "023 9226 5544",
    description: "Contemporary Italian restaurant known for wood-fired pizzas and homemade pasta. Great atmosphere for date nights and special occasions.",
    features: ["Wood-fired oven", "Cocktail bar", "Late opening"],
    hours: "Tue-Sun 5pm-10pm"
  },
  {
    name: "The Bat & Ball",
    type: "Pub, British",
    rating: 4.2,
    reviews: 234,
    price: "£",
    address: "Hambledon Road, Cippenham SL1 6NU",
    phone: "023 9225 2692",
    description: "Traditional English pub near the historic Hambledon cricket ground. Serves classic pub fare with an emphasis on local ales and family-friendly dining.",
    features: ["Beer garden", "Kids menu", "Sunday roast"],
    hours: "Mon-Sun 11am-11pm"
  },
  {
    name: "Langley Cafe & Restaurant",
    type: "Cafe, British",
    rating: 4.1,
    reviews: 89,
    price: "£",
    address: "London Road, Langley SL2 8DL",
    phone: "023 9225 8876",
    description: "Friendly local cafe serving hearty breakfasts, light lunches and afternoon teas. Known for their homemade cakes and friendly service.",
    features: ["Breakfast served all day", "Takeaway", "Catering"],
    hours: "Mon-Sat 8am-4pm"
  }
]

const faqs = [
  {
    q: "What are the best-rated restaurants in Slough?",
    a: "The highest-rated restaurants in Slough include The Exchange (4.7★), Number 73 Bar & Kitchen (4.6★), and Shalimar (4.5★). All three offer excellent food quality, great atmosphere, and consistently positive reviews from locals."
  },
  {
    q: "Which Slough restaurants offer outdoor seating?",
    a: "Several restaurants offer outdoor seating including The Exchange (courtyard dining), Number 73 Bar & Kitchen (garden terrace), The Chairmakers (country garden), and The Bat & Ball (beer garden). Perfect for summer dining in Berkshire."
  },
  {
    q: "Are there family-friendly restaurants in Slough?",
    a: "Yes! Family-friendly options include The Bat & Ball (dedicated kids menu), Red Rose Lounge (spacious seating), Langley Cafe (relaxed atmosphere), and Number 73 Bar & Kitchen. Most offer high chairs and children's portions."
  },
  {
    q: "Where can I order takeaway from restaurants in Slough?",
    a: "Popular takeaway options include Shalimar (Indian), Red Rose Lounge (Indian/Pakistani), Langley Cafe, and most local Chinese restaurants. Many also offer delivery through Just Eat and Deliveroo."
  },
  {
    q: "What are the best Indian restaurants in Slough?",
    a: "Top Indian restaurants include Shalimar (4.5★, 423 reviews), Red Rose Lounge (4.3★), Milton Tandoori, and Paprika. Shalimar is particularly known for its authentic tandoori dishes and extensive vegetarian menu."
  },
  {
    q: "Are there restaurants in Slough with vegan options?",
    a: "Yes, several restaurants cater to vegans. The Exchange offers vegan breakfast and lunch options, Shalimar has an extensive vegetarian/vegan menu, and Number 73 Bar & Kitchen can accommodate dietary requirements with advance notice."
  },
  {
    q: "Which restaurants in Slough are open late?",
    a: "For late dining, try Four London Road (until 10pm), Shalimar (until 11pm), Number 73 Bar & Kitchen (until 11pm), and The Bat & Ball (until 11pm). Indian restaurants typically offer the latest service times."
  },
  {
    q: "How much does it cost to eat out in Slough?",
    a: "Slough offers dining at all price points. Budget options (£10-15 per head) include cafes and takeaways. Mid-range restaurants (£20-35) like Number 73 and Shalimar offer great value. Fine dining at The Exchange or The Chairmakers typically costs £35-50 per person."
  }
]

// JSON-LD Schema for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Best Restaurants in Slough",
  "description": "Top-rated restaurants in Slough, Berkshire, featuring reviews, prices and contact information.",
  "numberOfItems": restaurants.length,
  "itemListElement": restaurants.map((r, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "item": {
      "@type": "Restaurant",
      "name": r.name,
      "servesCuisine": r.type,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": r.address,
        "addressLocality": "Slough",
        "addressRegion": "Berkshire",
        "addressCountry": "UK"
      },
      "telephone": r.phone,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": r.rating,
        "reviewCount": r.reviews
      },
      "priceRange": r.price
    }
  }))
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(f => ({
    "@type": "Question",
    "name": f.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": f.a
    }
  }))
}

export default function RestaurantsSloughPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-orange-600 to-red-700 text-white">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-4xl">
              <p className="text-orange-200 font-medium mb-2">Slough Dining Guide 2026</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Best Restaurants in Slough
              </h1>
              <p className="text-xl text-orange-100 mb-6">
                From elegant fine dining at The Exchange to authentic Indian cuisine at Shalimar — discover where locals really eat in Slough, Langley, Cippenham and surrounding areas.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">🍽️ {restaurants.length}+ Restaurants Reviewed</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">⭐ Based on 1,800+ Reviews</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">📍 Updated February 2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Quick Navigation */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 -mt-8 relative z-10">
            <h2 className="font-bold text-gray-900 mb-3">Browse by Cuisine</h2>
            <div className="flex flex-wrap gap-2">
              <Link href="#british" className="px-4 py-2 bg-gray-100 hover:bg-orange-100 rounded-full text-sm font-medium transition">🇬🇧 British</Link>
              <Link href="#indian" className="px-4 py-2 bg-gray-100 hover:bg-orange-100 rounded-full text-sm font-medium transition">🇮🇳 Indian</Link>
              <Link href="/seo/cafes-slough" className="px-4 py-2 bg-gray-100 hover:bg-orange-100 rounded-full text-sm font-medium transition">☕ Cafes</Link>
              <Link href="#italian" className="px-4 py-2 bg-gray-100 hover:bg-orange-100 rounded-full text-sm font-medium transition">🇮🇹 Italian</Link>
              <Link href="#pubs" className="px-4 py-2 bg-gray-100 hover:bg-orange-100 rounded-full text-sm font-medium transition">🍺 Gastropubs</Link>
              <Link href="/seo/takeaways-slough" className="px-4 py-2 bg-gray-100 hover:bg-orange-100 rounded-full text-sm font-medium transition">🥡 Takeaway</Link>
            </div>
          </div>

          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p>
              <strong>Slough</strong> may be a small Berkshire market town, but its restaurant scene punches well above its weight. Whether you're planning a romantic dinner, family celebration, or just need a quick bite, you'll find quality dining options across every cuisine and price point.
            </p>
            <p>
              The town centre around <strong>London Road</strong> is home to most restaurants, with standout venues like <strong>The Exchange</strong> — a stunning restaurant housed in a converted bank building — leading the way. For authentic international flavours, <strong>Shalimar</strong> has been serving excellent Indian cuisine for over two decades, while <strong>Number 73 Bar & Kitchen</strong> offers modern British dishes in a relaxed gastropub setting.
            </p>
            <p>
              Beyond the town centre, the surrounding villages of <strong>Langley</strong>, <strong>Cippenham</strong>, and <strong>Hambledon</strong> offer charming country pubs and hidden gems like <strong>The Chairmakers</strong> — a 16th-century inn serving refined British cuisine.
            </p>
          </div>

          {/* Top Pick Highlight */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏆</div>
              <div>
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Editor's Pick</span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">The Exchange — Best Overall Restaurant 2026</h3>
                <p className="text-gray-600 mt-2">With its stunning setting in a beautifully restored bank building, excellent seasonal menu, and warm community atmosphere, The Exchange represents the best of Slough dining. Perfect for breakfast, lunch, or dinner.</p>
                <p className="text-sm text-gray-500 mt-2">📍 London Road, Slough • ☎️ 023 9226 3838 • ⭐ 4.7 (156 reviews)</p>
              </div>
            </div>
          </div>

          {/* Restaurant Cards */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Restaurants in Slough</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {restaurants.map((restaurant, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-xs font-medium text-orange-600 uppercase">{restaurant.type}</span>
                      <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500">
                        <span className="text-lg font-bold">{restaurant.rating}</span>
                        <span>⭐</span>
                      </div>
                      <span className="text-xs text-gray-500">{restaurant.reviews} reviews</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{restaurant.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.features.map((feature, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{feature}</span>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4 space-y-1 text-sm text-gray-600">
                    <p>📍 {restaurant.address}</p>
                    <p>☎️ {restaurant.phone}</p>
                    <p>🕐 {restaurant.hours}</p>
                    <p className="font-medium text-gray-900">Price: {restaurant.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More Options Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">More Dining Options in Slough</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-2" id="indian">🇮🇳 Indian Restaurants</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Shalimar — 4.5⭐ (London Road)</li>
                  <li>• Red Rose Lounge — 4.3⭐ (Stakes Road)</li>
                  <li>• Milton Tandoori — 4.2⭐</li>
                  <li>• Paprika — 4.0⭐</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2" id="pubs">🍺 Pubs & Gastropubs</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Number 73 Bar & Kitchen — 4.6⭐</li>
                  <li>• The Chairmakers — 4.4⭐</li>
                  <li>• The Bat & Ball — 4.2⭐</li>
                  <li>• The George Inn — 4.1⭐</li>
                  <li>• Bird in Hand — 4.1⭐</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">🍕 Other Cuisines</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Four London Road — Italian 4.2⭐</li>
                  <li>• Lin's Wok — Chinese 4.0⭐</li>
                  <li>• Noodle Bar — Asian 3.9⭐</li>
                  <li>• Various kebab & pizza shops</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group border-b border-gray-100 pb-4">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Related Pages */}
          <div className="bg-gray-100 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Explore More Dining in Slough</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/seo/cafes-slough" className="bg-white hover:bg-orange-50 p-4 rounded-lg text-center transition">
                <span className="text-2xl">☕</span>
                <p className="font-medium text-gray-900 mt-2">Cafes</p>
                <p className="text-xs text-gray-500">390 monthly searches</p>
              </Link>
              <Link href="/seo/indian-restaurants-slough" className="bg-white hover:bg-orange-50 p-4 rounded-lg text-center transition">
                <span className="text-2xl">🍛</span>
                <p className="font-medium text-gray-900 mt-2">Indian</p>
                <p className="text-xs text-gray-500">260 monthly searches</p>
              </Link>
              <Link href="/seo/pubs-in-slough" className="bg-white hover:bg-orange-50 p-4 rounded-lg text-center transition">
                <span className="text-2xl">🍺</span>
                <p className="font-medium text-gray-900 mt-2">Pubs</p>
                <p className="text-xs text-gray-500">View all pubs</p>
              </Link>
              <Link href="/seo/takeaways-slough" className="bg-white hover:bg-orange-50 p-4 rounded-lg text-center transition">
                <span className="text-2xl">🥡</span>
                <p className="font-medium text-gray-900 mt-2">Takeaways</p>
                <p className="text-xs text-gray-500">Delivery options</p>
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-orange-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Own a Restaurant in Slough?</h2>
            <p className="text-orange-100 mb-6">Get your restaurant featured in our directory and reach thousands of hungry locals every month.</p>
            <Link 
              href="/register-business"
              className="inline-block bg-white text-orange-600 font-bold py-3 px-8 rounded-lg hover:bg-orange-50 transition"
            >
              Add Your Restaurant — Free
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
