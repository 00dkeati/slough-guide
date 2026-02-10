#!/usr/bin/env node
/**
 * Send "You're Featured!" emails directly via Klaviyo
 */

const KLAVIYO_API_KEY = 'pk_632b4f44496526f6e65d15229648c663bb';

const businesses = require('../data/business-emails.json');

// Filter to businesses with valid emails
const validBusinesses = businesses.filter(b => 
  b.emails && 
  b.emails.length > 0 && 
  b.emails[0] && 
  !b.emails[0].startsWith('--') && 
  !b.emails[0].startsWith('u003e') &&
  b.emails[0].includes('@')
);

console.log(`Sending emails to ${validBusinesses.length} businesses...\n`);

async function createList(name) {
  const response = await fetch('https://a.klaviyo.com/api/lists/', {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'Content-Type': 'application/json',
      'revision': '2024-02-15',
    },
    body: JSON.stringify({
      data: {
        type: 'list',
        attributes: {
          name: name,
        },
      },
    }),
  });
  
  if (response.ok) {
    const data = await response.json();
    return data.data.id;
  }
  return null;
}

async function addProfilesToList(listId, profiles) {
  const response = await fetch(`https://a.klaviyo.com/api/lists/${listId}/relationships/profiles/`, {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'Content-Type': 'application/json',
      'revision': '2024-02-15',
    },
    body: JSON.stringify({
      data: profiles.map(p => ({ type: 'profile', id: p.id })),
    }),
  });
  
  return response.ok;
}

async function getOrCreateProfile(email, business) {
  // Try to get existing profile
  const searchResponse = await fetch(`https://a.klaviyo.com/api/profiles/?filter=equals(email,"${encodeURIComponent(email)}")`, {
    headers: {
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'revision': '2024-02-15',
    },
  });
  
  if (searchResponse.ok) {
    const data = await searchResponse.json();
    if (data.data && data.data.length > 0) {
      return data.data[0].id;
    }
  }
  
  // Create new profile
  const createResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'Content-Type': 'application/json',
      'revision': '2024-02-15',
    },
    body: JSON.stringify({
      data: {
        type: 'profile',
        attributes: {
          email: email,
          properties: {
            business_name: business.name,
            business_slug: business.slug,
            business_category: business.category,
            profile_url: `https://slough.co/biz/${business.slug}`,
          },
        },
      },
    }),
  });
  
  if (createResponse.ok) {
    const data = await createResponse.json();
    return data.data.id;
  }
  
  return null;
}

async function createCampaign(listId) {
  // First create the campaign
  const response = await fetch('https://a.klaviyo.com/api/campaigns/', {
    method: 'POST',
    headers: {
      'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
      'Content-Type': 'application/json',
      'revision': '2024-02-15',
    },
    body: JSON.stringify({
      data: {
        type: 'campaign',
        attributes: {
          name: 'Featured Business Notification - ' + new Date().toISOString().split('T')[0],
          audiences: {
            included: [listId],
            excluded: [],
          },
          'campaign-messages': {
            data: [{
              type: 'campaign-message',
              attributes: {
                channel: 'email',
                label: 'Featured Notification',
                content: {
                  subject: '🎉 Your business is now featured on Slough.co!',
                  preview_text: 'Local customers can now find you more easily',
                  from_email: 'hello@slough.co',
                  from_label: 'Slough.co',
                },
                render_options: {
                  shorten_links: true,
                  add_org_prefix: true,
                  add_info_link: true,
                  add_opt_out_link: true,
                },
              },
            }],
          },
          send_strategy: {
            method: 'immediate',
          },
        },
      },
    }),
  });
  
  if (response.ok) {
    const data = await response.json();
    return data.data.id;
  } else {
    const error = await response.text();
    console.log('Campaign creation failed:', error);
  }
  return null;
}

async function sendDirectEmail(email, business) {
  const profileUrl = `https://slough.co/biz/${business.slug}`;
  const categoryFormatted = business.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #dc2626; margin: 0;">🎉 You're Featured!</h1>
  </div>
  
  <p>Hi there,</p>
  
  <p>Great news — <strong>${business.name}</strong> is now featured on <a href="https://slough.co" style="color: #dc2626;">Slough.co</a>, the local directory for Slough and surrounding areas.</p>
  
  <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
    <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your business listing is live:</p>
    <a href="${profileUrl}" style="display: inline-block; background: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">View Your Listing →</a>
  </div>
  
  <p>This means local customers searching for <strong>${categoryFormatted}</strong> in Slough can now find you more easily.</p>
  
  <p><strong>Want to stand out even more?</strong> Reply to this email to:</p>
  <ul>
    <li>Add photos to your listing</li>
    <li>Update your business description</li>
    <li>Get featured in our weekly newsletter</li>
  </ul>
  
  <p>Thanks for being part of the Slough community!</p>
  
  <p>Best,<br>
  <strong>The Slough.co Team</strong></p>
  
  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
  
  <p style="font-size: 12px; color: #999; text-align: center;">
    <a href="https://slough.co" style="color: #999;">Slough.co</a> — Supporting local businesses<br>
    <a href="${profileUrl}" style="color: #999;">View your listing</a>
  </p>
</body>
</html>`;

  // Use Klaviyo's events API to trigger an email through automation
  // Since direct email sending requires templates, we'll use the profile update + event approach
  
  try {
    // Trigger a "Send Featured Email" event which can be picked up by a flow
    const response = await fetch('https://a.klaviyo.com/api/events/', {
      method: 'POST',
      headers: {
        'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        'Content-Type': 'application/json',
        'revision': '2024-02-15',
      },
      body: JSON.stringify({
        data: {
          type: 'event',
          attributes: {
            metric: {
              data: {
                type: 'metric',
                attributes: {
                  name: 'Send Featured Email Now',
                },
              },
            },
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email,
                  properties: {
                    business_name: business.name,
                    business_category: categoryFormatted,
                    profile_url: profileUrl,
                  },
                },
              },
            },
            properties: {
              business_name: business.name,
              business_category: categoryFormatted,
              profile_url: profileUrl,
              email_html: htmlContent,
            },
            time: new Date().toISOString(),
            unique_id: `featured-${business.slug}-${Date.now()}`,
          },
        },
      }),
    });

    if (response.ok || response.status === 202) {
      console.log(`✓ ${business.name} (${email})`);
      return true;
    } else {
      const error = await response.text();
      console.log(`✗ ${business.name}: ${error}`);
      return false;
    }
  } catch (err) {
    console.log(`✗ ${business.name}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Sending Featured Business Emails ===\n');
  
  let sent = 0;
  
  for (const business of validBusinesses) {
    const email = business.emails[0];
    const success = await sendDirectEmail(email, business);
    if (success) sent++;
    
    // Rate limiting
    await new Promise(r => setTimeout(r, 250));
  }
  
  console.log(`\n=== Complete ===`);
  console.log(`Triggered ${sent}/${validBusinesses.length} emails`);
  console.log(`\n⚠️  Note: Emails will send once you create a Klaviyo Flow`);
  console.log(`   triggered by "Send Featured Email Now" metric.`);
  console.log(`   Or use Klaviyo's Campaign feature to send immediately.`);
}

main().catch(console.error);
