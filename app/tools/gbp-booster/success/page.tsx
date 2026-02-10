'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, Mail, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const businessName = searchParams.get('business') || 'your business';

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Thank you for your order! We'll start optimizing <strong>{decodeURIComponent(businessName)}</strong>'s Google Business Profile right away.
        </p>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-left mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">What happens next:</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Within 24 hours</p>
                <p className="text-sm text-gray-600">
                  We'll review your profile in detail and begin implementing the optimizations.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Email confirmation</p>
                <p className="text-sm text-gray-600">
                  You'll receive a confirmation email with details about the changes we've made.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Within 48 hours</p>
                <p className="text-sm text-gray-600">
                  All optimizations complete! We'll send you a before/after report showing what we improved.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/tools/gbp-booster" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Audit Another Business
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Slough.co
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Questions? Contact us at{' '}
          <a href="mailto:dean@slough.co" className="text-green-600 hover:underline">
            dean@slough.co
          </a>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
