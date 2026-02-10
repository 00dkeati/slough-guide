#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'

interface Business {
  id: string
  name: string
  category: string
  area: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Area {
  id: string
  name: string
  slug: string
}

// Load data
const businessesPath = path.join(process.cwd(), 'public/data/businesses.json')
const categoriesPath = path.join(process.cwd(), 'public/data/categories.json')
const areasPath = path.join(process.cwd(), 'public/data/areas.json')

const businesses: Business[] = JSON.parse(fs.readFileSync(businessesPath, 'utf8'))
const categories: Category[] = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'))
const areas: Area[] = JSON.parse(fs.readFileSync(areasPath, 'utf8'))

// Create lookup maps
const categoryMap = new Map(categories.map(c => [c.slug, c.name]))
const areaMap = new Map(areas.map(a => [a.slug, a.name]))

function shortenTitle(business: Business): string {
  const categoryName = categoryMap.get(business.category) || business.category
  const areaName = areaMap.get(business.area) || business.area
  
  // Remove common suffixes
  let shortName = business.name
    .replace(/\s+-\s+.*$/g, '') // Remove everything after " - "
    .replace(/\s+\|\s+.*$/g, '') // Remove everything after " | "
    .replace(/\s+Ltd\.?$/gi, '') // Remove "Ltd" or "Ltd."
    .replace(/\s+Limited$/gi, '') // Remove "Limited"
  .replace(/\s+& Co\.?$/gi, '') // Remove "& Co" or "& Co."
  .replace(/\s+and Co\.?$/gi, '') // Remove "and Co" or "and Co."
  
  // Create shortened title
  let title = `${shortName} - ${categoryName} ${areaName}`
  
  // If still too long, shorten the business name
  if (title.length > 60) {
    const maxNameLength = 60 - ` - ${categoryName} ${areaName}`.length - 5 // 5 chars buffer
    if (maxNameLength > 0) {
      shortName = shortName.substring(0, maxNameLength).trim()
      title = `${shortName} - ${categoryName} ${areaName}`
    }
  }
  
  // Final check - if still too long, use just business name and area
  if (title.length > 60) {
    title = `${shortName} ${areaName}`
    if (title.length > 60) {
      title = shortName.substring(0, 60).trim()
    }
  }
  
  return title
}

function generateShortTitles() {
  console.log('🔍 Analyzing business titles...')
  
  const results = businesses.map(business => {
    const originalTitle = `${business.name} - ${categoryMap.get(business.category) || business.category} in ${areaMap.get(business.area) || business.area} | Slough Directory`
    const shortTitle = shortenTitle(business)
    
    return {
      slug: business.slug,
      name: business.name,
      originalTitle,
      shortTitle,
      originalLength: originalTitle.length,
      shortLength: shortTitle.length,
      saved: originalTitle.length - shortTitle.length
    }
  })
  
  // Sort by savings (most saved first)
  results.sort((a, b) => b.saved - a.saved)
  
  console.log('\n📊 Title Length Analysis:')
  console.log(`Total businesses: ${results.length}`)
  console.log(`Average original length: ${Math.round(results.reduce((sum, r) => sum + r.originalLength, 0) / results.length)} characters`)
  console.log(`Average short length: ${Math.round(results.reduce((sum, r) => sum + r.shortLength, 0) / results.length)} characters`)
  console.log(`Average saved: ${Math.round(results.reduce((sum, r) => sum + r.saved, 0) / results.length)} characters`)
  
  const over65 = results.filter(r => r.originalLength > 65).length
  const over60 = results.filter(r => r.originalLength > 60).length
  const shortOver60 = results.filter(r => r.shortLength > 60).length
  
  console.log(`\n📈 Length Statistics:`)
  console.log(`Over 65 characters (original): ${over65} (${Math.round(over65/results.length*100)}%)`)
  console.log(`Over 60 characters (original): ${over60} (${Math.round(over60/results.length*100)}%)`)
  console.log(`Over 60 characters (shortened): ${shortOver60} (${Math.round(shortOver60/results.length*100)}%)`)
  
  console.log('\n🏆 Top 10 Most Improved Titles:')
  results.slice(0, 10).forEach((result, index) => {
    console.log(`${index + 1}. ${result.name}`)
    console.log(`   Original: ${result.originalLength} chars - "${result.originalTitle}"`)
    console.log(`   Short:    ${result.shortLength} chars - "${result.shortTitle}"`)
    console.log(`   Saved:    ${result.saved} characters`)
    console.log('')
  })
  
  console.log('\n⚠️  Titles Still Over 60 Characters:')
  const stillLong = results.filter(r => r.shortLength > 60)
  if (stillLong.length > 0) {
    stillLong.forEach(result => {
      console.log(`- ${result.name}: ${result.shortLength} chars - "${result.shortTitle}"`)
    })
  } else {
    console.log('✅ All titles are now under 60 characters!')
  }
  
  // Save results to file
  const outputPath = path.join(process.cwd(), 'scripts/output/title-shortening-results.json')
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
  
  console.log(`\n💾 Results saved to: ${outputPath}`)
  
  return results
}

// Generate recommendations for updating the business page metadata
function generateMetadataUpdateScript(results: any[]) {
  console.log('\n🔧 Generating metadata update recommendations...')
  
  const script = `// Auto-generated script to update business page metadata
// Run this to update all business page titles

import { Business } from '@/lib/db'

const titleMap = new Map([
${results.map(r => `  ['${r.slug}', '${r.shortTitle}']`).join(',\n')}
])

export function getShortTitle(business: Business): string {
  return titleMap.get(business.slug) || \`\${business.name} - \${business.category} \${business.area}\`
}

// Usage in app/biz/[slug]/page.tsx:
// const title = getShortTitle(business)
// return {
//   title: \`\${title} | Slough Directory\`,
//   description: business.description || \`\${business.name} is a professional \${business.category} service in \${business.area}. Contact us for quality service and expert advice.\`,
//   openGraph: {
//     title,
//     description,
//     type: 'website',
//   },
// }`
  
  const scriptPath = path.join(process.cwd(), 'scripts/output/update-business-metadata.ts')
  fs.writeFileSync(scriptPath, script)
  
  console.log(`📝 Metadata update script saved to: ${scriptPath}`)
}

// Main execution
if (require.main === module) {
  try {
    const results = generateShortTitles()
    generateMetadataUpdateScript(results)
    
    console.log('\n✅ Title shortening analysis complete!')
    console.log('\nNext steps:')
    console.log('1. Review the results in scripts/output/title-shortening-results.json')
    console.log('2. Update app/biz/[slug]/page.tsx to use the shortened titles')
    console.log('3. Test the changes and deploy')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

export { generateShortTitles, shortenTitle }


