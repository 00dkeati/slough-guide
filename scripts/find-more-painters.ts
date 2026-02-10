import { readFileSync } from 'fs'

// Read existing results
const existing = JSON.parse(readFileSync('local-painters-results.json', 'utf-8'))

// Extract the ones we filtered as good
const goodOnes = [
  'ChIJ2c6yPr5bdEgRzRgcQ0Kc_QM', // The Decorating Lady
  'ChIJhygCKynU2Y4R0exHH3Mxszo', // Fin and Olive
  'ChIJzbqOcnaNdEgRKBfwL6b9V5U', // DWPM
  'ChIJeRmNyYBCdEgRJwqEqwQeZiU', // Bird Property Services
  'ChIJw1R3x8lGdEgRvwJuR1kM5J8', // A+ Design & Build
]

console.log('\n📋 CHECKING ALL 27 ORIGINAL RESULTS FOR MORE LOCAL PAINTERS\n')

existing.forEach((p: any, i: number) => {
  const name = p.name.toLowerCase()
  // Skip car-related
  if (name.includes('detailing') || name.includes('ceramic coating') || 
      name.includes('car body') || name.includes('valeting') ||
      name.includes('face painting')) {
    return
  }
  // Skip far locations
  if (p.address.includes('London') || p.address.includes('Worthing') || 
      p.address.includes('Petworth') || p.address.includes('Farnborough') ||
      p.address.includes('Fleet') || p.address.includes('Liphook')) {
    return
  }
  
  console.log(`${i + 1}. ${p.name}`)
  console.log(`   Location: ${p.address}`)
  console.log(`   ${p.phone} - ${p.rating}⭐ (${p.review_count} reviews)`)
  console.log(`   Area extracted: ${p.area}`)
  console.log('')
})

console.log('\n💡 ADDITIONAL PAINTERS FROM SEARCH THAT MET CRITERIA:\n')

const additionalFromSearch = [
  { name: 'Jade Lisa Interiors', area: 'Havant', phone: '07890 578575', reviews: 15 },
  { name: 'MS Decorating', area: 'Unknown', phone: '07495 491474', reviews: 13 },
  { name: 'Johnsons Decorating Leigh', area: 'Leigh Park', phone: '07736 120857', reviews: 7 },
  { name: 'Lee Baker Professional Decorating Services', area: 'Unknown', phone: '07738 117249', reviews: 6 },
  { name: 'Brewer C A, Painter and Decorator', area: 'Havant', phone: '07709 771672', reviews: 6 },
  { name: 'Charles Henry Property Services', area: 'Emsworth', phone: '07910 286256', reviews: 6 },
]

additionalFromSearch.forEach((p, i) => {
  console.log(`${i + 1}. ${p.name} - ${p.area} - ${p.phone} (${p.reviews} reviews)`)
})

console.log('\n✅ TOTAL LOCAL PAINTERS AVAILABLE: 8 + 6 additional = 14 options')
console.log('📝 Can select top 10 from these for articles')
