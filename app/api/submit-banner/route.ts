import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Telegram notification
async function sendTelegramNotification(data: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || '1401704724';
  
  if (!botToken) {
    console.log('No Telegram bot token configured');
    return;
  }
  
  const message = `🎉 NEW BANNER PURCHASE!

💼 ${data.businessName}
👤 ${data.contactName}
📧 ${data.email}
📱 ${data.phone}
🌐 ${data.website}
📂 ${data.category}

📝 Tagline: "${data.tagline}"

${data.description ? `📄 Description: ${data.description}` : ''}
${data.logo ? `🖼 Logo: ${data.logo}` : ''}

💳 Stripe Session: ${data.stripeSessionId || 'N/A'}
⏰ Submitted: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}`;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Failed to send Telegram notification:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validate required fields
    const required = ['businessName', 'contactName', 'email', 'phone', 'website', 'category', 'tagline'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Add metadata
    const submission = {
      id: `banner_${Date.now()}`,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // Try to save to file (for local/simple storage)
    try {
      const dataDir = path.join(process.cwd(), 'data');
      const filePath = path.join(dataDir, 'banner-submissions.json');
      
      let submissions = [];
      try {
        const existing = await fs.readFile(filePath, 'utf-8');
        submissions = JSON.parse(existing);
      } catch {
        // File doesn't exist yet, start fresh
      }
      
      submissions.push(submission);
      await fs.writeFile(filePath, JSON.stringify(submissions, null, 2));
    } catch (err) {
      console.error('Failed to save to file:', err);
      // Continue anyway - we'll still send notification
    }
    
    // Send Telegram notification
    await sendTelegramNotification(submission);
    
    return NextResponse.json({ 
      success: true, 
      id: submission.id,
      message: 'Banner submission received' 
    });
    
  } catch (error: any) {
    console.error('Submit banner error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit' },
      { status: 500 }
    );
  }
}
