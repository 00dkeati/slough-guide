#!/usr/bin/env tsx

import { fetchAndEnrichAllData } from './enhanced-fetch';

async function main() {
  console.log('🤖 Starting AI-Enhanced Data Fetch for Slough Guide...');
  
  try {
    const result = await fetchAndEnrichAllData({
      includeNeighbourhoods: true,
      concurrency: 2,
      clearExisting: false,
      enrichWithAI: true
    });

    if (result.success) {
      console.log('🎉 AI-Enhanced data fetch completed successfully!');
      console.log('📊 Summary:', result.summary);
    } else {
      console.error('❌ AI-Enhanced data fetch failed:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

main();
