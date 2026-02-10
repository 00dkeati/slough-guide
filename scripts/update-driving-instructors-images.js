const fs = require('fs');
const path = require('path');

// Load the driving instructors data and main businesses data
const drivingInstructorsPath = path.join(__dirname, '..', 'data', 'driving-instructors.json');
const businessesPath = path.join(__dirname, '..', 'public', 'data', 'businesses.json');

const drivingInstructors = JSON.parse(fs.readFileSync(drivingInstructorsPath, 'utf-8'));
const allBusinesses = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'));

console.log(`Loaded ${drivingInstructors.length} driving instructors and ${allBusinesses.length} total businesses`);

// Function to normalize strings for comparison
function normalizeString(str) {
  return str.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Function to calculate match score between driving instructor and business
function calculateMatchScore(drivingInstructorName, businessName, businessCategory, businessDescription) {
  const instructorNorm = normalizeString(drivingInstructorName);
  const businessNorm = normalizeString(businessName);
  const category = normalizeString(businessCategory || '');
  const description = normalizeString(businessDescription || '');
  
  let score = 0;
  let matchingWords = [];
  
  // Check for exact name matches (highest priority)
  if (instructorNorm === businessNorm) {
    score += 100;
    matchingWords.push('exact_name');
  }
  
  // Check for partial name matches
  const instructorWords = instructorNorm.split(' ');
  const businessWords = businessNorm.split(' ');
  
  instructorWords.forEach(iWord => {
    if (businessWords.includes(iWord) && iWord.length > 2) {
      score += 15;
      matchingWords.push(iWord);
    }
  });
  
  // Check for driving instructor related categories
  const drivingCategories = [
    'driving-instructors', 'driving-schools', 'instructors', 'schools'
  ];
  
  drivingCategories.forEach(cat => {
    if (category.includes(cat)) {
      score += 10;
      if (!matchingWords.includes(cat)) {
        matchingWords.push(cat);
      }
    }
  });
  
  // Check for driving-related keywords in description
  const drivingKeywords = [
    'driving', 'instructor', 'instructors', 'lesson', 'lessons', 'school', 'schools',
    'pass', 'test', 'learner', 'learner', 'tuition', 'coaching', 'training',
    'automatic', 'manual', 'intensive', 'crash', 'course', 'courses',
    'adult', 'teen', 'teenager', 'student', 'students', 'pupil', 'pupils',
    'theory', 'practical', 'hazard', 'perception', 'mock', 'test', 'tests',
    'ADI', 'approved', 'qualified', 'certified', 'professional', 'experienced'
  ];
  
  drivingKeywords.forEach(keyword => {
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

// Filter out non-driving instructor businesses and update with real data
const filteredDrivingInstructors = [];
let updatedCount = 0;

drivingInstructors.forEach((instructor, index) => {
  // Skip businesses that are clearly not driving instructors
  const name = normalizeString(instructor.name);
  const category = normalizeString(instructor.category || '');
  
  // Skip if it's clearly not a driving instructor business
  if (category.includes('pharmacy') || category.includes('car-mechanics') || 
      category.includes('mot-centres') || category.includes('personal-trainers') ||
      category.includes('roofers') || category.includes('dog') ||
      category.includes('tutors') || category.includes('nurseries')) {
    console.log(`\n[${index + 1}/${drivingInstructors.length}] Skipping non-driving instructor: ${instructor.name} (category: ${instructor.category})`);
    return;
  }
  
  console.log(`\n[${index + 1}/${drivingInstructors.length}] Looking for matches for: ${instructor.name}`);
  
  let bestMatch = null;
  let bestScore = 0;
  
  // Find the best matching business
  allBusinesses.forEach(business => {
    const { score, matchingWords } = calculateMatchScore(
      instructor.name,
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
    
    // Update the instructor with real business data
    instructor.image = bestMatch.business.images && bestMatch.business.images.length > 0 
      ? bestMatch.business.images[0] 
      : null;
    instructor.google_place_id = bestMatch.business.google_place_id;
    instructor.real_business_data = bestMatch.business;
    
    // Update other fields if they're missing or placeholder
    if (!instructor.phone || instructor.phone.includes('1286') || instructor.phone.includes('1287')) {
      instructor.phone = bestMatch.business.phone || instructor.phone;
    }
    if (!instructor.website || instructor.website.includes('example')) {
      instructor.website = bestMatch.business.website || instructor.website;
    }
    if (instructor.location === 'slough' && bestMatch.business.area) {
      instructor.location = bestMatch.business.area;
    }
    
    updatedCount++;
  } else {
    console.log(`  ❌ No good match found`);
  }
  
  // Add to filtered list
  filteredDrivingInstructors.push(instructor);
});

// Update ranks for filtered list
filteredDrivingInstructors.forEach((instructor, index) => {
  instructor.rank = index + 1;
});

// Save the updated driving instructors data
fs.writeFileSync(drivingInstructorsPath, JSON.stringify(filteredDrivingInstructors, null, 2));

console.log(`\n✅ Updated driving instructors data file`);
console.log(`📁 Saved to: ${drivingInstructorsPath}`);

// Summary
const withImages = filteredDrivingInstructors.filter(d => d.image && !d.image.includes('unsplash')).length;
const withGooglePlaceId = filteredDrivingInstructors.filter(d => d.google_place_id).length;
const withRealImages = filteredDrivingInstructors.filter(d => d.image && d.image.includes('maps.googleapis.com')).length;

console.log(`\n📊 Summary:`);
console.log(`   Total driving instructors: ${filteredDrivingInstructors.length}`);
console.log(`   Updated with real data: ${updatedCount}`);
console.log(`   With real images: ${withRealImages}`);
console.log(`   With Google Place ID: ${withGooglePlaceId}`);
console.log(`   Average rating: ${(filteredDrivingInstructors.reduce((sum, d) => sum + d.rating, 0) / filteredDrivingInstructors.length).toFixed(1)}`);

// Show which driving instructors now have real images
console.log(`\n🖼️  Real Images Status:`);
filteredDrivingInstructors.forEach((instructor, index) => {
  const hasRealImage = instructor.image && instructor.image.includes('maps.googleapis.com');
  const hasPlaceholder = instructor.image && instructor.image.includes('unsplash');
  const hasNoImage = !instructor.image;
  
  let status = '';
  if (hasRealImage) status = '✅ Real Google image';
  else if (hasPlaceholder) status = '⚠️  Placeholder image';
  else status = '❌ No image';
  
  console.log(`   ${index + 1}. ${instructor.name}: ${status}`);
});
