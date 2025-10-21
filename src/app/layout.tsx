import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

// Force new deployment with correct environment variable
export const metadata: Metadata = {
  title: {
    default: 'Slough Guide - Best Local Businesses & Services in Slough, Berkshire',
    template: '%s | Slough Guide',
  },
  description: 'Discover the best restaurants, shops, services and businesses in Slough. Read reviews, check opening hours, and find top-rated local businesses near you.',
  keywords: [
    'Slough',
    'Berkshire',
    'local businesses',
    'restaurants',
    'services',
    'reviews',
    'directory',
    'UK',
  ],
  authors: [{ name: 'Slough Guide' }],
  creator: 'Slough Guide',
  publisher: 'Slough Guide',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.SITE_CANONICAL || 'https://www.sloughguide.co.uk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: process.env.SITE_CANONICAL || 'https://www.sloughguide.co.uk',
    siteName: 'Slough Guide',
    title: 'Slough Guide - Best Local Businesses & Services in Slough, Berkshire',
    description: 'Discover the best restaurants, shops, services and businesses in Slough. Read reviews, check opening hours, and find top-rated local businesses near you.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Slough Guide - Local Business Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slough Guide - Best Local Businesses & Services in Slough, Berkshire',
    description: 'Discover the best restaurants, shops, services and businesses in Slough. Read reviews, check opening hours, and find top-rated local businesses near you.',
    images: ['/og-image.jpg'],
  },
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}