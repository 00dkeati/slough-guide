import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Helper to get __dirname in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load keywords data
const keywords = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/keywords.json'), 'utf8'))

// Load business data for local references
const businesses = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/data/businesses-lightweight.json'), 'utf8'))

// Content templates for different categories
const contentTemplates = {
  general: {
    title: '{keyword} | Complete Guide to Slough',
    description: 'Everything you need to know about {keyword}. Local information, services, and community updates for Slough residents.',
    content: `
# {keyword} - Complete Guide

Welcome to our comprehensive guide about {keyword}. Whether you're a local resident or planning to visit Slough, this page provides all the essential information you need.

## About {keyword}

{keyword} is an important part of the Slough community. Located in Berkshire, England, Slough offers a perfect blend of traditional charm and modern convenience.

## Local Information

### Getting Around
Slough is well-connected with excellent transport links:
- **Bus Services**: Regular bus connections to Portsmouth, Havant, and surrounding areas
- **Road Access**: Easy access via A3(M) and local roads
- **Parking**: Multiple car parks available in the town centre

### Local Amenities
The area offers a wide range of facilities and services:
- Shopping centres and retail parks
- Healthcare facilities and medical centres
- Educational institutions and schools
- Recreational facilities and leisure centres

## Community Services

Slough provides excellent community services including:
- Public library with modern facilities
- Community centres hosting various events
- Sports clubs and recreational activities
- Local businesses serving the community

## Find More Information

For the latest updates and comprehensive local information, visit [Slough.co](https://slough.co). Our directory features verified businesses, local news, and community information to help you make the most of living in or visiting Slough.

Discover everything Slough has to offer and connect with your local community today.
    `
  },
  
  weather: {
    title: '{keyword} | Weather Forecast & Local Conditions',
    description: 'Get the latest weather information for {keyword}. Current conditions, forecasts, and weather updates for Slough area.',
    content: `
# {keyword} - Weather Information

Stay informed about the weather conditions in Slough with our comprehensive weather guide.

## Current Weather Conditions

Slough enjoys a temperate maritime climate typical of southern England. The area experiences mild winters and warm summers, making it an ideal place to live and visit.

### Seasonal Weather Patterns

**Spring (March - May)**
- Average temperature: 8-15°C
- Increasing daylight hours
- Occasional rainfall

**Summer (June - August)**
- Average temperature: 15-22°C
- Longest daylight hours
- Generally pleasant weather

**Autumn (September - November)**
- Average temperature: 8-16°C
- Beautiful autumn colours
- Increasing rainfall

**Winter (December - February)**
- Average temperature: 2-8°C
- Shortest daylight hours
- Occasional frost and snow

## Weather Services

For the most accurate and up-to-date weather information, we recommend:

- **Met Office**: Official UK weather service
- **BBC Weather**: Reliable local forecasts
- **Local Weather Apps**: Real-time conditions

## Weather Safety Tips

### Summer Safety
- Stay hydrated during hot weather
- Use sun protection
- Be aware of heat-related health issues

### Winter Safety
- Check road conditions before traveling
- Dress warmly in cold weather
- Be prepared for potential disruptions

## Local Weather Impact

Weather conditions in Slough can affect:
- **Transport**: Bus and road conditions
- **Events**: Outdoor activities and festivals
- **Business**: Local shops and services
- **Recreation**: Parks and leisure facilities

## Stay Connected

For the latest weather updates and local information, visit [Slough.co](https://slough.co). Our community platform provides weather-related news, event updates, and local business information to help you plan your day in Slough.

Stay weather-aware and make the most of every season in Slough!
    `
  },
  
  business: {
    title: '{keyword} | Business Information & Contact Details',
    description: 'Find detailed information about {keyword}. Contact details, services, reviews, and location information for this Slough business.',
    content: `
# {keyword} - Business Information

Discover everything you need to know about {keyword}, a valued business serving the Slough community.

## About {keyword}

{keyword} is an established business in Slough, providing quality services to local residents and visitors. With a commitment to customer satisfaction and community involvement, this business has become an integral part of the local area.

## Services Offered

{keyword} offers a range of services designed to meet the needs of the Slough community:

- Professional service delivery
- Local expertise and knowledge
- Customer-focused approach
- Community involvement

## Why Choose {keyword}?

### Local Knowledge
- Deep understanding of Slough area
- Established relationships with local customers
- Community-focused business practices

### Quality Service
- Professional standards maintained
- Customer satisfaction prioritised
- Reliable and trustworthy service

### Convenient Location
- Easily accessible in Slough
- Good transport links
- Local parking available

## Customer Reviews

Customers consistently praise {keyword} for:
- Professional service delivery
- Friendly and helpful staff
- Competitive pricing
- Reliable service

## Contact Information

For more information about {keyword}:
- Visit their location in Slough
- Check their website for latest updates
- Contact them directly for specific inquiries

## Supporting Local Business

Choosing {keyword} means supporting the local Slough economy. Local businesses like this one:
- Keep money in the local community
- Provide local employment opportunities
- Contribute to the area's character and identity
- Support other local businesses

## Find More Local Businesses

Discover other excellent businesses in Slough by visiting [Slough.co](https://slough.co). Our comprehensive directory features verified local businesses with reviews, contact information, and detailed service descriptions.

Support your local community by choosing Slough businesses for your needs.
    `
  },
  
  shopping: {
    title: '{keyword} | Store Information & Shopping Guide',
    description: 'Complete guide to {keyword}. Store details, opening hours, location, and shopping information for Slough.',
    content: `
# {keyword} - Shopping Information

Your complete guide to {keyword} in Slough, including store details, services, and shopping information.

## About {keyword}

{keyword} is a popular shopping destination in Slough, offering a wide range of products and services to meet the needs of local residents and visitors.

## Store Information

### Location
{keyword} is conveniently located in Slough with:
- Easy access from main roads
- Good public transport connections
- Ample parking facilities

### Opening Hours
- Monday to Friday: 9:00 AM - 6:00 PM
- Saturday: 9:00 AM - 5:30 PM
- Sunday: 10:00 AM - 4:00 PM
- *Hours may vary during holidays

## Products & Services

{keyword} offers:
- Wide product selection
- Competitive prices
- Professional customer service
- Convenient shopping experience

## Shopping Experience

### Customer Service
- Helpful and knowledgeable staff
- Efficient checkout process
- Customer satisfaction focus

### Store Layout
- Well-organised product displays
- Clear signage and navigation
- Accessible facilities

## Special Offers & Events

{keyword} regularly offers:
- Seasonal promotions
- Special discounts
- Community events
- Loyalty programs

## Accessibility

The store is committed to accessibility:
- Wheelchair accessible entrances
- Accessible parking spaces
- Assistance for customers with disabilities
- Clear signage throughout

## Online Services

Many services are also available online:
- Product information
- Store locator
- Customer service
- Special offers

## Local Shopping Benefits

Shopping at {keyword} supports:
- Local employment
- Community investment
- Local economy
- Convenient access for residents

## Find More Shopping Options

Discover other great shopping destinations in Slough at [Slough.co](https://slough.co). Our directory includes all major retailers, independent shops, and local businesses with detailed information to help you find exactly what you need.

Make Slough your shopping destination and support your local community!
    `
  },
  
  property: {
    title: '{keyword} | Property Information & Real Estate Guide',
    description: 'Complete property guide for {keyword}. Find homes, get market insights, and connect with local estate agents in Slough.',
    content: `
# {keyword} - Property Guide

Your comprehensive guide to {keyword} in Slough, including market information, property types, and local insights.

## Property Market Overview

Slough offers an attractive property market with:
- Diverse property types available
- Good transport connections
- Excellent local amenities
- Strong community spirit

## Property Types Available

### Houses
- Detached family homes
- Semi-detached properties
- Terraced houses
- Period properties

### Flats & Apartments
- Modern apartment complexes
- Converted period buildings
- Studio and one-bedroom options
- Luxury developments

### Special Properties
- Bungalows for easy living
- Character cottages
- New build developments
- Investment properties

## Local Area Benefits

### Transport Links
- Excellent road connections via A3(M)
- Regular bus services
- Easy access to Portsmouth and London
- Good cycling routes

### Amenities
- Shopping centres and retail parks
- Healthcare facilities
- Schools and educational institutions
- Recreational facilities

### Community
- Active local community
- Regular events and festivals
- Sports clubs and activities
- Strong sense of community spirit

## Property Investment

Slough offers good investment potential:
- Steady property value growth
- Strong rental demand
- Excellent location benefits
- Good infrastructure development

## Local Estate Agents

Professional estate agents in Slough can help with:
- Property valuations
- Market analysis
- Buying and selling guidance
- Local market knowledge

## Property Search Tips

When looking for property in Slough:
- Research local areas thoroughly
- Consider transport links
- Check local amenities
- Visit at different times of day

## Market Trends

Current market trends in Slough:
- Steady demand for family homes
- Growing interest in modern developments
- Strong rental market
- Good capital growth potential

## Find Your Perfect Property

Discover available properties and connect with local estate agents through [Slough.co](https://slough.co). Our property section features current listings, market insights, and verified estate agents to help you find your ideal home in Slough.

Start your property journey in Slough today!
    `
  },
  
  jobs: {
    title: '{keyword} | Job Opportunities & Employment Guide',
    description: 'Find {keyword} opportunities in Slough. Browse local jobs, career advice, and employment information for the area.',
    content: `
# {keyword} - Employment Opportunities

Discover exciting career opportunities with {keyword} in Slough and surrounding areas.

## Job Market Overview

Slough offers a diverse job market with opportunities across various sectors:
- Retail and hospitality
- Healthcare and education
- Professional services
- Manufacturing and logistics

## Available Positions

### Full-Time Opportunities
- Permanent positions with benefits
- Career development opportunities
- Competitive salary packages
- Job security and stability

### Part-Time Positions
- Flexible working hours
- Work-life balance
- Supplementary income options
- Entry-level opportunities

### Seasonal Work
- Holiday period positions
- Event-based employment
- Temporary contracts
- Experience building opportunities

## Application Process

### How to Apply
- Online application systems
- CV submission requirements
- Interview processes
- Reference checks

### Required Qualifications
- Relevant experience preferred
- Good communication skills
- Team working abilities
- Customer service focus

## Benefits of Working in Slough

### Location Advantages
- Easy commute to major cities
- Local community connections
- Reduced travel costs
- Work-life balance

### Career Development
- Training opportunities
- Skill development programs
- Career progression paths
- Professional networking

## Local Employment Support

### Job Centres
- Career advice and guidance
- CV writing support
- Interview preparation
- Job search assistance

### Training Programs
- Skills development courses
- Qualification opportunities
- Apprenticeship schemes
- Professional development

## Industry Sectors

Slough employment spans:
- **Retail**: Major retailers and independent shops
- **Healthcare**: Medical centres and care facilities
- **Education**: Schools and training providers
- **Services**: Professional and business services

## Finding Employment

### Job Search Resources
- Online job boards
- Local recruitment agencies
- Company websites
- Networking opportunities

### Application Tips
- Tailor applications to specific roles
- Highlight relevant experience
- Demonstrate local knowledge
- Show commitment to the area

## Career Development

### Skills Enhancement
- Professional qualifications
- Industry certifications
- Soft skills development
- Technology training

### Networking
- Local business events
- Professional associations
- Community groups
- Industry meetups

## Start Your Career Journey

Find your next opportunity and connect with local employers through [Slough.co](https://slough.co). Our jobs section features current vacancies, career advice, and local employment information to help you advance your career in Slough.

Take the next step in your career with opportunities in Slough!
    `
  },
  
  sports: {
    title: '{keyword} | Sports Information & Community Guide',
    description: 'Complete guide to {keyword}. Fixtures, results, membership, and community sports information for Slough.',
    content: `
# {keyword} - Sports Information

Your complete guide to {keyword}, featuring fixtures, results, membership information, and community sports activities.

## About {keyword}

{keyword} is an integral part of the Slough sports community, providing opportunities for participation, competition, and community engagement.

## Club Information

### History & Heritage
- Established community presence
- Rich sporting tradition
- Local pride and identity
- Community involvement

### Facilities
- Modern sports facilities
- Training grounds
- Clubhouse amenities
- Equipment and resources

## Sports Programs

### Youth Development
- Junior training programs
- Age-group competitions
- Skill development focus
- Fun and inclusive environment

### Adult Participation
- Competitive leagues
- Recreational opportunities
- Social sports activities
- Fitness and wellness programs

### Community Engagement
- Local school partnerships
- Community events
- Charity fundraising
- Volunteer opportunities

## Membership Benefits

### Playing Opportunities
- Regular training sessions
- Competitive fixtures
- Social activities
- Skill development

### Social Benefits
- Community connections
- Friendship opportunities
- Team building experiences
- Local networking

## Fixtures & Results

### Upcoming Fixtures
- Regular season matches
- Cup competitions
- Friendly matches
- Tournament participation

### Recent Results
- Match reports and analysis
- Player performances
- Team statistics
- League standings

## Community Impact

### Local Benefits
- Community pride and identity
- Youth development opportunities
- Health and fitness promotion
- Social cohesion

### Economic Contribution
- Local business support
- Employment opportunities
- Tourism and visitors
- Community investment

## Getting Involved

### Participation Options
- Player registration
- Volunteer opportunities
- Spectator support
- Community involvement

### Support Methods
- Membership fees
- Sponsorship opportunities
- Fundraising events
- Volunteer time

## Local Sports Scene

Slough offers a vibrant sports community:
- Multiple sports clubs
- Community facilities
- School sports programs
- Recreational opportunities

## Health & Fitness

### Physical Benefits
- Regular exercise opportunities
- Skill development
- Team work and cooperation
- Stress relief and enjoyment

### Mental Health
- Social connections
- Achievement and goals
- Community belonging
- Positive lifestyle habits

## Stay Connected

Keep up with the latest news, fixtures, and community updates through [Slough.co](https://slough.co). Our sports section features local team news, fixture information, and community sports activities to help you stay connected with Slough's sporting community.

Join the Slough sports community and be part of something special!
    `
  },
  
  services: {
    title: '{keyword} | Service Information & Community Guide',
    description: 'Complete guide to {keyword}. Service details, contact information, and local service information for Slough.',
    content: `
# {keyword} - Service Information

Your comprehensive guide to {keyword} in Slough, including service details, contact information, and community resources.

## About {keyword}

{keyword} provides essential services to the Slough community, ensuring residents have access to important facilities and support.

## Service Details

### What We Offer
- Essential community services
- Professional service delivery
- Local expertise and knowledge
- Community-focused approach

### Service Standards
- High quality service delivery
- Customer satisfaction focus
- Efficient and reliable service
- Community benefit prioritised

## Access Information

### Location
- Convenient Slough location
- Easy access for all residents
- Good transport connections
- Accessible facilities

### Opening Hours
- Regular service hours
- Emergency contact availability
- Holiday arrangements
- Service updates and changes

## Community Benefits

### Local Impact
- Essential service provision
- Community support and assistance
- Local employment opportunities
- Community investment

### Accessibility
- Services for all community members
- Inclusive service delivery
- Support for vulnerable residents
- Community outreach programs

## Service Quality

### Standards
- Professional service delivery
- Regular service reviews
- Continuous improvement focus
- Community feedback integration

### Reliability
- Consistent service provision
- Emergency service availability
- Service continuity planning
- Quality assurance measures

## Community Support

### Local Partnerships
- Collaboration with other services
- Community organisation support
- Local business partnerships
- Educational institution links

### Volunteer Opportunities
- Community involvement options
- Volunteer support programs
- Community engagement activities
- Local participation opportunities

## Service Updates

### Regular Information
- Service changes and updates
- New service introductions
- Community announcements
- Important notices

### Communication
- Clear information provision
- Community consultation
- Feedback mechanisms
- Service improvement communication

## Getting Help

### Contact Information
- Direct service contact
- Emergency contact details
- Online service access
- Community support channels

### Support Available
- Service guidance and advice
- Community assistance
- Information and signposting
- Problem resolution support

## Community Resources

Discover more local services and community resources through [Slough.co](https://slough.co). Our services directory provides comprehensive information about local facilities, community support, and essential services to help you access everything you need in Slough.

Access the services you need and stay connected with your Slough community!
    `
  }
}

// Function to generate page content
function generatePageContent(keyword: any) {
  const template = contentTemplates[keyword.category] || contentTemplates.general
  
  let content = template.content
  let title = template.title
  let description = template.description
  
  // Replace placeholders
  content = content.replace(/{keyword}/g, keyword.keyword)
  title = title.replace(/{keyword}/g, keyword.keyword)
  description = description.replace(/{keyword}/g, keyword.keyword)
  
  // Add local business references
  const localBusinesses = businesses.filter((b: any) => 
    b.area === 'slough' || b.area === 'cowplain' || b.area === 'denmead'
  ).slice(0, 3)
  
  if (localBusinesses.length > 0) {
    const businessSection = `

## Local Businesses in Slough

Slough is home to many excellent local businesses:

${localBusinesses.map((business: any) => 
  `- **${business.name}** - ${business.category} (${business.rating}/5 stars, ${business.review_count} reviews)`
).join('\n')}

For a complete directory of local businesses, visit [Slough.co](https://slough.co).
    `
    content += businessSection
  }
  
  return {
    title,
    description,
    content,
    keyword: keyword.keyword,
    category: keyword.category,
    priority: keyword.priority
  }
}

// Function to create Next.js page file
function createNextPage(pageData: any) {
  const slug = pageData.keyword.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
  
  const pageContent = `import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '${pageData.title}',
  description: '${pageData.description}',
  keywords: '${pageData.keyword}, slough, hampshire, local information, community',
  openGraph: {
    title: '${pageData.title}',
    description: '${pageData.description}',
    url: 'https://slough.co/k/${slug}',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ${slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, '')}Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="prose prose-lg max-w-none">
        ${pageData.content.split('\n').map(line => 
          line.trim() ? line : ''
        ).join('\n')}
      </div>
      
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">More Slough Information</h2>
        <p className="text-gray-700 mb-4">
          Discover more about Slough and connect with your local community.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/categories" 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Business Directory
          </Link>
          <Link 
            href="/areas" 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Local Areas
          </Link>
        </div>
      </div>
    </div>
  )
}
`
  
  return {
    slug,
    content: pageContent,
    path: `app/k/${slug}/page.tsx`
  }
}

// Main generation function
async function generateProgrammaticPages() {
  console.log('🚀 Starting programmatic SEO page generation...\n')
  
  const outputDir = path.join(__dirname, '../app/k')
  
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  let generated = 0
  let errors = 0
  
  // Process high priority keywords first
  const highPriorityKeywords = keywords.filter((k: any) => k.priority === 'high')
  const otherKeywords = keywords.filter((k: any) => k.priority !== 'high')
  
  const allKeywords = [...highPriorityKeywords, ...otherKeywords]
  
  for (const keyword of allKeywords) {
    try {
      console.log(`📄 Generating page for: ${keyword.keyword}`)
      
      const pageData = generatePageContent(keyword)
      const pageFile = createNextPage(pageData)
      
      const filePath = path.join(__dirname, '..', pageFile.path)
      const dirPath = path.dirname(filePath)
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      
      // Write the page file
      fs.writeFileSync(filePath, pageFile.content)
      
      generated++
      
      if (generated % 10 === 0) {
        console.log(`✅ Generated ${generated} pages...`)
      }
      
    } catch (error) {
      console.error(`❌ Error generating page for ${keyword.keyword}:`, error.message)
      errors++
    }
  }
  
  console.log(`\n🎉 Programmatic SEO generation complete!`)
  console.log(`✅ Successfully generated: ${generated} pages`)
  console.log(`❌ Errors: ${errors} pages`)
  console.log(`📁 Pages saved to: app/k/`)
  
  // Create sitemap entries
  console.log('\n📋 Creating sitemap entries...')
  const sitemapEntries = allKeywords.map((keyword: any) => {
    const slug = keyword.keyword.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    return `  {
    url: \`\${baseUrl}/k/\${slug}\`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: ${keyword.priority === 'high' ? '0.9' : keyword.priority === 'medium' ? '0.7' : '0.5'},
  },`
  }).join('\n')
  
  console.log('\n📝 Add these entries to your sitemap.ts:')
  console.log(sitemapEntries)
}

// Run the generation
generateProgrammaticPages().catch(console.error)
