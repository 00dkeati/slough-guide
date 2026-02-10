import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_WATERLOOVILLE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  return new Stripe(key, {
    apiVersion: '2026-01-28.clover',
  });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    
    if (!stripe) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 500 }
      );
    }

    const { businessName, placeId, email, score } = await request.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.slough.co';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_creation: 'always',
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Google Business Profile Optimization',
              description: `Complete GBP optimization for ${businessName}. Includes: profile audit, photo optimization, review response templates, Q&A setup, and weekly posting strategy.`,
              images: ['https://www.slough.co/og-image.png'],
            },
            unit_amount: 4900, // £49.00
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/tools/gbp-booster/success?session_id={CHECKOUT_SESSION_ID}&business=${encodeURIComponent(businessName)}`,
      cancel_url: `${baseUrl}/tools/gbp-booster?cancelled=true`,
      customer_email: email || undefined,
      metadata: {
        product: 'gbp-optimization',
        businessName: businessName || '',
        placeId: placeId || '',
        auditScore: score?.toString() || '',
      },
      billing_address_collection: 'required',
      custom_fields: [
        {
          key: 'business_name',
          label: { type: 'custom', custom: 'Confirm Business Name' },
          type: 'text',
        },
        {
          key: 'phone',
          label: { type: 'custom', custom: 'Best Contact Number' },
          type: 'text',
        },
      ],
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('GBP Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
