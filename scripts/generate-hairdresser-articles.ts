import * as fs from 'fs'

// Select top 10 businesses with best reviews and photos
const selectedBusinesses = [
  "ChIJWx9Ol8dGdEgRNYR5fggdRao", // Summers and Co Hair Boutique (5.0, 225 reviews)
  "ChIJUWKnOBFEdEgRIYWzmZ3Cv4g", // Studio H (5.0, 550 reviews)
  "ChIJ_xecBgBFdEgRfVAWEuuLslU", // TOP G Barbers (5.0, 56 reviews)
  "ChIJQ4bRI7pDdEgR7bEHdu2Jp6c", // The Bros Barber (5.0, 12 reviews)
  "ChIJ_xixRGFDdEgRxGbJFYc2V94", // JC Barbering (4.8, 40 reviews)
  "ChIJ3Z3bNQ1DdEgRZXPmYl2ssPE", // Mo's Barber (4.8, 19 reviews)
  "ChIJZ22GajNDdEgRmXBNtBRpnRI", // Mr H Barber (4.6, 31 reviews)
  "ChIJyw3_-tBDdEgR-INkj9oqDUw", // Jakes gentleman's salon (4.6, 36 reviews)
  "ChIJ38xZHpZFdEgR9Mt89uzsdC8", // Aiden barber (4.3, 27 reviews)
  "ChIJ8xUqy55DdEgRAs86sAnpy88", // Bovers Barbershop (5.0, 7 reviews)
]

const allData = JSON.parse(fs.readFileSync('hairdressers-with-mobile.json', 'utf-8'))

// Helper to create slug
function createSlug(name: string): string {
  return name.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Helper to extract location
function extractLocation(address: string): string {
  const parts = address.split(',')
  if (parts.length >= 2) {
    return parts[parts.length - 3]?.trim() || parts[0].trim()
  }
  return parts[0].trim()
}

// Generate article for each business
const articles: any[] = []

for (const placeId of selectedBusinesses) {
  const business = allData.find((b: any) => b.place_id === placeId)
  
  if (!business) {
    console.log(`⚠️  Could not find business with place_id: ${placeId}`)
    continue
  }
  
  const slug = createSlug(business.name)
  const location = extractLocation(business.address)
  const isBarber = business.name.toLowerCase().includes('barber')
  const type = isBarber ? 'barber' : 'hairdresser'
  const Type = isBarber ? 'Barber' : 'Hairdresser'
  
  // Pick best reviews (5-star only, with substantial text)
  const goodReviews = business.reviews
    .filter((r: any) => r.rating === 5 && r.text.length > 100)
    .slice(0, 3)
  
  // Create title
  const title = `${business.rating}★ on Google. ${business.review_count} Reviews. ${business.name} Is ${location}'s ${Type} with a Growing Fanbase.`
  
  const subtitle = goodReviews.length > 0 
    ? `"${goodReviews[0].text.substring(0, 120)}..." — Real customer review.`
    : `Rated ${business.rating} stars with ${business.review_count} Google reviews.`
  
  // Build content
  const content: any[] = []
  
  // Opening
  content.push({
    type: "paragraph",
    text: `Finding a ${type} you trust takes time. You want someone who listens, delivers consistently, and doesn't leave you fixing things at home.`
  })
  
  content.push({
    type: "paragraph",
    text: `${business.name} in ${location} has built a reputation for exactly that.`
  })
  
  // The Numbers
  content.push({
    type: "heading",
    text: "The Numbers"
  })
  
  content.push({
    type: "list",
    items: [
      `**${business.rating}★** average rating on Google`,
      `**${business.review_count} reviews** — all public, all real`,
      `📞 **${business.phone}** — book direct`
    ]
  })
  
  if (business.website) {
    content[content.length - 1].items.push(`🌐 [Visit website](${business.website})`)
  }
  
  // Add first image
  if (business.photos && business.photos.length > 0) {
    content.push({
      type: "image",
      src: business.photos[0],
      alt: business.name,
      caption: `Inside ${business.name}`
    })
  }
  
  // What Customers Say
  if (goodReviews.length > 0) {
    content.push({
      type: "heading",
      text: "What Customers Say"
    })
    
    goodReviews.forEach((review: any) => {
      content.push({
        type: "paragraph",
        text: `**${review.author_name}** left a 5-star review:`
      })
      
      content.push({
        type: "paragraph",
        text: `> "${review.text}"`
      })
    })
  }
  
  // Add second image
  if (business.photos && business.photos.length > 1) {
    content.push({
      type: "image",
      src: business.photos[1],
      alt: `${business.name} - customer photos`,
      caption: "Customer photos from Google"
    })
  }
  
  // Why It Works
  content.push({
    type: "heading",
    text: "Why It Works"
  })
  
  content.push({
    type: "paragraph",
    text: `${business.name} isn't trying to be the flashiest ${type} in town. They focus on what matters:`
  })
  
  content.push({
    type: "list",
    items: [
      "Consistent quality — reviews mention the same names coming back",
      `Listening to what you want — not just doing what's trendy`,
      `Fair pricing for ${location}`,
      "Friendly atmosphere without the awkward small talk pressure"
    ]
  })
  
  // Add third image if available
  if (business.photos && business.photos.length > 2) {
    content.push({
      type: "image",
      src: business.photos[2],
      alt: `${business.name} - interior`,
      caption: `The space at ${business.name}`
    })
  }
  
  // The Details
  content.push({
    type: "heading",
    text: "The Details"
  })
  
  content.push({
    type: "list",
    items: [
      `**Name:** ${business.name}`,
      `**Location:** ${location}`,
      `**Address:** ${business.address.split(',')[0]}`,
      `**Mobile:** ${business.phone}`,
      `**Rating:** ${business.rating}★ (${business.review_count} reviews)`
    ]
  })
  
  if (business.website) {
    content[content.length - 1].items.push(`**Website:** ${business.website}`)
  }
  
  // Closing
  content.push({
    type: "heading",
    text: "Should You Try It?"
  })
  
  content.push({
    type: "paragraph",
    text: `If you're in ${location} or nearby and looking for a reliable ${type}, ${business.name} is worth calling. With ${business.review_count} reviews averaging ${business.rating} stars, they're clearly doing something right.`
  })
  
  content.push({
    type: "paragraph",
    text: `Call **${business.phone}** to book.`
  })
  
  // Create article object
  const article = {
    id: slug,
    slug: slug,
    title: title,
    subtitle: subtitle,
    category: "Business Spotlight",
    author: "Slough.co",
    publishedAt: new Date().toISOString(),
    featured: false,
    heroImage: business.photos[0] || "/images/placeholder.jpg",
    excerpt: `${business.name} in ${location} has ${business.review_count} Google reviews averaging ${business.rating} stars. Customers praise the quality, consistency, and friendly service.`,
    content: content
  }
  
  articles.push(article)
  
  console.log(`✅ Created article: ${business.name}`)
}

// Load existing editorial articles
const existingArticles = JSON.parse(
  fs.readFileSync('data/editorial-articles.json', 'utf-8')
)

// Append new articles
const updatedArticles = [...existingArticles, ...articles]

// Save
fs.writeFileSync(
  'data/editorial-articles.json',
  JSON.stringify(updatedArticles, null, 2)
)

console.log(`\n✅ Added ${articles.length} hairdresser/barber articles to editorial-articles.json`)
console.log('\n📋 ARTICLES CREATED:')
articles.forEach(a => {
  const biz = allData.find((b: any) => createSlug(b.name) === a.slug)
  console.log(`\n${a.title}`)
  console.log(`   📞 ${biz.phone}`)
  console.log(`   🔗 https://www.slough.co/editorial/${a.slug}`)
})
