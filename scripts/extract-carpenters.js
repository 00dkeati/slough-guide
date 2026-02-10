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

// Function to calculate match score for carpentry-related businesses
function calculateMatchScore(businessName, businessCategory, businessDescription) {
  const name = normalizeString(businessName);
  const category = normalizeString(businessCategory || '');
  const description = normalizeString(businessDescription || '');
  
  let score = 0;
  let matchingWords = [];
  
  // Carpentry-related keywords
  const carpentryKeywords = [
    'carpenter', 'carpentry', 'joiner', 'joinery', 'woodwork', 'woodworking',
    'cabinet', 'furniture', 'kitchen', 'wardrobe', 'staircase', 'door',
    'window', 'flooring', 'decking', 'fence', 'shed', 'workshop',
    'maintenance', 'property', 'construction', 'building', 'handyman',
    'bespoke', 'custom', 'fitted', 'installation', 'repair', 'renovation'
  ];
  
  // Check for exact keyword matches in name
  carpentryKeywords.forEach(keyword => {
    if (name.includes(keyword)) {
      score += 10;
      matchingWords.push(keyword);
    }
  });
  
  // Check for keyword matches in description
  carpentryKeywords.forEach(keyword => {
    if (description.includes(keyword)) {
      score += 5;
      if (!matchingWords.includes(keyword)) {
        matchingWords.push(keyword);
      }
    }
  });
  
  // Check for keyword matches in category
  carpentryKeywords.forEach(keyword => {
    if (category.includes(keyword)) {
      score += 8;
      if (!matchingWords.includes(keyword)) {
        matchingWords.push(keyword);
      }
    }
  });
  
  // Bonus for businesses with "carpenter" or "joiner" in the name
  if (name.includes('carpenter') || name.includes('joiner')) {
    score += 15;
  }
  
  // Bonus for businesses with images
  if (businessName.images && businessName.images.length > 0) {
    score += 5;
  }
  
  // Bonus for businesses with Google Place ID
  if (businessName.google_place_id) {
    score += 3;
  }
  
  return { score, matchingWords };
}

// Extract carpentry-related businesses
const carpentryBusinesses = [];

allBusinesses.forEach(business => {
  const { score, matchingWords } = calculateMatchScore(
    business.name, 
    business.category, 
    business.description
  );
  
  // Only include businesses with a reasonable match score
  if (score >= 10) {
    carpentryBusinesses.push({
      ...business,
      matchScore: score,
      matchingWords: matchingWords
    });
  }
});

// Sort by match score (highest first)
carpentryBusinesses.sort((a, b) => b.matchScore - a.matchScore);

console.log(`\nFound ${carpentryBusinesses.length} carpentry-related businesses:`);
console.log('='.repeat(60));

carpentryBusinesses.forEach((business, index) => {
  console.log(`${index + 1}. ${business.name}`);
  console.log(`   Category: ${business.category}`);
  console.log(`   Score: ${business.matchScore}`);
  console.log(`   Matching words: ${business.matchingWords.join(', ')}`);
  console.log(`   Images: ${business.images ? business.images.length : 0}`);
  console.log(`   Google Place ID: ${business.google_place_id ? 'Yes' : 'No'}`);
  console.log('');
});

// Create the carpenters data structure
const carpentersData = carpentryBusinesses.slice(0, 10).map((business, index) => ({
  id: business.id,
  rank: index + 1,
  name: business.name,
  specialty: business.matchingWords.slice(0, 3).join(', '),
  rating: business.rating || 0,
  review_count: business.review_count || 0,
  description: business.description || `Professional ${business.matchingWords[0] || 'carpentry'} services in Slough.`,
  services: business.matchingWords.slice(0, 5),
  location: business.area || 'Slough',
  pricing: 'Contact for quote',
  badge: business.rating >= 4.5 ? 'Highly Recommended' : business.rating >= 4.0 ? 'Recommended' : 'Good',
  badge_color: business.rating >= 4.5 ? 'green' : business.rating >= 4.0 ? 'blue' : 'gray',
  image: business.images && business.images.length > 0 ? business.images[0] : null,
  phone: business.phone || '',
  website: business.website || '',
  google_place_id: business.google_place_id || null,
  real_business_data: business
}));

// Save the carpenters data
const outputPath = path.join(__dirname, '..', 'data', 'carpenters.json');
fs.writeFileSync(outputPath, JSON.stringify(carpentersData, null, 2));

console.log(`\n✅ Created carpenters data file with ${carpentersData.length} businesses`);
console.log(`📁 Saved to: ${outputPath}`);

// Summary
const withImages = carpentersData.filter(b => b.image).length;
const withGooglePlaceId = carpentersData.filter(b => b.google_place_id).length;

console.log(`\n📊 Summary:`);
console.log(`   Total businesses: ${carpentersData.length}`);
console.log(`   With images: ${withImages}`);
console.log(`   With Google Place ID: ${withGooglePlaceId}`);
console.log(`   Average rating: ${(carpentersData.reduce((sum, b) => sum + b.rating, 0) / carpentersData.length).toFixed(1)}`);
