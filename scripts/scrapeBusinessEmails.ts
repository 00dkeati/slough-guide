/**
 * Scrape Business Emails
 * Crawls business websites to extract email addresses
 * 
 * Usage: npx tsx scripts/scrapeBusinessEmails.ts
 */

import fs from 'fs';
import path from 'path';

const BUSINESSES_FILE = path.join(process.cwd(), 'public/data/businesses-lightweight.json');
const OUTPUT_FILE = path.join(process.cwd(), 'data/business-emails.json');

interface Business {
  id: string;
  name: string;
  slug: string;
  website?: string;
  category: string;
  rating?: number;
  review_count?: number;
  [key: string]: any;
}

interface EmailResult {
  slug: string;
  name: string;
  category: string;
  website: string;
  emails: string[];
  scrapedAt: string;
  error?: string;
}

// Email regex - catches most common email formats
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Common pages to check for contact info
const CONTACT_PATHS = ['', '/contact', '/contact-us', '/about', '/about-us'];

// Domains to ignore (generic, not business-specific)
const IGNORED_DOMAINS = [
  'example.com', 'email.com', 'domain.com', 'yoursite.com',
  'sentry.io', 'schema.org', 'w3.org', 'facebook.com', 
  'twitter.com', 'instagram.com', 'linkedin.com', 'google.com',
  'wixpress.com', 'squarespace.com', 'godaddy.com'
];

async function fetchPage(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SloughBot/1.0; +https://slough.co)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    
    clearTimeout(timeout);
    
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractEmails(html: string): string[] {
  const matches = html.match(EMAIL_REGEX) || [];
  
  // Clean and filter
  const emails = [...new Set(matches)]
    .map(e => e.toLowerCase())
    .filter(e => {
      // Skip ignored domains
      const domain = e.split('@')[1];
      if (IGNORED_DOMAINS.some(d => domain.includes(d))) return false;
      // Skip image extensions that got caught
      if (e.endsWith('.png') || e.endsWith('.jpg') || e.endsWith('.gif')) return false;
      // Skip super long emails (probably not real)
      if (e.length > 50) return false;
      return true;
    });
  
  return emails;
}

function normalizeUrl(url: string): string {
  if (!url) return '';
  let normalized = url.trim();
  if (!normalized.startsWith('http')) {
    normalized = 'https://' + normalized;
  }
  // Remove trailing slash
  return normalized.replace(/\/$/, '');
}

async function scrapeBusiness(biz: Business): Promise<EmailResult> {
  const result: EmailResult = {
    slug: biz.slug,
    name: biz.name,
    category: biz.category,
    website: biz.website || '',
    emails: [],
    scrapedAt: new Date().toISOString(),
  };
  
  if (!biz.website) {
    result.error = 'No website';
    return result;
  }
  
  const baseUrl = normalizeUrl(biz.website);
  const allEmails: string[] = [];
  
  for (const contactPath of CONTACT_PATHS) {
    const url = baseUrl + contactPath;
    const html = await fetchPage(url);
    
    if (html) {
      const emails = extractEmails(html);
      allEmails.push(...emails);
    }
    
    // Small delay between requests to same domain
    await new Promise(r => setTimeout(r, 100));
  }
  
  result.emails = [...new Set(allEmails)];
  return result;
}

async function main() {
  // Check for --limit argument
  const limitArg = process.argv.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : Infinity;
  
  console.log('📧 Scraping business emails...\n');
  if (limit !== Infinity) console.log(`Limit: ${limit} businesses\n`);
  
  // Load businesses
  const businesses: Business[] = JSON.parse(fs.readFileSync(BUSINESSES_FILE, 'utf-8'));
  
  // Filter to unique businesses with websites
  const seen = new Set<string>();
  const withWebsites = businesses.filter(b => {
    if (!b.website || seen.has(b.name.toLowerCase())) return false;
    seen.add(b.name.toLowerCase());
    return true;
  });
  
  console.log(`Found ${withWebsites.length} unique businesses with websites\n`);
  
  // Load existing results if any
  let results: EmailResult[] = [];
  if (fs.existsSync(OUTPUT_FILE)) {
    results = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    console.log(`Loaded ${results.length} existing results\n`);
  }
  
  const existingSlugs = new Set(results.map(r => r.slug));
  let toScrape = withWebsites.filter(b => !existingSlugs.has(b.slug));
  
  // Apply limit
  if (limit !== Infinity) {
    toScrape = toScrape.slice(0, limit);
  }
  
  console.log(`Scraping ${toScrape.length} new businesses...\n`);
  
  let processed = 0;
  let found = 0;
  
  for (const biz of toScrape) {
    process.stdout.write(`\r[${processed + 1}/${toScrape.length}] ${biz.name.substring(0, 40).padEnd(40)}`);
    
    const result = await scrapeBusiness(biz);
    results.push(result);
    
    if (result.emails.length > 0) {
      found++;
      console.log(`\n   ✅ Found: ${result.emails.join(', ')}`);
    }
    
    processed++;
    
    // Save every 20 businesses
    if (processed % 20 === 0) {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    }
    
    // Rate limit - 200ms between businesses
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Final save
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  
  // Summary
  const withEmails = results.filter(r => r.emails.length > 0);
  const totalEmails = withEmails.reduce((sum, r) => sum + r.emails.length, 0);
  
  console.log('\n\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total businesses scraped: ${results.length}`);
  console.log(`Businesses with emails:   ${withEmails.length}`);
  console.log(`Total emails found:       ${totalEmails}`);
  console.log(`Success rate:             ${((withEmails.length / results.length) * 100).toFixed(1)}%`);
  console.log(`\nResults saved to: ${OUTPUT_FILE}`);
  
  // Top categories by email found
  const byCategory = withEmails.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\nEmails by category:');
  Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
}

main().catch(console.error);
