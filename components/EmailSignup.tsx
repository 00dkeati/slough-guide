'use client';

import { useState } from 'react';

interface EmailSignupProps {
  listId?: string;
  heading?: string;
  subheading?: string;
  buttonText?: string;
  successMessage?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'hero';
}

export default function EmailSignup({
  listId = 'XvLp6K', // Default list ID - update in Klaviyo dashboard
  heading = '🎟️ Free Local Deals',
  subheading = 'Exclusive vouchers from Slough businesses + weekly local news. Join 1,000+ locals.',
  buttonText = 'Get Free Deals',
  successMessage = 'You\'re in! Check your email to confirm.',
  className = '',
  variant = 'default',
}: EmailSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Use Klaviyo's client-side API
      const response = await fetch('https://a.klaviyo.com/client/subscriptions/?company_id=' + process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'revision': '2024-02-15',
        },
        body: JSON.stringify({
          data: {
            type: 'subscription',
            attributes: {
              profile: {
                data: {
                  type: 'profile',
                  attributes: {
                    email: email,
                    properties: {
                      source: 'slough.co website',
                    },
                  },
                },
              },
              custom_source: 'Website Signup',
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: listId,
                },
              },
            },
          },
        }),
      });

      if (response.ok || response.status === 202) {
        setStatus('success');
        setEmail('');
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.errors?.[0]?.detail || 'Subscription failed');
      }
    } catch (err) {
      console.error('Klaviyo subscription error:', err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        {status === 'success' ? (
          <p className="text-green-600 font-medium">{successMessage}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? '...' : buttonText}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-600 text-sm mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white ${className}`}>
        <h3 className="text-2xl font-bold mb-2">{heading}</h3>
        <p className="text-blue-100 mb-6">{subheading}</p>
        
        {status === 'success' ? (
          <div className="bg-white/20 backdrop-blur rounded-lg p-4">
            <p className="font-medium">✓ {successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-white"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : buttonText}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-200 text-sm mt-2">{errorMessage}</p>
        )}
        <p className="text-blue-200 text-xs mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-slate-50 border border-slate-200 rounded-xl p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 mb-1">{heading}</h3>
      <p className="text-slate-600 text-sm mb-4">{subheading}</p>
      
      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-700 font-medium">✓ {successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : buttonText}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
      )}
      <p className="text-slate-400 text-xs mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
