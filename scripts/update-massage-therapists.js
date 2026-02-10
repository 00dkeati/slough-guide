const fs = require('fs');
const path = require('path');

// Read the current massage therapists data
const massageTherapistsPath = path.join(__dirname, '../data/massage-therapists.json');
const businessesPath = path.join(__dirname, '../public/data/businesses.json');

const massageTherapists = JSON.parse(fs.readFileSync(massageTherapistsPath, 'utf8'));
const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf8'));

console.log(`Found ${massageTherapists.length} massage therapists to update`);
console.log(`Found ${businesses.length} total businesses`);

// Find all massage-related businesses
const massageRelatedBusinesses = businesses.filter(business => {
  const name = business.name.toLowerCase();
  const description = business.description.toLowerCase();
  const category = business.category.toLowerCase();
  
  return (
    category.includes('massage') ||
    category.includes('spa') ||
    category.includes('beauty') ||
    category.includes('wellness') ||
    name.includes('massage') ||
    name.includes('spa') ||
    name.includes('therapy') ||
    name.includes('wellness') ||
    description.includes('massage') ||
    description.includes('spa') ||
    description.includes('therapy') ||
    description.includes('wellness')
  );
});

console.log(`Found ${massageRelatedBusinesses.length} massage-related businesses`);

// Function to normalize business names for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Function to find matching business
function findMatchingBusiness(massageTherapist) {
  const normalizedTherapistName = normalizeName(massageTherapist.name);
  
  // First, try exact name match
  let match = massageRelatedBusinesses.find(business => {
    const normalizedBusinessName = normalizeName(business.name);
    return normalizedBusinessName === normalizedTherapistName;
  });
  
  if (match) return match;
  
  // Try partial name matching
  const therapistWords = normalizedTherapistName.split(' ').filter(word => word.length > 2);
  
  match = massageRelatedBusinesses.find(business => {
    const normalizedBusinessName = normalizeName(business.name);
    const businessWords = normalizedBusinessName.split(' ').filter(word => word.length > 2);
    
    // Check if most words match
    const matchingWords = therapistWords.filter(word => 
      businessWords.some(bWord => bWord.includes(word) || word.includes(bWord))
    );
    
    return matchingWords.length >= Math.min(2, therapistWords.length - 1);
  });
  
  return match;
}

// Create a comprehensive list of massage therapists with real data
const updatedMassageTherapists = [
  // Keep existing ones but update with real images if possible
  ...massageTherapists.map(therapist => {
    console.log(`\nProcessing: ${therapist.name}`);
    
    const matchingBusiness = findMatchingBusiness(therapist);
    
    if (matchingBusiness) {
      console.log(`  ✓ Found match: ${matchingBusiness.name}`);
      console.log(`  ✓ Has ${matchingBusiness.images ? matchingBusiness.images.length : 0} images`);
      
      if (matchingBusiness.images && matchingBusiness.images.length > 0) {
        const realImage = matchingBusiness.images[0];
        console.log(`  ✓ Updated image: ${realImage.substring(0, 100)}...`);
        
        return {
          ...therapist,
          image: realImage,
          google_place_id: matchingBusiness.google_place_id,
          real_business_data: {
            address: matchingBusiness.address,
            postcode: matchingBusiness.postcode,
            lat: matchingBusiness.lat,
            lng: matchingBusiness.lng,
            phone: matchingBusiness.phone,
            website: matchingBusiness.website,
            opening_hours_json: matchingBusiness.opening_hours_json
          }
        };
      }
    } else {
      console.log(`  ❌ No match found for ${therapist.name}`);
    }
    
    return therapist;
  }),
  
  // Add new massage therapists from the businesses data
  ...massageRelatedBusinesses
    .filter(business => !massageTherapists.some(therapist => 
      normalizeName(therapist.name) === normalizeName(business.name)
    ))
    .map((business, index) => {
      console.log(`\nAdding new massage therapist: ${business.name}`);
      
      return {
        id: business.slug || `massage-therapist-${index + 1}`,
        name: business.name,
        slug: business.slug || `massage-therapist-${index + 1}`,
        rating: business.rating || 4.5,
        review_count: business.review_count || 10,
        location: business.area || 'Slough',
        address: business.address || 'Slough',
        phone: business.phone || '023 9200 0000',
        website: business.website || '',
        specialist: 'Professional Massage Therapist',
        experience: 'Established',
        services: ['Swedish Massage', 'Deep Tissue', 'Relaxation Massage'],
        description: business.description || 'Professional massage therapy services.',
        specialty: 'Professional massage therapy',
        pricing: 'Contact for pricing',
        image: business.images && business.images.length > 0 ? business.images[0] : 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
        rank: massageTherapists.length + index + 1,
        badge: 'Professional massage therapy services',
        badge_color: 'blue',
        google_place_id: business.google_place_id,
        real_business_data: {
          address: business.address,
          postcode: business.postcode,
          lat: business.lat,
          lng: business.lng,
          phone: business.phone,
          website: business.website,
          opening_hours_json: business.opening_hours_json
        }
      };
    })
];

// Re-rank all therapists
const rankedTherapists = updatedMassageTherapists.map((therapist, index) => ({
  ...therapist,
  rank: index + 1
}));

// Write updated data back to file
fs.writeFileSync(massageTherapistsPath, JSON.stringify(rankedTherapists, null, 2));

console.log('\n=== SUMMARY ===');
const updatedCount = rankedTherapists.filter(therapist => 
  therapist.image && !therapist.image.includes('unsplash.com')
).length;

console.log(`Updated ${updatedCount} out of ${rankedTherapists.length} massage therapists with real images`);
console.log(`Total massage therapists: ${rankedTherapists.length}`);

// Show which ones were updated
console.log('\nUpdated massage therapists:');
rankedTherapists.forEach(therapist => {
  if (therapist.image && !therapist.image.includes('unsplash.com')) {
    console.log(`  ✓ ${therapist.name} - ${therapist.image.substring(0, 80)}...`);
  } else {
    console.log(`  ❌ ${therapist.name} - still using placeholder`);
  }
});

// Show all available massage-related businesses for reference
console.log('\n=== AVAILABLE MASSAGE-RELATED BUSINESSES ===');
massageRelatedBusinesses.forEach(business => {
  console.log(`- ${business.name} (${business.category}) - ${business.images ? business.images.length : 0} images`);
});
