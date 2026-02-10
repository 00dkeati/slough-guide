/**
 * Manus API Integration
 * For enriching business data across multiple sectors
 */

const MANUS_API_KEY = process.env.MANUS_API_KEY

export interface ManusBusinessData {
  business_name: string
  industry: string
  description: string
  services: string[]
  specialties: string[]
  certifications?: string[]
  awards?: string[]
  years_in_business?: number
  employee_count?: string
  service_area?: string[]
  [key: string]: any
}

/**
 * Fetch business data from Manus API
 */
export async function fetchManusBusinessData(
  businessName: string,
  industry: string
): Promise<ManusBusinessData | null> {
  if (!MANUS_API_KEY) {
    console.warn('MANUS_API_KEY not set')
    return null
  }

  try {
    // Manus API endpoint (adjust based on actual API documentation)
    const response = await fetch('https://api.manus.ai/v1/business/enrich', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MANUS_API_KEY}`
      },
      body: JSON.stringify({
        business_name: businessName,
        industry: industry,
        location: 'Slough, UK'
      })
    })

    if (!response.ok) {
      console.error(`Manus API error: ${response.status}`)
      return null
    }

    const data = await response.json()
    return data

  } catch (error) {
    console.error('Error fetching from Manus API:', error)
    return null
  }
}

/**
 * Get AI-generated business insights from Manus
 */
export async function getManusInsights(
  businessName: string,
  businessType: string,
  existingData: any
): Promise<string | null> {
  if (!MANUS_API_KEY) {
    return null
  }

  try {
    const response = await fetch('https://api.manus.ai/v1/insights/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MANUS_API_KEY}`
      },
      body: JSON.stringify({
        business_name: businessName,
        business_type: businessType,
        context: existingData,
        format: 'directory_listing'
      })
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.insights || data.content || null

  } catch (error) {
    console.error('Error getting Manus insights:', error)
    return null
  }
}

/**
 * Enrich business data for specific sectors
 */
export async function enrichSectorData(
  sector: 'restaurants' | 'healthcare' | 'automotive' | 'beauty' | 'tradesmen',
  businesses: any[]
): Promise<any[]> {
  if (!MANUS_API_KEY) {
    console.warn('MANUS_API_KEY not set - skipping enrichment')
    return businesses
  }

  console.log(`\n🔧 Enriching ${sector} businesses with Manus API...\n`)

  const enriched = []

  for (let i = 0; i < businesses.length; i++) {
    const business = businesses[i]
    console.log(`[${i + 1}/${businesses.length}] ${business.name}`)

    try {
      const manusData = await fetchManusBusinessData(business.name, sector)
      
      if (manusData) {
        // Merge Manus data with existing business data
        enriched.push({
          ...business,
          manus_data: manusData,
          services: manusData.services || business.services,
          specialties: manusData.specialties || [],
          certifications: manusData.certifications || [],
          years_in_business: manusData.years_in_business
        })
        
        console.log(`  ✅ Enriched with ${Object.keys(manusData).length} fields`)
      } else {
        enriched.push(business)
        console.log(`  ℹ️  No Manus data available`)
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      console.error(`  ❌ Error: ${error}`)
      enriched.push(business)
    }
  }

  return enriched
}

/**
 * Get sector-specific insights
 */
export async function getSectorInsights(
  sector: string,
  businesses: any[]
): Promise<{
  market_overview: string
  top_trends: string[]
  customer_preferences: string[]
  competitive_landscape: string
} | null> {
  if (!MANUS_API_KEY) {
    return null
  }

  try {
    const response = await fetch('https://api.manus.ai/v1/sector/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MANUS_API_KEY}`
      },
      body: JSON.stringify({
        sector,
        location: 'Slough, Berkshire, UK',
        businesses: businesses.slice(0, 20).map(b => ({
          name: b.name,
          rating: b.rating,
          review_count: b.review_count
        }))
      })
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data

  } catch (error) {
    console.error('Error getting sector insights:', error)
    return null
  }
}

export default {
  fetchManusBusinessData,
  getManusInsights,
  enrichSectorData,
  getSectorInsights
}

