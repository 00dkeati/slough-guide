'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import NewsLayout from "@/components/NewsLayout";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  return <SuccessForm sessionId={sessionId} />;
}

export default function AdvertiseSuccessPage() {
  return (
    <Suspense fallback={
      <NewsLayout showSidebar={false}>
        <div className="text-center py-12">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </NewsLayout>
    }>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessForm({ sessionId }: { sessionId: string | null }) {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    category: '',
    tagline: '',
    description: '',
    logo: '',
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/submit-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stripeSessionId: sessionId,
          submittedAt: new Date().toISOString(),
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to submit');
      }
      
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please email hello@slough.co with your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <NewsLayout showSidebar={false}>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">You're All Set!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Thanks for submitting your details. We'll create your banner and have it live within 48 hours.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h2 className="font-semibold text-green-800 mb-2">What happens next?</h2>
            <ol className="text-left text-green-700 space-y-2">
              <li>1. We'll design your custom banner using your logo and tagline</li>
              <li>2. You'll receive an email preview within 24 hours</li>
              <li>3. Once approved, your banner goes live on the homepage</li>
              <li>4. You'll get monthly performance reports</li>
            </ol>
          </div>
          <p className="text-gray-500 text-sm">
            Questions? Email <a href="mailto:hello@slough.co" className="text-blue-600 underline">hello@slough.co</a>
          </p>
        </div>
      </NewsLayout>
    );
  }

  return (
    <NewsLayout showSidebar={false}>
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Just a few more details and we'll get your banner live within 48 hours.
          </p>
        </div>

        {/* Questionnaire Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Tell Us About Your Business</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Business Name */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                required
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Smith's Plumbing Services"
              />
            </div>

            {/* Contact Name */}
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                id="contactName"
                name="contactName"
                required
                value={formData.contactName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. John Smith"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="07xxx xxxxxx"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website URL *
              </label>
              <input
                type="url"
                id="website"
                name="website"
                required
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.yourbusiness.co.uk"
              />
              <p className="text-xs text-gray-500 mt-1">This is where your banner will link to</p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Business Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category...</option>
                <option value="plumber">Plumber</option>
                <option value="electrician">Electrician</option>
                <option value="builder">Builder</option>
                <option value="roofer">Roofer</option>
                <option value="gardener">Gardener / Landscaper</option>
                <option value="hairdresser">Hairdresser / Barber</option>
                <option value="restaurant">Restaurant / Cafe</option>
                <option value="takeaway">Takeaway</option>
                <option value="estate-agent">Estate Agent</option>
                <option value="garage">Garage / Mechanic</option>
                <option value="cleaner">Cleaner</option>
                <option value="locksmith">Locksmith</option>
                <option value="handyman">Handyman</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Tagline */}
            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 mb-1">
                Banner Tagline *
              </label>
              <input
                type="text"
                id="tagline"
                name="tagline"
                required
                maxLength={60}
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Slough's Most Trusted Plumber"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.tagline.length}/60 characters — this appears on your banner</p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                maxLength={200}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us a bit about your business (optional)"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200 characters</p>
            </div>

            {/* Logo URL */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL (optional)
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.yourbusiness.co.uk/logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">Or email your logo to hello@slough.co after submitting</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg"
          >
            {loading ? 'Submitting...' : 'Submit & Create My Banner →'}
          </button>
          
          <p className="text-center text-gray-500 text-sm mt-4">
            We'll email you a preview within 24 hours
          </p>
        </form>
      </div>
    </NewsLayout>
  );
}
