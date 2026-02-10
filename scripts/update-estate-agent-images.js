const fs = require('fs');
const path = require('path');

// Read the estate agents data
const estateAgentsPath = path.join(__dirname, '../data/estate-agents.json');
const businessesPath = path.join(__dirname, '../public/data/businesses.json');

const estateAgents = JSON.parse(fs.readFileSync(estateAgentsPath, 'utf8'));
const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf8'));

console.log(`Found ${estateAgents.length} estate agents to update`);
console.log(`Found ${businesses.length} total businesses`);

// Function to normalize business names for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Function to find matching business
function findMatchingBusiness(estateAgent) {
  const normalizedEstateAgentName = normalizeName(estateAgent.name);
  
  // First, try exact name match
  let match = businesses.find(business => {
    if (business.category !== 'estate-agents') return false;
    const normalizedBusinessName = normalizeName(business.name);
    return normalizedBusinessName === normalizedEstateAgentName;
  });
  
  if (match) return match;
  
  // Try partial name matching for estate agents
  const estateAgentWords = normalizedEstateAgentName.split(' ').filter(word => word.length > 2);
  
  match = businesses.find(business => {
    if (business.category !== 'estate-agents') return false;
    const normalizedBusinessName = normalizeName(business.name);
    const businessWords = normalizedBusinessName.split(' ').filter(word => word.length > 2);
    
    // Check if most words match
    const matchingWords = estateAgentWords.filter(word => 
      businessWords.some(bWord => bWord.includes(word) || word.includes(bWord))
    );
    
    return matchingWords.length >= Math.min(2, estateAgentWords.length - 1);
  });
  
  return match;
}

// Update estate agents with real images
const updatedEstateAgents = estateAgents.map(estateAgent => {
  console.log(`\nProcessing: ${estateAgent.name}`);
  
  const matchingBusiness = findMatchingBusiness(estateAgent);
  
  if (matchingBusiness) {
    console.log(`  ✓ Found match: ${matchingBusiness.name}`);
    console.log(`  ✓ Has ${matchingBusiness.images ? matchingBusiness.images.length : 0} images`);
    
    if (matchingBusiness.images && matchingBusiness.images.length > 0) {
      // Use the first real image
      const realImage = matchingBusiness.images[0];
      console.log(`  ✓ Updated image: ${realImage.substring(0, 100)}...`);
      
      return {
        ...estateAgent,
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
    } else {
      console.log(`  ⚠ No images found for ${matchingBusiness.name}`);
    }
  } else {
    console.log(`  ❌ No match found for ${estateAgent.name}`);
  }
  
  return estateAgent;
});

// Write updated data back to file
fs.writeFileSync(estateAgentsPath, JSON.stringify(updatedEstateAgents, null, 2));

console.log('\n=== SUMMARY ===');
const updatedCount = updatedEstateAgents.filter(agent => 
  agent.image && !agent.image.includes('unsplash.com')
).length;

console.log(`Updated ${updatedCount} out of ${estateAgents.length} estate agents with real images`);

// Show which ones were updated
console.log('\nUpdated estate agents:');
updatedEstateAgents.forEach(agent => {
  if (agent.image && !agent.image.includes('unsplash.com')) {
    console.log(`  ✓ ${agent.name} - ${agent.image.substring(0, 80)}...`);
  } else {
    console.log(`  ❌ ${agent.name} - still using placeholder`);
  }
});
