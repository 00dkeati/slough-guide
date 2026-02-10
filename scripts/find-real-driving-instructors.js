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

// Find businesses with Google Place IDs that might be driving instructors
const drivingKeywords = [
  'driving', 'instructor', 'instructors', 'school', 'schools', 'academy',
  'pass', 'lesson', 'lessons', 'learner', 'tuition', 'coaching', 'training',
  'automatic', 'manual', 'intensive', 'crash', 'course', 'courses',
  'adult', 'teen', 'teenager', 'student', 'students', 'pupil', 'pupils',
  'theory', 'practical', 'hazard', 'perception', 'mock', 'test', 'tests',
  'ADI', 'approved', 'qualified', 'certified', 'professional', 'experienced'
];

const drivingInstructorBusinesses = [];

allBusinesses.forEach(business => {
  // Only consider businesses with Google Place IDs
  if (!business.google_place_id) return;
  
  const name = normalizeString(business.name);
  const category = normalizeString(business.category || '');
  const description = normalizeString(business.description || '');
  
  let score = 0;
  let matchingWords = [];
  
  // Check for driving keywords in name
  drivingKeywords.forEach(keyword => {
    if (name.includes(keyword)) {
      score += 10;
      matchingWords.push(keyword);
    }
  });
  
  // Check for driving keywords in category
  drivingKeywords.forEach(keyword => {
    if (category.includes(keyword)) {
      score += 8;
      if (!matchingWords.includes(keyword)) {
        matchingWords.push(keyword);
      }
    }
  });
  
  // Check for driving keywords in description
  drivingKeywords.forEach(keyword => {
    if (description.includes(keyword)) {
      score += 5;
      if (!matchingWords.includes(keyword)) {
        matchingWords.push(keyword);
      }
    }
  });
  
  // Only include businesses with a reasonable match score
  if (score >= 10) {
    drivingInstructorBusinesses.push({
      ...business,
      matchScore: score,
      matchingWords: matchingWords
    });
  }
});

// Sort by match score (highest first)
drivingInstructorBusinesses.sort((a, b) => b.matchScore - a.matchScore);

console.log(`\nFound ${drivingInstructorBusinesses.length} driving instructor related businesses with Google Place IDs:`);
console.log('='.repeat(80));

drivingInstructorBusinesses.forEach((business, index) => {
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
const withRealImages = drivingInstructorBusinesses.filter(b => 
  b.images && b.images.some(img => img.includes('maps.googleapis.com'))
);

console.log(`\n🖼️  Businesses with real Google Places images: ${withRealImages.length}`);
withRealImages.forEach((business, index) => {
  console.log(`   ${index + 1}. ${business.name} - ${business.images.filter(img => img.includes('maps.googleapis.com')).length} real images`);
});

// Summary
console.log(`\n📊 Summary:`);
console.log(`   Total driving instructor businesses with Google Place IDs: ${drivingInstructorBusinesses.length}`);
console.log(`   With real Google Places images: ${withRealImages.length}`);
console.log(`   Average rating: ${(drivingInstructorBusinesses.reduce((sum, b) => sum + b.rating, 0) / drivingInstructorBusinesses.length).toFixed(1)}`);

// Save the driving instructor businesses data
const outputPath = path.join(__dirname, '..', 'data', 'real-driving-instructors.json');
fs.writeFileSync(outputPath, JSON.stringify(drivingInstructorBusinesses, null, 2));

console.log(`\n💾 Saved real driving instructor businesses data to: ${outputPath}`);
