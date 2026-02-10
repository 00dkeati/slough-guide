const fs = require('fs');
const path = require('path');

// Load the main businesses data
const businessesPath = path.join(__dirname, '..', 'public', 'data', 'businesses.json');
const allBusinesses = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'));

console.log(`Loaded ${allBusinesses.length} businesses from main data`);

// Function to normalize strings for comparison
function normalizeString(str) {
  return str.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Find businesses with Google Place IDs that might be construction-related
const constructionKeywords = [
  'construction', 'building', 'carpenter', 'carpentry', 'joiner', 'joinery',
  'woodwork', 'woodworking', 'cabinet', 'furniture', 'kitchen', 'wardrobe',
  'staircase', 'door', 'window', 'flooring', 'decking', 'fence', 'shed',
  'workshop', 'maintenance', 'property', 'handyman', 'bespoke', 'custom',
  'fitted', 'installation', 'repair', 'renovation', 'builder', 'roofer',
  'electrician', 'plumber', 'heating', 'boiler', 'gas', 'electrical',
  'plumbing', 'roofing', 'tiling', 'painting', 'decorating', 'landscaping',
  'garden', 'driveway', 'patio', 'conservatory', 'extension', 'loft',
  'conversion', 'refurbishment', 'restoration', 'renovation'
];

const constructionBusinesses = [];

allBusinesses.forEach(business => {
  // Only consider businesses with Google Place IDs
  if (!business.google_place_id) return;
  
  const name = normalizeString(business.name);
  const category = normalizeString(business.category || '');
  const description = normalizeString(business.description || '');
  
  let score = 0;
  let matchingWords = [];
  
  // Check for construction keywords in name
  constructionKeywords.forEach(keyword => {
    if (name.includes(keyword)) {
      score += 10;
      matchingWords.push(keyword);
    }
  });
  
  // Check for construction keywords in category
  constructionKeywords.forEach(keyword => {
    if (category.includes(keyword)) {
      score += 8;
      if (!matchingWords.includes(keyword)) {
        matchingWords.push(keyword);
      }
    }
  });
  
  // Check for construction keywords in description
  constructionKeywords.forEach(keyword => {
    if (description.includes(keyword)) {
      score += 5;
      if (!matchingWords.includes(keyword)) {
        matchingWords.push(keyword);
      }
    }
  });
  
  // Only include businesses with a reasonable match score
  if (score >= 10) {
    constructionBusinesses.push({
      ...business,
      matchScore: score,
      matchingWords: matchingWords
    });
  }
});

// Sort by match score (highest first)
constructionBusinesses.sort((a, b) => b.matchScore - a.matchScore);

console.log(`\nFound ${constructionBusinesses.length} construction-related businesses with Google Place IDs:`);
console.log('='.repeat(80));

constructionBusinesses.forEach((business, index) => {
  console.log(`${index + 1}. ${business.name}`);
  console.log(`   Category: ${business.category}`);
  console.log(`   Score: ${business.matchScore}`);
  console.log(`   Matching words: ${business.matchingWords.join(', ')}`);
  console.log(`   Images: ${business.images ? business.images.length : 0}`);
  console.log(`   Google Place ID: ${business.google_place_id}`);
  console.log(`   Rating: ${business.rating}/5 (${business.review_count} reviews)`);
  console.log('');
});

// Show businesses with real Google Places images
const withRealImages = constructionBusinesses.filter(b => 
  b.images && b.images.some(img => img.includes('maps.googleapis.com'))
);

console.log(`\n🖼️  Businesses with real Google Places images: ${withRealImages.length}`);
withRealImages.forEach((business, index) => {
  console.log(`   ${index + 1}. ${business.name} - ${business.images.filter(img => img.includes('maps.googleapis.com')).length} real images`);
});

// Summary
console.log(`\n📊 Summary:`);
console.log(`   Total construction businesses with Google Place IDs: ${constructionBusinesses.length}`);
console.log(`   With real Google Places images: ${withRealImages.length}`);
console.log(`   Average rating: ${(constructionBusinesses.reduce((sum, b) => sum + b.rating, 0) / constructionBusinesses.length).toFixed(1)}`);

// Save the construction businesses data
const outputPath = path.join(__dirname, '..', 'data', 'construction-businesses.json');
fs.writeFileSync(outputPath, JSON.stringify(constructionBusinesses, null, 2));

console.log(`\n💾 Saved construction businesses data to: ${outputPath}`);
