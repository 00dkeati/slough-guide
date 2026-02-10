import { Business, GoogleReview } from './db'

export interface KeywordMetadata {
  keyword: string
  category?: string
  area?: string
  intent: 'informational' | 'transactional' | 'navigational'
  searchVolume: number
  relatedKeywords: string[]
}

export interface SEOPageContent {
  introduction: string
  mainContent: string
  localContext: string
  callToAction: string
  faqs: FAQ[]
  totalWordCount: number
}

export interface FAQ {
  question: string
  answer: string
}

// Generate introduction section (80-100 words)
export function generateIntroduction(keyword: string, metadata: KeywordMetadata, businesses: Business[]): string {
  const area = metadata.area || 'Slough'
  const areaName = area.charAt(0).toUpperCase() + area.slice(1)
  const businessCount = businesses.length
  
  const intros = [
    `Looking for ${keyword}? ${areaName} offers excellent options with ${businessCount > 0 ? `${businessCount} trusted local businesses` : 'quality local services'} ready to help. Whether you're a long-time resident or new to the area, finding the right ${keyword.replace('slough', '').trim()} is essential for your needs. Our comprehensive guide connects you with verified, highly-rated professionals who understand the local community and deliver exceptional service.`,
    
    `Discover the best ${keyword} in ${areaName}. With ${businessCount > 0 ? `${businessCount} established businesses` : 'trusted local providers'} serving the community, you'll find quality options that match your requirements. From experienced professionals to friendly local services, ${areaName} provides everything you need. Our directory features verified businesses with genuine customer reviews to help you make informed decisions.`,
    
    `Welcome to your complete guide for ${keyword}. ${areaName} is home to ${businessCount > 0 ? `${businessCount} quality businesses` : 'excellent local services'} offering professional solutions for residents and visitors alike. Whether you need immediate assistance or are planning ahead, our directory connects you with trusted local providers who deliver reliable service and value for money.`
  ]
  
  return intros[Math.floor(Math.random() * intros.length)]
}

// Generate main content section (150-250 words)
export function generateMainContent(keyword: string, metadata: KeywordMetadata, businesses: Business[]): string {
  const area = metadata.area || 'Slough'
  const areaName = area.charAt(0).toUpperCase() + area.slice(1)
  const category = metadata.category || keyword.replace('slough', '').trim()
  
  let content = ''
  
  // Add "Why Choose" section
  content += `## Why Choose ${category.charAt(0).toUpperCase() + category.slice(1)} in ${areaName}\n\n`
  content += `${areaName} offers several advantages when searching for ${keyword}:\n\n`
  content += `- **Local Expertise**: Businesses understand the specific needs of ${areaName} residents\n`
  content += `- **Convenient Access**: Easy to reach locations with good transport links and parking\n`
  content += `- **Community Trust**: Established businesses with strong local reputations\n`
  content += `- **Competitive Pricing**: Fair rates reflecting local market conditions\n`
  content += `- **Personal Service**: Friendly, approachable professionals who care about customer satisfaction\n\n`
  
  // Add business-specific content if available
  if (businesses.length > 0) {
    const avgRating = businesses.reduce((sum, b) => sum + (b.rating || 0), 0) / businesses.length
    const totalReviews = businesses.reduce((sum, b) => sum + (b.review_count || 0), 0)
    
    content += `## Local ${category.charAt(0).toUpperCase() + category.slice(1)} Options\n\n`
    content += `Our directory features ${businesses.length} verified businesses with an average rating of ${avgRating.toFixed(1)} stars across ${totalReviews} customer reviews. `
    content += `Each business has been carefully selected based on service quality, customer satisfaction, and local reputation. `
    content += `You can browse detailed profiles including contact information, opening hours, customer reviews, and service descriptions to find the perfect match for your needs.\n\n`
  }
  
  // Add "What to Look For" section
  content += `## What to Look For\n\n`
  content += `When choosing ${keyword.replace('slough', '').trim()}, consider these important factors:\n\n`
  
  if (metadata.intent === 'transactional') {
    content += `- **Pricing and Value**: Compare quotes and understand what's included\n`
    content += `- **Availability**: Check opening hours and booking availability\n`
    content += `- **Experience**: Look for established businesses with proven track records\n`
    content += `- **Reviews**: Read customer feedback to gauge service quality\n`
    content += `- **Location**: Choose convenient locations that save you time\n`
  } else {
    content += `- **Reputation**: Check customer reviews and ratings\n`
    content += `- **Qualifications**: Ensure proper certifications and training\n`
    content += `- **Experience**: Look for established local businesses\n`
    content += `- **Customer Service**: Friendly, responsive, and professional\n`
    content += `- **Value**: Competitive pricing with transparent costs\n`
  }
  
  return content
}

// Generate local context section (70-100 words)
export function generateLocalContext(keyword: string, area: string = 'slough'): string {
  const areaName = area.charAt(0).toUpperCase() + area.slice(1)
  
  const contexts = [
    `${areaName} is a thriving town in Berkshire with excellent amenities and strong community spirit. Located close to Portsmouth and with easy access to the A3(M), it's well-connected while maintaining its local character. The town offers great shopping facilities, good schools, and plenty of green spaces, making it an ideal place to live and work. Local businesses benefit from a loyal customer base and supportive community.`,
    
    `Situated in Berkshire, ${areaName} combines convenient location with quality of life. The town centre provides excellent shopping and dining options, while surrounding areas offer peaceful residential neighborhoods. With strong transport links to Portsmouth, Havant, and beyond, ${areaName} attracts both residents and businesses. The local economy thrives on community support, with many established businesses serving generations of families.`,
    
    `${areaName} is a vibrant Berkshire town known for its friendly community and excellent facilities. The area boasts good schools, healthcare services, and recreational amenities. Well-connected by road and public transport, it's easily accessible from Portsmouth, Havant, and surrounding areas. Local businesses form the backbone of the community, providing essential services and employment opportunities while maintaining the town's welcoming atmosphere.`
  ]
  
  return contexts[Math.floor(Math.random() * contexts.length)]
}

// Generate call-to-action section (30-50 words)
export function generateCallToAction(keyword: string, metadata: KeywordMetadata): string {
  const ctas = [
    `Ready to find the perfect ${keyword.replace('slough', '').trim()}? Browse our verified directory to compare options, read reviews, and connect with trusted local businesses. Start your search today and experience quality service in your community.`,
    
    `Don't settle for less when searching for ${keyword.replace('slough', '').trim()}. Our comprehensive directory makes it easy to find, compare, and contact reliable local businesses. Explore detailed profiles, genuine reviews, and make informed decisions with confidence.`,
    
    `Find your ideal ${keyword.replace('slough', '').trim()} today. Our directory connects you with verified local businesses offering professional service and competitive prices. Browse profiles, check reviews, and get in touch directly to discuss your requirements.`
  ]
  
  return ctas[Math.floor(Math.random() * ctas.length)]
}

// Generate FAQs (3-5 questions)
export function generateFAQs(keyword: string, metadata: KeywordMetadata, businesses: Business[]): FAQ[] {
  const area = metadata.area || 'Slough'
  const areaName = area.charAt(0).toUpperCase() + area.slice(1)
  const category = metadata.category || keyword.replace('slough', '').trim()
  const businessCount = businesses.length
  
  const faqs: FAQ[] = [
    {
      question: `How many ${category} are there in ${areaName}?`,
      answer: businessCount > 0 
        ? `Our directory currently lists ${businessCount} verified ${category} in ${areaName} and surrounding areas. Each business has been checked for quality and reliability, with customer reviews and detailed information to help you choose.`
        : `${areaName} has several ${category} serving the local community. Our directory features verified businesses with customer reviews and detailed profiles to help you find the right option for your needs.`
    },
    {
      question: `What should I look for when choosing ${keyword.replace('slough', '').trim()}?`,
      answer: `Consider factors like customer reviews, experience, location, pricing, and service quality. Check for proper qualifications and certifications where applicable. Read recent customer feedback to understand service standards, and don't hesitate to contact businesses directly to discuss your specific requirements.`
    },
    {
      question: `Are the ${category} in ${areaName} reliable?`,
      answer: `Yes, businesses in our directory are verified local establishments with genuine customer reviews. ${areaName} has many established businesses with strong reputations built over years of serving the community. Always check reviews and ratings to make informed decisions.`
    }
  ]
  
  // Add intent-specific FAQs
  if (metadata.intent === 'transactional') {
    faqs.push({
      question: `How do I book or contact ${keyword.replace('slough', '').trim()}?`,
      answer: `Most businesses offer multiple contact methods including phone, email, and online booking. Check individual business profiles for specific contact details, opening hours, and booking procedures. Many offer same-day or next-day appointments depending on availability.`
    })
  } else {
    faqs.push({
      question: `What areas do ${category} in ${areaName} serve?`,
      answer: `Most ${category} in ${areaName} serve the town and surrounding areas including Chalvey, Langley, Cippenham, Horndean, and Leigh Park. Some businesses cover wider areas across Berkshire and Portsmouth. Check individual business profiles for specific service areas.`
    })
  }
  
  // Add business-specific FAQ if we have data
  if (businesses.length > 0 && businesses[0].rating) {
    const avgRating = businesses.reduce((sum, b) => sum + (b.rating || 0), 0) / businesses.length
    faqs.push({
      question: `What's the average rating for ${category} in ${areaName}?`,
      answer: `Based on customer reviews, ${category} in ${areaName} maintain an average rating of ${avgRating.toFixed(1)} out of 5 stars. This reflects the high quality of service and customer satisfaction in the local area. Individual ratings vary, so check specific business profiles for detailed reviews.`
    })
  }
  
  return faqs.slice(0, 5) // Return max 5 FAQs
}

// Generate complete SEO page content
export function generateSEOContent(
  keyword: string,
  businesses: Business[],
  metadata: KeywordMetadata
): SEOPageContent {
  const introduction = generateIntroduction(keyword, metadata, businesses)
  const mainContent = generateMainContent(keyword, metadata, businesses)
  const localContext = generateLocalContext(keyword, metadata.area)
  const callToAction = generateCallToAction(keyword, metadata)
  const faqs = generateFAQs(keyword, metadata, businesses)
  
  // Calculate total word count
  const allText = introduction + mainContent + localContext + callToAction + 
                  faqs.map(f => f.question + f.answer).join(' ')
  const totalWordCount = allText.split(/\s+/).length
  
  return {
    introduction,
    mainContent,
    localContext,
    callToAction,
    faqs,
    totalWordCount
  }
}

// Generate related keywords for internal linking
export function generateRelatedKeywords(keyword: string, allKeywords: string[]): string[] {
  const lowerKeyword = keyword.toLowerCase()
  const words = lowerKeyword.split(/\s+/)
  
  return allKeywords
    .filter(k => {
      const lowerK = k.toLowerCase()
      return lowerK !== lowerKeyword && words.some(word => word.length > 3 && lowerK.includes(word))
    })
    .slice(0, 6)
}

// Generate optimized title (under 60 characters)
export function generateOptimizedTitle(keyword: string, area: string = 'Slough'): string {
  const areaName = area.charAt(0).toUpperCase() + area.slice(1)
  const keywordPart = keyword.replace(/slough/gi, '').trim()
  
  // Try different formats to stay under 60 chars
  const formats = [
    `${keywordPart} ${areaName} | Local Directory`,
    `${keywordPart} in ${areaName} | Guide`,
    `Best ${keywordPart} ${areaName}`,
    `${keywordPart} ${areaName} Directory`
  ]
  
  for (const format of formats) {
    if (format.length <= 60) {
      return format
    }
  }
  
  // Fallback: truncate if needed
  return keyword.substring(0, 57) + '...'
}

// Generate meta description (under 160 characters)
export function generateMetaDescription(keyword: string, businessCount: number, area: string = 'Slough'): string {
  const areaName = area.charAt(0).toUpperCase() + area.slice(1)
  
  const descriptions = [
    `Find ${keyword} in ${areaName}. ${businessCount > 0 ? `${businessCount} verified businesses` : 'Trusted local services'} with reviews, contact details & more. Your complete local guide.`,
    `Discover quality ${keyword} in ${areaName}. ${businessCount > 0 ? `Browse ${businessCount} local businesses` : 'Compare local options'}, read reviews & find the perfect match for your needs.`,
    `Your guide to ${keyword} in ${areaName}. ${businessCount > 0 ? `${businessCount} trusted businesses` : 'Quality local services'} with customer reviews and detailed information.`
  ]
  
  const desc = descriptions[Math.floor(Math.random() * descriptions.length)]
  return desc.length <= 160 ? desc : desc.substring(0, 157) + '...'
}

