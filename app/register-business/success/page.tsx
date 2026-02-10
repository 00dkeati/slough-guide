import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Payment Successful | Slough.co',
  description: 'Thank you for your purchase. We\'ll be in touch shortly to create your Story Listing.',
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">Slough</span>
            <span className="text-xl font-light text-blue-600">.co</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-16">
        <div className="bg-white rounded-2xl border border-green-200 p-8 text-center shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-lg text-slate-600 mb-8">
            Thank you for choosing a Story Listing. We're excited to feature your business on Slough.co!
          </p>

          <div className="bg-slate-50 rounded-xl p-6 text-left mb-8">
            <h2 className="font-semibold text-slate-900 mb-4">What happens next?</h2>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <span className="text-slate-600">We'll email you within 24 hours to gather info about your business</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <span className="text-slate-600">Our team writes your professionally crafted article</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <span className="text-slate-600">You review and approve (one round of revisions included)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</span>
                <span className="text-slate-600">Article goes live + featured in newsletter & social media</span>
              </li>
            </ol>
          </div>

          <p className="text-slate-500 mb-6">
            Check your email for a confirmation receipt from Stripe.
          </p>

          <Link 
            href="/"
            className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Back to Homepage
          </Link>
        </div>
      </main>
    </div>
  )
}
