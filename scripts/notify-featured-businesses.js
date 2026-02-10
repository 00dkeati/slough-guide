#!/usr/bin/env node
/**
 * Send "You're Featured!" emails to businesses via Klaviyo
 */

const KLAVIYO_API_KEY = 'pk_632b4f44496526f6e65d15229648c663bb';
const FEATURED_LIST_ID = 'XvLp6K'; // Same list as newsletter for now

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

console.log(`Found ${validBusinesses.length} businesses with valid emails\n`);

async function addProfileToKlaviyo(business) {
  const email = business.emails[0];
  const profileUrl = `https://slough.co/biz/${business.slug}`;
  
  try {
    // Create/update profile
    const response = await fetch('https://a.klaviyo.com/api/profiles/', {
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
              business_website: business.website,
              profile_url: profileUrl,
              source: 'Featured Business Notification',
              featured_date: new Date().toISOString(),
            },
          },
        },
      }),
    });

    if (response.ok || response.status === 201) {
      const data = await response.json();
      console.log(`✓ Created profile: ${business.name} (${email})`);
      return data.data.id;
    } else if (response.status === 409) {
      // Profile exists, update it
      console.log(`→ Profile exists: ${business.name} (${email})`);
      return null; // We'll handle existing profiles separately
    } else {
      const error = await response.text();
      console.log(`✗ Failed: ${business.name} - ${response.status}: ${error}`);
      return null;
    }
  } catch (err) {
    console.log(`✗ Error: ${business.name} - ${err.message}`);
    return null;
  }
}

async function subscribeToList(email, listId) {
  try {
    const response = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=ReizhG`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'revision': '2024-02-15',
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email,
                },
              },
            },
            custom_source: 'Featured Business',
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: listId,
              },
            },
          },
        },
      }),
    });

    return response.ok || response.status === 202;
  } catch (err) {
    return false;
  }
}

async function triggerFeaturedEvent(email, business) {
  const profileUrl = `https://slough.co/biz/${business.slug}`;
  
  try {
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
                  name: 'Business Featured',
                },
              },
            },
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: email,
                },
              },
            },
            properties: {
              business_name: business.name,
              business_category: business.category,
              profile_url: profileUrl,
              website: business.website,
            },
            time: new Date().toISOString(),
          },
        },
      }),
    });

    if (response.ok || response.status === 202) {
      console.log(`  → Triggered "Business Featured" event`);
      return true;
    } else {
      const error = await response.text();
      console.log(`  ✗ Event failed: ${error}`);
      return false;
    }
  } catch (err) {
    console.log(`  ✗ Event error: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('=== Notifying Featured Businesses ===\n');
  
  let successCount = 0;
  
  for (const business of validBusinesses) {
    await addProfileToKlaviyo(business);
    
    const email = business.emails[0];
    
    // Subscribe to list
    const subscribed = await subscribeToList(email, FEATURED_LIST_ID);
    if (subscribed) {
      console.log(`  → Added to list`);
    }
    
    // Trigger the featured event (for flow automation)
    await triggerFeaturedEvent(email, business);
    
    successCount++;
    console.log('');
    
    // Rate limiting - wait 200ms between requests
    await new Promise(r => setTimeout(r, 200));
  }
  
  console.log(`\n=== Complete ===`);
  console.log(`Processed ${successCount} businesses`);
  console.log(`\nNext step: Create a Klaviyo Flow triggered by "Business Featured" event`);
  console.log(`to automatically send the notification email.`);
}

main().catch(console.error);
