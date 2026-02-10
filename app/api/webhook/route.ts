import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

function getStripe() {
  const key = process.env.STRIPE_WATERLOOVILLE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: '2026-01-28.clover' });
}

const PRODUCT_NAMES: Record<string, string> = {
  'story-listing': 'Story Listing',
  'sponsored': 'Sponsored Listing',
  'homepage-banner': 'Homepage Banner',
};

const PRODUCT_EMOJIS: Record<string, string> = {
  'story-listing': '📝',
  'sponsored': '⭐',
  'homepage-banner': '🏠',
};

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not set');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }
    
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const product = session.metadata?.product || 'unknown';
    const productName = PRODUCT_NAMES[product] || product;
    const productEmoji = PRODUCT_EMOJIS[product] || '📦';
    const amount = session.amount_total ? `£${(session.amount_total / 100).toFixed(2)}` : 'N/A';
    const customerEmail = session.customer_details?.email || 'No email';
    const customerName = session.customer_details?.name || '';
    const businessName = session.custom_fields?.find(f => f.key === 'business_name')?.text?.value || 'Unknown';
    const phone = session.custom_fields?.find(f => f.key === 'business_phone')?.text?.value || '';
    
    // Send notification to Telegram - SALE notification (different from registration)
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    
    if (telegramToken && telegramChatId) {
      const message = `💰💰💰 *SALE!* 💰💰💰\n\n` +
        `${productEmoji} *${productName}*\n\n` +
        `*Amount:* ${amount}\n` +
        `*Business:* ${businessName}\n` +
        `*Customer:* ${customerName || customerEmail}\n` +
        `*Email:* ${customerEmail}` +
        (phone ? `\n*Phone:* ${phone}` : '') +
        `\n\n` +
        `_${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}_`;

      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        });
      } catch (telegramError) {
        console.error('Failed to send Telegram notification:', telegramError);
      }
    }

    console.log(`✅ Sale completed: ${productName} - ${businessName} - ${amount}`);
  }

  if (event.type === 'customer.subscription.created') {
    const session = event.data.object as Stripe.Subscription;
    
    // Notify about new subscription
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    
    if (telegramToken && telegramChatId) {
      const message = `🔄 *New Subscription Started*\n\n` +
        `Subscription ID: \`${session.id}\`\n` +
        `Status: ${session.status}\n\n` +
        `_${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}_`;

      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        });
      } catch (e) {
        console.error('Telegram notification failed:', e);
      }
    }
    
    console.log(`📅 New subscription created: ${session.id}`);
  }

  if (event.type === 'customer.subscription.deleted') {
    const session = event.data.object as Stripe.Subscription;
    
    // Notify about cancellation
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    
    if (telegramToken && telegramChatId) {
      const message = `❌ *Subscription Cancelled*\n\n` +
        `Subscription ID: \`${session.id}\`\n\n` +
        `_${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}_`;

      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        });
      } catch (e) {
        console.error('Telegram notification failed:', e);
      }
    }
    
    console.log(`❌ Subscription cancelled: ${session.id}`);
  }

  return NextResponse.json({ received: true });
}
