import { Metadata } from 'next'
import Link from 'next/link'
import OnboardingForm from '@/components/OnboardingForm'

export const metadata: Metadata = {
  title: 'Thank You! | Slough.co',
  description: 'Thanks for your purchase. Complete your business details to get started.',
}

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: { plan?: string }
}) {
  const plan = searchParams.plan || 'story'
  
  const planNames: Record<string, string> = {
    'sponsored': 'Sponsored Listing',
    'story': 'Story Listing',
    'homepage': 'Homepage Banner',
  }

  const planName = planNames[plan] || 'Story Listing'

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto max-w-3xl px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">Slough</span>
            <span className="text-xl font-light text-blue-600">.co</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-12">
        {/* Success Message */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-slate-600">
            Thanks for purchasing your <strong>{planName}</strong>.
          </p>
          <p className="text-slate-500 mt-2">
            Complete the form below so we can set up your listing.
          </p>
        </div>

        {/* Onboarding Form */}
        <OnboardingForm plan={plan} planName={planName} />

        {/* What Happens Next */}
        <div className="mt-12 bg-slate-50 rounded-2xl p-6">
          <h2 className="font-semibold text-slate-900 mb-4">What happens next?</h2>
          <ol className="space-y-3 text-slate-600">
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
              <span>We'll review your details and may reach out for photos or extra info.</span>
            </li>
            {plan === 'story' && (
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                <span>We'll write your article within 5-7 business days.</span>
              </li>
            )}
            <li className="flex gap-3">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">{plan === 'story' ? '3' : '2'}</span>
              <span>Your listing goes live and we'll send you the link!</span>
            </li>
          </ol>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16 py-8">
        <div className="container mx-auto max-w-3xl px-4 text-center text-slate-400">
          <p>Questions? Email us at <a href="mailto:hello@slough.co" className="text-white hover:underline">hello@slough.co</a></p>
        </div>
      </footer>
    </div>
  )
}
