import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'onboarding-submissions.json');

// Telegram notification (optional)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramNotification(data: any) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const message = `🆕 New ${data.planName} Purchase!

📍 Business: ${data.businessName}
👤 Contact: ${data.contactName}
📧 Email: ${data.email}
📞 Phone: ${data.phone}
📂 Category: ${data.category}
🌐 Website: ${data.website || 'N/A'}

📝 About:
${data.description}`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Load existing submissions
    let submissions: any[] = [];
    try {
      const existing = await fs.readFile(DATA_FILE, 'utf-8');
      submissions = JSON.parse(existing);
    } catch {
      // File doesn't exist yet, start fresh
    }

    // Add new submission
    const submission = {
      id: Date.now().toString(),
      ...data,
    };
    submissions.push(submission);

    // Save to file
    await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2));

    // Send notification
    await sendTelegramNotification(data);

    return NextResponse.json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Onboarding submission error:', error);
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const submissions = JSON.parse(data);
    return NextResponse.json(submissions);
  } catch {
    return NextResponse.json([]);
  }
}
