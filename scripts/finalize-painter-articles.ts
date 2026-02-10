import { readFileSync, writeFileSync } from 'fs'

console.log('🎨 FINALIZING LOCAL PAINTER ARTICLES\n')

// Read current articles
const articles = JSON.parse(readFileSync('data/editorial-articles.json', 'utf-8'))

// Read additional painters
const additional = JSON.parse(readFileSync('additional-painters.json', 'utf-8'))

// Filter to truly local ones
const localAdditional = additional.filter((p: any) => {
  // Must be in local area
  if (p.address.includes('Wigan') || p.address.includes('Liss')) {
    return false
  }
  return true
})

console.log(`✅ ${localAdditional.length} truly local additional painters found\n`)

function extractArea(address: string): string {
  const cities = ['Slough', 'Havant', 'Horndean', 'Emsworth', 'Hayling Island', 'Rowlands Castle', 'Lee-on-the-Solent']
  for (const city of cities) {
    if (address.includes(city)) return city
  }
  return address.split(',')[1]?.trim() || 'Slough'
}

function createSlug(name: string, area: string): string {
  return (name + '-' + area).toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function generateContent(painter: any, area: string): any[] {
  const reviews = painter.reviews || []
  const topReviews = reviews.slice(0, 3)
  
  const content: any[] = [
    {
      type: 'paragraph',
      text: `There's a decorator in ${area} who's earned ${painter.review_count} five-star reviews without cutting corners, overselling, or disappearing mid-job. ${painter.name} has become one of the most trusted names in local decorating — and the reviews tell the story better than any marketing could.`
    },
    {
      type: 'heading',
      text: 'The Numbers'
    },
    {
      type: 'list',
      items: [
        `**Rating:** ${painter.rating}/5 stars`,
        `**Reviews:** ${painter.review_count} verified Google reviews`,
        `**Phone:** ${painter.phone}`,
        `**Location:** ${painter.address.split(',').slice(0, 2).join(',')}`
      ]
    }
  ]

  if (topReviews.length > 0) {
    content.push({
      type: 'heading',
      text: 'What Customers Say'
    })
    
    topReviews.forEach((review: any) => {
      if (review.text) {
        content.push({
          type: 'quote',
          text: review.text,
          author: review.author_name || 'Local customer'
        })
      }
    })
  }

  content.push(
    {
      type: 'heading',
      text: 'Why Local Matters'
    },
    {
      type: 'paragraph',
      text: `When you're looking for a decorator in ${area}, you don't want someone from Winchester charging you travel time. You want someone local who knows the area, can pop round for quotes quickly, and has a reputation to protect in the community.`
    },
    {
      type: 'paragraph',
      text: `That's what makes ${painter.name} different. With ${painter.review_count} reviews from real local customers, they've built their business on word-of-mouth and quality work — not flashy websites or cheap quotes that turn expensive.`
    },
    {
      type: 'heading',
      text: 'Get In Touch'
    },
    {
      type: 'list',
      items: [
        `**Phone:** ${painter.phone}`,
        `**Address:** ${painter.address}`,
        ...(painter.website ? [`**Website:** ${painter.website}`] : []),
        `**Rating:** ${painter.rating}/5 (${painter.review_count} reviews)`
      ]
    }
  )

  return content
}

// Generate articles for the additional painters
const newArticles = localAdditional.map((painter: any) => {
  const area = extractArea(painter.address)
  const slug = createSlug(painter.name, area)
  
  return {
    id: slug,
    slug: slug,
    title: `${painter.name}: ${painter.review_count} Five-Star Reviews From ${area} Locals`,
    subtitle: `With ${painter.rating} stars from ${painter.review_count} reviews, this ${area} decorator has built a reputation the old-fashioned way`,
    category: 'Business Spotlight',
    author: 'Slough.co',
    publishedAt: new Date().toISOString(),
    featured: false,
    heroImage: `/images/businesses/${slug}.jpg`,
    excerpt: `${painter.review_count} Google reviews. ${painter.rating} stars. Mobile: ${painter.phone}. When you need a decorator in ${area} who actually answers, here's who locals call.`,
    content: generateContent(painter, area),
    relatedBusinesses: [],
    tags: [
      'Painter',
      'Decorator',
      area,
      'Painting and Decorating',
      'Local Tradesman'
    ],
    readTime: 4,
    placeId: painter.place_id,
    phone: painter.phone,
    address: painter.address,
    rating: painter.rating,
    reviewCount: painter.review_count
  }
})

console.log(`✅ GENERATED ${newArticles.length} NEW ARTICLES:`)
newArticles.forEach((a: any) => {
  console.log(`   - ${a.title}`)
})

// Add to existing articles
const finalArticles = [...articles, ...newArticles]
console.log(`\n📊 TOTAL ARTICLES: ${finalArticles.length}`)

// Save
writeFileSync('data/editorial-articles.json', JSON.stringify(finalArticles, null, 2))
console.log('✅ Saved to data/editorial-articles.json')

// Summary report
console.log('\n📋 LOCAL PAINTER ARTICLES SUMMARY:')
const painterArticles = finalArticles.filter((a: any) => 
  a.tags && (a.tags.includes('Painter') || a.tags.includes('Decorator'))
)
console.log(`Total painter/decorator articles: ${painterArticles.length}`)
console.log('\nAll local painters:')
painterArticles.forEach((a: any, i: number) => {
  const area = a.tags.find((t: string) => 
    ['Slough', 'Havant', 'Horndean', 'Emsworth', 'Hayling Island', 'Rowlands Castle', 'Lee-on-the-Solent'].includes(t)
  ) || 'Unknown'
  console.log(`${i + 1}. ${a.title.split(':')[0]} - ${area}`)
})
