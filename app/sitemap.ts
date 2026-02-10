import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

interface EditorialArticle {
  slug: string
  publishedAt?: string
}

interface Business {
  slug: string
  category: string
}

// Get all editorial article slugs from JSON
function getEditorialSlugs(): { slug: string; date: Date }[] {
  const articlesPath = path.join(process.cwd(), 'data/editorial-articles.json')
  try {
    const articles: EditorialArticle[] = JSON.parse(fs.readFileSync(articlesPath, 'utf8'))
    return articles.map(a => ({
      slug: a.slug,
      date: a.publishedAt ? new Date(a.publishedAt) : new Date()
    }))
  } catch {
    return []
  }
}

// Get all business slugs
function getBusinessSlugs(): string[] {
  const businessPath = path.join(process.cwd(), 'public/data/businesses.json')
  try {
    const businesses: Business[] = JSON.parse(fs.readFileSync(businessPath, 'utf8'))
    return businesses.map(b => b.slug)
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://slough.co'
  const now = new Date()
  
  // Core pages
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/categories`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/part-time-jobs-slough`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/estate-agents`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/slough-sainsburys`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/slough-asda`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/slough-argos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/slough-wickes`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/slough-recycling-centre`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/slough-football-club`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/areas`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/editorial`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/news`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/get-featured`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/advertise`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  // High-value SEO landing pages
  const seoPages: MetadataRoute.Sitemap = [
    'loft-conversions-hampshire',
    'loft-conversions-portsmouth', 
    'loft-conversion-slough',
    'plumber-slough',
    'electrician-slough',
    'gas-engineer-slough',
    'hairdresser-slough',
    'dentist-slough',
    'restaurants-slough',
    'pubs-in-slough',
    'takeaways-slough',
    'fish-and-chips-slough',
    'taxi-slough',
    'driving-instructor-slough',
    'locksmith-slough',
    'handyman-slough',
    'painter-decorator-slough',
    'beauty-salon-slough',
    'boiler-service-slough',
    'cafes-slough',
    'things-to-do-in-slough',
    'slough-shops',
    'slough-market',
    'slough-news',
    'houses-for-sale-slough',
    'rental-properties-slough',
    'slough-estate-agents',
    'schools-in-slough',
    'nurseries-in-slough',
    'dog-walker-slough',
    'dog-walks-near-slough',
  ].map(slug => ({
    url: `${baseUrl}/seo/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = [
    'plumbers', 'electricians', 'roofers', 'builders', 'carpenters',
    'restaurants', 'cafes', 'pubs', 'takeaways',
    'hairdressers', 'barbers', 'beauty-salons',
    'estate-agents', 'solicitors', 'accountants',
    'gyms', 'dentists', 'vets',
  ].map(cat => ({
    url: `${baseUrl}/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Area pages
  const areaPages: MetadataRoute.Sitemap = [
    'slough', 'cowplain', 'horndean', 'denmead', 'purbrook',
    'clanfield', 'lovedean', 'havant', 'leigh-park',
  ].map(area => ({
    url: `${baseUrl}/area/${area}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }))

  // All editorial articles (the big SEO value)
  const editorialArticles = getEditorialSlugs()
  const editorialPages: MetadataRoute.Sitemap = editorialArticles.map(article => ({
    url: `${baseUrl}/editorial/${article.slug}`,
    lastModified: article.date,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // All business pages
  const businessSlugs = getBusinessSlugs()
  const businessPages: MetadataRoute.Sitemap = businessSlugs.map(slug => ({
    url: `${baseUrl}/biz/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // Combine all
  return [
    ...corePages,
    ...seoPages,
    ...categoryPages,
    ...areaPages,
    ...editorialPages,
    ...businessPages,
  ]
}
