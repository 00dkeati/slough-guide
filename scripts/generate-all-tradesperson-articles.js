#!/usr/bin/env node
/**
 * Generate articles for all tradespeople (plumbers + heating engineers)
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const articlesPath = path.join(dataDir, 'editorial-articles.json');

// Load existing articles
const existingArticles = fs.existsSync(articlesPath) 
  ? JSON.parse(fs.readFileSync(articlesPath, 'utf8')) 
  : [];

// Get existing slugs
const existingSlugs = new Set(existingArticles.map(a => a.slug || a.id));

// Load all tradespeople
const tradespeople = JSON.parse(fs.readFileSync(path.join(dataDir, 'all-tradespeople-mobile.json'), 'utf8'));

console.log(`📝 Generating articles for ${tradespeople.length} tradespeople...\n`);

function createSlug(name, area) {
  return (name + ' ' + (area || 'slough'))
    .toLowerCase()
    .replace(/[&]/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function createArticle(t) {
  const slug = t.slug || createSlug(t.name, t.area);
  
  if (existingSlugs.has(slug)) {
    console.log(`⏭️  ${t.name} - already exists`);
    return null;
  }
  
  // Determine service type from source/keywords
  const isPlumber = t.source === 'plumber' || t.sourceKeyword?.includes('plumb');
  const serviceType = isPlumber ? 'plumber' : 'heating engineer';
  const serviceDesc = isPlumber 
    ? 'plumbing and heating' 
    : 'heating, gas, and boiler services';
  
  const title = `${t.name}: ${t.reviews} Reviews And ${t.rating} Stars. Why Locals Keep Calling Back`;
  
  return {
    id: slug,
    slug: slug,
    title: title,
    subtitle: `The ${t.area || 'local'} ${serviceType} with ${t.reviews} Google reviews who answers the phone`,
    category: "Business Spotlight",
    author: "Slough.co",
    publishedAt: new Date().toISOString(),
    featured: false,
    heroImage: `/images/businesses/${slug}.jpg`,
    excerpt: `${t.name} - ${t.rating} stars, ${t.reviews} reviews. Call ${t.phone}. Local ${serviceDesc}.`,
    content: [
      {
        type: "paragraph",
        text: `There is a ${serviceType} in ${t.area || 'the local area'} whose number (${t.phone}) gets saved in contacts and passed around. ${t.name} has built a ${t.rating}-star reputation from ${t.reviews} Google reviews by doing what matters: answering the phone, turning up on time, fixing the problem properly, and charging a fair price.`
      },
      {
        type: "heading",
        text: `${t.reviews} People Took The Time To Leave Reviews`
      },
      {
        type: "paragraph",
        text: `That is not something that happens by accident. ${t.reviews} people went onto Google and wrote about their experience. At ${t.rating} stars, the pattern is clear: ${t.name} does good work and treats customers fairly.`
      },
      ...(t.review1 ? [{
        type: "quote",
        text: t.review1.substring(0, 400),
        author: "Google reviewer"
      }] : []),
      {
        type: "heading",
        text: "What Shows Up In The Reviews"
      },
      {
        type: "paragraph",
        text: `Reading through the reviews for ${t.name}, the same themes come up repeatedly:`
      },
      {
        type: "list",
        items: [
          "**Reliable** — Turns up when they say they will. That should not be unusual, but it is.",
          "**Professional** — Knows the job. Explains what needs doing without the jargon.",
          "**Fair prices** — No surprise charges. Tells you what it costs before starting.",
          "**Clean and tidy** — Does not leave your house looking like a building site.",
          "**Friendly** — Actually pleasant to have in your home."
        ]
      },
      ...(t.review2 ? [{
        type: "quote",
        text: t.review2.substring(0, 400),
        author: "Google reviewer"
      }] : []),
      {
        type: "heading",
        text: "Services"
      },
      {
        type: "paragraph",
        text: isPlumber 
          ? `${t.name} handles everything from emergency leaks and burst pipes to boiler repairs, radiator installations, and full bathroom plumbing. The kind of tradesman you call when you need someone who actually knows what they are doing.`
          : `${t.name} covers boiler repairs and servicing, radiator installations, central heating systems, gas work, and emergency call-outs. Whether it is an annual boiler service or a full system replacement, reviewers report the same professional approach.`
      },
      ...(t.review3 ? [{
        type: "quote",
        text: t.review3.substring(0, 400),
        author: "Google reviewer"
      }] : []),
      {
        type: "heading",
        text: "Contact Details"
      },
      {
        type: "list",
        items: [
          `**Mobile:** ${t.phone}`,
          `**Area:** ${t.area || 'Slough and surrounding areas'}`,
          `**Google rating:** ${t.rating}/5 from ${t.reviews} reviews`,
          t.website ? `**Website:** [Visit website](${t.website})` : "**Website:** Call for details"
        ]
      },
      {
        type: "paragraph",
        text: `That is it. A local tradesperson with ${t.reviews} reviews, ${t.rating} stars, and a mobile that actually gets answered. Call ${t.phone} to get a quote, or look them up on Google to read all the reviews yourself.`
      }
    ],
    relatedBusinesses: [],
    tags: [serviceType.replace(' ', '-'), "heating", "boiler", "gas", "local tradesman", (t.area || 'slough').toLowerCase().split(',')[0].trim()],
    readTime: 3,
    businessPhone: t.phone,
    businessWebsite: t.website,
    googleUrl: t.googleUrl
  };
}

// Generate all articles
const newArticles = [];
for (const t of tradespeople) {
  const article = createArticle(t);
  if (article) {
    newArticles.push(article);
    existingSlugs.add(article.slug); // Prevent duplicates within this run
    console.log(`✅ ${t.name} (${t.reviews} reviews)`);
  }
}

// Merge and save
const allArticles = [...existingArticles, ...newArticles];
fs.writeFileSync(articlesPath, JSON.stringify(allArticles, null, 2));

// Save tradesperson-specific list for reference
fs.writeFileSync(
  path.join(dataDir, 'tradesperson-articles.json'),
  JSON.stringify(newArticles, null, 2)
);

console.log('\n' + '='.repeat(60));
console.log(`📊 ARTICLES GENERATED: ${newArticles.length}`);
console.log(`📁 Total in editorial-articles.json: ${allArticles.length}`);
console.log('='.repeat(60));

// Create SMS outreach list
console.log('\n📱 SMS OUTREACH LIST:\n');
const smsLines = [];
for (const article of newArticles) {
  const phone = article.businessPhone?.replace(/\s+/g, '') || '';
  const url = `https://slough.co/article/${article.slug}`;
  if (phone) {
    smsLines.push({ phone, url, name: article.title.split(':')[0] });
    console.log(`${phone} → ${url}`);
  }
}

// Save SMS list
fs.writeFileSync(
  path.join(dataDir, 'tradesperson-sms-list.json'),
  JSON.stringify(smsLines, null, 2)
);

console.log(`\n✅ SMS list saved: ${smsLines.length} numbers`);
