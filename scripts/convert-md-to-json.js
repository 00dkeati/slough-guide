#!/usr/bin/env node
/**
 * Convert markdown editorials to JSON format for editorial-articles.json
 */

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content', 'editorial');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'editorial-articles.json');

// Files to convert
const newArticles = [
  'diamonds-beauty-rooms-slough.md',
  'fursace-dog-grooming-cowplain.md',
  'kerry-kynvin-beauty-cowplain.md',
  'a-touch-of-asia-cowplain.md',
  'jd-nail-studio-cowplain.md',
  'k9-4-paws-soberton.md',
  'lovely-chops-dog-grooming-portsmouth.md',
  'beau-chien-dog-grooming-portchester.md',
  'doggilocks-natural-grooming-wickham.md',
  'ryval-fitness-slough.md',
  'slough-boxing-club.md',
  'studio-sattva-slough.md',
  'bellissima-beauty-slough.md',
  'nails-by-maria-slough.md',
  'angel-cakes-slough.md',
  'hampshire-drainage-solutions.md',
  'jaw-heating-slough.md',
  'animals-at-home-meon.md',
  'mad-hatterz-coffee-house-slough.md'
];

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  
  const frontmatter = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      // Remove quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      // Handle arrays
      if (value.startsWith('[')) {
        try {
          value = JSON.parse(value.replace(/'/g, '"'));
        } catch (e) {}
      }
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, body: match[2] };
}

function parseMarkdownBody(body) {
  const content = [];
  const lines = body.trim().split('\n');
  let currentParagraph = [];
  
  for (const line of lines) {
    // Heading
    if (line.startsWith('## ')) {
      if (currentParagraph.length > 0) {
        content.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      content.push({ type: 'heading', text: line.slice(3).trim() });
    }
    // List item
    else if (line.startsWith('- **')) {
      if (currentParagraph.length > 0) {
        content.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      // Add as paragraph with bold formatting preserved
      content.push({ type: 'paragraph', text: line.slice(2).trim() });
    }
    // Quote (lines starting with ")
    else if (line.startsWith('"') && line.includes('" —')) {
      if (currentParagraph.length > 0) {
        content.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      const quoteMatch = line.match(/"(.+?)" — (.+)/);
      if (quoteMatch) {
        content.push({ type: 'quote', text: quoteMatch[1], author: quoteMatch[2] });
      }
    }
    // Empty line
    else if (line.trim() === '') {
      if (currentParagraph.length > 0) {
        content.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
    }
    // Horizontal rule or closing italics
    else if (line.startsWith('---') || (line.startsWith('*') && line.endsWith('*'))) {
      if (currentParagraph.length > 0) {
        content.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
        currentParagraph = [];
      }
      if (line.startsWith('*')) {
        content.push({ type: 'paragraph', text: line });
      }
    }
    // Regular text
    else if (line.trim()) {
      currentParagraph.push(line.trim());
    }
  }
  
  if (currentParagraph.length > 0) {
    content.push({ type: 'paragraph', text: currentParagraph.join(' ').trim() });
  }
  
  return content;
}

function estimateReadTime(content) {
  const words = content.reduce((acc, item) => {
    return acc + (item.text || '').split(/\s+/).length;
  }, 0);
  return Math.max(3, Math.ceil(words / 200));
}

// Main
const existingArticles = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
const newEntries = [];

for (const filename of newArticles) {
  const filepath = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.log(`Skipping ${filename} - not found`);
    continue;
  }
  
  const fileContent = fs.readFileSync(filepath, 'utf-8');
  const parsed = parseFrontmatter(fileContent);
  if (!parsed) {
    console.log(`Skipping ${filename} - could not parse`);
    continue;
  }
  
  const { frontmatter, body } = parsed;
  const slug = filename.replace('.md', '');
  const content = parseMarkdownBody(body);
  
  const article = {
    id: slug,
    slug: slug,
    title: frontmatter.title || slug,
    subtitle: frontmatter.subtitle || '',
    category: frontmatter.category || 'Business Spotlight',
    author: frontmatter.author || 'Slough.co',
    publishedAt: frontmatter.publishedAt || new Date().toISOString(),
    heroImage: frontmatter.heroImage || '/images/editorial/default.jpg',
    excerpt: frontmatter.excerpt || '',
    content: content,
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    readTime: estimateReadTime(content)
  };
  
  // Check if already exists
  if (!existingArticles.find(a => a.slug === slug)) {
    newEntries.push(article);
    console.log(`Added: ${slug}`);
  } else {
    console.log(`Skipped (exists): ${slug}`);
  }
}

// Merge and save
const allArticles = [...newEntries, ...existingArticles];
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allArticles, null, 2));
console.log(`\nTotal articles: ${allArticles.length}`);
console.log(`New articles added: ${newEntries.length}`);
