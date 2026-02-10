const fs = require('fs');
const path = require('path');

// Read the businesses data
const massageTherapistsPath = path.join(__dirname, '../data/massage-therapists.json');
const businessesPath = path.join(__dirname, '../public/data/businesses.json');

const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf8'));

console.log(`Found ${businesses.length} total businesses`);

// Find only actual massage therapists and wellness businesses
const actualMassageTherapists = businesses.filter(business => {
  const name = business.name.toLowerCase();
  const description = business.description.toLowerCase();
  const category = business.category.toLowerCase();
  
  // Only include businesses that are actually massage/wellness related
  const isMassageTherapist = category === 'massage-therapists';
  const isBeautySalon = category === 'beauty-salons' && (
    name.includes('spa') || 
    name.includes('wellness') || 
    description.includes('massage') || 
    description.includes('spa')
  );
  const isPhysiotherapist = category === 'physiotherapists';
  const isYogaStudio = category === 'yoga-studios';
  
  // Exclude businesses that are clearly not massage/wellness related
  const isNotMassageRelated = (
    name.includes('electrical') || 
    name.includes('landscape') || 
    name.includes('cleaning') || 
    name.includes('spanner') || 
    name.includes('mechanic') || 
    name.includes('car') ||
    name.includes('community centre') ||
    name.includes('groomer') ||
    name.includes('paw')
  );
  
  return (isMassageTherapist || isBeautySalon || isPhysiotherapist || isYogaStudio) && !isNotMassageRelated;
});

console.log(`Found ${actualMassageTherapists.length} actual massage/wellness businesses`);

// Create a clean list of massage therapists
const massageTherapists = actualMassageTherapists.map((business, index) => {
  // Determine services based on business type
  let services = ['Swedish Massage', 'Deep Tissue', 'Relaxation Massage'];
  let specialty = 'Professional massage therapy';
  let badge = 'Professional massage therapy services';
  let badgeColor = 'blue';
  
  if (business.category === 'beauty-salons' || business.name.toLowerCase().includes('spa')) {
    services = ['Swedish Massage', 'Deep Tissue', 'Facial Treatments', 'Spa Services'];
    specialty = 'Spa and wellness services';
    badge = 'Spa and wellness services';
    badgeColor = 'purple';
  } else if (business.category === 'physiotherapists') {
    services = ['Sports Massage', 'Deep Tissue', 'Injury Rehabilitation', 'Pain Management'];
    specialty = 'Physiotherapy and sports massage';
    badge = 'Physiotherapy and sports massage';
    badgeColor = 'green';
  } else if (business.category === 'yoga-studios') {
    services = ['Yoga Classes', 'Mindfulness', 'Wellness', 'Relaxation'];
    specialty = 'Yoga and wellness';
    badge = 'Yoga and wellness services';
    badgeColor = 'teal';
  }
  
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
    services: services,
    description: business.description || 'Professional massage therapy services.',
    specialty: specialty,
    pricing: 'Contact for pricing',
    image: business.images && business.images.length > 0 ? business.images[0] : 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
    rank: index + 1,
    badge: badge,
    badge_color: badgeColor,
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
});

// Write updated data back to file
fs.writeFileSync(massageTherapistsPath, JSON.stringify(massageTherapists, null, 2));

console.log('\n=== SUMMARY ===');
const updatedCount = massageTherapists.filter(therapist => 
  therapist.image && !therapist.image.includes('unsplash.com')
).length;

console.log(`Created ${massageTherapists.length} massage therapists`);
console.log(`Updated ${updatedCount} with real images`);

// Show all massage therapists
console.log('\n=== MASSAGE THERAPISTS ===');
massageTherapists.forEach(therapist => {
  if (therapist.image && !therapist.image.includes('unsplash.com')) {
    console.log(`  ✓ ${therapist.name} - ${therapist.image.substring(0, 80)}...`);
  } else {
    console.log(`  ❌ ${therapist.name} - using placeholder`);
  }
});

// Show the businesses that were included
console.log('\n=== INCLUDED BUSINESSES ===');
actualMassageTherapists.forEach(business => {
  console.log(`- ${business.name} (${business.category}) - ${business.images ? business.images.length : 0} images`);
});
