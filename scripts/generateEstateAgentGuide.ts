import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY required')
  process.exit(1)
}

interface Business {
  [key: string]: any
  name: string
  rating: number
  review_count: number
  aggregated_reviews?: any[]
}

async function generateComprehensiveGuide() {
  console.log('📝 Generating Comprehensive Estate Agent Guide with AI\n')
  
  // Load businesses
  const businessesPath = join(process.cwd(), 'public', 'data', 'businesses.json')
  const businesses: Business[] = JSON.parse(readFileSync(businessesPath, 'utf-8'))
  
  // Filter estate agents
  const estateAgents = businesses
    .filter(b => 
      b.category === 'estate-agents' || 
      b.name.toLowerCase().includes('estate')
    )
    .sort((a, b) => b.rating - a.rating)

  console.log(`Found ${estateAgents.length} estate agents\n`)

  // Prepare data for AI analysis
  const agentData = estateAgents.map(agent => {
    const reviews = agent.aggregated_reviews || []
    const positiveReviews = reviews.filter((r: any) => r.rating >= 4).slice(0, 5)
    const negativeReviews = reviews.filter((r: any) => r.rating <= 3).slice(0, 3)
    
    return {
      name: agent.name,
      rating: agent.rating,
      review_count: agent.review_count,
      address: agent.address,
      phone: agent.phone,
      website: agent.website,
      positive_reviews: positiveReviews.map((r: any) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        source: r.source
      })),
      negative_reviews: negativeReviews.map((r: any) => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        source: r.source
      }))
    }
  })

  console.log('🤖 Sending to OpenAI for comprehensive analysis...\n')

  const prompt = `You are writing a comprehensive, in-depth guide to estate agents in Slough for a local directory website.

Here is the data for all ${estateAgents.length} estate agents with their ratings and customer reviews:

${JSON.stringify(agentData, null, 2)}

Create a professional, comprehensive guide (2000-3000 words) that includes:

1. **EXECUTIVE SUMMARY**
   - Overview of the estate agent market in Slough
   - Key statistics and trends
   - Top performers at a glance

2. **DETAILED AGENT PROFILES** (For each agent):
   - Agent name and rating
   - Strengths highlighted in reviews
   - Areas for improvement (if any negative feedback)
   - What they're best known for
   - Ideal customer type
   - Quote from best review

3. **COMPARATIVE ANALYSIS**
   - How agents compare across key metrics
   - Service quality comparison
   - Price/value considerations (from reviews)
   - Communication and responsiveness
   - Local market knowledge

4. **CUSTOMER INSIGHTS**
   - Common positive themes across all agents
   - Common complaints/concerns
   - What Slough residents value most
   - Red flags to watch for

5. **RECOMMENDATIONS BY SITUATION**
   - Best for first-time buyers
   - Best for selling quickly
   - Best for premium properties
   - Best for lettings
   - Best overall

6. **HOW TO CHOOSE THE RIGHT AGENT**
   - Questions to ask
   - Warning signs
   - What to expect from a good agent

Style: Professional yet friendly, data-driven, balanced, helpful for local residents making important property decisions.

Write the complete guide now:`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Use full GPT-4 for high-quality long-form content
        messages: [
          {
            role: 'system',
            content: 'You are an expert local business analyst and professional content writer specializing in property and estate agency. You write comprehensive, balanced, data-driven guides.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 6000
      })
    })

    const data = await response.json()
    
    if (data.error) {
      console.error('OpenAI error:', data.error.message)
      process.exit(1)
    }

    const guide = data.choices[0]?.message?.content

    if (!guide) {
      console.error('No content generated')
      process.exit(1)
    }

    // Save to file
    const guidePath = join(process.cwd(), 'public', 'estate-agents-guide.md')
    writeFileSync(guidePath, guide)

    console.log('✅ Guide generated successfully!')
    console.log(`📁 Saved to: ${guidePath}`)
    console.log(`📊 Length: ${guide.length} characters`)
    console.log(`💰 Tokens used: ${data.usage.total_tokens}`)
    console.log(`\n📖 Preview:\n`)
    console.log(guide.substring(0, 500) + '...\n')

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

generateComprehensiveGuide().catch(console.error)

