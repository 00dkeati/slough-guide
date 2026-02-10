'use client';

import { useState } from 'react';

interface LeadFormProps {
  category: string;
  location: string;
  title?: string;
  subtitle?: string;
  cta?: string;
}

export default function LeadForm({ 
  category, 
  location, 
  title = "Get Free Quotes",
  subtitle = "Compare prices from local companies",
  cta = "Get Free Quotes"
}: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postcode: '',
    projectType: 'dormer',
    timeline: '3-6 months',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category,
          location,
          source: 'seo-page',
          submittedAt: new Date().toISOString()
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      // Still show success - we'll handle errors gracefully
      setSubmitted(true);
    }
    
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Thanks! We've got your details</h3>
        <p className="text-green-700">
          Local {category.replace('-', ' ')} companies will be in touch within 24 hours with your free quotes.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 my-6">
      <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-600 mb-4">{subtitle}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="07xxx xxxxxx"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="SL1 5XX"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type of Loft Conversion</label>
            <select
              value={formData.projectType}
              onChange={(e) => setFormData({...formData, projectType: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="velux">Velux / Roof Light</option>
              <option value="dormer">Dormer</option>
              <option value="hip-to-gable">Hip to Gable</option>
              <option value="mansard">Mansard</option>
              <option value="not-sure">Not Sure Yet</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">When do you want to start?</label>
            <select
              value={formData.timeline}
              onChange={(e) => setFormData({...formData, timeline: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="asap">ASAP</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
              <option value="just-researching">Just researching</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anything else we should know? (optional)</label>
          <textarea
            value={formData.details}
            onChange={(e) => setFormData({...formData, details: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="e.g. Want an extra bedroom with en-suite..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors disabled:bg-blue-400"
        >
          {loading ? 'Submitting...' : cta}
        </button>

        <p className="text-xs text-gray-500 text-center">
          ✓ 100% free ✓ No obligation ✓ Takes 30 seconds
        </p>
      </form>
    </div>
  );
}
