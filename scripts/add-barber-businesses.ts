import fs from 'fs'
import path from 'path'

// Barber businesses data
const barberBusinesses = [
  {
    name: "Studio H",
    category: "hair-salons",
    area: "horndean",
    postcode: "SL2 0BZ",
    address: "2b London Rd, Horndean",
    lat: 50.9200,
    lng: -1.0100,
    phone: "07523 131982",
    website: "https://www.hair-studioh.co.uk",
    description: "Premium barber shop with perfect 5.0 rating from over 500 reviews. Exceptional attention to detail and modern trendy styles.",
    opening_hours: "Appointment-based (Closed Thursdays)",
    rating: 5.0,
    review_count: 534,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b7d?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&q=80"
    ]
  },
  {
    name: "JC Barbering",
    category: "hair-salons",
    area: "slough",
    postcode: "SL2 9QQ",
    address: "4 Frogmore Ln, Slough",
    lat: 50.8817,
    lng: -1.0324,
    phone: "07487 602476",
    website: "https://jcbarbering.co.uk",
    description: "Skin fade specialists with near-perfect 4.9 rating. Professional beard styling and precision cuts.",
    opening_hours: "Tue-Sat (Closed Mon & Sun)",
    rating: 4.9,
    review_count: 42,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop&q=80"
    ]
  },
  {
    name: "The Langley Barber Shop",
    category: "hair-salons",
    area: "cowplain",
    postcode: "SL2 8EW",
    address: "64 London Rd, Langley",
    lat: 50.8890,
    lng: -1.0180,
    phone: "023 9400 0385",
    website: "https://thecowplainbarbershop.setmore.com",
    description: "Established since the 1980s with loyal following. Consistent quality and excellent value at £16 per cut.",
    opening_hours: "Mon-Sat",
    rating: 4.7,
    review_count: 121,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1594736797933-d0f6c0b0b0b0?w=800&h=600&fit=crop&q=80"
    ]
  },
  {
    name: "L.A. Barbers",
    category: "hair-salons",
    area: "widley",
    postcode: "SL1 5AG",
    address: "74 London Rd, Widley",
    lat: 50.8750,
    lng: -1.0450,
    phone: "023 9225 5555",
    website: "",
    description: "Children's haircut specialists with SEN/autism expertise. Patient and understanding approach for families.",
    opening_hours: "Mon-Sat (Closed Wed & Sun)",
    rating: 4.6,
    review_count: 93,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1562322140-8baaccef4b5b?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80"
    ]
  },
  {
    name: "Jay's Barbers",
    category: "hair-salons",
    area: "cowplain",
    postcode: "SL2 8AA",
    address: "12 Portsmouth Road, Langley",
    lat: 50.8890,
    lng: -1.0180,
    phone: "023 9225 6666",
    website: "",
    description: "Dual service barber shop offering haircuts and body piercing. Walk-in friendly with good local reputation.",
    opening_hours: "Mon-Sat",
    rating: 4.3,
    review_count: 80,
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1585747860715-2ba37e788b7d?w=800&h=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&q=80"
    ]
  }
]

function generateSlug(name: string, area: string): string {
  return `${name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()}-${area.toLowerCase()}`
}

async function addBarberBusinesses() {
  try {
    console.log('🔍 Adding barber businesses to database...')
    
    // Read existing businesses.json
    const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
    let businessesData = []
    
    if (fs.existsSync(businessesPath)) {
      businessesData = JSON.parse(fs.readFileSync(businessesPath, 'utf8'))
    }
    
    // Add barber businesses
    barberBusinesses.forEach(barber => {
      const slug = generateSlug(barber.name, barber.area)
      const id = `barber-${slug}`
      
      const business = {
        id,
        name: barber.name,
        slug,
        category: barber.category,
        area: barber.area,
        postcode: barber.postcode,
        address: barber.address,
        lat: barber.lat,
        lng: barber.lng,
        phone: barber.phone,
        website: barber.website,
        description: barber.description,
        opening_hours_json: JSON.stringify({
          monday: barber.opening_hours,
          tuesday: barber.opening_hours,
          wednesday: barber.opening_hours,
          thursday: barber.opening_hours,
          friday: barber.opening_hours,
          saturday: barber.opening_hours,
          sunday: 'Closed'
        }),
        rating: barber.rating,
        review_count: barber.review_count,
        featured: barber.featured,
        images: barber.images,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // Check if business already exists
      const existingIndex = businessesData.findIndex(b => b.slug === slug)
      if (existingIndex >= 0) {
        console.log(`✅ Updated: ${barber.name}`)
        businessesData[existingIndex] = business
      } else {
        console.log(`✅ Added: ${barber.name}`)
        businessesData.push(business)
      }
    })
    
    // Write updated businesses.json
    fs.writeFileSync(businessesPath, JSON.stringify(businessesData, null, 2))
    
    console.log(`✅ Successfully added/updated ${barberBusinesses.length} barber businesses`)
    
  } catch (error) {
    console.error('❌ Error adding barber businesses:', error)
  }
}

// Run the script
addBarberBusinesses().catch(console.error)
