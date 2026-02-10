#!/usr/bin/env node
/**
 * Combine all plumber + heating engineer data into one master list
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Load both datasets
const plumbers = JSON.parse(fs.readFileSync(path.join(dataDir, 'plumbers-with-mobile.json'), 'utf8'));
const heatingEngineers = JSON.parse(fs.readFileSync(path.join(dataDir, 'heating-engineers-mobile.json'), 'utf8'));

// Deduplicate by phone number (normalized)
const byPhone = new Map();

function normalizePhone(phone) {
  return phone?.replace(/\s+/g, '').replace(/^0/, '+44') || '';
}

for (const p of plumbers) {
  const key = normalizePhone(p.phone);
  if (key && !byPhone.has(key)) {
    byPhone.set(key, { ...p, source: 'plumber' });
  }
}

for (const h of heatingEngineers) {
  const key = normalizePhone(h.phone);
  if (key && !byPhone.has(key)) {
    byPhone.set(key, { ...h, source: 'heating_engineer' });
  }
}

const combined = Array.from(byPhone.values());

// Sort by reviews (most reviewed first)
combined.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));

// Save combined list
fs.writeFileSync(
  path.join(dataDir, 'all-tradespeople-mobile.json'),
  JSON.stringify(combined, null, 2)
);

console.log('='.repeat(60));
console.log('📊 COMBINED TRADESPERSON DATA');
console.log('='.repeat(60));
console.log(`Plumbers: ${plumbers.length}`);
console.log(`Heating engineers: ${heatingEngineers.length}`);
console.log(`Combined (deduped): ${combined.length}`);
console.log('='.repeat(60));

// Show top 10 by reviews
console.log('\n🏆 TOP 10 BY REVIEWS:\n');
for (const t of combined.slice(0, 10)) {
  console.log(`${t.reviews} reviews | ${t.rating}⭐ | ${t.name} | ${t.phone}`);
}

// Show stats by source
const plumberCount = combined.filter(t => t.source === 'plumber').length;
const heatingCount = combined.filter(t => t.source === 'heating_engineer').length;
console.log(`\nBy source: ${plumberCount} plumbers, ${heatingCount} heating engineers`);
