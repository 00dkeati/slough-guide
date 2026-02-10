import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Simple file-based lead storage + Telegram notification
const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.json');
// Use Dean's main Telegram for notifications
const TELEGRAM_BOT_TOKEN = process.env.KP_CHAT_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = '1401704724';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  postcode: string;
  category: string;
  location: string;
  projectType?: string;
  timeline?: string;
  details?: string;
  source: string;
  submittedAt: string;
  status: 'new' | 'contacted' | 'sold' | 'closed';
}

function loadLeads(): Lead[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading leads:', e);
  }
  return [];
}

function saveLeads(leads: Lead[]) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (e) {
    console.error('Error saving leads:', e);
  }
}

async function notifyTelegram(lead: Lead) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.log('No Telegram bot token configured');
    return;
  }

  const message = `🎯 NEW LEAD - Slough.co

📋 ${lead.category.replace('-', ' ').toUpperCase()}

👤 ${lead.name}
📧 ${lead.email}
📱 ${lead.phone}
📍 ${lead.postcode}

🏠 Type: ${lead.projectType || 'Not specified'}
⏰ Timeline: ${lead.timeline || 'Not specified'}
${lead.details ? `💬 Notes: ${lead.details}\n` : ''}
📊 Source: ${lead.source}
🕐 Time: ${new Date(lead.submittedAt).toLocaleString('en-GB')}

💰 SELL THIS LEAD TO A LOFT COMPANY!
📞 Call Complete Carpentry: 07939 890 225
📞 Call D Scott Lofts: 0800 44 88 474`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (e) {
    console.error('Telegram notification failed:', e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const lead: Lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      postcode: data.postcode || '',
      category: data.category || 'general',
      location: data.location || 'slough',
      projectType: data.projectType,
      timeline: data.timeline,
      details: data.details,
      source: data.source || 'website',
      submittedAt: data.submittedAt || new Date().toISOString(),
      status: 'new'
    };

    // Save to file
    const leads = loadLeads();
    leads.push(lead);
    saveLeads(leads);

    // Notify via Telegram
    await notifyTelegram(lead);

    return NextResponse.json({ 
      success: true, 
      message: 'Lead received',
      leadId: lead.id 
    });

  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return lead stats (for admin use)
  const leads = loadLeads();
  return NextResponse.json({
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    byCategory: leads.reduce((acc, l) => {
      acc[l.category] = (acc[l.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  });
}
