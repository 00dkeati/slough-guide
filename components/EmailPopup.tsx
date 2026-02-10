'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function EmailPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Check if already dismissed or subscribed
    const dismissed = localStorage.getItem('email-popup-dismissed');
    const subscribed = localStorage.getItem('email-subscribed');
    
    if (dismissed || subscribed) return;

    // Show popup after 8 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('email-popup-dismissed', Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');

    try {
      const response = await fetch('https://a.klaviyo.com/client/subscriptions/?company_id=ReizhG', {
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
                      source: 'Website Popup',
                    },
                  },
                },
              },
              custom_source: 'Website Popup',
            },
            relationships: {
              list: {
                data: {
                  type: 'list',
                  id: 'XvLp6K',
                },
              },
            },
          },
        }),
      });

      if (response.ok || response.status === 202) {
        setStatus('success');
        localStorage.setItem('email-subscribed', 'true');
        setTimeout(() => setIsOpen(false), 3000);
      } else {
        throw new Error('Failed');
      }
    } catch {
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image section */}
        <div className="bg-gradient-to-br from-red-600 to-red-700 px-6 py-8 text-white text-center">
          <span className="text-4xl mb-3 block">🎁</span>
          <h2 className="text-2xl font-bold mb-2">
            Get Exclusive Local Deals
          </h2>
          <p className="text-red-100 text-sm">
            Vouchers & offers from Slough businesses
          </p>
        </div>

        {/* Form section */}
        <div className="p-6">
          {status === 'success' ? (
            <div className="text-center py-4">
              <span className="text-4xl mb-3 block">✅</span>
              <p className="text-lg font-semibold text-slate-900">You're in!</p>
              <p className="text-slate-600 text-sm mt-1">Check your inbox to confirm</p>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900"
                  disabled={status === 'loading'}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Get Free Deals'}
                </button>
              </form>
              
              {status === 'error' && (
                <p className="text-red-600 text-sm text-center mt-2">Something went wrong. Try again.</p>
              )}
              
              <p className="text-slate-400 text-xs text-center mt-4">
                Join 1,000+ locals. No spam, unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
