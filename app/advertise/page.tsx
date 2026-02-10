'use client';

import { useState } from 'react';
import NewsLayout from "@/components/NewsLayout";
import Link from "next/link";

export default function AdvertisePage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start checkout. Please try again or email hello@slough.co');
      }
    } catch (err) {
      alert('Something went wrong. Please email hello@slough.co');
    } finally {
      setLoading(false);
    }
  };

  return (
    <NewsLayout showSidebar={false}>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 md:p-12 text-white mb-8 shadow-xl">
        <div className="max-w-3xl">
          <span className="inline-block bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold mb-4">
            LIMITED SPOTS AVAILABLE
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Put Your Business in Front of Every Local Customer
          </h1>
          <p className="text-xl text-blue-100 mb-6">
            Premium homepage banner on Slough.co — the #1 local directory for Slough, Langley, Horndean & Cippenham.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-200 text-yellow-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
            >
              {loading ? 'Loading...' : 'Get Started — £299/year →'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { stat: '500+', label: 'Daily Visitors', icon: '👥' },
          { stat: '65,000', label: 'Local Population', icon: '🏘️' },
          { stat: '#1', label: 'Local Directory', icon: '🏆' },
          { stat: '267', label: 'Business Guides', icon: '📰' },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <span className="text-3xl mb-2 block">{item.icon}</span>
            <p className="text-2xl font-bold text-gray-900">{item.stat}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>

      {/* What You Get */}
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: '🎯',
              title: 'Premium Homepage Placement',
              desc: 'Your banner appears at the very top of Slough.co — the first thing every visitor sees.'
            },
            {
              icon: '🔗',
              title: 'Direct Link to Your Website',
              desc: 'Every click goes straight to your website or booking page. No middleman, no extra steps.'
            },
            {
              icon: '📍',
              title: 'Hyper-Local Audience',
              desc: 'Our visitors are specifically searching for businesses in Slough, Langley, Horndean & Cippenham.'
            },
            {
              icon: '📱',
              title: 'Mobile Optimized',
              desc: 'Your banner looks great on phones, tablets and desktops. Over 60% of our traffic is mobile.'
            },
            {
              icon: '✏️',
              title: 'Custom Design',
              desc: "We'll create a professional banner for your business with your logo, message and call-to-action."
            },
            {
              icon: '📊',
              title: 'Performance Reports',
              desc: 'Monthly reports showing impressions and clicks so you can track your ROI.'
            },
          ].map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <span className="text-3xl flex-shrink-0">{feature.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why It Works */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Homepage Banners Work</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-900">People are actively looking for services</p>
              <p className="text-gray-600 text-sm">Unlike social media ads, visitors to Slough.co are already searching for local businesses. They're ready to buy.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Zero competition in your slot</p>
              <p className="text-gray-600 text-sm">We only accept one business per category in each banner slot. When someone's looking for your service, they see YOU.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Builds trust through association</p>
              <p className="text-gray-600 text-sm">Being featured on Slough.co — alongside our trusted local guides — positions your business as the go-to choice.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-green-600 text-xl">✓</span>
            <div>
              <p className="font-semibold text-gray-900">Fraction of the cost of Google Ads</p>
              <p className="text-gray-600 text-sm">At £299/year (just 82p/day), you'd pay more for a single week of Google Ads in competitive categories like plumbing or roofing.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Perfect For */}
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Perfect For</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            '🔧 Plumbers',
            '⚡ Electricians',
            '🏠 Estate Agents',
            '💇 Hair Salons',
            '🍽️ Restaurants',
            '🚗 Garages',
            '🏗️ Builders',
            '🌳 Gardeners',
          ].map((business) => (
            <div key={business} className="bg-gray-50 rounded-lg p-3 text-center font-medium text-gray-700">
              {business}
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-sm mt-4 text-center">
          ...and any business serving Slough, Langley, Horndean, Cippenham or Chalvey
        </p>
      </div>

      {/* Pricing */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white mb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Simple, Transparent Pricing</h2>
          <p className="text-gray-400">No hidden fees. No contracts. Cancel anytime.</p>
        </div>
        
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm mb-1">Homepage Banner</p>
            <p className="text-5xl font-bold">£299</p>
            <p className="text-gray-400">/year</p>
            <p className="text-green-400 text-sm mt-2">That's just 82p per day</p>
          </div>
          
          <ul className="space-y-3 mb-6">
            {[
              'Premium homepage placement',
              'Direct link to your website',
              'Custom banner design included',
              'Monthly performance reports',
              '12 months visibility',
              'Cancel anytime',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm">
                <span className="text-green-400">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="block w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-200 text-yellow-900 font-bold py-4 rounded-xl text-center text-lg transition-colors"
          >
            {loading ? 'Loading...' : 'Get Started Now →'}
          </button>
          
          <p className="text-center text-gray-400 text-xs mt-4">
            Secure payment via Stripe. VAT included.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: 'How quickly will my banner go live?',
              a: "Within 48 hours of payment. We'll email you to confirm your banner design and link."
            },
            {
              q: 'Can I change my banner during the year?',
              a: 'Yes! You can update your banner design or link up to 4 times per year at no extra cost.'
            },
            {
              q: 'What if my category is already taken?',
              a: "We only allow one business per category per banner slot to maximize your visibility. We'll let you know if your category is available."
            },
            {
              q: 'How do I track performance?',
              a: 'We send monthly reports showing impressions and clicks. You can also add UTM tracking to your link.'
            },
            {
              q: 'Can I cancel?',
              a: "Yes, but the £299 is an annual fee paid upfront. We don't offer partial refunds, but you won't be charged again."
            },
          ].map((faq) => (
            <div key={faq.q}>
              <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
              <p className="text-gray-600 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-blue-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Ready to Grow Your Business?</h2>
        <p className="text-blue-100 mb-6">Join local businesses already getting customers from Slough.co</p>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="inline-flex items-center bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-blue-50 transition-colors"
        >
          {loading ? 'Loading...' : 'Get Your Banner — £299/year →'}
        </button>
        <p className="text-blue-200 text-sm mt-4">
          Questions? Email <a href="mailto:hello@slough.co" className="underline">hello@slough.co</a>
        </p>
      </div>
    </NewsLayout>
  );
}
