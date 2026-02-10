/**
 * Update Editorial Articles with Downloaded Business Images
 * 
 * Replaces Unsplash placeholder images with actual Google Places photos
 */

import fs from 'fs';
import path from 'path';

const ARTICLES_FILE = path.join(process.cwd(), 'data/editorial-articles.json');
const IMAGES_MAP_FILE = path.join(process.cwd(), 'data/business-images.json');

// Load files
const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
const imageMap: Record<string, string> = JSON.parse(fs.readFileSync(IMAGES_MAP_FILE, 'utf-8'));

// Helper to slugify business names (matching the download script logic)
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Try multiple slug variations to find a match
function findImage(name: string): string | null {
  const variations = [
    slugify(name),
    slugify(name.replace(/^the\s+/i, '')),  // Without "The"
    slugify('the-' + name),                   // With "The"
    slugify(name.replace(/\s+and\s+/gi, ' ')), // "and" -> space
    slugify(name.replace(/&/g, '')),          // Remove &
  ];
  
  for (const slug of variations) {
    if (imageMap[slug]) return imageMap[slug];
  }
  return null;
}

let updatedCount = 0;
let totalBusinesses = 0;

// Process each article
for (const article of articles) {
  // Check for leagueTable content blocks (Chinese takeaways, etc.)
  if (article.content) {
    for (const block of article.content) {
      if (block.type === 'leagueTable') {
        // Handle both takeaways and venues arrays
        const items = block.takeaways || block.venues || [];
        for (const item of items) {
          totalBusinesses++;
          const imagePath = findImage(item.name);
          if (imagePath) {
            item.image = imagePath;
            console.log(`✅ ${item.name}: ${imagePath}`);
            updatedCount++;
          } else {
            console.log(`⏭️ ${item.name}: no image found (slug: ${slugify(item.name)})`);
          }
        }
      }
      
      // Also check for businessCards blocks
      if (block.type === 'businessCards' && block.businesses) {
        for (const business of block.businesses) {
          totalBusinesses++;
          const imagePath = findImage(business.name);
          if (imagePath) {
            business.image = imagePath;
            console.log(`✅ ${business.name}: ${imagePath}`);
            updatedCount++;
          } else {
            console.log(`⏭️ ${business.name}: no image found (slug: ${slugify(business.name)})`);
          }
        }
      }
    }
  }
  
  // Check featuredBusinesses array
  if (article.featuredBusinesses) {
    for (const business of article.featuredBusinesses) {
      if (typeof business === 'object' && business.name) {
        totalBusinesses++;
        const imagePath = findImage(business.name);
        if (imagePath) {
          business.image = imagePath;
          console.log(`✅ ${business.name}: ${imagePath}`);
          updatedCount++;
        }
      }
    }
  }
}

// Save updated articles
fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));

console.log(`\n📸 Updated ${updatedCount}/${totalBusinesses} business images`);
console.log(`💾 Saved to: ${ARTICLES_FILE}`);
