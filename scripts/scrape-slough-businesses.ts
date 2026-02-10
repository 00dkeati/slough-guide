/**
 * Scrape businesses from Google Places for Slough areas
 * Run with: npx tsx scripts/scrape-slough-businesses.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY || '';

// Slough areas with coordinates
const SLOUGH_AREAS = [
  { name: 'Slough Central', lat: 51.5105, lng: -0.5950, slug: 'slough-central' },
  { name: 'Langley', lat: 51.5088, lng: -0.5418, slug: 'langley' },
  { name: 'Cippenham', lat: 51.5150, lng: -0.6200, slug: 'cippenham' },
  { name: 'Chalvey', lat: 51.5050, lng: -0.5800, slug: 'chalvey' },
  { name: 'Britwell', lat: 51.5250, lng: -0.5700, slug: 'britwell' },
  { name: 'Colnbrook', lat: 51.4800, lng: -0.5200, slug: 'colnbrook' },
  { name: 'Upton', lat: 51.5200, lng: -0.6000, slug: 'upton' },
  { name: 'Wexham', lat: 51.5350, lng: -0.5800, slug: 'wexham' },
  { name: 'Manor Park', lat: 51.5180, lng: -0.5850, slug: 'manor-park' },
  { name: 'Salt Hill', lat: 51.5130, lng: -0.6050, slug: 'salt-hill' },
  { name: 'Farnham Royal', lat: 51.5400, lng: -0.6100, slug: 'farnham-royal' },
  { name: 'Burnham', lat: 51.5300, lng: -0.6500, slug: 'burnham' },
];

// Business categories to scrape
const CATEGORIES = [
  'restaurant',
  'cafe',
  'pub',
  'gym',
  'hairdresser',
  'plumber',
  'electrician',
  'dentist',
  'estate_agent',
  'takeaway',
  'barber',
  'car_repair',
  'florist',
  'bakery',
  'pharmacy',
  'veterinary_care',
  'accountant',
  'lawyer',
];

interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  area: string;
  areaSlug: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  lat: number;
  lng: number;
  placeId: string;
  photos?: string[];
}

async function searchPlaces(
  lat: number, 
  lng: number, 
  type: string,
  area: { name: string; slug: string }
): Promise<Business[]> {
  const radius = 2000; // 2km radius
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error(`API Error for ${type} in ${area.name}:`, data.status);
      return [];
    }
    
    const businesses: Business[] = (data.results || []).map((place: any) => ({
      id: place.place_id,
      name: place.name,
      slug: place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
      category: type.replace('_', '-'),
      area: area.name,
      areaSlug: area.slug,
      address: place.vicinity || place.formatted_address || '',
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      lat: place.geometry?.location?.lat,
      lng: place.geometry?.location?.lng,
      placeId: place.place_id,
    }));
    
    console.log(`  Found ${businesses.length} ${type}s in ${area.name}`);
    return businesses;
  } catch (error) {
    console.error(`Error fetching ${type} in ${area.name}:`, error);
    return [];
  }
}

async function scrapeArea(area: typeof SLOUGH_AREAS[0]): Promise<Business[]> {
  console.log(`\nScraping ${area.name}...`);
  const allBusinesses: Business[] = [];
  
  for (const category of CATEGORIES) {
    const businesses = await searchPlaces(area.lat, area.lng, category, area);
    allBusinesses.push(...businesses);
    
    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return allBusinesses;
}

async function main() {
  if (!GOOGLE_API_KEY) {
    console.error('GOOGLE_PLACES_API_KEY not set!');
    process.exit(1);
  }
  
  console.log('Starting Slough business scrape...');
  console.log(`Areas: ${SLOUGH_AREAS.length}`);
  console.log(`Categories: ${CATEGORIES.length}`);
  
  const allBusinesses: Business[] = [];
  const seenIds = new Set<string>();
  
  for (const area of SLOUGH_AREAS) {
    const businesses = await scrapeArea(area);
    
    // Dedupe by place_id
    for (const biz of businesses) {
      if (!seenIds.has(biz.placeId)) {
        seenIds.add(biz.placeId);
        allBusinesses.push(biz);
      }
    }
    
    // Rate limit between areas
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\nTotal unique businesses: ${allBusinesses.length}`);
  
  // Save to file
  const outputPath = path.join(process.cwd(), 'data', 'slough-businesses.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(allBusinesses, null, 2));
  console.log(`Saved to ${outputPath}`);
  
  // Also save to public for API access
  const publicPath = path.join(process.cwd(), 'public', 'data', 'businesses.json');
  fs.writeFileSync(publicPath, JSON.stringify(allBusinesses, null, 2));
  console.log(`Saved to ${publicPath}`);
  
  // Summary by category
  const byCategory: Record<string, number> = {};
  for (const biz of allBusinesses) {
    byCategory[biz.category] = (byCategory[biz.category] || 0) + 1;
  }
  console.log('\nBy category:');
  Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });
}

main().catch(console.error);
