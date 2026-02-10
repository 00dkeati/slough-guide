import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Category mapping - normalizes user input to valid category slugs
const CATEGORY_MAP: Record<string, string> = {
  // Direct matches
  'plumber': 'plumbers',
  'plumbers': 'plumbers',
  'plumbing': 'plumbers',
  'electrician': 'electricians',
  'electricians': 'electricians',
  'electrical': 'electricians',
  'restaurant': 'restaurants',
  'restaurants': 'restaurants',
  'cafe': 'cafes',
  'cafes': 'cafes',
  'coffee': 'cafes',
  'pub': 'pubs',
  'pubs': 'pubs',
  'bar': 'pubs',
  'hairdresser': 'hairdressers',
  'hairdressers': 'hairdressers',
  'hair salon': 'hairdressers',
  'barber': 'barbers',
  'barbers': 'barbers',
  'dentist': 'dentists',
  'dentists': 'dentists',
  'dental': 'dentists',
  'gym': 'gyms',
  'gyms': 'gyms',
  'fitness': 'gyms',
  'takeaway': 'takeaways',
  'takeaways': 'takeaways',
  'takeout': 'takeaways',
  'indian': 'indian-restaurants',
  'indian restaurant': 'indian-restaurants',
  'chinese': 'chinese-restaurants',
  'chinese restaurant': 'chinese-restaurants',
  'fish and chips': 'fish-chips',
  'fish & chips': 'fish-chips',
  'chippy': 'fish-chips',
  'garage': 'garages',
  'garages': 'garages',
  'mechanic': 'garages',
  'car repair': 'garages',
  'estate agent': 'estate-agents',
  'estate agents': 'estate-agents',
  'letting agent': 'estate-agents',
  'solicitor': 'solicitors',
  'solicitors': 'solicitors',
  'lawyer': 'solicitors',
  'accountant': 'accountants',
  'accountants': 'accountants',
  'pharmacy': 'pharmacies',
  'pharmacies': 'pharmacies',
  'chemist': 'pharmacies',
};

function normalizeCategory(input: string): string {
  const lower = input.toLowerCase().trim();
  return CATEGORY_MAP[lower] || lower.replace(/\s+/g, '-');
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractPostcode(address: string): string {
  const match = address.match(/[A-Z]{1,2}[0-9][0-9A-Z]?\s*[0-9][A-Z]{2}/i);
  return match ? match[0].toUpperCase() : 'SL1';
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { businessName, category, address, phone, email, website, description, tier } = data;

    // Validate required fields
    if (!businessName || !category || !address || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const normalizedCategory = normalizeCategory(category);
    const slug = generateSlug(businessName);
    const postcode = extractPostcode(address);

    const submission = {
      id: `sub_${Date.now()}`,
      businessName,
      slug,
      category: normalizedCategory,
      originalCategory: category,
      address,
      postcode,
      phone: phone || '',
      email,
      website: website || '',
      description: description || '',
      tier: tier || 'free',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    // Send Telegram notification for new submissions
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const categoryLink = `https://www.slough.co/${normalizedCategory}`;
      const message = `🏪 *New Business Listing*\n\n` +
        `*Business:* ${businessName}\n` +
        `*Category:* ${normalizedCategory} → [View Category](${categoryLink})\n` +
        `*Address:* ${address}\n` +
        `*Postcode:* ${postcode}\n` +
        `*Phone:* ${phone || 'Not provided'}\n` +
        `*Email:* ${email}\n` +
        `*Website:* ${website || 'Not provided'}\n` +
        `*Tier:* ${tier || 'free'}\n\n` +
        `*Description:*\n${description || 'None'}\n\n` +
        `_Slug: ${slug}_\n` +
        `_Submitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}_\n\n` +
        `Reply "approve ${submission.id}" to add to directory`;

      try {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
          }),
        });
      } catch (e) {
        console.error('Telegram notification failed:', e);
      }
    }

    // Add to Klaviyo for email list (business owners segment)
    if (process.env.KLAVIYO_PRIVATE_KEY) {
      try {
        await fetch('https://a.klaviyo.com/api/profiles/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_KEY}`,
            'revision': '2024-02-15',
          },
          body: JSON.stringify({
            data: {
              type: 'profile',
              attributes: {
                email: email,
                properties: {
                  business_name: businessName,
                  business_category: normalizedCategory,
                  business_address: address,
                  business_phone: phone || '',
                  business_website: website || '',
                  business_description: description || '',
                  listing_tier: tier || 'free',
                  source: 'slough.co registration',
                },
              },
            },
          }),
        });
      } catch (e) {
        console.error('Failed to add to Klaviyo:', e);
      }
    }

    // Log for processing - this will be picked up by automation
    console.log('NEW_BUSINESS_SUBMISSION:', JSON.stringify(submission));

    return NextResponse.json({ 
      success: true, 
      id: submission.id,
      slug,
      category: normalizedCategory,
      message: `Your business will appear at slough.co/${normalizedCategory} once approved`
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
