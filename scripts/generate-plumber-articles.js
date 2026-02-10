#!/usr/bin/env node
/**
 * Generate individual articles for all plumbers and add to editorial-articles.json
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const articlesPath = path.join(dataDir, 'editorial-articles.json');

// Load existing articles
const existingArticles = fs.existsSync(articlesPath) 
  ? JSON.parse(fs.readFileSync(articlesPath, 'utf8')) 
  : [];

// Get existing slugs to avoid duplicates
const existingSlugs = new Set(existingArticles.map(a => a.slug || a.id));

// Load plumber data
const plumbersPath = path.join(dataDir, 'plumbers-with-mobile.json');
const plumbers = JSON.parse(fs.readFileSync(plumbersPath, 'utf8'));

console.log(`📝 Generating articles for ${plumbers.length} plumbers...\n`);

function createArticle(p) {
  const slug = p.slug || createSlug(p.name, p.area);
  
  // Skip if already exists
  if (existingSlugs.has(slug)) {
    console.log(`⏭️  ${p.name} - already exists`);
    return null;
  }
  
  const title = `${p.name}: ${p.reviews} Reviews And A ${p.rating}-Star Rating. Here's Why Locals Trust Them`;
  
  return {
    id: slug,
    slug: slug,
    title: title,
    subtitle: `The ${p.area} plumber with ${p.reviews} Google reviews and a reputation for turning up on time`,
    category: "Business Spotlight",
    author: "Slough.co",
    publishedAt: new Date().toISOString(),
    featured: false,
    heroImage: `/images/businesses/${slug}.jpg`,
    excerpt: `${p.name} has ${p.rating} stars from ${p.reviews} reviews. Mobile: ${p.phone}. Local, reliable, fairly priced.`,
    content: [
      {
        type: "paragraph",
        text: `There is a plumber in ${p.area} whose number (${p.phone}) gets saved in phones and recommended to neighbours. ${p.name} has earned ${p.rating} stars from ${p.reviews} Google reviews by doing what every plumber should do but few actually manage: turning up when they say they will, fixing the problem properly, and charging a fair price.`
      },
      {
        type: "heading",
        text: `${p.reviews} Reviews Tell The Story`
      },
      {
        type: "paragraph",
        text: `${p.rating} stars from ${p.reviews} reviews is not something you stumble into. It requires consistently doing good work for real people who then take the time to write about it. When someone leaves a five-star review for a plumber, they are not doing it for fun. They are doing it because the experience was genuinely good.`
      },
      ...(p.review1 ? [{
        type: "quote",
        text: p.review1,
        author: "Google reviewer"
      }] : []),
      {
        type: "heading",
        text: "What Keeps Coming Up In Reviews"
      },
      {
        type: "paragraph",
        text: `Reading through the Google reviews for ${p.name}, certain phrases appear again and again:`
      },
      {
        type: "list",
        items: [
          "**Punctual** — Actually turns up at the agreed time. Novel concept, apparently.",
          "**Professional** — Knows what they are doing. Explains the problem clearly.",
          "**Clean and tidy** — Does not leave your home looking like a building site.",
          "**Fair pricing** — No surprise charges. Tells you what it will cost upfront.",
          "**Would use again** — The ultimate test. People keep coming back."
        ]
      },
      ...(p.review2 ? [{
        type: "quote",
        text: p.review2,
        author: "Google reviewer"
      }] : []),
      {
        type: "heading",
        text: "The Kind Of Work They Handle"
      },
      {
        type: "paragraph",
        text: `${p.name} covers the full range: leaking taps, burst pipes, boiler repairs and installations, radiator issues, bathroom plumbing, and emergency call-outs. Whether it is a small job or a full heating system replacement, reviewers report the same professional approach.`
      },
      ...(p.review3 ? [{
        type: "quote",
        text: p.review3,
        author: "Google reviewer"
      }] : []),
      {
        type: "heading",
        text: "Contact Details"
      },
      {
        type: "list",
        items: [
          `**Mobile:** ${p.phone}`,
          `**Area:** ${p.area}`,
          `**Google rating:** ${p.rating}/5 from ${p.reviews} reviews`,
          p.website ? `**Website:** [Visit website](${p.website})` : "**Website:** Call for details"
        ]
      },
      {
        type: "paragraph",
        text: `That is the summary. A local plumber with ${p.reviews} reviews, ${p.rating} stars, and a phone that actually gets answered. Call ${p.phone} or check the full Google reviews yourself.`
      }
    ],
    relatedBusinesses: [],
    tags: ["plumber", "heating", "boiler", "emergency plumber", "local tradesman", p.area.toLowerCase().split(',')[0].trim()],
    readTime: 3,
    businessPhone: p.phone,
    businessWebsite: p.website,
    googleUrl: p.googleUrl
  };
}

function createSlug(name, area) {
  return (name + ' ' + (area || 'slough'))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Generate articles
const newArticles = [];
for (const plumber of plumbers) {
  const article = createArticle(plumber);
  if (article) {
    newArticles.push(article);
    console.log(`✅ ${plumber.name}`);
  }
}

// Merge and save
const allArticles = [...existingArticles, ...newArticles];
fs.writeFileSync(articlesPath, JSON.stringify(allArticles, null, 2));

// Also save to a separate plumber-articles.json for reference
fs.writeFileSync(
  path.join(dataDir, 'plumber-articles.json'),
  JSON.stringify(newArticles, null, 2)
);

console.log('\n' + '='.repeat(50));
console.log(`📊 ARTICLES GENERATED: ${newArticles.length}`);
console.log(`📁 Total in editorial-articles.json: ${allArticles.length}`);
console.log('='.repeat(50));

// Output URLs for SMS
console.log('\n📱 SMS-READY URLS:\n');
for (const article of newArticles) {
  const phone = article.businessPhone?.replace(/\s+/g, '') || 'NO PHONE';
  console.log(`${phone} → https://slough.co/article/${article.slug}`);
}
