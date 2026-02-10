import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_WATERLOOVILLE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('Stripe secret key not configured');
  }
  return new Stripe(key);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  try {
    const { email } = await req.json();
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Slough.co Homepage Banner',
              description: 'Premium homepage banner advertising for 12 months. Includes custom design and direct link to your website.',
            },
            unit_amount: 29900, // £299.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.slough.co'}/advertise/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.slough.co'}/advertise`,
      customer_email: email || undefined,
      metadata: {
        product: 'homepage_banner',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
