'use client';

import { useState } from 'react';

export default function RegisterBusinessForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    category: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/register-business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tier: 'free' }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          businessName: '',
          category: '',
          address: '',
          phone: '',
          email: '',
          website: '',
          description: '',
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-green-900 mb-2">Listing Submitted!</h3>
        <p className="text-green-700">
          We'll review your submission and add your business within 24-48 hours. 
          You'll receive an email confirmation at the address provided.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Free Basic Listing</h2>
      <p className="text-slate-600 mb-6">Fill in your details below. We'll review and add your business within 24-48 hours.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Joe's Barber Shop"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">Select a category...</option>
              <option value="restaurant">Restaurant / Café</option>
              <option value="takeaway">Takeaway</option>
              <option value="pub">Pub / Bar</option>
              <option value="hairdresser">Hairdresser / Barber</option>
              <option value="beauty">Beauty / Spa</option>
              <option value="health">Health / Fitness</option>
              <option value="trades">Trades (Plumber, Electrician, etc.)</option>
              <option value="retail">Retail / Shop</option>
              <option value="professional">Professional Services</option>
              <option value="automotive">Automotive</option>
              <option value="property">Property / Estate Agent</option>
              <option value="education">Education / Childcare</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g. 123 London Road, Slough, SL1 7AA"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. 023 9226 1234"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@business.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://www.yourbusiness.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Brief Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Tell us a bit about your business..."
          />
        </div>

        {status === 'error' && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl">
            Something went wrong. Please try again or email us directly.
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Submitting...' : 'Submit Free Listing'}
        </button>

        <p className="text-center text-slate-500 text-sm">
          Want more visibility? <a href="#" className="text-blue-600 hover:underline" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Upgrade to Story Listing</a> for £199
        </p>
      </form>
    </div>
  );
}
