'use client';

type ProductType = 'story-listing' | 'sponsored' | 'homepage-banner';

interface StripeCheckoutButtonProps {
  className?: string;
  children: React.ReactNode;
  product?: ProductType;
}

// Stripe Payment Links - redirect to thank-you page with plan param
const PAYMENT_LINKS: Record<ProductType, string> = {
  'sponsored': 'https://buy.stripe.com/fZu00daWEgUMeIg7mR3Ru0m',         // £14.99/mo
  'story-listing': 'https://buy.stripe.com/9B614h3uceMEdEccHb3Ru0n',     // £199 once
  'homepage-banner': 'https://buy.stripe.com/14A5kx6Go0VO0Rq9uZ3Ru0o',  // £299/year
};

export default function StripeCheckoutButton({ 
  className = '', 
  children, 
  product = 'story-listing' 
}: StripeCheckoutButtonProps) {
  const handleCheckout = () => {
    window.location.href = PAYMENT_LINKS[product];
  };

  return (
    <button
      onClick={handleCheckout}
      className={className}
    >
      {children}
    </button>
  );
}
