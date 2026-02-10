const fs = require('fs');
const path = require('path');

// Load the carpenters data and main businesses data
const carpentersPath = path.join(__dirname, '..', 'data', 'carpenters.json');
const businessesPath = path.join(__dirname, '..', 'public', 'data', 'businesses.json');

const carpenters = JSON.parse(fs.readFileSync(carpentersPath, 'utf-8'));
const allBusinesses = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'));

console.log(`Loaded ${carpenters.length} carpenters and ${allBusinesses.length} total businesses`);

// Function to normalize strings for comparison
function normalizeString(str) {
  return str.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to calculate match score between carpenter and business
function calculateMatchScore(carpenterName, businessName, businessCategory, businessDescription) {
  const carpenterNorm = normalizeString(carpenterName);
  const businessNorm = normalizeString(businessName);
  const category = normalizeString(businessCategory || '');
  const description = normalizeString(businessDescription || '');
  
  let score = 0;
  let matchingWords = [];
  
  // Check for exact name matches (highest priority)
  if (carpenterNorm === businessNorm) {
    score += 100;
    matchingWords.push('exact_name');
  }
  
  // Check for partial name matches
  const carpenterWords = carpenterNorm.split(' ');
  const businessWords = businessNorm.split(' ');
  
  carpenterWords.forEach(cWord => {
    if (businessWords.includes(cWord) && cWord.length > 2) {
      score += 15;
      matchingWords.push(cWord);
    }
  });
  
  // Check for construction/carpentry related categories
  const constructionCategories = [
    'carpenters', 'joiners', 'builders', 'construction', 'handyman', 
    'property', 'maintenance', 'roofers', 'electricians', 'plumbers'
  ];
  
  constructionCategories.forEach(cat => {
    if (category.includes(cat)) {
      score += 10;
      if (!matchingWords.includes(cat)) {
        matchingWords.push(cat);
      }
    }
  });
  
  // Check for construction-related keywords in description
  const constructionKeywords = [
    'carpenter', 'carpentry', 'joiner', 'joinery', 'woodwork', 'woodworking',
    'cabinet', 'furniture', 'kitchen', 'wardrobe', 'staircase', 'door',
    'window', 'flooring', 'decking', 'fence', 'shed', 'workshop',
    'maintenance', 'property', 'construction', 'building', 'handyman',
    'bespoke', 'custom', 'fitted', 'installation', 'repair', 'renovation'
  ];
  
  constructionKeywords.forEach(keyword => {
    if (description.includes(keyword)) {
      score += 5;
      if (!matchingWords.includes(keyword)) {
        matchingWords.push(keyword);
      }
    }
  });
  
  // Bonus for businesses with images
  if (businessName.images && businessName.images.length > 0) {
    score += 5;
  }
  
  // Bonus for businesses with Google Place ID
  if (businessName.google_place_id) {
    score += 10;
  }
  
  return { score, matchingWords };
}

// Update carpenters with real business data and images
let updatedCount = 0;

carpenters.forEach((carpenter, index) => {
  console.log(`\n[${index + 1}/${carpenters.length}] Looking for matches for: ${carpenter.name}`);
  
  let bestMatch = null;
  let bestScore = 0;
  
  // Find the best matching business
  allBusinesses.forEach(business => {
    const { score, matchingWords } = calculateMatchScore(
      carpenter.name,
      business.name,
      business.category,
      business.description
    );
    
    if (score > bestScore && score >= 20) { // Only consider good matches
      bestMatch = {
        business,
        score,
        matchingWords
      };
      bestScore = score;
    }
  });
  
  if (bestMatch) {
    console.log(`  ✅ Found match: ${bestMatch.business.name} (score: ${bestMatch.score})`);
    console.log(`     Matching words: ${bestMatch.matchingWords.join(', ')}`);
    console.log(`     Images: ${bestMatch.business.images ? bestMatch.business.images.length : 0}`);
    console.log(`     Google Place ID: ${bestMatch.business.google_place_id ? 'Yes' : 'No'}`);
    
    // Update the carpenter with real business data
    carpenters[index].image = bestMatch.business.images && bestMatch.business.images.length > 0 
      ? bestMatch.business.images[0] 
      : null;
    carpenters[index].google_place_id = bestMatch.business.google_place_id;
    carpenters[index].real_business_data = bestMatch.business;
    
    // Update other fields if they're missing or placeholder
    if (!carpenters[index].phone || carpenters[index].phone.includes('1234')) {
      carpenters[index].phone = bestMatch.business.phone || carpenters[index].phone;
    }
    if (!carpenters[index].website || carpenters[index].website.includes('checkatrade')) {
      carpenters[index].website = bestMatch.business.website || carpenters[index].website;
    }
    if (carpenters[index].location === 'slough' && bestMatch.business.area) {
      carpenters[index].location = bestMatch.business.area;
    }
    
    updatedCount++;
  } else {
    console.log(`  ❌ No good match found`);
  }
});

// Save the updated carpenters data
fs.writeFileSync(carpentersPath, JSON.stringify(carpenters, null, 2));

console.log(`\n✅ Updated carpenters data file`);
console.log(`📁 Saved to: ${carpentersPath}`);

// Summary
const withImages = carpenters.filter(c => c.image && !c.image.includes('unsplash')).length;
const withGooglePlaceId = carpenters.filter(c => c.google_place_id).length;
const withRealImages = carpenters.filter(c => c.image && c.image.includes('maps.googleapis.com')).length;

console.log(`\n📊 Summary:`);
console.log(`   Total carpenters: ${carpenters.length}`);
console.log(`   Updated with real data: ${updatedCount}`);
console.log(`   With real images: ${withRealImages}`);
console.log(`   With Google Place ID: ${withGooglePlaceId}`);
console.log(`   Average rating: ${(carpenters.reduce((sum, c) => sum + c.rating, 0) / carpenters.length).toFixed(1)}`);

// Show which carpenters now have real images
console.log(`\n🖼️  Real Images Status:`);
carpenters.forEach((carpenter, index) => {
  const hasRealImage = carpenter.image && carpenter.image.includes('maps.googleapis.com');
  const hasPlaceholder = carpenter.image && carpenter.image.includes('unsplash');
  const hasNoImage = !carpenter.image;
  
  let status = '';
  if (hasRealImage) status = '✅ Real Google image';
  else if (hasPlaceholder) status = '⚠️  Placeholder image';
  else status = '❌ No image';
  
  console.log(`   ${index + 1}. ${carpenter.name}: ${status}`);
});
