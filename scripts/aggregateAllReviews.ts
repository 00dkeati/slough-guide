import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { aggregateAllReviews, calculateReviewStats, AggregatedReview } from '../lib/reviewAggregator'

// API Keys from environment
const API_KEYS = {
  google: process.env.GOOGLE_PLACES_API_KEY,
  facebook: process.env.FACEBOOK_ACCESS_TOKEN,
  trustpilot: process.env.TRUSTPILOT_API_KEY,
  tripadvisor: process.env.TRIPADVISOR_API_KEY,
}

interface Business {
  [key: string]: any
  id: string
  name: string
  google_place_id?: string
  facebook_page_id?: string
  trustpilot_id?: string
  tripadvisor_id?: string
  aggregated_reviews?: AggregatedReview[]
  review_stats?: any
}

async function aggregateReviewsForAllBusinesses() {
  console.log('🔍 Multi-Source Review Aggregation System')
  console.log('==========================================\n')
  
  // Check which APIs are configured
  console.log('📡 Checking API Configuration:')
  console.log(`  Google Places: ${API_KEYS.google ? '✅ Configured' : '❌ Not configured'}`)
  console.log(`  Facebook: ${API_KEYS.facebook ? '✅ Configured' : '❌ Not configured'}`)
  console.log(`  Trustpilot: ${API_KEYS.trustpilot ? '✅ Configured' : '❌ Not configured'}`)
  console.log(`  TripAdvisor: ${API_KEYS.tripadvisor ? '✅ Configured' : '❌ Not configured'}`)
  console.log('')
  
  if (!API_KEYS.google) {
    console.error('⚠️  Warning: No APIs configured. Set environment variables:')
    console.error('   - GOOGLE_PLACES_API_KEY')
    console.error('   - FACEBOOK_ACCESS_TOKEN')
    console.error('   - TRUSTPILOT_API_KEY')
    console.error('   - TRIPADVISOR_API_KEY')
    console.error('\nProceeding with available APIs only...\n')
  }
  
  // Load businesses
  console.log('📂 Loading businesses...')
  const businessesPath = join(process.cwd(), 'public', 'data', 'businesses.json')
  const businesses: Business[] = JSON.parse(readFileSync(businessesPath, 'utf-8'))
  
  console.log(`   Found ${businesses.length} businesses\n`)
  
  // Filter businesses that have at least one review source ID
  const businessesWithSources = businesses.filter(b => 
    b.google_place_id || b.facebook_page_id || b.trustpilot_id || b.tripadvisor_id
  )
  
  console.log(`   ${businessesWithSources.length} businesses have review source IDs\n`)
  
  console.log('🚀 Starting review aggregation...\n')
  
  let totalReviews = 0
  let successCount = 0
  let errorCount = 0
  const sourceStats = new Map<string, number>()
  
  for (let i = 0; i < businessesWithSources.length; i++) {
    const business = businessesWithSources[i]
    const progress = `[${i + 1}/${businessesWithSources.length}]`
    
    console.log(`${progress} ${business.name}`)
    
    try {
      // Aggregate reviews from all sources
      const reviews = await aggregateAllReviews(
        {
          google_place_id: business.google_place_id,
          facebook_page_id: business.facebook_page_id,
          trustpilot_id: business.trustpilot_id,
          tripadvisor_id: business.tripadvisor_id
        },
        API_KEYS
      )
      
      if (reviews.length > 0) {
        // Calculate statistics
        const stats = calculateReviewStats(reviews)
        
        // Update business in main array
        const businessIndex = businesses.findIndex(b => b.id === business.id)
        if (businessIndex !== -1) {
          businesses[businessIndex].aggregated_reviews = reviews
          businesses[businessIndex].review_stats = stats
          
          // Update overall rating with aggregated data
          businesses[businessIndex].rating = stats.average_rating
          businesses[businessIndex].review_count = stats.total_reviews
        }
        
        console.log(`   ✅ ${reviews.length} reviews from ${stats.sources.length} sources`)
        
        // Show breakdown by source
        stats.sources.forEach(source => {
          console.log(`      ${source.source}: ${source.count} reviews (avg: ${source.avg_rating.toFixed(1)}⭐)`)
          sourceStats.set(source.source, (sourceStats.get(source.source) || 0) + source.count)
        })
        
        totalReviews += reviews.length
        successCount++
      } else {
        console.log(`   ℹ️  No reviews found`)
      }
      
      // Rate limiting - be respectful to APIs
      await new Promise(resolve => setTimeout(resolve, 300))
      
    } catch (error) {
      console.error(`   ❌ Error: ${error}`)
      errorCount++
    }
    
    console.log('') // Blank line between businesses
  }
  
  // Save updated data
  console.log('💾 Saving aggregated reviews...')
  writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))
  
  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 AGGREGATION SUMMARY')
  console.log('='.repeat(50))
  console.log(`Total businesses processed: ${businessesWithSources.length}`)
  console.log(`Successfully enriched: ${successCount}`)
  console.log(`Errors: ${errorCount}`)
  console.log(`Total reviews collected: ${totalReviews}`)
  console.log('')
  console.log('Reviews by source:')
  sourceStats.forEach((count, source) => {
    console.log(`  ${source}: ${count} reviews`)
  })
  console.log('')
  console.log('✅ Review aggregation complete!')
  console.log('   Data saved to: public/data/businesses.json')
}

// Run if called directly
if (require.main === module) {
  aggregateReviewsForAllBusinesses().catch(console.error)
}

export { aggregateReviewsForAllBusinesses }

