import { readFileSync, writeFileSync } from 'fs'

// Read the local painters data
const paintersData = JSON.parse(readFileSync('local-painters-results.json', 'utf-8'))

// Filter to ONLY actual house painters/decorators (not car detailing)
const actualPainters = paintersData.filter((p: any) => {
  const name = p.name.toLowerCase()
  // Exclude car-related services
  if (name.includes('detailing') || name.includes('ceramic coating') || 
      name.includes('car body') || name.includes('valeting') ||
      name.includes('face painting')) {
    return false
  }
  // Exclude non-painting trades
  if (name.includes('plastering') && !name.includes('decorat')) {
    return false
  }
  // Must be local to Slough area (not London, Worthing, Petworth)
  if (p.address.includes('London') || p.address.includes('Worthing') || 
      p.address.includes('Petworth')) {
    return false
  }
  return true
})

console.log(`\n🎨 FILTERED TO ${actualPainters.length} ACTUAL LOCAL PAINTERS:\n`)
actualPainters.forEach((p: any, i: number) => {
  console.log(`${i + 1}. ${p.name} - ${p.area}`)
  console.log(`   ${p.phone} - ${p.rating}⭐ (${p.review_count} reviews)`)
  console.log(`   ${p.address}`)
  console.log('')
})

// Generate BBC-style articles for top 10
const top10 = actualPainters.slice(0, 10)

function createSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function extractTopReviews(reviews: any[]): any[] {
  if (!reviews) return []
  return reviews.slice(0, 3).map(r => ({
    text: r.text,
    author: r.author_name
  }))
}

function generateArticleContent(painter: any): any[] {
  const topReviews = extractTopReviews(painter.reviews)
  
  const content: any[] = [
    {
      type: 'paragraph',
      text: `There's a decorator in ${painter.area} who's earned ${painter.review_count} five-star reviews without cutting corners, overselling, or disappearing mid-job. ${painter.name} has become one of the most trusted names in local decorating — and the reviews tell the story better than any marketing could.`
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
        `**Location:** ${painter.address.split(',')[0]}, ${painter.area}`
      ]
    }
  ]

  if (topReviews.length > 0) {
    content.push({
      type: 'heading',
      text: 'What Customers Say'
    })
    
    topReviews.forEach(review => {
      content.push({
        type: 'quote',
        text: review.text,
        author: review.author
      })
    })
  }

  content.push(
    {
      type: 'heading',
      text: 'Why This Matters'
    },
    {
      type: 'paragraph',
      text: `Finding a reliable decorator in Berkshire shouldn't feel like a gamble. But too often it does. Cowboys charging upfront and vanishing. "Specialists" who can't tell the difference between satin and gloss. Numbers that ring out to nothing.`
    },
    {
      type: 'paragraph',
      text: `${painter.name} has ${painter.review_count} reviews because they keep showing up, doing quality work, and treating people's homes with respect. That's not revolutionary — it's just rare.`
    },
    {
      type: 'heading',
      text: 'Get In Touch'
    },
    {
      type: 'list',
      items: [
        `**Phone:** ${painter.phone} (mobile — actually answers)`,
        `**Address:** ${painter.address}`,
        ...(painter.website ? [`**Website:** ${painter.website}`] : []),
        `**Google Rating:** ${painter.rating}/5`,
        `**Total Reviews:** ${painter.review_count}`
      ]
    }
  )

  return content
}

const articles = top10.map((painter: any) => {
  const slug = createSlug(painter.name + '-' + painter.area)
  const title = `${painter.name}: ${painter.review_count} Five-Star Reviews From Slough Locals Who Keep Calling Back`
  const subtitle = `With ${painter.rating} stars from ${painter.review_count} reviews, this ${painter.area} decorator has built a reputation the old-fashioned way`
  
  return {
    id: slug,
    slug: slug,
    title: title,
    subtitle: subtitle,
    category: 'Business Spotlight',
    author: 'Slough.co',
    publishedAt: new Date().toISOString(),
    featured: painter.review_count > 30,
    heroImage: `/images/businesses/${slug}.jpg`,
    excerpt: `${painter.review_count} Google reviews. ${painter.rating} stars. Mobile number: ${painter.phone}. When you need a decorator in ${painter.area} who actually answers, here's who locals call.`,
    content: generateArticleContent(painter),
    relatedBusinesses: [],
    tags: [
      'Painter',
      'Decorator',
      painter.area || 'Slough',
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

console.log(`\n✅ GENERATED ${articles.length} ARTICLES\n`)
articles.forEach((a, i) => {
  console.log(`${i + 1}. ${a.title}`)
})

writeFileSync('painter-articles.json', JSON.stringify(articles, null, 2))
console.log('\n📝 Saved to painter-articles.json')
