import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Local Businesses in Slough | Business Directory',
  description: 'Search and find local businesses in Slough, Berkshire. Browse restaurants, shops, services, and more with our comprehensive business directory.',
  keywords: [
    'slough businesses',
    'local search',
    'business directory',
    'slough directory',
    'find businesses slough',
    'search businesses',
    'local services',
    'slough search'
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Search Local Businesses in Slough',
    description: 'Find the perfect local business for your needs in Slough, Berkshire.',
    type: 'website',
    url: 'https://slough.co/search',
    siteName: 'Slough.co',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Local Businesses in Slough',
    description: 'Find the perfect local business for your needs in Slough, Berkshire.',
  },
  alternates: {
    canonical: 'https://slough.co/search',
  },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
