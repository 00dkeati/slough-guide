import { NextRequest, NextResponse } from 'next/server';

// Verify token - must match what you enter in Facebook
const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN || 'kidportrait_leads_2026';

// Telegram notification
const TG_BOT_TOKEN = process.env.KP_CHAT_BOT_TOKEN;
const TG_CHAT_ID = process.env.KP_CHAT_BOT_CHAT_ID || '1401704724';

// Facebook tokens for fetching lead details
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

async function sendTelegramNotification(message: string) {
  if (!TG_BOT_TOKEN) {
    console.log('No TG bot token, skipping notification');
    return;
  }
  
  try {
    await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
  }
}

async function fetchLeadDetails(leadgenId: string) {
  if (!FB_ACCESS_TOKEN) {
    console.log('No FB access token');
    return null;
  }
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${leadgenId}?access_token=${FB_ACCESS_TOKEN}`
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Failed to fetch lead details:', err);
    return null;
  }
}

// GET - Facebook webhook verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  console.log('FB Webhook verification:', { mode, token, challenge });
  
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified!');
    return new NextResponse(challenge, { status: 200 });
  }
  
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

// POST - Receive lead data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('FB Lead webhook received:', JSON.stringify(body, null, 2));
    
    // Facebook sends leadgen data in this structure
    if (body.object === 'page' && body.entry) {
      for (const entry of body.entry) {
        const pageId = entry.id;
        const changes = entry.changes || [];
        
        for (const change of changes) {
          if (change.field === 'leadgen') {
            const leadgenId = change.value?.leadgen_id;
            const formId = change.value?.form_id;
            const createdTime = change.value?.created_time;
            
            // Fetch full lead details
            let leadDetails = null;
            if (leadgenId) {
              leadDetails = await fetchLeadDetails(leadgenId);
            }
            
            // Extract field data if available
            let leadInfo = '';
            if (leadDetails?.field_data) {
              for (const field of leadDetails.field_data) {
                leadInfo += `\n• ${field.name}: ${field.values?.join(', ') || 'N/A'}`;
              }
            }
            
            // Send notification
            const message = `🎯 <b>NEW LEAD - Kid Portrait</b>

📋 Lead ID: ${leadgenId}
📝 Form ID: ${formId}
⏰ Time: ${createdTime ? new Date(createdTime * 1000).toLocaleString('en-GB') : 'Unknown'}
${leadInfo || '\n(Lead details pending - check Ads Manager)'}

<i>Follow up ASAP!</i>`;
            
            await sendTelegramNotification(message);
          }
        }
      }
    }
    
    // Always return 200 to acknowledge receipt
    return NextResponse.json({ status: 'ok' }, { status: 200 });
    
  } catch (err) {
    console.error('FB Lead webhook error:', err);
    // Still return 200 to prevent Facebook retries
    return NextResponse.json({ status: 'error logged' }, { status: 200 });
  }
}
