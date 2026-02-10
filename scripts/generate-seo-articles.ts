import fs from 'fs'
import path from 'path'

// Template configurations
const templates = [
  'Best {business_type} in {location}',
  'Where to get {service} in {location}',
  '{Business A} vs {Business B} in {location}',
  'Things to do in {location} with kids',
  'What\'s on in {location} this weekend?',
  'Sunday roasts in {location}',
  'Bonfire Night events in {location}'
]

const locations = [
  'Slough', 'Horndean', 'Langley', 'Chalvey', 
  'Cippenham', 'Clanfield', 'Lovedean', 'Wecock Farm'
]

const businessTypes = [
  'Hairdressers', 'Plumbers', 'Takeaways', 'Dentists', 
  'Nurseries', 'Dog Groomers', 'Mechanics', 'Gardeners', 
  'Electricians', 'Estate Agents', 'Barbers'
]

// Service mappings for "Where to get" articles
const serviceMappings = {
  'Hairdressers': 'haircuts and styling',
  'Plumbers': 'plumbing services',
  'Takeaways': 'takeaway food',
  'Dentists': 'dental care',
  'Nurseries': 'childcare',
  'Dog Groomers': 'dog grooming',
  'Mechanics': 'car repairs',
  'Gardeners': 'gardening services',
  'Electricians': 'electrical work',
  'Estate Agents': 'property services',
  'Barbers': 'men\'s haircuts'
}

// Sample businesses for each type (you can expand this with real data)
const sampleBusinesses = {
  'Hairdressers': ['Hair Studio', 'Cut & Style', 'Beauty Bar'],
  'Plumbers': ['Quick Fix Plumbing', 'Reliable Plumbers', 'Emergency Plumbing'],
  'Takeaways': ['Golden Dragon', 'Pizza Palace', 'Curry House'],
  'Dentists': ['Smile Dental', 'Family Dental Care', 'Modern Dentistry'],
  'Nurseries': ['Little Learners', 'Happy Kids Nursery', 'Sunshine Daycare'],
  'Dog Groomers': ['Paws & Claws', 'Doggy Style', 'Grooming Studio'],
  'Mechanics': ['Auto Care Centre', 'Reliable Motors', 'Quick Fix Garage'],
  'Gardeners': ['Green Thumb', 'Garden Solutions', 'Landscape Design'],
  'Electricians': ['Spark Electrical', 'Reliable Electric', 'Power Solutions'],
  'Estate Agents': ['Property Partners', 'Home Finders', 'Estate Solutions'],
  'Barbers': ['Gentleman\'s Cut', 'Classic Barbers', 'Style Studio']
}

// Sample reviews for authenticity
const sampleReviews = {
  'Hairdressers': [
    'Absolutely love this place! The stylists are so talented and really listen to what you want.',
    'Great atmosphere and friendly staff. My hair has never looked better!',
    'Professional service and reasonable prices. Highly recommend!'
  ],
  'Plumbers': [
    'Quick response and fixed the issue efficiently. Very professional and clean work.',
    'Reliable service when we needed it most. Fair pricing and excellent workmanship.',
    'Called them for an emergency and they were here within an hour. Great service!'
  ],
  'Takeaways': [
    'Best takeaway in the area! Fresh ingredients and generous portions.',
    'Always hot and delicious. The family loves ordering from here.',
    'Great value for money and consistently good quality food.'
  ]
}

function generateArticle(template: string, location: string, businessType: string): string {
  const businesses = sampleBusinesses[businessType as keyof typeof sampleBusinesses] || ['Local Business', 'Community Service', 'Professional Service']
  const reviews = sampleReviews[businessType as keyof typeof sampleReviews] || [
    'Excellent service and friendly staff.',
    'Highly recommend this business.',
    'Great value and professional service.'
  ]

  let title = template
    .replace('{business_type}', businessType)
    .replace('{service}', serviceMappings[businessType as keyof typeof serviceMappings] || businessType.toLowerCase())
    .replace('{location}', location)
    .replace('{Business A}', businesses[0])
    .replace('{Business B}', businesses[1])

  let content = `# ${title}\n\n`

  // Introduction
  content += `Finding the right ${businessType.toLowerCase()} in ${location} can make all the difference to your experience. Whether you're a local resident or visiting the area, this comprehensive guide will help you discover the top-rated ${businessType.toLowerCase()} that ${location} has to offer.\n\n`

  // Top Picks section
  content += `## Top Picks in ${location}\n\n`
  businesses.forEach((business, index) => {
    content += `### ${index + 1}. ${business}\n`
    content += `Located in the heart of ${location}, ${business} has built a strong reputation for quality service and customer satisfaction. Their experienced team understands the unique needs of ${location} residents and visitors alike.\n\n`
  })

  // What Locals Say section
  content += `## What Locals Say\n\n`
  content += `The ${location} community values quality and reliability when it comes to ${businessType.toLowerCase()}. Here's what residents are saying:\n\n`
  reviews.forEach((review, index) => {
    content += `"${review}" - Local ${location} resident\n\n`
  })

  // How to Choose section
  content += `## How to Choose the Right ${businessType.slice(0, -1)}\n\n`
  content += `When selecting a ${businessType.slice(0, -1).toLowerCase()} in ${location}, consider these important factors:\n\n`
  content += `- **Experience**: Look for businesses with a proven track record in the ${location} area\n`
  content += `- **Reviews**: Check online reviews and ask for recommendations from neighbours\n`
  content += `- **Location**: Consider convenience and accessibility from your home or workplace\n`
  content += `- **Services**: Ensure they offer the specific services you need\n`
  content += `- **Pricing**: Compare quotes from multiple providers to ensure fair pricing\n\n`

  // Local area context
  content += `## About ${location}\n\n`
  content += `${location} is a vibrant community with a strong sense of local identity. The area is known for its friendly residents, excellent transport links, and thriving local business scene. Whether you're looking for ${businessType.toLowerCase()} or any other service, ${location} offers a great selection of professional providers.\n\n`

  // Call to action
  content += `## Find More ${businessType} in ${location}\n\n`
  content += `For a complete directory of ${businessType.toLowerCase()} and other local businesses in ${location} and surrounding areas, visit [Slough.co](https://slough.co). Our comprehensive directory features verified businesses with real customer reviews, contact information, and detailed service descriptions.\n\n`
  content += `Discover the best local businesses in ${location} today and support your community by choosing local providers.\n\n`

  return content
}

function generateAllArticles(): void {
  const articles: Array<{filename: string, content: string, title: string}> = []
  
  // Generate articles for each template
  templates.forEach(template => {
    if (template.includes('{business_type}')) {
      // Best {business_type} in {location}
      businessTypes.forEach(businessType => {
        locations.forEach(location => {
          const content = generateArticle(template, location, businessType)
          const filename = `best-${businessType.toLowerCase()}-in-${location.toLowerCase().replace(/\s+/g, '-')}.md`
          articles.push({ filename, content, title: template.replace('{business_type}', businessType).replace('{location}', location) })
        })
      })
    } else if (template.includes('{service}')) {
      // Where to get {service} in {location}
      businessTypes.forEach(businessType => {
        locations.forEach(location => {
          const content = generateArticle(template, location, businessType)
          const service = serviceMappings[businessType as keyof typeof serviceMappings] || businessType.toLowerCase()
          const filename = `where-to-get-${service.replace(/\s+/g, '-')}-in-${location.toLowerCase().replace(/\s+/g, '-')}.md`
          articles.push({ filename, content, title: template.replace('{service}', service).replace('{location}', location) })
        })
      })
    } else if (template.includes('vs')) {
      // Comparison articles - generate fewer of these
      const comparisonBusinesses = ['Hairdressers', 'Takeaways', 'Estate Agents']
      comparisonBusinesses.forEach(businessType => {
        locations.slice(0, 4).forEach(location => { // Only top 4 locations for comparisons
          const content = generateArticle(template, location, businessType)
          const businesses = sampleBusinesses[businessType as keyof typeof sampleBusinesses] || ['Business A', 'Business B']
          const filename = `${businesses[0].toLowerCase().replace(/\s+/g, '-')}-vs-${businesses[1].toLowerCase().replace(/\s+/g, '-')}-in-${location.toLowerCase().replace(/\s+/g, '-')}.md`
          articles.push({ filename, content, title: template.replace('{Business A}', businesses[0]).replace('{Business B}', businesses[1]).replace('{location}', location) })
        })
      })
    } else {
      // Other templates (kids activities, weekend events, etc.)
      locations.forEach(location => {
        const content = generateArticle(template, location, '')
        const filename = template.toLowerCase().replace(/\s+/g, '-').replace(/\{.*?\}/g, '').replace(/--+/g, '-').replace(/^-|-$/g, '') + `-in-${location.toLowerCase().replace(/\s+/g, '-')}.md`
        articles.push({ filename, content, title: template.replace('{location}', location) })
      })
    }
  })

  // Create articles directory
  const articlesDir = path.join(process.cwd(), 'generated-articles')
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true })
  }

  // Write articles to files
  articles.forEach(({ filename, content }) => {
    const filePath = path.join(articlesDir, filename)
    fs.writeFileSync(filePath, content)
    console.log(`Generated: ${filename}`)
  })

  console.log(`\nGenerated ${articles.length} SEO articles in ${articlesDir}`)
  
  // Create index file
  const indexContent = articles.map(({ filename, title }) => `- [${title}](${filename})`).join('\n')
  fs.writeFileSync(path.join(articlesDir, 'README.md'), `# Generated SEO Articles\n\n${indexContent}`)
}

// Run the generator
generateAllArticles()
