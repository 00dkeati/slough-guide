'use client';

import Link from 'next/link';
import Image from 'next/image';
import NewsLayout from '@/components/NewsLayout';

const jcBarbering = {
  name: 'JC Barbering',
  slug: 'jc-barbering-slough',
  address: '4 Frogmore Lane, Slough SL2 9QQ',
  phone: '07487 602476',
  rating: 4.8,
  reviewCount: 40,
  owner: 'Jordan',
  image: '/images/businesses/jc-barbering-1.jpg',
  reviews: [
    { text: "Jordan is a master of the hair. Knows exactly what you want and gives you the best haircut every single time. Highly recommend!", author: "Tom K." },
    { text: "Best barber I've been to in years. Really takes his time and the attention to detail is spot on.", author: "James M." },
    { text: "Excellent service every time. The shop has a great vibe and Jordan always delivers.", author: "Chris P." }
  ],
  services: [
    { name: 'JC Skin Fade', price: '£23', time: '35 mins' },
    { name: 'JC Cut and Style', price: '£20', time: '30 mins' },
    { name: 'Wash, Cut, Style & Beard', price: '£30', time: '40 mins' },
    { name: 'Hot Towel Shave', price: '£15', time: '20 mins' },
  ]
};

const otherBarbers = [
  { name: 'Frogmore Barbers', area: 'Slough', rating: 4.6, reviewCount: 28 },
  { name: 'Langley Barbers', area: 'Langley', rating: 4.5, reviewCount: 35 },
  { name: 'The Barber Shop', area: 'Horndean', rating: 4.7, reviewCount: 22 },
  { name: 'Gents of Slough', area: 'Slough', rating: 4.4, reviewCount: 18 },
  { name: 'Sharp Cuts', area: 'Cippenham', rating: 4.5, reviewCount: 15 },
];

export default function BarbersPage() {
  return (
    <NewsLayout showSidebar={false}>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Best Barbers in Slough
        </h1>
        <p className="text-xl text-gray-600">
          Find the top-rated barbers in Slough, Horndean, Langley & Cippenham. 
          Quality cuts, great prices, trusted by locals.
        </p>
      </div>

      {/* #1 Pick - JC Barbering */}
      <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-400 rounded-2xl p-6 md:p-8 mb-8 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            🏆 #1 WATERLOOVILLE.CO PICK
          </span>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            ✓ VERIFIED
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left - Info */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {jcBarbering.name}
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              Run by {jcBarbering.owner} • Lovedean, Slough
            </p>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-amber-600">{jcBarbering.rating}</span>
                <span className="text-amber-500 ml-1">★★★★★</span>
              </div>
              <span className="text-gray-500">({jcBarbering.reviewCount}+ reviews)</span>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-gray-700">📍 {jcBarbering.address}</p>
              <p className="text-gray-700">📞 {jcBarbering.phone}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link 
                href={`/editorial/${jcBarbering.slug}`}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Read Full Article →
              </Link>
              <a 
                href={`tel:${jcBarbering.phone.replace(/\s/g, '')}`}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                📞 Call Now
              </a>
            </div>
          </div>

          {/* Right - Services & Prices */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Services & Prices</h3>
            <div className="space-y-3">
              {jcBarbering.services.map((service) => (
                <div key={service.name} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-500">{service.time}</p>
                  </div>
                  <span className="font-bold text-amber-600">{service.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-6">
          <h3 className="font-bold text-gray-900 mb-4">Why We Picked JC Barbering</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {jcBarbering.reviews.map((review, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-amber-500 mb-2">★★★★★</p>
                <p className="text-gray-700 text-sm mb-2">"{review.text}"</p>
                <p className="text-gray-500 text-xs">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Other Barbers */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Other Barbers in the Area
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherBarbers.map((barber) => (
            <div key={barber.name} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-1">{barber.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{barber.area}</p>
              <div className="flex items-center gap-2">
                <span className="text-amber-500">★</span>
                <span className="font-medium">{barber.rating}</span>
                <span className="text-gray-400 text-sm">({barber.reviewCount} reviews)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Trust Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          How We Choose Our #1 Pick
        </h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-900 mb-1">📊 Review Analysis</p>
            <p className="text-gray-600">We analyze Google reviews for consistency, detail, and authenticity.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">🏆 Track Record</p>
            <p className="text-gray-600">Long-term reputation and repeat customer satisfaction.</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 mb-1">💬 Local Feedback</p>
            <p className="text-gray-600">Real recommendations from the Slough community.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-900 text-white rounded-xl p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Are You a Barber in Slough?</h2>
        <p className="text-gray-400 mb-4">Get featured on our directory and reach more local customers.</p>
        <Link 
          href="/advertise"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Get Featured →
        </Link>
      </div>
    </NewsLayout>
  );
}
