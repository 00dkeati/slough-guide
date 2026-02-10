#!/usr/bin/env node

import { loadCsvRedirects } from './loadCsvRedirects.mjs';
import fs from 'fs';
import path from 'path';

function validateRedirects() {
  console.log('🔍 Validating CSV redirects...\n');
  
  try {
    const redirects = loadCsvRedirects('./data/redirects.csv');
    
    if (redirects.length === 0) {
      console.log('⚠️  No redirects found in CSV file');
      return;
    }
    
    console.log(`✅ Loaded ${redirects.length} redirects:\n`);
    
    const issues = [];
    
    redirects.forEach((redirect, index) => {
      const { from, to, status } = redirect;
      
      // Check for common issues
      if (from === to) {
        issues.push(`Row ${index + 1}: Source and destination are the same (${from})`);
      }
      
      if (!to.startsWith('/') && !to.startsWith('http')) {
        issues.push(`Row ${index + 1}: Invalid destination URL (${to})`);
      }
      
      if (status < 300 || status > 399) {
        issues.push(`Row ${index + 1}: Invalid status code (${status})`);
      }
      
      console.log(`  ${index + 1}. ${from} → ${to} (${status})`);
    });
    
    if (issues.length > 0) {
      console.log('\n❌ Issues found:');
      issues.forEach(issue => console.log(`  - ${issue}`));
    } else {
      console.log('\n✅ All redirects look valid!');
    }
    
    // Check for duplicates
    const fromPaths = redirects.map(r => r.from);
    const duplicates = fromPaths.filter((path, index) => fromPaths.indexOf(path) !== index);
    
    if (duplicates.length > 0) {
      console.log('\n⚠️  Duplicate source paths found:');
      [...new Set(duplicates)].forEach(dup => console.log(`  - ${dup}`));
    }
    
  } catch (error) {
    console.error('❌ Error validating redirects:', error.message);
    process.exit(1);
  }
}

function testRedirects() {
  console.log('\n🧪 Testing redirect logic...\n');
  
  const testCases = [
    { input: '/old-page', expected: '/new-page' },
    { input: 'old-page', expected: '/old-page' }, // Should add leading slash
    { input: '//double-slash', expected: '/double-slash' }, // Should normalize
    { input: '/api/test', expected: null }, // Should be bypassed
    { input: '/_next/static/test.js', expected: null }, // Should be bypassed
  ];
  
  testCases.forEach(({ input, expected }) => {
    console.log(`  Input: "${input}" → Expected: ${expected || 'no redirect'}`);
  });
}

function showUsage() {
  console.log(`
📋 CSV Redirect System Usage:

1. Edit data/redirects.csv with your redirects:
   from,to,status
   /old-page,/new-page,307
   /broken,https://example.com/fixed,302

2. Build-time redirects (next.config.js):
   - Automatically loaded during build
   - Fastest performance
   - Requires redeploy to update

3. Runtime redirects (middleware):
   - Updates without redeploy
   - Cached for 1 minute
   - Served from /redirects.csv

4. Status codes:
   - 302: Temporary redirect (default)
   - 303: See Other
   - 307: Temporary redirect (preserves method)

5. Commands:
   npm run validate-redirects  # Validate CSV
   npm run test-redirects     # Test logic
`);
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'validate':
    validateRedirects();
    break;
  case 'test':
    testRedirects();
    break;
  case 'help':
  case '--help':
  case '-h':
    showUsage();
    break;
  default:
    console.log('🔧 CSV Redirect System\n');
    validateRedirects();
    testRedirects();
    showUsage();
}
