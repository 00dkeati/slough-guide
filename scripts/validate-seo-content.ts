import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface ValidationResult {
  page: string
  wordCount: number
  hasH1: boolean
  hasH2: boolean
  hasMetadata: boolean
  hasImages: boolean
  keywordDensity: number
  readabilityScore: number
  issues: string[]
  passed: boolean
}

// Calculate Flesch Reading Ease score
function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const words = text.split(/\s+/).filter(w => w.length > 0).length
  const syllables = countSyllables(text)
  
  if (sentences === 0 || words === 0) return 0
  
  const avgWordsPerSentence = words / sentences
  const avgSyllablesPerWord = syllables / words
  
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
  return Math.max(0, Math.min(100, score))
}

// Count syllables in text
function countSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/)
  let totalSyllables = 0
  
  words.forEach(word => {
    word = word.replace(/[^a-z]/g, '')
    if (word.length === 0) return
    
    // Simple syllable counting
    const vowels = word.match(/[aeiouy]+/g)
    let syllables = vowels ? vowels.length : 1
    
    // Adjust for silent e
    if (word.endsWith('e')) syllables--
    if (word.endsWith('le') && word.length > 2) syllables++
    
    totalSyllables += Math.max(1, syllables)
  })
  
  return totalSyllables
}

// Calculate keyword density
function calculateKeywordDensity(text: string, keyword: string): number {
  const words = text.toLowerCase().split(/\s+/)
  const keywordWords = keyword.toLowerCase().split(/\s+/)
  const totalWords = words.length
  
  if (totalWords === 0) return 0
  
  let keywordCount = 0
  
  // Count exact keyword matches
  for (let i = 0; i <= words.length - keywordWords.length; i++) {
    const phrase = words.slice(i, i + keywordWords.length).join(' ')
    if (phrase === keyword.toLowerCase()) {
      keywordCount++
    }
  }
  
  // Also count individual keyword words
  keywordWords.forEach(kw => {
    keywordCount += words.filter(w => w === kw).length
  })
  
  return (keywordCount / totalWords) * 100
}

// Extract text content from TSX file
function extractTextContent(fileContent: string): string {
  // Remove imports and exports
  let text = fileContent.replace(/^import.*$/gm, '')
  text = text.replace(/^export.*$/gm, '')
  
  // Remove JSX tags but keep content
  text = text.replace(/<[^>]+>/g, ' ')
  
  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, '')
  
  // Remove markdown links but keep text
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  
  // Remove special characters
  text = text.replace(/[{}()[\]]/g, ' ')
  
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim()
  
  return text
}

// Validate a single page
function validatePage(filePath: string, keyword: string): ValidationResult {
  const content = fs.readFileSync(filePath, 'utf-8')
  const text = extractTextContent(content)
  const issues: string[] = []
  
  // Word count
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length
  if (wordCount < 300) {
    issues.push(`Word count too low: ${wordCount} (minimum 300)`)
  }
  
  // Check for H1
  const hasH1 = /<h1[^>]*>/.test(content) || /^#\s+/.test(content)
  if (!hasH1) {
    issues.push('Missing H1 heading')
  }
  
  // Check for H2
  const hasH2 = /<h2[^>]*>/.test(content) || /^##\s+/m.test(content)
  if (!hasH2) {
    issues.push('Missing H2 headings')
  }
  
  // Check for metadata
  const hasMetadata = /export const metadata/.test(content) || /export async function generateMetadata/.test(content)
  if (!hasMetadata) {
    issues.push('Missing metadata export')
  }
  
  // Check for images (basic check)
  const hasImages = /Image\s+src=/.test(content) || /img\s+src=/.test(content) || /api\/photo/.test(content)
  
  // Keyword density
  const keywordDensity = calculateKeywordDensity(text, keyword)
  if (keywordDensity < 0.5) {
    issues.push(`Keyword density too low: ${keywordDensity.toFixed(2)}% (minimum 0.5%)`)
  } else if (keywordDensity > 3) {
    issues.push(`Keyword density too high: ${keywordDensity.toFixed(2)}% (maximum 3%)`)
  }
  
  // Readability
  const readabilityScore = calculateReadability(text)
  if (readabilityScore < 60) {
    issues.push(`Readability score too low: ${readabilityScore.toFixed(1)} (minimum 60)`)
  }
  
  const passed = issues.length === 0 && wordCount >= 300
  
  return {
    page: path.basename(path.dirname(filePath)),
    wordCount,
    hasH1,
    hasH2,
    hasMetadata,
    hasImages,
    keywordDensity,
    readabilityScore,
    issues,
    passed
  }
}

// Main validation function
async function validateAllPages() {
  console.log('🔍 Validating SEO content...\n')
  
  // Load strategy
  const strategyPath = path.join(__dirname, '..', 'data', 'keyword-seo-strategy.json')
  if (!fs.existsSync(strategyPath)) {
    console.error('❌ Strategy file not found')
    process.exit(1)
  }
  
  const strategies = JSON.parse(fs.readFileSync(strategyPath, 'utf-8'))
  const results: ValidationResult[] = []
  
  // Validate new landing pages
  const newPages = strategies.filter((s: any) => s.needsNewPage)
  
  for (const strategy of newPages) {
    const slug = strategy.keyword.toLowerCase().replace(/\s+/g, '-')
    const pagePath = path.join(__dirname, '..', 'app', 'k', slug, 'page.tsx')
    
    if (!fs.existsSync(pagePath)) {
      console.log(`⏭️  Skipping ${slug} (not found)`)
      continue
    }
    
    const result = validatePage(pagePath, strategy.keyword)
    results.push(result)
    
    if (result.passed) {
      console.log(`✅ ${result.page} - ${result.wordCount} words, ${result.readabilityScore.toFixed(1)} readability`)
    } else {
      console.log(`❌ ${result.page} - ${result.issues.length} issues`)
      result.issues.forEach(issue => console.log(`   - ${issue}`))
    }
  }
  
  // Summary
  console.log('\n📊 Validation Summary:')
  console.log('='.repeat(50))
  console.log(`Total pages validated: ${results.length}`)
  console.log(`Passed: ${results.filter(r => r.passed).length}`)
  console.log(`Failed: ${results.filter(r => !r.passed).length}`)
  
  console.log('\n📈 Statistics:')
  const avgWordCount = results.reduce((sum, r) => sum + r.wordCount, 0) / results.length
  const avgReadability = results.reduce((sum, r) => sum + r.readabilityScore, 0) / results.length
  const avgKeywordDensity = results.reduce((sum, r) => sum + r.keywordDensity, 0) / results.length
  
  console.log(`Average word count: ${Math.round(avgWordCount)}`)
  console.log(`Average readability: ${avgReadability.toFixed(1)}`)
  console.log(`Average keyword density: ${avgKeywordDensity.toFixed(2)}%`)
  console.log(`Pages with images: ${results.filter(r => r.hasImages).length}`)
  console.log(`Pages with H1: ${results.filter(r => r.hasH1).length}`)
  console.log(`Pages with H2: ${results.filter(r => r.hasH2).length}`)
  console.log(`Pages with metadata: ${results.filter(r => r.hasMetadata).length}`)
  
  // Save results
  const outputPath = path.join(__dirname, '..', 'data', 'seo-validation-results.json')
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
  console.log(`\n✅ Results saved to: ${outputPath}`)
  
  // Exit with error if any failed
  if (results.some(r => !r.passed)) {
    console.log('\n⚠️  Some pages failed validation. Review and fix issues above.')
    process.exit(1)
  } else {
    console.log('\n✅ All pages passed validation!')
  }
}

validateAllPages().catch(console.error)

