'use client';

import { useState } from 'react';

interface OnboardingFormProps {
  plan: string;
  planName: string;
}

export default function OnboardingForm({ plan, planName }: OnboardingFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const data = {
      plan,
      planName,
      businessName: formData.get('businessName'),
      contactName: formData.get('contactName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      category: formData.get('category'),
      address: formData.get('address'),
      website: formData.get('website'),
      description: formData.get('description'),
      socialMedia: formData.get('socialMedia'),
      submittedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Submission failed');

      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please email us at hello@slough.co with your details.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Details Submitted!</h3>
        <p className="text-slate-600">We'll be in touch soon to get your listing live.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Your Business Details</h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Business Name */}
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-1">
            Business Name *
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            required
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Smith's Plumbing Services"
          />
        </div>

        {/* Contact Name & Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Smith"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="john@example.com"
            />
          </div>
        </div>

        {/* Phone & Category */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="07123 456789"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">
              Business Category *
            </label>
            <select
              id="category"
              name="category"
              required
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              <option value="restaurant">Restaurant / Café</option>
              <option value="pub">Pub / Bar</option>
              <option value="takeaway">Takeaway</option>
              <option value="hairdresser">Hairdresser / Barber</option>
              <option value="beauty">Beauty / Nails</option>
              <option value="plumber">Plumber</option>
              <option value="electrician">Electrician</option>
              <option value="builder">Builder / Contractor</option>
              <option value="gardener">Gardener / Landscaper</option>
              <option value="cleaner">Cleaner</option>
              <option value="dentist">Dentist</option>
              <option value="doctor">Doctor / GP</option>
              <option value="estate-agent">Estate Agent</option>
              <option value="garage">Garage / Mechanic</option>
              <option value="gym">Gym / Fitness</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
            Business Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="123 London Road, Slough SL1 7AA"
          />
        </div>

        {/* Website */}
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-slate-700 mb-1">
            Website (if you have one)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://www.yourbusiness.co.uk"
          />
        </div>

        {/* Social Media */}
        <div>
          <label htmlFor="socialMedia" className="block text-sm font-medium text-slate-700 mb-1">
            Social Media Links
          </label>
          <input
            type="text"
            id="socialMedia"
            name="socialMedia"
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Facebook, Instagram, etc."
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Tell us about your business *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="What do you do? What makes you different? Any specialties or awards?"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors ${
            submitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {submitting ? 'Submitting...' : 'Submit Details'}
        </button>
      </div>
    </form>
  );
}
