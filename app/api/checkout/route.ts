import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe lazily to avoid build-time errors
function getStripe() {
  const key = process.env.STRIPE_WATERLOOVILLE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  return new Stripe(key, {
    apiVersion: '2026-01-28.clover',
  });
}

const PRODUCT_DESCRIPTIONS: Record<string, string> = {
  'story-listing': 'Professional article about your business, SEO optimised for Google ranking, featured in newsletter & social media.',
  'sponsored': 'Top placement in your category page with Sponsored badge. Limited to 2-3 slots per category.',
  'homepage-banner': 'Premium banner placement on the Slough.co homepage for maximum visibility. Exclusive single slot.',
};

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    const { product, productName, price, mode } = await request.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.slough.co';

    // Build session config based on payment mode
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      success_url: `${baseUrl}/register-business/success?session_id={CHECKOUT_SESSION_ID}&product=${product}`,
      cancel_url: `${baseUrl}/register-business`,
      metadata: {
        product: product,
      },
      billing_address_collection: 'required',
      custom_fields: [
        {
          key: 'business_name',
          label: { type: 'custom', custom: 'Business Name' },
          type: 'text',
        },
        {
          key: 'business_phone',
          label: { type: 'custom', custom: 'Phone Number' },
          type: 'text',
          optional: true,
        },
      ],
    };

    if (mode === 'subscription') {
      // Subscription mode for sponsored listings
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${productName} - Slough.co`,
              description: PRODUCT_DESCRIPTIONS[product] || '',
              images: ['https://www.slough.co/og-image.png'],
            },
            unit_amount: price,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ];
    } else {
      // One-time payment mode
      sessionConfig.mode = 'payment';
      sessionConfig.customer_creation = 'always';
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `${productName} - Slough.co`,
              description: PRODUCT_DESCRIPTIONS[product] || '',
              images: ['https://www.slough.co/og-image.png'],
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
// Trigger redeploy Sat Jan 31 18:52:03 GMT 2026
// Redeploy 1769885766
