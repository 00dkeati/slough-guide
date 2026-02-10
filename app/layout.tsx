import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import EmailPopup from '@/components/EmailPopup'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
  variable: '--font-inter'
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.slough.co'),
  title: {
    default: 'Slough.co — Local Directory & News',
    template: '%s | Slough.co'
  },
  description: 'Find trusted local businesses, read the latest news, and discover what\'s happening in Slough and surrounding areas. Your complete local directory and community guide.',
  keywords: [
    'Slough',
    'Slough Berkshire', 
    'Slough directory',
    'Slough news',
    'Slough businesses',
    'Slough shops',
    'Slough SL1',
    'Slough SL2',
    'Slough SL3',
    'local directory',
    'local news',
    'Berkshire',
    'Langley',
    'Cippenham',
    'Chalvey',
    'Britwell',
    'Colnbrook'
  ],
  authors: [{ name: 'Slough.co Team' }],
  creator: 'Slough.co',
  publisher: 'Slough.co',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.slough.co',
    siteName: 'Slough.co',
    title: 'Slough.co — Local Directory & News',
    description: 'Find trusted local businesses, read the latest news, and discover what\'s happening in Slough and surrounding areas.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Slough.co - Local Directory & News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slough.co — Local Directory & News',
    description: 'Find trusted local businesses, read the latest news, and discover what\'s happening in Slough and surrounding areas.',
    images: ['/og-image.png'],
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
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://www.slough.co',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {/* Klaviyo On-Site JS for email popups */}
        <Script
          src="//static.klaviyo.com/onsite/js/klaviyo.js?company_id=ReizhG"
          strategy="afterInteractive"
        />
        {/* Meta Pixel */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1410040510671745');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img 
            height="1" 
            width="1" 
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1410040510671745&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <div className="min-h-screen bg-cream-50">
          {children}
        </div>
        <EmailPopup />
      </body>
    </html>
  )
}

