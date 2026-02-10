import fs from 'fs';
import path from 'path';
import { getBusinessesByKeyword, getRelatedKeywords, getAreaInfo } from '../lib/localData';

// Define all keywords and their content
const keywords = [
  'slough asda',
  'fish and chips slough',
  'things to do in slough',
  'car wash slough',
  'slough wickes',
  'taxi slough',
  'massage slough',
  'plumber slough',
  'car hire slough',
  'takeaways slough',
  'dentist slough',
  'restaurants slough',
  'slough shops',
  'slough soft play',
  'slough postcode',
  'slough town centre',
  'beauty salon slough',
  'pet shops slough',
  'removals slough',
  'electrician slough',
  'handyman slough',
  'cafes slough',
  'hairdresser slough',
  'slough market',
  'doctor slough',
  'car service slough',
  'painter decorator slough',
  'locksmith slough',
  'slough new builds',
  'slough news',
  'slough high street',
  'rental properties slough',
  'schools in slough',
  'pubs in slough',
  'mortgage advisor slough',
  'gas engineer slough',
  'secondary schools slough',
  'boiler service slough'
];

// Content templates for each keyword
const contentTemplates: Record<string, any> = {
  'slough asda': {
    title: 'Asda Slough – Store Guide, Opening Hours & Services 2025',
    description: 'Complete guide to Asda Slough store including opening hours, pharmacy, petrol station, click & collect, parking and peak times.',
    intro: 'Asda Slough serves the local community with a comprehensive supermarket offering groceries, household essentials, and additional services. Located conveniently for residents of Slough, Langley, Chalvey, and Cippenham, the store provides easy access to everyday shopping needs with extended opening hours and multiple service options.',
    prices: 'Asda Slough offers competitive pricing across all product categories. Grocery essentials typically range from £1-£5 for basic items, with fresh produce starting from £0.50. Household items vary from £2-£20 depending on brand and size. The pharmacy provides NHS prescriptions at standard rates, while petrol prices fluctuate with market rates but remain competitive locally.',
    tips: 'Parking is free with 2-hour limits during peak times. The store is busiest on weekends and weekday evenings. Click & collect slots fill quickly during holidays. The pharmacy operates separate hours and may close during lunch breaks.',
    coverage: 'Asda Slough serves the immediate Slough area including Langley, Chalvey, Cippenham, Widley, Horndean, and Clanfield. The store is easily accessible by car with good parking facilities and is served by local bus routes connecting surrounding villages.',
    faqs: [
      { q: 'What are Asda Slough opening hours?', a: 'Asda Slough is typically open 7am-10pm Monday to Saturday and 10am-4pm on Sundays, with extended hours during peak shopping periods.' },
      { q: 'Does Asda Slough have a pharmacy?', a: 'Yes, Asda Slough includes a pharmacy offering NHS prescriptions, over-the-counter medications, and health advice during store hours.' },
      { q: 'Is there parking at Asda Slough?', a: 'Yes, Asda Slough provides free customer parking with a 2-hour limit during busy periods to ensure availability for all shoppers.' },
      { q: 'Does Asda Slough offer click & collect?', a: 'Yes, Asda Slough provides click & collect services for groceries and general merchandise, with dedicated collection points and convenient time slots.' },
      { q: 'What services are available at Asda Slough?', a: 'Asda Slough offers groceries, household items, pharmacy, petrol station, click & collect, and various seasonal services throughout the year.' }
    ]
  },
  'fish and chips slough': {
    title: 'Fish and Chips Slough – Best Local Takeaways 2025',
    description: 'Discover the best fish and chips in Slough with our guide to top-rated takeaways, portion sizes, gluten-free options, and local favourites.',
    intro: 'Slough boasts several excellent fish and chip shops serving the local community with traditional British fare. From crispy battered cod to golden chips, these establishments cater to residents across Slough, Langley, Chalvey, and Cippenham with authentic flavours and generous portions.',
    prices: 'Fish and chips in Slough typically cost £8-£12 for a standard portion, with larger portions ranging £10-£15. Children\'s portions are usually £4-£6. Additional items like mushy peas, curry sauce, or pickled onions add £1-£2. Most shops offer meal deals combining fish, chips, and a drink for £10-£14.',
    tips: 'Peak times are Friday evenings and weekends. Many shops offer gluten-free options on specific nights. Cash is preferred at some establishments. Parking can be limited during busy periods, so consider collection times.',
    coverage: 'Fish and chip shops in Slough serve the town centre and surrounding areas including Langley, Chalvey, Cippenham, Widley, Horndean, and Clanfield. Most offer delivery within a 3-mile radius of the town centre.',
    faqs: [
      { q: 'Which fish and chip shops in Slough offer gluten-free options?', a: 'Several fish and chip shops in Slough provide gluten-free batter and chips, typically available on specific nights of the week to avoid cross-contamination.' },
      { q: 'What are typical portion sizes for fish and chips in Slough?', a: 'Standard portions in Slough include a medium-sized fish fillet with a generous serving of chips, while large portions offer bigger fish and extra chips.' },
      { q: 'Do Slough fish and chip shops deliver?', a: 'Most fish and chip shops in Slough offer delivery within a 3-mile radius, with delivery times typically 30-45 minutes during peak periods.' },
      { q: 'What types of fish are available at Slough chippies?', a: 'Slough fish and chip shops typically offer cod, haddock, and plaice, with some also providing alternative options like scampi or fishcakes.' },
      { q: 'Are there children\'s portions available at Slough fish and chip shops?', a: 'Yes, most fish and chip shops in Slough offer children\'s portions with smaller fish fillets and reduced chip portions at lower prices.' }
    ]
  },
  'things to do in slough': {
    title: 'Things to Do in Slough – Attractions, Activities & Days Out 2025',
    description: 'Discover the best things to do in Slough including parks, leisure activities, family attractions, and day trip ideas for all ages.',
    intro: 'Slough offers a variety of activities and attractions for residents and visitors alike. From family-friendly parks and leisure facilities to cultural attractions and outdoor pursuits, there\'s something for everyone in Slough and the surrounding areas of Langley, Chalvey, Cippenham, and Horndean.',
    prices: 'Many activities in Slough are free, including parks, walking trails, and community events. Leisure centre activities range from £3-£8 for swimming or fitness classes. Soft play centres typically charge £5-£10 per child. Cinema tickets are £8-£12 for adults. Family attractions and day trips to nearby areas like Portsmouth or the South Downs cost £15-£30 per person.',
    tips: 'Weekend activities can be busier, so book ahead for popular attractions. Many venues offer family discounts and annual passes. Check seasonal opening hours for outdoor activities. Local events are often advertised in community centres and online.',
    coverage: 'Slough\'s attractions serve the town and surrounding villages including Langley, Chalvey, Cippenham, Widley, Horndean, and Clanfield. Many activities are easily accessible by car or public transport, with good connections to Portsmouth and the South Downs.',
    faqs: [
      { q: 'What free activities are available in Slough?', a: 'Slough offers several free activities including parks, walking trails, community events, library activities, and seasonal festivals throughout the year.' },
      { q: 'Are there family-friendly attractions in Slough?', a: 'Yes, Slough has family-friendly attractions including soft play centres, parks with playgrounds, leisure centres with swimming pools, and community events suitable for all ages.' },
      { q: 'What outdoor activities can I do in Slough?', a: 'Outdoor activities in Slough include walking trails, cycling routes, park activities, sports facilities, and easy access to the South Downs for hiking and nature walks.' },
      { q: 'Are there any cultural attractions in Slough?', a: 'Slough has cultural attractions including local history displays, community centres hosting events, libraries with regular activities, and seasonal cultural festivals.' },
      { q: 'What day trip options are available from Slough?', a: 'From Slough, you can easily visit Portsmouth for maritime attractions, the South Downs for hiking, Winchester for history, or the coast for beach activities within 30-60 minutes drive.' }
    ]
  },
  'restaurants slough': {
    title: 'Restaurants Slough – Best Local Dining & Eateries 2025',
    description: 'Discover the best restaurants in Slough with our guide to top-rated dining options, cuisines, and local favourites for every occasion.',
    intro: 'Slough offers a diverse range of restaurants serving the local community with various cuisines and dining experiences. From traditional British pubs to international cuisine, these establishments cater to residents across Slough, Langley, Chalvey, and Cippenham with quality food and welcoming atmospheres.',
    prices: 'Restaurant meals in Slough typically range from £12-£25 for main courses, with set menus available from £15-£20. Fine dining establishments may charge £25-£40 per person. Many restaurants offer early bird discounts and children\'s menus, with family meals often providing good value.',
    tips: 'Peak dining times are evenings and weekends. Many restaurants accept bookings, especially for larger groups. Some offer early bird discounts and children\'s menus. Check for special offers and seasonal menus.',
    coverage: 'Restaurants in Slough serve the town centre and surrounding areas including Langley, Chalvey, Cippenham, Widley, Horndean, and Clanfield. Many offer delivery services within a 3-mile radius of the town centre.',
    faqs: [
      { q: 'What types of cuisine are available in Slough restaurants?', a: 'Slough restaurants offer a variety of cuisines including British, Italian, Indian, Chinese, Thai, and Mediterranean, with many establishments specialising in specific regional dishes.' },
      { q: 'Do Slough restaurants offer delivery services?', a: 'Many restaurants in Slough offer delivery services, either directly or through third-party platforms, typically within a 3-mile radius of the town centre.' },
      { q: 'Are there family-friendly restaurants in Slough?', a: 'Yes, many restaurants in Slough are family-friendly, offering children\'s menus, high chairs, and welcoming atmospheres suitable for families with young children.' },
      { q: 'Do Slough restaurants accommodate dietary requirements?', a: 'Most restaurants in Slough can accommodate common dietary requirements including vegetarian, vegan, and gluten-free options, though it\'s advisable to check in advance.' },
      { q: 'What are the typical opening hours for Slough restaurants?', a: 'Restaurant opening hours in Slough vary, but most are open for lunch and dinner, with some offering breakfast and late-night dining options.' }
    ]
  },
  'cafes slough': {
    title: 'Cafes Slough – Best Coffee Shops & Light Bites 2025',
    description: 'Discover the best cafes in Slough with our guide to top-rated coffee shops, light meals, and cosy spots for coffee and cake.',
    intro: 'Slough boasts several charming cafes serving the local community with quality coffee, light meals, and welcoming atmospheres. From independent coffee shops to chain cafes, these establishments cater to residents across Slough, Langley, Chalvey, and Cippenham with freshly brewed drinks and delicious treats.',
    prices: 'Café prices in Slough range from £3-£6 for hot drinks, £5-£10 for light meals, and £8-£15 for full breakfasts or lunches. Many cafes offer loyalty schemes and special deals, with some providing free WiFi and comfortable seating areas.',
    tips: 'Cafés are busiest during morning coffee rush and lunch hours. Many offer free WiFi and are child-friendly. Some have outdoor seating and takeaway options. Check for daily specials and seasonal menu items.',
    coverage: 'Cafes in Slough serve the town centre and surrounding areas including Langley, Chalvey, Cippenham, Widley, Horndean, and Clanfield. Many are easily accessible by car and public transport.',
    faqs: [
      { q: 'Do Slough cafes offer free WiFi?', a: 'Most cafes in Slough provide free WiFi for customers, making them popular spots for remote work and casual meetings.' },
      { q: 'Are Slough cafes child-friendly?', a: 'Yes, many cafes in Slough are child-friendly, offering high chairs, children\'s menus, and welcoming atmospheres for families.' },
      { q: 'Do Slough cafes serve breakfast?', a: 'Many cafes in Slough serve breakfast items including full English breakfasts, pastries, and continental options, typically available until late morning.' },
      { q: 'Are there outdoor seating options at Slough cafes?', a: 'Several cafes in Slough offer outdoor seating areas, weather permitting, providing pleasant spots for al fresco dining and coffee.' },
      { q: 'Do Slough cafes offer takeaway options?', a: 'Yes, most cafes in Slough offer takeaway options for drinks and light meals, with some providing online ordering and collection services.' }
    ]
  }
  // Add more templates as needed...
};

// Generate slug from keyword
function generateSlug(keyword: string): string {
  return keyword
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Generate title from keyword
function generateTitle(keyword: string): string {
  const words = keyword.split(' ');
  const capitalized = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  return `${capitalized} – Complete Guide 2025`;
}

// Generate description from keyword
function generateDescription(keyword: string): string {
  const base = `Find the best ${keyword} options in Slough, Berkshire. Complete guide with reviews, prices, locations, and local tips for residents and visitors.`;
  return base.length > 155 ? base.substring(0, 152) + '...' : base;
}

// Generate intro content
function generateIntro(keyword: string): string {
  const areaInfo = getAreaInfo();
  const areas = areaInfo.areas.slice(0, 4).join(', ');
  
  return `Slough offers excellent ${keyword} options serving the local community with quality services and convenient locations. Whether you're a resident of Slough, ${areas}, or visiting the area, you'll find a range of options to meet your needs with professional service and local expertise.`;
}

// Generate prices content
function generatePrices(keyword: string): string {
  const priceRanges: Record<string, string> = {
    'restaurants': 'Restaurant meals in Slough typically range from £12-£25 for main courses, with set menus available from £15-£20. Fine dining establishments may charge £25-£40 per person.',
    'cafes': 'Café prices in Slough range from £3-£6 for hot drinks, £5-£10 for light meals, and £8-£15 for full breakfasts or lunches.',
    'takeaways': 'Takeaway prices in Slough vary by cuisine, with most main dishes costing £8-£15, sides from £2-£5, and delivery charges typically £2-£4.',
    'massage': 'Massage therapy in Slough costs £35-£60 for 60-minute sessions, with shorter treatments from £25-£40. Sports massage and deep tissue work may cost £45-£70.',
    'plumber': 'Plumbing services in Slough typically charge £40-£80 per hour plus materials, with emergency call-outs costing £80-£120. Simple jobs like tap repairs start from £60.',
    'electrician': 'Electrical work in Slough costs £40-£70 per hour plus materials, with emergency services charging £80-£100. Simple jobs like socket installation start from £80.',
    'handyman': 'Handyman services in Slough typically charge £25-£45 per hour, with minimum call-out fees of £40-£60. Small jobs like hanging pictures start from £30.',
    'car service': 'Car servicing in Slough costs £80-£150 for basic services, £150-£300 for full services, with MOT tests typically £35-£55.',
    'car wash': 'Car washing in Slough costs £5-£15 for basic washes, £15-£30 for full valeting, with hand-wash services typically £10-£25.',
    'taxi': 'Taxi fares in Slough start from £3-£5 minimum charge, with local journeys typically £5-£15. Airport transfers cost £25-£45 depending on destination.',
    'dentist': 'Dental treatment in Slough varies by service, with NHS check-ups from £23, private consultations £50-£80, and treatments ranging £50-£300.',
    'doctor': 'GP services in Slough are free under the NHS, with private consultations typically costing £80-£150. Prescription charges are £9.65 per item.',
    'beauty salon': 'Beauty treatments in Slough range from £15-£30 for basic services, £30-£60 for advanced treatments, with full packages from £50-£120.',
    'hairdresser': 'Hair services in Slough cost £20-£40 for cuts, £30-£80 for colouring, with styling and treatments ranging £25-£60.',
    'locksmith': 'Locksmith services in Slough cost £50-£100 for standard jobs, £80-£150 for emergency call-outs, with lock changes from £60-£120.',
    'removals': 'Removal services in Slough typically charge £40-£80 per hour for local moves, with full house removals costing £200-£500 depending on size.',
    'gas engineer': 'Gas engineering work in Slough costs £60-£100 per hour plus parts, with boiler servicing typically £80-£120 and installations from £200-£500.',
    'boiler service': 'Boiler servicing in Slough costs £80-£120 for annual services, with repairs ranging £100-£300 and emergency call-outs from £120-£200.',
    'car hire': 'Car hire in Slough costs £25-£50 per day for small cars, £40-£80 for larger vehicles, with weekly rates offering better value.',
    'mortgage advisor': 'Mortgage advice in Slough is typically free for borrowers, with advisors earning commission from lenders. Some may charge £200-£500 for complex cases.',
    'pet shops': 'Pet supplies in Slough vary by product, with food ranging £5-£30, accessories £10-£50, and services like grooming from £25-£60.',
    'soft play': 'Soft play in Slough costs £5-£10 per child for 2-hour sessions, with party packages from £15-£25 per child including food and activities.',
    'shops': 'Shopping in Slough offers a range of prices across different retailers, from budget-friendly options to premium brands, with regular sales and promotions.',
    'schools': 'School costs in Slough vary by type, with state schools free, private schools from £3,000-£8,000 per term, and additional costs for uniforms and activities.',
    'pubs': 'Pub prices in Slough range from £3-£5 for pints, £4-£7 for spirits, with meals typically £8-£15 and Sunday roasts from £10-£18.',
    'rental properties': 'Rental properties in Slough cost £800-£1,200 for 1-bed flats, £1,000-£1,500 for 2-bed properties, and £1,200-£2,000 for 3-bed houses.',
    'new builds': 'New build properties in Slough start from £250,000 for 2-bed apartments, £300,000-£400,000 for 3-bed houses, with larger properties from £400,000.',
    'news': 'Local news in Slough is available free through various online platforms, community newsletters, and local publications, with some premium content available.',
    'market': 'Market prices in Slough vary by stall and product, with fresh produce typically £1-£5 per item, crafts from £5-£25, and food items £3-£10.',
    'postcode': 'Postcode information for Slough (SL1/SL2) is free to access, with postal services costing standard Royal Mail rates from £0.85 for letters.',
    'town centre': 'Town centre activities in Slough include free access to public spaces, with shopping, dining, and services at standard retail prices.',
    'high street': 'High street shopping in Slough offers competitive prices across various retailers, with regular sales and seasonal promotions available.',
    'things to do': 'Activities in Slough range from free options like parks and walking trails to paid attractions costing £5-£25 per person, with family discounts available.',
    'asda': 'Asda Slough offers competitive supermarket pricing with groceries from £0.50-£5 for basics, household items £2-£20, and regular promotions and offers.',
    'wickes': 'Wickes Slough provides competitive DIY and building supplies pricing, with materials ranging from £5-£50 for basic items and larger purchases from £50-£500.'
  };
  
  return priceRanges[keyword] || `Prices for ${keyword} in Slough vary depending on the specific service or product, with most local businesses offering competitive rates compared to surrounding areas.`;
}

// Generate tips content
function generateTips(keyword: string): string {
  const tips: Record<string, string> = {
    'restaurants': 'Peak dining times are evenings and weekends. Many restaurants accept bookings, especially for larger groups. Some offer early bird discounts and children\'s menus.',
    'cafes': 'Cafés are busiest during morning coffee rush and lunch hours. Many offer free WiFi and are child-friendly. Some have outdoor seating and takeaway options.',
    'takeaways': 'Peak delivery times are evenings and weekends. Many offer online ordering and contactless payment. Check delivery areas and minimum order requirements.',
    'massage': 'Book appointments in advance, especially for popular therapists. Some offer mobile services. Check qualifications and insurance. Bring comfortable clothing.',
    'plumber': 'Emergency plumbers are available 24/7 but cost more. Get quotes for larger jobs. Check if they\'re Gas Safe registered for gas work.',
    'electrician': 'Always use qualified electricians. Emergency services available but cost more. Get quotes for larger jobs. Check Part P certification.',
    'handyman': 'Book in advance for non-urgent work. Get quotes for larger jobs. Check insurance and references. Some offer same-day service for small jobs.',
    'car service': 'Book MOT tests in advance. Regular servicing helps avoid breakdowns. Check if garage is VAT registered. Keep service records for resale value.',
    'car wash': 'Peak times are weekends and before holidays. Some offer loyalty cards. Check if they use eco-friendly products. Hand wash takes longer but better results.',
    'taxi': 'Book in advance for airport runs. Check if they accept cards. Some offer fixed rates for longer journeys. Local knowledge helps with traffic.',
    'dentist': 'Register with an NHS dentist early as waiting lists can be long. Emergency appointments available. Check if they offer payment plans.',
    'doctor': 'Register with a local GP practice. Book appointments online where possible. Emergency appointments available. Check opening hours and out-of-hours services.',
    'beauty salon': 'Book appointments in advance, especially for popular treatments. Some offer package deals. Check qualifications and hygiene standards.',
    'hairdresser': 'Book appointments in advance, especially for colouring. Bring photos of desired styles. Some offer consultations. Check if they use quality products.',
    'locksmith': 'Keep emergency numbers handy. Check if they\'re DBS checked. Get quotes for non-emergency work. Some offer 24/7 service.',
    'removals': 'Book well in advance, especially for summer moves. Get quotes from multiple companies. Check insurance coverage. Pack carefully to avoid damage.',
    'gas engineer': 'Always use Gas Safe registered engineers. Get annual boiler servicing. Check qualifications for different types of gas work.',
    'boiler service': 'Annual servicing recommended before winter. Check if engineer is Gas Safe registered. Keep service records for warranty purposes.',
    'car hire': 'Book in advance for better rates. Check age restrictions and driving licence requirements. Inspect vehicle before driving. Check insurance coverage.',
    'mortgage advisor': 'Get advice from multiple advisors. Check if they\'re whole of market. Understand fees and commission structure. Get pre-approval before house hunting.',
    'pet shops': 'Check opening hours as they may vary. Some offer loyalty schemes. Ask about product guarantees. Check if they offer grooming services.',
    'soft play': 'Peak times are weekends and school holidays. Some offer toddler-only sessions. Bring socks for children. Check age restrictions and supervision requirements.',
    'shops': 'Peak shopping times are weekends and lunch hours. Many offer parking. Check opening hours as they may vary. Some offer click and collect.',
    'schools': 'Apply for school places early. Check catchment areas. Visit schools before applying. Check Ofsted reports and exam results.',
    'pubs': 'Peak times are evenings and weekends. Many offer food and children\'s menus. Some have outdoor seating. Check if they allow dogs.',
    'rental properties': 'Start looking early as good properties go quickly. Have references ready. Check what\'s included in rent. Visit properties in person.',
    'new builds': 'Visit show homes to see finishes. Check warranties and snagging policies. Consider location and transport links. Get independent surveys.',
    'news': 'Follow local social media pages for updates. Subscribe to newsletters. Check council websites for official information. Join community groups.',
    'market': 'Check market days and times. Some stalls only accept cash. Arrive early for best selection. Check if they offer parking.',
    'postcode': 'SL1 and SL2 cover different areas. Check council services for your specific postcode. Update address with all services when moving.',
    'town centre': 'Peak times are lunch hours and weekends. Check parking restrictions. Many shops offer free WiFi. Some areas are pedestrianised.',
    'high street': 'Peak shopping times are weekends and lunch hours. Check parking availability. Many shops offer click and collect. Some have late night opening.',
    'things to do': 'Check seasonal opening hours. Book popular attractions in advance. Many activities are weather dependent. Check age restrictions.',
    'asda': 'Peak times are weekends and evenings. Use click and collect to avoid queues. Check pharmacy hours. Some items may be out of stock.',
    'wickes': 'Peak times are weekends and DIY seasons. Use trade desk for bulk orders. Check delivery options. Some items may need to be ordered.'
  };
  
  return tips[keyword] || `When using ${keyword} services in Slough, it\'s advisable to book in advance where possible, check opening hours, and consider peak times to avoid delays.`;
}

// Generate coverage content
function generateCoverage(keyword: string): string {
  const areaInfo = getAreaInfo();
  const areas = areaInfo.areas.join(', ');
  
  return `${keyword} services in Slough cover the town centre and surrounding areas including ${areas}. Most businesses serve the immediate Slough area with some extending services to nearby villages. The town\'s central location makes it easily accessible by car and public transport from surrounding areas.`;
}

// Generate FAQs
function generateFAQs(keyword: string): Array<{q: string, a: string}> {
  const baseFAQs = [
    {
      q: `What are the best ${keyword} options in Slough?`,
      a: `Slough offers several excellent ${keyword} options, with many highly-rated businesses serving the local community. The best choice depends on your specific needs, location, and preferences.`
    },
    {
      q: `How much do ${keyword} services cost in Slough?`,
      a: `Prices for ${keyword} in Slough vary depending on the specific service, with most businesses offering competitive rates. It's advisable to get quotes from multiple providers to compare prices.`
    },
    {
      q: `Are ${keyword} services available in surrounding areas?`,
      a: `Yes, many ${keyword} businesses in Slough also serve surrounding areas including Langley, Chalvey, Cippenham, and Horndean, though service areas may vary by provider.`
    },
    {
      q: `Do I need to book ${keyword} services in advance?`,
      a: `Booking requirements vary by business, but it's generally advisable to book ${keyword} services in advance, especially during peak times or for popular providers.`
    },
    {
      q: `What should I look for when choosing ${keyword} services?`,
      a: `When choosing ${keyword} services in Slough, consider factors like reputation, qualifications, pricing, availability, and customer reviews to find the best option for your needs.`
    }
  ];
  
  return baseFAQs;
}

// Generate related links
function generateRelatedLinks(keyword: string): string[] {
  const related = getRelatedKeywords(keyword);
  return related.slice(0, 5).map(link => generateSlug(link));
}

// Generate MDX content
function generateMDXContent(keyword: string, businesses: any[]): string {
  const slug = generateSlug(keyword);
  const title = contentTemplates[keyword]?.title || generateTitle(keyword);
  const description = contentTemplates[keyword]?.description || generateDescription(keyword);
  const intro = contentTemplates[keyword]?.intro || generateIntro(keyword);
  const prices = contentTemplates[keyword]?.prices || generatePrices(keyword);
  const tips = contentTemplates[keyword]?.tips || generateTips(keyword);
  const coverage = contentTemplates[keyword]?.coverage || generateCoverage(keyword);
  const faqs = contentTemplates[keyword]?.faqs || generateFAQs(keyword);
  const relatedLinks = generateRelatedLinks(keyword);
  
  const currentDate = new Date().toISOString().split('T')[0];
  
  let content = `---
title: "${title}"
description: "${description}"
slug: "/seo/${slug}"
datePublished: "${currentDate}"
dateModified: "${currentDate}"
tags: ["Slough", "${keyword.split(' ')[0]}", "Guide", "2025"]
canonical: "https://www.slough.co/seo/${slug}"
ogImage: "/og/${slug}.png"
schemaType: "ItemList"
---

# ${title}

${intro}

## Top ${keyword} options in Slough

`;

  if (businesses.length > 0) {
    content += `Here are the top-rated ${keyword} options in Slough based on customer reviews and local reputation:

`;
    
    businesses.forEach((business, index) => {
      content += `### ${index + 1}. ${business.name}
${business.description || `Professional ${keyword} services in Slough.`}

**Location:** ${business.area || 'Slough'}  
**Rating:** ${business.rating ? `${business.rating}/5 (${business.review_count} reviews)` : 'Not rated'}  
**Contact:** ${business.phone ? business.phone : 'Contact via website'}  
**Website:** ${business.website ? `[Visit website](${business.website})` : 'No website available'}

`;
    });
  } else {
    content += `### How to choose the best ${keyword} in Slough

When looking for ${keyword} services in Slough, consider these key factors:

- **Reputation and reviews:** Check online reviews and ask for recommendations from local residents
- **Qualifications and experience:** Ensure providers have appropriate qualifications and experience
- **Availability and response times:** Consider how quickly services can be provided
- **Pricing and value:** Compare prices but don't just choose the cheapest option
- **Local knowledge:** Choose providers familiar with the Slough area
- **Insurance and guarantees:** Check that providers have appropriate insurance and offer guarantees
- **Customer service:** Look for providers who are responsive and professional

`;
  }

  content += `## Prices & what to expect

${prices}

## Neighbourhood tips

${tips}

## Map & areas covered

${coverage}

## FAQs

`;

  faqs.forEach(faq => {
    content += `### ${faq.q}

${faq.a}

`;
  });

  content += `## Related guides

Explore more local services and attractions in Slough:

`;

  relatedLinks.forEach(link => {
    const linkTitle = link.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    content += `- [${linkTitle}](/seo/${link})\n`;
  });

  content += `
---

*Last updated: ${currentDate} | Slough Local Guide*
`;

  return content;
}

// Main function to generate all pages
async function generateAllPages() {
  const contentDir = path.join(process.cwd(), 'content', 'editorial');
  
  // Ensure directory exists
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  
  let generatedCount = 0;
  
  for (const keyword of keywords) {
    try {
      // Get businesses for this keyword
      const businessData = getBusinessesByKeyword(keyword, 10);
      
      // Generate MDX content
      const mdxContent = generateMDXContent(keyword, businessData.businesses);
      
      // Write file
      const slug = generateSlug(keyword);
      const filePath = path.join(contentDir, `${slug}.mdx`);
      fs.writeFileSync(filePath, mdxContent);
      
      console.log(`✅ Generated: ${slug}.mdx (${businessData.businesses.length} businesses found)`);
      generatedCount++;
      
    } catch (error) {
      console.error(`❌ Error generating ${keyword}:`, error);
    }
  }
  
  console.log(`\n🎉 Successfully generated ${generatedCount} SEO pages!`);
  console.log(`📁 Files saved to: ${contentDir}`);
}

// Run the generator
generateAllPages().catch(console.error);
