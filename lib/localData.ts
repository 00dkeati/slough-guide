import fs from 'fs';
import path from 'path';

export interface Business {
  id: string;
  name: string;
  slug: string;
  category: string;
  area: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  review_count?: number;
  description?: string;
  images?: string[];
  google_place_id?: string;
  lat?: number;
  lng?: number;
}

export interface LocalDataResult {
  businesses: Business[];
  totalCount: number;
  hasData: boolean;
}

// Category mapping for keyword searches
const categoryMappings: Record<string, string[]> = {
  'fish and chips': ['fish-and-chips', 'restaurants', 'takeaways'],
  'restaurants': ['restaurants', 'cafes', 'pubs'],
  'takeaways': ['takeaways', 'restaurants', 'fish-and-chips'],
  'cafes': ['cafes', 'restaurants', 'coffee-shops'],
  'pubs': ['pubs', 'restaurants', 'bars'],
  'massage': ['massage-therapists', 'beauty-salons', 'wellness'],
  'beauty salon': ['beauty-salons', 'hairdressers', 'nail-salons'],
  'hairdresser': ['hairdressers', 'barbers', 'beauty-salons'],
  'dentist': ['dentists', 'dental-clinics'],
  'doctor': ['doctors', 'gps', 'medical-centres'],
  'plumber': ['plumbers', 'emergency-plumbers'],
  'electrician': ['electricians', 'electrical-contractors'],
  'handyman': ['handymen', 'handyman-services'],
  'gas engineer': ['gas-engineers', 'heating-engineers'],
  'boiler service': ['boiler-services', 'heating-services'],
  'car service': ['car-services', 'garages', 'mot-centres'],
  'car wash': ['car-washes', 'car-detailing'],
  'car hire': ['car-hire', 'car-rental'],
  'taxi': ['taxis', 'taxi-services'],
  'locksmith': ['locksmiths', 'security-services'],
  'painter decorator': ['painters', 'decorators', 'painting-services'],
  'removals': ['removal-services', 'moving-services'],
  'pet shops': ['pet-shops', 'pet-stores'],
  'soft play': ['soft-play', 'childrens-centres'],
  'shops': ['shops', 'retail', 'supermarkets'],
  'schools': ['schools', 'primary-schools'],
  'secondary schools': ['secondary-schools', 'schools'],
  'mortgage advisor': ['mortgage-advisors', 'financial-advisors'],
  'rental properties': ['estate-agents', 'letting-agents'],
  'new builds': ['new-builds', 'property-developers'],
  'news': ['news', 'local-news'],
  'market': ['markets', 'farmers-markets'],
  'postcode': ['postcode', 'area-info'],
  'town centre': ['town-centre', 'shopping-centre'],
  'high street': ['high-street', 'shopping'],
  'things to do': ['attractions', 'leisure', 'entertainment'],
  'asda': ['supermarkets', 'grocery-stores'],
  'wickes': ['diy-stores', 'hardware-stores']
};

// Load businesses data
function loadBusinesses(): Business[] {
  try {
    const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json');
    const businessesData = fs.readFileSync(businessesPath, 'utf-8');
    return JSON.parse(businessesData);
  } catch (error) {
    console.error('Error loading businesses data:', error);
    return [];
  }
}

// Normalize string for matching
function normalizeString(str: string): string {
  return str.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Get businesses by keyword/category
export function getBusinessesByKeyword(keyword: string, limit: number = 10): LocalDataResult {
  const allBusinesses = loadBusinesses();
  
  if (allBusinesses.length === 0) {
    return {
      businesses: [],
      totalCount: 0,
      hasData: false
    };
  }

  const normalizedKeyword = normalizeString(keyword);
  const categories = categoryMappings[normalizedKeyword] || [normalizedKeyword];
  
  // Find businesses that match the categories or contain the keyword
  const matchingBusinesses = allBusinesses.filter(business => {
    const businessCategory = normalizeString(business.category || '');
    const businessName = normalizeString(business.name);
    const businessDescription = normalizeString(business.description || '');
    
    // Check if business category matches any of our target categories
    const categoryMatch = categories.some(cat => businessCategory.includes(cat));
    
    // Check if business name or description contains the keyword
    const keywordMatch = businessName.includes(normalizedKeyword) || 
                        businessDescription.includes(normalizedKeyword);
    
    return categoryMatch || keywordMatch;
  });

  // Sort by rating (highest first), then by review count
  const sortedBusinesses = matchingBusinesses.sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    const reviewA = a.review_count || 0;
    const reviewB = b.review_count || 0;
    
    if (ratingA !== ratingB) {
      return ratingB - ratingA;
    }
    return reviewB - reviewA;
  });

  return {
    businesses: sortedBusinesses.slice(0, limit),
    totalCount: matchingBusinesses.length,
    hasData: matchingBusinesses.length > 0
  };
}

// Get businesses by specific category
export function getBusinessesByCategory(category: string, limit: number = 10): LocalDataResult {
  const allBusinesses = loadBusinesses();
  
  if (allBusinesses.length === 0) {
    return {
      businesses: [],
      totalCount: 0,
      hasData: false
    };
  }

  const normalizedCategory = normalizeString(category);
  
  const matchingBusinesses = allBusinesses.filter(business => {
    const businessCategory = normalizeString(business.category || '');
    return businessCategory.includes(normalizedCategory);
  });

  const sortedBusinesses = matchingBusinesses.sort((a, b) => {
    const ratingA = a.rating || 0;
    const ratingB = b.rating || 0;
    const reviewA = a.review_count || 0;
    const reviewB = b.review_count || 0;
    
    if (ratingA !== ratingB) {
      return ratingB - ratingA;
    }
    return reviewB - reviewA;
  });

  return {
    businesses: sortedBusinesses.slice(0, limit),
    totalCount: matchingBusinesses.length,
    hasData: matchingBusinesses.length > 0
  };
}

// Get area information for Slough
export function getAreaInfo() {
  return {
    postcodes: ['SL1', 'SL2'],
    council: 'Havant Borough Council',
    areas: ['Slough', 'Langley', 'Chalvey', 'Cippenham', 'Widley', 'Horndean', 'Clanfield'],
    nearby: ['Portsmouth', 'Havant', 'Fareham', 'Petersfield']
  };
}

// Get related keywords for internal linking
export function getRelatedKeywords(currentKeyword: string): string[] {
  // Extract the main keyword without "slough"
  const mainKeyword = currentKeyword.replace(/slough\s+/gi, '').replace(/\s+slough/gi, '').trim();
  
  const relatedMap: Record<string, string[]> = {
    'fish and chips': ['restaurants', 'takeaways', 'cafes', 'pubs'],
    'restaurants': ['cafes', 'takeaways', 'pubs', 'fish and chips'],
    'takeaways': ['restaurants', 'cafes', 'fish and chips', 'pubs'],
    'cafes': ['restaurants', 'takeaways', 'pubs', 'shops'],
    'pubs': ['restaurants', 'cafes', 'takeaways', 'high street'],
    'massage': ['beauty salon', 'hairdresser', 'wellness'],
    'beauty salon': ['hairdresser', 'massage', 'wellness'],
    'hairdresser': ['beauty salon', 'barbers', 'massage'],
    'dentist': ['doctor', 'medical', 'health'],
    'doctor': ['dentist', 'medical', 'health'],
    'plumber': ['gas engineer', 'boiler service', 'handyman'],
    'electrician': ['handyman', 'gas engineer', 'boiler service'],
    'handyman': ['plumber', 'electrician', 'painter decorator'],
    'gas engineer': ['plumber', 'boiler service', 'electrician'],
    'boiler service': ['gas engineer', 'plumber', 'heating'],
    'car service': ['car wash', 'car hire', 'garages'],
    'car wash': ['car service', 'car hire', 'detailing'],
    'car hire': ['car service', 'car wash', 'transport'],
    'taxi': ['car hire', 'transport', 'airport'],
    'locksmith': ['security', 'emergency', 'handyman'],
    'painter decorator': ['handyman', 'home improvement', 'decorating'],
    'removals': ['moving', 'storage', 'logistics'],
    'pet shops': ['vets', 'pet care', 'animals'],
    'soft play': ['children', 'family', 'entertainment'],
    'shops': ['high street', 'town centre', 'market'],
    'schools': ['secondary schools', 'education', 'children'],
    'secondary schools': ['schools', 'education', 'teenagers'],
    'mortgage advisor': ['financial', 'property', 'advice'],
    'rental properties': ['property', 'letting', 'accommodation'],
    'new builds': ['property', 'housing', 'development'],
    'news': ['local', 'events', 'community'],
    'market': ['shops', 'high street', 'town centre'],
    'postcode': ['area', 'location', 'address'],
    'town centre': ['high street', 'shops', 'market'],
    'high street': ['town centre', 'shops', 'market'],
    'things to do': ['attractions', 'entertainment', 'leisure'],
    'asda': ['supermarkets', 'shops', 'grocery'],
    'wickes': ['diy', 'hardware', 'home improvement']
  };

  return relatedMap[mainKeyword] || [];
}
