export interface InternalLink {
  text: string
  url: string
  relevance: number
}

export interface RelatedPage {
  title: string
  url: string
  description: string
  type: 'category' | 'area' | 'business' | 'landing'
}

// Generate related links based on keyword
export function generateRelatedLinks(
  keyword: string,
  category?: string,
  area?: string,
  relatedKeywords: string[] = []
): InternalLink[] {
  const links: InternalLink[] = []
  
  // Add category link if available
  if (category) {
    links.push({
      text: `All ${category} in Slough`,
      url: `/${category}`,
      relevance: 0.9
    })
  }
  
  // Add area link if available and not Slough
  if (area && area.toLowerCase() !== 'slough') {
    links.push({
      text: `Businesses in ${area.charAt(0).toUpperCase() + area.slice(1)}`,
      url: `/area/${area}`,
      relevance: 0.8
    })
  }
  
  // Add category + area link if both available
  if (category && area) {
    links.push({
      text: `${category.charAt(0).toUpperCase() + category.slice(1)} in ${area.charAt(0).toUpperCase() + area.slice(1)}`,
      url: `/${category}/${area}`,
      relevance: 1.0
    })
  }
  
  // Add related keyword links
  relatedKeywords.slice(0, 4).forEach(relatedKeyword => {
    const slug = relatedKeyword.toLowerCase().replace(/\s+/g, '-')
    links.push({
      text: relatedKeyword,
      url: `/k/${slug}`,
      relevance: 0.7
    })
  })
  
  // Add general directory links
  links.push({
    text: 'Browse All Categories',
    url: '/categories',
    relevance: 0.5
  })
  
  links.push({
    text: 'Explore Local Areas',
    url: '/areas',
    relevance: 0.5
  })
  
  // Sort by relevance and return top 6
  return links.sort((a, b) => b.relevance - a.relevance).slice(0, 6)
}

// Generate breadcrumb links
export function generateBreadcrumbs(
  currentPage: string,
  category?: string,
  area?: string
): Array<{ label: string; url: string }> {
  const breadcrumbs = [
    { label: 'Home', url: '/' }
  ]
  
  if (category) {
    breadcrumbs.push({
      label: category.charAt(0).toUpperCase() + category.slice(1),
      url: `/${category}`
    })
  }
  
  if (area && area.toLowerCase() !== 'slough') {
    breadcrumbs.push({
      label: area.charAt(0).toUpperCase() + area.slice(1),
      url: `/area/${area}`
    })
  }
  
  breadcrumbs.push({
    label: currentPage,
    url: '' // Current page, no link
  })
  
  return breadcrumbs
}

// Generate topic cluster links
export function generateTopicCluster(
  mainTopic: string,
  relatedTopics: string[]
): RelatedPage[] {
  return relatedTopics.map(topic => {
    const slug = topic.toLowerCase().replace(/\s+/g, '-')
    return {
      title: topic,
      url: `/k/${slug}`,
      description: `Learn more about ${topic}`,
      type: 'landing'
    }
  })
}

// Generate contextual links within content
export function generateContextualLinks(
  content: string,
  availableLinks: Map<string, string>
): string {
  let linkedContent = content
  
  // Sort by length (longest first) to avoid partial matches
  const sortedKeys = Array.from(availableLinks.keys()).sort((a, b) => b.length - a.length)
  
  for (const keyword of sortedKeys) {
    const url = availableLinks.get(keyword)
    if (!url) continue
    
    // Only link first occurrence
    const regex = new RegExp(`\\b${keyword}\\b`, 'i')
    linkedContent = linkedContent.replace(regex, (match) => {
      return `[${match}](${url})`
    })
  }
  
  return linkedContent
}

// Generate "Related Searches" section
export function generateRelatedSearches(
  keyword: string,
  relatedKeywords: string[]
): Array<{ text: string; url: string }> {
  return relatedKeywords.slice(0, 8).map(related => {
    const slug = related.toLowerCase().replace(/\s+/g, '-')
    return {
      text: related,
      url: `/k/${slug}`
    }
  })
}

// Generate "Popular in Area" links
export function generatePopularInArea(
  area: string,
  popularCategories: string[]
): InternalLink[] {
  return popularCategories.map(category => ({
    text: `${category.charAt(0).toUpperCase() + category.slice(1)} in ${area.charAt(0).toUpperCase() + area.slice(1)}`,
    url: `/${category}/${area}`,
    relevance: 0.8
  }))
}

// Generate "Similar Services" links
export function generateSimilarServices(
  category: string,
  similarCategories: string[]
): InternalLink[] {
  return similarCategories.map(similar => ({
    text: similar.charAt(0).toUpperCase() + similar.slice(1),
    url: `/${similar}`,
    relevance: 0.7
  }))
}

// Build link map for a keyword strategy
export function buildLinkMap(keywords: Array<{ keyword: string; targetPage: string }>): Map<string, string> {
  const linkMap = new Map<string, string>()
  
  keywords.forEach(({ keyword, targetPage }) => {
    linkMap.set(keyword.toLowerCase(), targetPage)
  })
  
  return linkMap
}

// Calculate link relevance score
export function calculateLinkRelevance(
  sourceKeyword: string,
  targetKeyword: string
): number {
  const sourceWords = sourceKeyword.toLowerCase().split(/\s+/)
  const targetWords = targetKeyword.toLowerCase().split(/\s+/)
  
  let matchCount = 0
  sourceWords.forEach(word => {
    if (word.length > 3 && targetWords.includes(word)) {
      matchCount++
    }
  })
  
  return matchCount / Math.max(sourceWords.length, targetWords.length)
}

// Find best internal links for a page
export function findBestInternalLinks(
  currentKeyword: string,
  allKeywords: Array<{ keyword: string; targetPage: string }>,
  maxLinks: number = 5
): InternalLink[] {
  const links: InternalLink[] = []
  
  allKeywords.forEach(({ keyword, targetPage }) => {
    if (keyword.toLowerCase() === currentKeyword.toLowerCase()) {
      return // Skip self
    }
    
    const relevance = calculateLinkRelevance(currentKeyword, keyword)
    if (relevance > 0.3) {
      links.push({
        text: keyword,
        url: targetPage,
        relevance
      })
    }
  })
  
  return links.sort((a, b) => b.relevance - a.relevance).slice(0, maxLinks)
}

// Generate footer links for SEO pages
export function generateFooterLinks(): InternalLink[] {
  return [
    { text: 'Home', url: '/', relevance: 1.0 },
    { text: 'Business Directory', url: '/categories', relevance: 1.0 },
    { text: 'Local Areas', url: '/areas', relevance: 1.0 },
    { text: 'About Slough', url: '/about', relevance: 0.8 },
    { text: 'Contact Us', url: '/contact', relevance: 0.7 }
  ]
}

// Generate anchor text variations
export function generateAnchorTextVariations(keyword: string): string[] {
  const variations = [
    keyword,
    `best ${keyword}`,
    `find ${keyword}`,
    `${keyword} near me`,
    `local ${keyword}`,
    `${keyword} directory`
  ]
  
  return variations.slice(0, 3) // Return top 3 variations
}

