const fs = require('fs');
const path = require('path');

// Load existing data
const categories = require('../public/data/categories.json');
const areas = require('../public/data/areas.json');

// Sample business name templates
const businessTemplates = {
  'plumbers': ['Plumbing Services', 'Plumbing Solutions', 'Emergency Plumbers', 'Plumbing & Heating'],
  'cafes': ['Coffee House', 'Cafe', 'Coffee Shop', 'Tea Room'],
  'electricians': ['Electrical Services', 'Electrician', 'Electric Solutions', 'Electrical Contractors'],
  'restaurants': ['Restaurant', 'Bistro', 'Grill', 'Eatery', 'Dining'],
  'hair-salons': ['Hair Studio', 'Hair Salon', 'Hairdressers', 'Beauty Salon'],
  'dentists': ['Dental Practice', 'Dental Surgery', 'Dentist', 'Dental Care'],
  'gyms': ['Fitness Center', 'Gym', 'Fitness Studio', 'Health Club'],
  'car-mechanics': ['Auto Repairs', 'Car Service Center', 'Garage', 'MOT & Service'],
  'garden-centers': ['Garden Centre', 'Garden Supplies', 'Nursery', 'Landscaping'],
  'solicitors': ['Solicitors', 'Law Firm', 'Legal Services', 'Barristers'],
  'accountants': ['Accountants', 'Accounting Services', 'Tax Advisors', 'Bookkeepers'],
  'estate-agents': ['Estate Agents', 'Property Services', 'Letting Agents', 'Realtors'],
  'builders': ['Builders', 'Construction', 'Building Services', 'Contractors'],
  'cleaners': ['Cleaning Services', 'Cleaners', 'Commercial Cleaning', 'Domestic Cleaning'],
  'vets': ['Veterinary Clinic', 'Vet Practice', 'Animal Hospital', 'Veterinary Surgery']
};

const prefixes = ['The', 'Premier', 'Professional', 'Expert', 'Quality', 'Reliable', 'Trusted', 'Local', 'Family'];
const suffixes = ['Ltd', 'Services', '& Co', 'Specialists'];

// Generate businesses
const businesses = [];
let businessId = 1;

categories.forEach(category => {
  areas.forEach(area => {
    // Generate 3-5 businesses per category per area
    const count = Math.floor(Math.random() * 3) + 3;
    
    for (let i = 0; i < count; i++) {
      const templates = businessTemplates[category.slug] || ['Services', 'Solutions'];
      const template = templates[Math.floor(Math.random() * templates.length)];
      const usePrefix = Math.random() > 0.5;
      const useSuffix = Math.random() > 0.3;
      
      let name = area.name + ' ' + template;
      if (usePrefix) {
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        name = prefix + ' ' + name;
      }
      if (useSuffix) {
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        name += ' ' + suffix;
      }
      
      const slug = name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        + '-' + area.slug;
      
      const business = {
        id: `biz-${businessId}`,
        name: name,
        slug: slug,
        category: category.slug,
        area: area.slug,
        postcode: `PO${Math.floor(Math.random() * 10)} ${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        address: `${Math.floor(Math.random() * 200) + 1} ${['High Street', 'London Road', 'Main Street', 'Station Road'][Math.floor(Math.random() * 4)]}, ${area.name}`,
        lat: 50.8 + Math.random() * 0.2,
        lng: -1.1 + Math.random() * 0.2,
        phone: `023 9${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        website: `https://${slug}.co.uk`,
        description: `Professional ${category.name.toLowerCase()} in ${area.name}. Quality service with experienced staff. Contact us today for a quote.`,
        opening_hours_json: JSON.stringify({
          monday: "9:00 AM - 5:00 PM",
          tuesday: "9:00 AM - 5:00 PM",
          wednesday: "9:00 AM - 5:00 PM",
          thursday: "9:00 AM - 5:00 PM",
          friday: "9:00 AM - 5:00 PM",
          saturday: Math.random() > 0.5 ? "9:00 AM - 1:00 PM" : "Closed",
          sunday: "Closed"
        }),
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        review_count: Math.floor(Math.random() * 200),
        featured: Math.random() > 0.9,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      };
      
      businesses.push(business);
      businessId++;
    }
  });
});

// Save to file
fs.writeFileSync(
  path.join(__dirname, '../public/data/businesses.json'),
  JSON.stringify(businesses, null, 2)
);

console.log(`Generated ${businesses.length} businesses!`);
console.log(`Categories: ${categories.length}`);
console.log(`Areas: ${areas.length}`);
console.log(`Total potential pages: ${categories.length * areas.length + categories.length + areas.length + businesses.length}`);
