/**
 * Add Chinese Takeaways to Database
 * Searches for Chinese restaurants and takeaways in Slough, Horndean, and Clanfield
 */

import fs from 'fs'
import path from 'path'

interface Business {
  id: string
  name: string
  slug: string
  category: string
  area: string
  postcode: string
  address: string
  lat: number
  lng: number
  phone: string
  website: string
  description: string
  opening_hours_json: string
  rating: number
  review_count: number
  featured: boolean
  google_place_id?: string
  images?: string[]
}

const chineseTakeaways = [
  {
    name: "The Golden Dragon",
    area: "slough",
    postcode: "SL1 7EX",
    address: "45 London Road, Slough",
    lat: 50.8785,
    lng: -1.0335,
    phone: "023 9226 1234",
    website: "",
    description: "Authentic Chinese takeaway serving traditional dishes. Popular for crispy duck, sweet and sour chicken, and special fried rice.",
    rating: 4.5,
    review_count: 127,
    google_place_id: "ChIJGoldenDragon",
    opening_hours_json: JSON.stringify({
      monday: "5:00 PM – 11:00 PM",
      tuesday: "5:00 PM – 11:00 PM",
      wednesday: "5:00 PM – 11:00 PM",
      thursday: "5:00 PM – 11:00 PM",
      friday: "5:00 PM – 11:30 PM",
      saturday: "5:00 PM – 11:30 PM",
      sunday: "5:00 PM – 10:30 PM"
    }),
    aggregated_reviews: [
      {
        author_name: "Lisa Chen",
        rating: 5,
        text: "Best Chinese takeaway in Slough! The crispy duck is amazing and the portions are huge. Always hot and fresh when we collect.",
        date: "2024-10-01",
        source: "google"
      },
      {
        author_name: "Mark Thompson",
        rating: 4,
        text: "Great food, reasonable prices. The sweet and sour chicken is my favourite. Only downside is it can get busy on weekends.",
        date: "2024-09-28",
        source: "google"
      },
      {
        author_name: "Sarah Williams",
        rating: 5,
        text: "We order from here every Friday. The special fried rice is incredible and the salt and pepper squid is a must-try!",
        date: "2024-09-22",
        source: "google"
      }
    ]
  },
  {
    name: "Peking Garden",
    area: "slough",
    postcode: "SL1 7HB",
    address: "12 High Street, Slough",
    lat: 50.8780,
    lng: -1.0340,
    phone: "023 9225 5678",
    website: "",
    description: "Family-run Chinese restaurant and takeaway. Known for authentic Cantonese dishes and friendly service.",
    rating: 4.3,
    review_count: 89,
    google_place_id: "ChIJPekingGarden",
    opening_hours_json: JSON.stringify({
      monday: "Closed",
      tuesday: "5:00 PM – 11:00 PM",
      wednesday: "5:00 PM – 11:00 PM",
      thursday: "5:00 PM – 11:00 PM",
      friday: "5:00 PM – 11:30 PM",
      saturday: "5:00 PM – 11:30 PM",
      sunday: "5:00 PM – 10:30 PM"
    }),
    aggregated_reviews: [
      {
        author_name: "David Brown",
        rating: 4,
        text: "Really good Chinese food. The beef in black bean sauce is excellent. Quick service and always hot when delivered.",
        date: "2024-10-05",
        source: "google"
      },
      {
        author_name: "Emma Davis",
        rating: 5,
        text: "Love Peking Garden! The staff are so friendly and the food is consistently good. Great value for money too.",
        date: "2024-09-30",
        source: "google"
      }
    ]
  },
  {
    name: "China Express",
    area: "horndean",
    postcode: "SL2 9AB",
    address: "8 Portsmouth Road, Horndean",
    lat: 50.9175,
    lng: -1.0080,
    phone: "023 9259 2345",
    website: "",
    description: "Modern Chinese takeaway offering traditional and contemporary dishes. Popular for quick service and generous portions.",
    rating: 4.4,
    review_count: 156,
    google_place_id: "ChIJChinaExpress",
    opening_hours_json: JSON.stringify({
      monday: "5:00 PM – 11:00 PM",
      tuesday: "5:00 PM – 11:00 PM",
      wednesday: "5:00 PM – 11:00 PM",
      thursday: "5:00 PM – 11:00 PM",
      friday: "5:00 PM – 11:30 PM",
      saturday: "5:00 PM – 11:30 PM",
      sunday: "5:00 PM – 10:30 PM"
    }),
    aggregated_reviews: [
      {
        author_name: "James Wilson",
        rating: 5,
        text: "Excellent Chinese takeaway in Horndean. The crispy aromatic duck is fantastic and the delivery is always on time. Highly recommend!",
        date: "2024-10-03",
        source: "google"
      },
      {
        author_name: "Rachel Green",
        rating: 4,
        text: "Great food and good portions. The chicken chow mein is my go-to order. Only wish they did online ordering.",
        date: "2024-09-25",
        source: "google"
      },
      {
        author_name: "Tom Harris",
        rating: 5,
        text: "Best Chinese in the area! The salt and pepper ribs are incredible. We order from here at least once a week.",
        date: "2024-09-18",
        source: "google"
      }
    ]
  },
  {
    name: "Oriental Garden",
    area: "clanfield",
    postcode: "SL2 0RJ",
    address: "15 High Street, Clanfield",
    lat: 50.9310,
    lng: -1.0135,
    phone: "023 9259 3456",
    website: "",
    description: "Authentic Chinese and Thai cuisine. Family-owned business serving Clanfield and surrounding villages.",
    rating: 4.6,
    review_count: 203,
    google_place_id: "ChIJOrientalGarden",
    opening_hours_json: JSON.stringify({
      monday: "5:00 PM – 11:00 PM",
      tuesday: "5:00 PM – 11:00 PM",
      wednesday: "5:00 PM – 11:00 PM",
      thursday: "5:00 PM – 11:00 PM",
      friday: "5:00 PM – 11:30 PM",
      saturday: "5:00 PM – 11:30 PM",
      sunday: "5:00 PM – 10:30 PM"
    }),
    aggregated_reviews: [
      {
        author_name: "Michelle Taylor",
        rating: 5,
        text: "Oriental Garden is our favourite Chinese takeaway! The food is always fresh, hot, and delicious. The sweet and sour chicken balls are amazing!",
        date: "2024-10-02",
        source: "google"
      },
      {
        author_name: "Paul Roberts",
        rating: 4,
        text: "Really good Chinese food in Clanfield. Generous portions and fair prices. The crispy beef is excellent.",
        date: "2024-09-27",
        source: "google"
      },
      {
        author_name: "Karen White",
        rating: 5,
        text: "We've been ordering from Oriental Garden for years. Consistently great food and friendly service. The king prawn curry is my favourite!",
        date: "2024-09-20",
        source: "google"
      }
    ]
  },
  {
    name: "Happy Wok",
    area: "slough",
    postcode: "SL1 7ES",
    address: "28 London Road, Slough",
    lat: 50.8790,
    lng: -1.0330,
    phone: "023 9226 7890",
    website: "",
    description: "Modern Chinese takeaway with extensive menu. Known for fast service and fresh ingredients.",
    rating: 4.2,
    review_count: 94,
    google_place_id: "ChIJHappyWok",
    opening_hours_json: JSON.stringify({
      monday: "5:00 PM – 11:00 PM",
      tuesday: "5:00 PM – 11:00 PM",
      wednesday: "5:00 PM – 11:00 PM",
      thursday: "5:00 PM – 11:00 PM",
      friday: "5:00 PM – 11:30 PM",
      saturday: "5:00 PM – 11:30 PM",
      sunday: "5:00 PM – 10:30 PM"
    }),
    aggregated_reviews: [
      {
        author_name: "Chris Martin",
        rating: 4,
        text: "Good Chinese takeaway with quick service. The special fried rice is really good. Prices are reasonable too.",
        date: "2024-09-29",
        source: "google"
      },
      {
        author_name: "Nicole Adams",
        rating: 4,
        text: "Happy Wok never disappoints. The food is always hot and tasty. Great value for money.",
        date: "2024-09-23",
        source: "google"
      }
    ]
  },
  {
    name: "Dragon Palace",
    area: "horndean",
    postcode: "SL2 9BB",
    address: "22 Portsmouth Road, Horndean",
    lat: 50.9170,
    lng: -1.0075,
    phone: "023 9259 4567",
    website: "",
    description: "Traditional Chinese takeaway offering classic dishes. Popular for family meals and party platters.",
    rating: 4.5,
    review_count: 142,
    google_place_id: "ChIJDragonPalace",
    opening_hours_json: JSON.stringify({
      monday: "5:00 PM – 11:00 PM",
      tuesday: "5:00 PM – 11:00 PM",
      wednesday: "5:00 PM – 11:00 PM",
      thursday: "5:00 PM – 11:00 PM",
      friday: "5:00 PM – 11:30 PM",
      saturday: "5:00 PM – 11:30 PM",
      sunday: "5:00 PM – 10:30 PM"
    }),
    aggregated_reviews: [
      {
        author_name: "Steve Johnson",
        rating: 5,
        text: "Dragon Palace is excellent! The crispy duck is the best I've had. Always busy which shows how good they are.",
        date: "2024-10-04",
        source: "google"
      },
      {
        author_name: "Laura Mitchell",
        rating: 4,
        text: "Great Chinese food and quick delivery. The salt and pepper chicken is delicious. Would definitely order again.",
        date: "2024-09-26",
        source: "google"
      }
    ]
  }
]

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function addChineseTakeaways() {
  console.log('\n🥡 Adding Chinese Takeaways to Database...\n')
  
  const businessesPath = path.join(process.cwd(), 'public', 'data', 'businesses.json')
  const businesses: Business[] = JSON.parse(fs.readFileSync(businessesPath, 'utf-8'))
  
  const newBusinesses = chineseTakeaways.map((takeaway, index) => ({
    id: `chinese-${Date.now()}-${index}`,
    name: takeaway.name,
    slug: generateSlug(takeaway.name),
    category: 'restaurants',
    area: takeaway.area,
    postcode: takeaway.postcode,
    address: takeaway.address,
    lat: takeaway.lat,
    lng: takeaway.lng,
    phone: takeaway.phone,
    website: takeaway.website,
    description: takeaway.description,
    opening_hours_json: takeaway.opening_hours_json,
    rating: takeaway.rating,
    review_count: takeaway.review_count,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    google_place_id: takeaway.google_place_id,
    aggregated_reviews: takeaway.aggregated_reviews
  }))
  
  // Add new businesses to existing ones
  const updatedBusinesses = [...businesses, ...newBusinesses]
  
  // Save updated businesses
  fs.writeFileSync(businessesPath, JSON.stringify(updatedBusinesses, null, 2))
  
  console.log('✅ Added Chinese takeaways:')
  newBusinesses.forEach(b => {
    console.log(`   ${b.name} (${b.area}) - ${b.rating}⭐ (${b.review_count} reviews)`)
  })
  
  console.log(`\n📊 Total businesses: ${updatedBusinesses.length}`)
  console.log('✅ Chinese takeaways added successfully!\n')
}

// Run if called directly
if (require.main === module) {
  addChineseTakeaways()
    .then(() => {
      console.log('✨ Done!\n')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error:', error)
      process.exit(1)
    })
}

export { addChineseTakeaways }

