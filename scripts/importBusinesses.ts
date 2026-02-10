// @ts-nocheck
import { createClient } from '@libsql/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

interface BusinessData {
  name: string
  category: string
  area: string
  postcode?: string
  address?: string
  lat?: number
  lng?: number
  phone?: string
  website?: string
  description?: string
  opening_hours?: string
  rating?: number
  review_count?: number
  featured?: boolean
}

function generateSlug(name: string, area: string): string {
  return `${name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()}-${area.toLowerCase()}`
}

async function importBusinessesFromCSV(csvPath: string) {
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    console.log('CSV Headers:', headers)
    
    const businesses: BusinessData[] = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      
      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
      
      if (values.length !== headers.length) {
        console.warn(`Skipping line ${i + 1}: mismatched columns`)
        continue
      }
      const business: Partial<BusinessData> = {}
      
      headers.forEach((header, index) => {
        const value = values[index]
        if (!value) return
        
        switch (header.toLowerCase()) {
          case 'name':
            business.name = value
            break
          case 'category':
            business.category = value
            break
          case 'area':
            business.area = value
            break
          case 'postcode':
            business.postcode = value
            break
          case 'address':
            business.address = value
            break
          case 'lat':
            business.lat = parseFloat(value)
            break
          case 'lng':
            business.lng = parseFloat(value)
            break
          case 'phone':
            business.phone = value
            break
          case 'website':
            business.website = value
            break
          case 'description':
            business.description = value
            break
          case 'opening_hours':
            business.opening_hours = value
            break
          case 'rating':
            business.rating = parseFloat(value)
            break
          case 'review_count':
            business.review_count = parseInt(value)
            break
          case 'featured':
            business.featured = value.toLowerCase() === 'true'
            break
        }
      })
      
      if (business.name && business.category && business.area) {
        businesses.push(business)
      }
    }
    
    console.log(`Found ${businesses.length} businesses to import`)
    
    // Insert businesses
    for (const business of businesses) {
      const slug = generateSlug(business.name, business.area)
      const id = `biz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      const openingHoursJson = business.opening_hours ? JSON.stringify({
        monday: business.opening_hours,
        tuesday: business.opening_hours,
        wednesday: business.opening_hours,
        thursday: business.opening_hours,
        friday: business.opening_hours,
        saturday: business.opening_hours,
        sunday: 'Closed'
      }) : null
      
      try {
        await client.execute(`
          INSERT INTO businesses (
            id, name, slug, category, area, postcode, address, 
            lat, lng, phone, website, description, opening_hours_json,
            rating, review_count, featured
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id,
          business.name,
          slug,
          business.category,
          business.area,
          business.postcode || null,
          business.address || null,
          business.lat || null,
          business.lng || null,
          business.phone || null,
          business.website || null,
          business.description || null,
          openingHoursJson,
          business.rating || 0.0,
          business.review_count || 0,
          business.featured || false
        ])
        
        console.log(`✓ Imported: ${business.name}`)
      } catch (error) {
        console.error(`✗ Failed to import ${business.name}:`, error)
      }
    }
    
    console.log('Import completed!')
    
  } catch (error) {
    console.error('Error importing businesses:', error)
  }
}

async function createSampleData() {
  const sampleBusinesses: BusinessData[] = [
    {
      name: "Slough Plumbing Services",
      category: "plumbers",
      area: "slough",
      postcode: "SL1 7AA",
      address: "123 London Road, Slough",
      lat: 50.8817,
      lng: -1.0324,
      phone: "023 9225 1234",
      website: "https://sloughplumbing.co.uk",
      description: "Professional plumbing services for homes and businesses in Slough. Emergency repairs, installations, and maintenance.",
      opening_hours: "8:00 AM - 6:00 PM",
      rating: 4.8,
      review_count: 127,
      featured: true
    },
    {
      name: "The Coffee House",
      category: "cafes",
      area: "slough",
      postcode: "SL1 7BB",
      address: "45 High Street, Slough",
      lat: 50.8820,
      lng: -1.0310,
      phone: "023 9225 5678",
      website: "https://coffeehouseslough.co.uk",
      description: "Independent coffee shop serving freshly roasted beans, homemade cakes, and light meals. Perfect for meetings or relaxation.",
      opening_hours: "7:00 AM - 5:00 PM",
      rating: 4.6,
      review_count: 89,
      featured: true
    },
    {
      name: "Langley Veterinary Clinic",
      category: "vets",
      area: "cowplain",
      postcode: "SL2 8AA",
      address: "12 Portsmouth Road, Langley",
      lat: 50.8890,
      lng: -1.0180,
      phone: "023 9225 9999",
      website: "https://cowplainvets.co.uk",
      description: "Full-service veterinary clinic providing comprehensive care for pets. Routine checkups, surgeries, and emergency care available.",
      opening_hours: "8:30 AM - 6:30 PM",
      rating: 4.9,
      review_count: 156,
      featured: true
    },
    {
      name: "Cippenham Garden Centre",
      category: "garden-centers",
      area: "denmead",
      postcode: "SL1 6AA",
      address: "78 Southwick Road, Cippenham",
      lat: 50.8750,
      lng: -1.0450,
      phone: "023 9225 7777",
      description: "Family-run garden center offering plants, tools, and expert gardening advice. Seasonal displays and special events.",
      opening_hours: "9:00 AM - 5:00 PM",
      rating: 4.4,
      review_count: 67,
      featured: false
    },
    {
      name: "Chalvey Hair Studio",
      category: "hair-salons",
      area: "purbrook",
      postcode: "SL1 5AA",
      address: "23 London Road, Chalvey",
      lat: 50.8650,
      lng: -1.0580,
      phone: "023 9225 4444",
      description: "Modern hair salon offering cuts, colors, styling, and treatments. Experienced stylists and latest techniques.",
      opening_hours: "9:00 AM - 7:00 PM",
      rating: 4.7,
      review_count: 43,
      featured: false
    }
  ]

  console.log('Creating sample businesses...')
  
  for (const business of sampleBusinesses) {
    const slug = generateSlug(business.name, business.area)
    const id = `biz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    const openingHoursJson = business.opening_hours ? JSON.stringify({
      monday: business.opening_hours,
      tuesday: business.opening_hours,
      wednesday: business.opening_hours,
      thursday: business.opening_hours,
      friday: business.opening_hours,
      saturday: business.opening_hours,
      sunday: 'Closed'
    }) : null
    
    try {
      await client.execute(`
        INSERT OR REPLACE INTO businesses (
          id, name, slug, category, area, postcode, address, 
          lat, lng, phone, website, description, opening_hours_json,
          rating, review_count, featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        business.name,
        slug,
        business.category,
        business.area,
        business.postcode || null,
        business.address || null,
        business.lat || null,
        business.lng || null,
        business.phone || null,
        business.website || null,
        business.description || null,
        openingHoursJson,
        business.rating || 0.0,
        business.review_count || 0,
        business.featured || false
      ])
      
      console.log(`✓ Created: ${business.name}`)
    } catch (error) {
      console.error(`✗ Failed to create ${business.name}:`, error)
    }
  }
}

async function main() {
  const csvPath = path.join(process.cwd(), 'data', 'businesses.csv')
  
  if (fs.existsSync(csvPath)) {
    console.log('Found CSV file, importing...')
    await importBusinessesFromCSV(csvPath)
  } else {
    console.log('No CSV file found, creating sample data...')
    await createSampleData()
  }
}

main().catch(console.error)

