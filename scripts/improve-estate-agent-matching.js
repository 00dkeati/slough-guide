const fs = require('fs');
const path = require('path');

// Read the estate agents data
const estateAgentsPath = path.join(__dirname, '../data/estate-agents.json');
const businessesPath = path.join(__dirname, '../public/data/businesses.json');

const estateAgents = JSON.parse(fs.readFileSync(estateAgentsPath, 'utf8'));
const businesses = JSON.parse(fs.readFileSync(businessesPath, 'utf8'));

console.log(`Found ${estateAgents.length} estate agents to update`);
console.log(`Found ${businesses.length} total businesses`);

// Get all estate agent businesses
const estateAgentBusinesses = businesses.filter(business => business.category === 'estate-agents');
console.log(`Found ${estateAgentBusinesses.length} estate agent businesses in main data`);

// Function to normalize business names for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
}

// Function to find the best matching business
function findBestMatchingBusiness(estateAgent) {
  const normalizedEstateAgentName = normalizeName(estateAgent.name);
  
  // Create a list of potential matches with scores
  const matches = estateAgentBusinesses.map(business => {
    const normalizedBusinessName = normalizeName(business.name);
    
    // Exact match gets highest score
    if (normalizedBusinessName === normalizedEstateAgentName) {
      return { business, score: 100 };
    }
    
    // Check for key words that should match
    const estateAgentWords = normalizedEstateAgentName.split(' ').filter(word => word.length > 2);
    const businessWords = normalizedBusinessName.split(' ').filter(word => word.length > 2);
    
    let score = 0;
    let matchingWords = 0;
    
    // Check each word in estate agent name
    estateAgentWords.forEach(agentWord => {
      if (businessWords.some(bWord => bWord === agentWord)) {
        score += 20; // Exact word match
        matchingWords++;
      } else if (businessWords.some(bWord => bWord.includes(agentWord) || agentWord.includes(bWord))) {
        score += 10; // Partial word match
        matchingWords++;
      }
    });
    
    // Bonus for having similar word count
    const wordCountDiff = Math.abs(estateAgentWords.length - businessWords.length);
    if (wordCountDiff <= 1) score += 5;
    
    // Bonus for location match
    if (business.area === estateAgent.location.toLowerCase()) {
      score += 10;
    }
    
    return { business, score, matchingWords };
  });
  
  // Sort by score and return the best match
  matches.sort((a, b) => b.score - a.score);
  
  // Only return matches with a reasonable score
  const bestMatch = matches[0];
  if (bestMatch && bestMatch.score >= 20) {
    return bestMatch;
  }
  
  return null;
}

// Update estate agents with better matching
const updatedEstateAgents = estateAgents.map(estateAgent => {
  console.log(`\nProcessing: ${estateAgent.name}`);
  
  const matchResult = findBestMatchingBusiness(estateAgent);
  
  if (matchResult) {
    const { business, score, matchingWords } = matchResult;
    console.log(`  ✓ Found match: ${business.name} (score: ${score}, matching words: ${matchingWords})`);
    console.log(`  ✓ Has ${business.images ? business.images.length : 0} images`);
    
    if (business.images && business.images.length > 0) {
      // Use the first real image
      const realImage = business.images[0];
      console.log(`  ✓ Updated image: ${realImage.substring(0, 100)}...`);
      
      return {
        ...estateAgent,
        image: realImage,
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
    } else {
      console.log(`  ⚠ No images found for ${business.name}`);
    }
  } else {
    console.log(`  ❌ No good match found for ${estateAgent.name}`);
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

// Show all available estate agent businesses for reference
console.log('\n=== AVAILABLE ESTATE AGENT BUSINESSES ===');
estateAgentBusinesses.forEach(business => {
  console.log(`- ${business.name} (${business.area}) - ${business.images ? business.images.length : 0} images`);
});
