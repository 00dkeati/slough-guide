'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoftConversionQuotesPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('direct');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    propertyType: 'semi-detached',
    conversionType: 'dormer',
    timeline: '3-6 months',
    details: ''
  });

  // Track source on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const ref = document.referrer;
    
    if (utmSource) {
      setSource(`utm:${utmSource}`);
    } else if (ref.includes('google')) {
      setSource('organic:google');
    } else if (ref.includes('bing')) {
      setSource('organic:bing');
    } else if (ref.includes('facebook')) {
      setSource('social:facebook');
    } else if (ref.includes('slough.co')) {
      setSource('internal');
    } else if (ref) {
      setSource(`referral:${new URL(ref).hostname}`);
    } else {
      setSource('direct');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category: 'loft-conversion',
          location: 'hampshire',
          source: source,
          submittedAt: new Date().toISOString()
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setSubmitted(true);
    }
    
    setLoading(false);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thanks! We've Got Your Details</h1>
            <p className="text-lg text-gray-600 mb-6">
              Up to 3 trusted loft conversion specialists in your area will be in touch within 24 hours with free quotes.
            </p>
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                💡 <strong>What happens next?</strong> Local companies will contact you directly to arrange a free survey and quote. No obligation to proceed.
              </p>
            </div>
            <Link href="/seo/loft-conversions-hampshire" className="text-blue-600 hover:underline">
              ← Back to Loft Conversions Guide
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get Free Loft Conversion Quotes
          </h1>
          <p className="text-xl text-gray-600">
            Compare prices from up to 3 trusted local specialists. Free, no obligation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Contact Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="07xxx xxxxxx"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Postcode *</label>
                      <input
                        type="text"
                        required
                        value={formData.postcode}
                        onChange={(e) => setFormData({...formData, postcode: e.target.value.toUpperCase()})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="SL1 5XX"
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                      <select
                        value={formData.propertyType}
                        onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="detached">Detached House</option>
                        <option value="semi-detached">Semi-Detached House</option>
                        <option value="terraced">Terraced House</option>
                        <option value="end-terrace">End Terrace</option>
                        <option value="bungalow">Bungalow</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type of Conversion</label>
                      <select
                        value={formData.conversionType}
                        onChange={(e) => setFormData({...formData, conversionType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="velux">Velux / Roof Light (£25k-£40k)</option>
                        <option value="dormer">Rear Dormer (£40k-£70k)</option>
                        <option value="hip-to-gable">Hip to Gable (£45k-£80k)</option>
                        <option value="mansard">Mansard (£60k-£100k+)</option>
                        <option value="not-sure">Not Sure - Need Advice</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">When do you want to start?</label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="asap">As Soon As Possible</option>
                        <option value="1-3 months">1-3 Months</option>
                        <option value="3-6 months">3-6 Months</option>
                        <option value="6+ months">6+ Months</option>
                        <option value="just-researching">Just Researching</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Anything else? (optional)</label>
                      <textarea
                        value={formData.details}
                        onChange={(e) => setFormData({...formData, details: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="e.g. Want an extra bedroom with en-suite, Victorian terrace with limited headroom..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg disabled:bg-blue-400"
                >
                  {loading ? 'Submitting...' : 'Get My Free Quotes →'}
                </button>

                <p className="text-center text-sm text-gray-500">
                  ✓ 100% free service ✓ No obligation ✓ Up to 3 quotes ✓ Local vetted companies
                </p>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Why Use Our Service?</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>100% Free</strong> — no fees, ever</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Local Companies</strong> — Berkshire based specialists</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Save Time</strong> — one form, multiple quotes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>No Obligation</strong> — compare and decide</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span><strong>Vetted Installers</strong> — quality assured</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-2">💡 Quick Tip</h3>
              <p className="text-sm text-gray-700">
                Always get at least 3 quotes. Loft conversion prices in Berkshire vary by £10,000+ for the same work.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">Average Costs 2026</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Velux</span>
                  <span className="font-semibold">£25k-£40k</span>
                </li>
                <li className="flex justify-between">
                  <span>Dormer</span>
                  <span className="font-semibold">£40k-£70k</span>
                </li>
                <li className="flex justify-between">
                  <span>Hip to Gable</span>
                  <span className="font-semibold">£45k-£80k</span>
                </li>
                <li className="flex justify-between">
                  <span>Mansard</span>
                  <span className="font-semibold">£60k-£100k+</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

