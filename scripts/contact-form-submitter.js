#!/usr/bin/env node
/**
 * Slough Contact Form Submitter
 * Finds businesses without emails, detects contact forms, and submits outreach.
 * Skips forms with CAPTCHAs.
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const BUSINESS_EMAILS_FILE = path.join(DATA_DIR, 'business-emails.json');
const SUBMISSION_LOG = path.join(DATA_DIR, 'contact-form-submissions.json');

const MESSAGE_TEMPLATE = (businessName, articleUrl) => `Hi there,

I run slough.co, a local guide to the best businesses in the area.

I wanted to let you know that ${businessName} has been featured on our site - your stellar reviews are seriously impressive!

Check it out: ${articleUrl}

If you'd like to claim your listing and get priority placement (plus a direct link to your website), it's just £19/month or £149/year.

Either way, congrats on building such a great reputation locally!

Zack
Slough.co`;

// Load businesses without emails
function getBusinessesWithoutEmails() {
  const data = JSON.parse(fs.readFileSync(BUSINESS_EMAILS_FILE, 'utf8'));
  return data.filter(b => 
    (!b.emails || b.emails.length === 0) && 
    b.website && 
    !b.website.match(/facebook|instagram|google\.com|yelp|tripadvisor/)
  );
}

// Load submission log
function loadSubmissionLog() {
  try {
    return JSON.parse(fs.readFileSync(SUBMISSION_LOG, 'utf8'));
  } catch {
    return { submissions: [] };
  }
}

// Save submission log
function saveSubmission(log) {
  fs.writeFileSync(SUBMISSION_LOG, JSON.stringify(log, null, 2));
}

// Check if already submitted
function alreadySubmitted(log, slug) {
  return log.submissions.some(s => s.slug === slug);
}

// Detect and fill contact form
async function trySubmitContactForm(page, business) {
  const { name, slug, website, category } = business;
  const articleUrl = `https://slough.co/editorial/${category || 'business'}/${slug}`;
  
  console.log(`\n📋 Trying: ${name}`);
  console.log(`   Website: ${website}`);
  
  try {
    // Try common contact page URLs
    const contactUrls = [
      website.replace(/\/$/, '') + '/contact',
      website.replace(/\/$/, '') + '/contact-us',
      website.replace(/\/$/, '') + '/contact-us/',
      website
    ];
    
    let formFound = false;
    
    for (const url of contactUrls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
        
        // Check for CAPTCHA - skip if found
        const hasCaptcha = await page.evaluate(() => {
          return !!document.querySelector('iframe[src*="recaptcha"]') ||
                 !!document.querySelector('.g-recaptcha') ||
                 !!document.querySelector('[data-sitekey]') ||
                 document.body.innerHTML.includes('hcaptcha');
        });
        
        if (hasCaptcha) {
          console.log('   ⚠️  CAPTCHA detected - skipping');
          return { status: 'captcha', url };
        }
        
        // Look for contact form
        const formInfo = await page.evaluate(() => {
          const forms = document.querySelectorAll('form');
          for (const form of forms) {
            const inputs = form.querySelectorAll('input, textarea');
            const hasName = [...inputs].some(i => 
              i.name?.match(/name/i) || i.placeholder?.match(/name/i) || i.id?.match(/name/i)
            );
            const hasEmail = [...inputs].some(i => 
              i.type === 'email' || i.name?.match(/email/i) || i.placeholder?.match(/email/i)
            );
            const hasMessage = [...inputs].some(i => 
              i.tagName === 'TEXTAREA' || i.name?.match(/message|comment|enquiry/i)
            );
            
            if (hasEmail && hasMessage) {
              return {
                found: true,
                hasName,
                hasEmail,
                hasMessage,
                formId: form.id || null
              };
            }
          }
          return { found: false };
        });
        
        if (formInfo.found) {
          formFound = true;
          console.log('   ✅ Contact form found!');
          
          // Fill the form
          const message = MESSAGE_TEMPLATE(name, articleUrl);
          
          // Fill name field
          const nameSelectors = [
            'input[name*="name" i]',
            'input[placeholder*="name" i]',
            'input[id*="name" i]',
            'input[type="text"]:first-of-type'
          ];
          for (const sel of nameSelectors) {
            try {
              await page.type(sel, 'Zack from Slough.co', { delay: 50 });
              break;
            } catch {}
          }
          
          // Fill email field
          const emailSelectors = [
            'input[type="email"]',
            'input[name*="email" i]',
            'input[placeholder*="email" i]'
          ];
          for (const sel of emailSelectors) {
            try {
              await page.type(sel, 'zack@slough.co', { delay: 50 });
              break;
            } catch {}
          }
          
          // Fill subject if exists
          const subjectSelectors = [
            'input[name*="subject" i]',
            'input[placeholder*="subject" i]'
          ];
          for (const sel of subjectSelectors) {
            try {
              await page.type(sel, "You're featured on Slough.co!", { delay: 50 });
              break;
            } catch {}
          }
          
          // Fill message
          const messageSelectors = [
            'textarea',
            'textarea[name*="message" i]',
            'textarea[name*="comment" i]'
          ];
          for (const sel of messageSelectors) {
            try {
              await page.type(sel, message, { delay: 10 });
              break;
            } catch {}
          }
          
          // Find and click submit button
          const submitSelectors = [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:contains("Send")',
            'button:contains("Submit")',
            '.submit',
            '#submit'
          ];
          
          for (const sel of submitSelectors) {
            try {
              await page.click(sel);
              await page.waitForTimeout(2000);
              console.log('   📤 Form submitted!');
              return { status: 'submitted', url };
            } catch {}
          }
          
          return { status: 'form_found_no_submit', url };
        }
      } catch (e) {
        // URL didn't work, try next
      }
    }
    
    if (!formFound) {
      console.log('   ❌ No contact form found');
      return { status: 'no_form' };
    }
    
  } catch (e) {
    console.log(`   ❌ Error: ${e.message}`);
    return { status: 'error', error: e.message };
  }
}

// Main function
async function main() {
  const maxSubmissions = parseInt(process.argv[2]) || 5;
  console.log(`\n🚀 Slough Contact Form Submitter`);
  console.log(`   Target: ${maxSubmissions} submissions\n`);
  
  const businesses = getBusinessesWithoutEmails();
  const log = loadSubmissionLog();
  
  console.log(`📊 Found ${businesses.length} businesses without emails`);
  
  // Filter out already submitted
  const toProcess = businesses.filter(b => !alreadySubmitted(log, b.slug));
  console.log(`📋 ${toProcess.length} not yet attempted\n`);
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36');
  
  let submitted = 0;
  
  for (const business of toProcess) {
    if (submitted >= maxSubmissions) break;
    
    const result = await trySubmitContactForm(page, business);
    
    // Log the attempt
    log.submissions.push({
      slug: business.slug,
      name: business.name,
      website: business.website,
      ...result,
      timestamp: new Date().toISOString()
    });
    saveSubmission(log);
    
    if (result.status === 'submitted') {
      submitted++;
      console.log(`   ✅ (${submitted}/${maxSubmissions})`);
    }
    
    // Small delay between attempts
    await page.waitForTimeout(2000);
  }
  
  await browser.close();
  
  console.log(`\n✅ Done! Submitted ${submitted} contact forms.`);
  console.log(`📝 Log saved to: ${SUBMISSION_LOG}`);
}

main().catch(console.error);
