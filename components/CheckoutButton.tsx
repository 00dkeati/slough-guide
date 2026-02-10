'use client'

declare global {
  interface Window {
    fbq: (...args: any[]) => void
  }
}

interface CheckoutButtonProps {
  href: string
  className?: string
  children: React.ReactNode
}

export default function CheckoutButton({ href, className, children }: CheckoutButtonProps) {
  const handleClick = () => {
    // Fire Facebook AddToCart event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: '#1 Sponsored Listing - Slough.co',
        content_category: 'Sponsored Listing',
        content_ids: ['sponsored-listing-149'],
        content_type: 'product',
        value: 149.00,
        currency: 'GBP'
      })
    }
  }

  return (
    <a 
      href={href}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}
