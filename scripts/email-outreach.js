#!/usr/bin/env node
/**
 * Slough Email Outreach
 * Sends outreach emails to businesses with known email addresses.
 * Uses nodemailer with configured SMTP.
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const BUSINESS_EMAILS_FILE = path.join(DATA_DIR, 'business-emails.json');
const OUTREACH_LOG = path.join(DATA_DIR, 'email-outreach-log.json');

// Email template
const EMAIL_SUBJECT = (businessName) => `${businessName} is featured on Slough.co! 🎉`;

const EMAIL_HTML = (businessName, articleUrl) => `
<p>Hi there,</p>

<p>I run <a href="https://slough.co">slough.co</a>, a local guide to the best businesses in the area.</p>

<p>I wanted to let you know that <strong>${businessName}</strong> has been featured on our site - your stellar reviews are seriously impressive!</p>

<p>👉 <a href="${articleUrl}">Check out your listing</a></p>

<p>If you'd like to <strong>claim your listing</strong> and get priority placement (plus a direct link to your website), it's just <strong>£19/month</strong> or <strong>£149/year</strong>.</p>

<p>Either way, congrats on building such a great reputation locally!</p>

<p>Best,<br>
<strong>Zack</strong><br>
<a href="https://slough.co">Slough.co</a></p>

<p style="font-size: 12px; color: #666;">
If you don't want to hear from us, just reply and let me know - no hard feelings!
</p>
`;

const EMAIL_TEXT = (businessName, articleUrl) => `
Hi there,

I run slough.co, a local guide to the best businesses in the area.

I wanted to let you know that ${businessName} has been featured on our site - your stellar reviews are seriously impressive!

Check out your listing: ${articleUrl}

If you'd like to claim your listing and get priority placement (plus a direct link to your website), it's just £19/month or £149/year.

Either way, congrats on building such a great reputation locally!

Best,
Zack
Slough.co

---
If you don't want to hear from us, just reply and let me know - no hard feelings!
`;

// Load businesses with emails
function getBusinessesWithEmails() {
  const data = JSON.parse(fs.readFileSync(BUSINESS_EMAILS_FILE, 'utf8'));
  return data.filter(b => b.emails && b.emails.length > 0);
}

// Load outreach log
function loadOutreachLog() {
  try {
    return JSON.parse(fs.readFileSync(OUTREACH_LOG, 'utf8'));
  } catch {
    return { sent: [] };
  }
}

// Save outreach log
function saveOutreachLog(log) {
  fs.writeFileSync(OUTREACH_LOG, JSON.stringify(log, null, 2));
}

// Check if already emailed
function alreadyEmailed(log, slug) {
  return log.sent.some(s => s.slug === slug);
}

// Create transporter (configure with your SMTP)
function createTransporter() {
  // Using environment variables for SMTP config
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Send email
async function sendOutreachEmail(transporter, business) {
  const { name, slug, emails, category } = business;
  const articleUrl = `https://slough.co/editorial/${category || 'business'}/${slug}`;
  const email = emails[0]; // Use first email
  
  console.log(`\n📧 Sending to: ${name}`);
  console.log(`   Email: ${email}`);
  
  try {
    const result = await transporter.sendMail({
      from: '"Zack from Slough.co" <zack@slough.co>',
      to: email,
      subject: EMAIL_SUBJECT(name),
      text: EMAIL_TEXT(name, articleUrl),
      html: EMAIL_HTML(name, articleUrl)
    });
    
    console.log(`   ✅ Sent! Message ID: ${result.messageId}`);
    return { status: 'sent', messageId: result.messageId };
    
  } catch (e) {
    console.log(`   ❌ Failed: ${e.message}`);
    return { status: 'failed', error: e.message };
  }
}

// Main function
async function main() {
  const maxEmails = parseInt(process.argv[2]) || 5;
  const dryRun = process.argv.includes('--dry-run');
  
  console.log(`\n📬 Slough Email Outreach`);
  console.log(`   Target: ${maxEmails} emails`);
  if (dryRun) console.log('   🔍 DRY RUN - no emails will be sent\n');
  
  // Check for SMTP credentials
  if (!dryRun && (!process.env.SMTP_USER || !process.env.SMTP_PASS)) {
    console.error('❌ Missing SMTP credentials!');
    console.error('   Set SMTP_USER and SMTP_PASS environment variables.');
    console.error('   Or use --dry-run to preview without sending.');
    process.exit(1);
  }
  
  const businesses = getBusinessesWithEmails();
  const log = loadOutreachLog();
  
  console.log(`📊 Found ${businesses.length} businesses with emails`);
  
  // Filter out already emailed
  const toEmail = businesses.filter(b => !alreadyEmailed(log, b.slug));
  console.log(`📋 ${toEmail.length} not yet emailed\n`);
  
  if (toEmail.length === 0) {
    console.log('✅ All businesses already contacted!');
    return;
  }
  
  let sent = 0;
  const transporter = dryRun ? null : createTransporter();
  
  for (const business of toEmail) {
    if (sent >= maxEmails) break;
    
    if (dryRun) {
      console.log(`\n[DRY RUN] Would email: ${business.name}`);
      console.log(`   To: ${business.emails[0]}`);
      console.log(`   Subject: ${EMAIL_SUBJECT(business.name)}`);
      sent++;
      continue;
    }
    
    const result = await sendOutreachEmail(transporter, business);
    
    // Log the attempt
    log.sent.push({
      slug: business.slug,
      name: business.name,
      email: business.emails[0],
      ...result,
      timestamp: new Date().toISOString()
    });
    saveOutreachLog(log);
    
    if (result.status === 'sent') {
      sent++;
      console.log(`   ✅ (${sent}/${maxEmails})`);
    }
    
    // Rate limit - 1 email per 3 seconds
    await new Promise(r => setTimeout(r, 3000));
  }
  
  console.log(`\n✅ Done! ${dryRun ? 'Would send' : 'Sent'} ${sent} emails.`);
  console.log(`📝 Log: ${OUTREACH_LOG}`);
}

main().catch(console.error);
