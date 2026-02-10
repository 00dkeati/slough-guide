const fs = require('fs');
const path = require('path');

// Load the driving instructors data
const drivingInstructorsPath = path.join(__dirname, '..', 'data', 'driving-instructors.json');
const drivingInstructors = JSON.parse(fs.readFileSync(drivingInstructorsPath, 'utf-8'));

console.log(`Loaded ${drivingInstructors.length} driving instructors`);

// Function to normalize strings for comparison
function normalizeString(str) {
  return str.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Filter to only include actual driving instructors
const actualDrivingInstructors = drivingInstructors.filter(instructor => {
  const name = normalizeString(instructor.name);
  const category = normalizeString(instructor.category || '');
  const description = normalizeString(instructor.description || '');
  
  // Must have driving-related keywords in name or category
  const drivingKeywords = [
    'driving', 'instructor', 'instructors', 'school', 'schools', 'academy',
    'pass', 'lesson', 'lessons', 'learner', 'tuition', 'coaching'
  ];
  
  const hasDrivingKeyword = drivingKeywords.some(keyword => 
    name.includes(keyword) || category.includes(keyword) || description.includes(keyword)
  );
  
  // Exclude clearly non-driving businesses
  const excludeKeywords = [
    'pharmacy', 'car-mechanics', 'mot-centres', 'personal-trainers', 'roofers',
    'dog', 'tutors', 'nurseries', 'autobody', 'crash repair', 'earwax',
    'weight loss', 'blood test', 'travel clinic'
  ];
  
  const hasExcludeKeyword = excludeKeywords.some(keyword => 
    name.includes(keyword) || category.includes(keyword) || description.includes(keyword)
  );
  
  return hasDrivingKeyword && !hasExcludeKeyword;
});

// Update ranks for filtered list
actualDrivingInstructors.forEach((instructor, index) => {
  instructor.rank = index + 1;
});

// Save the cleaned driving instructors data
fs.writeFileSync(drivingInstructorsPath, JSON.stringify(actualDrivingInstructors, null, 2));

console.log(`\n✅ Cleaned driving instructors data`);
console.log(`📁 Saved to: ${drivingInstructorsPath}`);

console.log(`\n📊 Summary:`);
console.log(`   Original count: ${drivingInstructors.length}`);
console.log(`   Filtered count: ${actualDrivingInstructors.length}`);
console.log(`   Removed: ${drivingInstructors.length - actualDrivingInstructors.length} non-driving instructor businesses`);

console.log(`\n🚗 Actual Driving Instructors:`);
actualDrivingInstructors.forEach((instructor, index) => {
  console.log(`   ${index + 1}. ${instructor.name}`);
  console.log(`      Category: ${instructor.category}`);
  console.log(`      Rating: ${instructor.rating}/5 (${instructor.review_count} reviews)`);
  console.log(`      Images: ${instructor.image ? 'Yes' : 'No'}`);
  console.log(`      Google Place ID: ${instructor.google_place_id ? 'Yes' : 'No'}`);
  console.log('');
});

// Show which driving instructors have real images
const withRealImages = actualDrivingInstructors.filter(d => d.image && d.image.includes('maps.googleapis.com')).length;
const withPlaceholderImages = actualDrivingInstructors.filter(d => d.image && d.image.includes('unsplash')).length;
const withNoImages = actualDrivingInstructors.filter(d => !d.image).length;

console.log(`🖼️  Image Status:`);
console.log(`   Real Google images: ${withRealImages}`);
console.log(`   Placeholder images: ${withPlaceholderImages}`);
console.log(`   No images: ${withNoImages}`);
