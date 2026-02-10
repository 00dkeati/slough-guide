import fs from 'fs'
import path from 'path'

// Mobile optimization patterns
const mobileOptimizations = {
  // Responsive padding
  padding: {
    'p-8': 'p-4 sm:p-6 md:p-8',
    'p-6': 'p-3 sm:p-4 md:p-6',
    'px-6': 'px-4 sm:px-6',
    'py-5': 'py-4 sm:py-5',
    'py-4': 'py-3 sm:py-4',
    'py-3': 'py-2 sm:py-3',
  },
  
  // Responsive text sizes
  text: {
    'text-5xl': 'text-3xl sm:text-4xl md:text-5xl',
    'text-4xl': 'text-2xl sm:text-3xl md:text-4xl',
    'text-3xl': 'text-xl sm:text-2xl md:text-3xl',
    'text-2xl': 'text-lg sm:text-xl md:text-2xl',
    'text-xl': 'text-lg sm:text-xl',
    'text-lg': 'text-base sm:text-lg',
  },
  
  // Responsive gaps
  gap: {
    'gap-4': 'gap-3 sm:gap-4',
    'gap-6': 'gap-4 sm:gap-6',
    'gap-8': 'gap-4 sm:gap-6 md:gap-8',
  },
  
  // Responsive grid
  grid: {
    'grid-cols-3': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    'grid-cols-2': 'grid-cols-1 md:grid-cols-2',
    'md:grid-cols-2': 'grid-cols-1 lg:grid-cols-2',
    'md:grid-cols-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  },
  
  // Responsive flex
  flex: {
    'flex-row': 'flex-col sm:flex-row',
    'items-center': 'items-start sm:items-center',
    'justify-between': 'justify-start sm:justify-between',
  },
  
  // Responsive sizing
  sizing: {
    'w-16 h-16': 'w-12 h-12 sm:w-16 sm:h-16',
    'w-20 h-20': 'w-16 h-16 sm:w-20 sm:h-20',
    'h-56': 'h-48 sm:h-56',
  }
}

// Function to apply mobile optimizations to a file
function optimizeFileForMobile(filePath: string) {
  console.log(`📱 Optimizing ${filePath} for mobile...`)
  
  let content = fs.readFileSync(filePath, 'utf8')
  let changes = 0
  
  // Apply padding optimizations
  Object.entries(mobileOptimizations.padding).forEach(([old, newVal]) => {
    const regex = new RegExp(`\\b${old}\\b`, 'g')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, newVal)
      changes += matches.length
    }
  })
  
  // Apply text size optimizations
  Object.entries(mobileOptimizations.text).forEach(([old, newVal]) => {
    const regex = new RegExp(`\\b${old}\\b`, 'g')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, newVal)
      changes += matches.length
    }
  })
  
  // Apply gap optimizations
  Object.entries(mobileOptimizations.gap).forEach(([old, newVal]) => {
    const regex = new RegExp(`\\b${old}\\b`, 'g')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, newVal)
      changes += matches.length
    }
  })
  
  // Apply grid optimizations
  Object.entries(mobileOptimizations.grid).forEach(([old, newVal]) => {
    const regex = new RegExp(`\\b${old}\\b`, 'g')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, newVal)
      changes += matches.length
    }
  })
  
  // Apply flex optimizations
  Object.entries(mobileOptimizations.flex).forEach(([old, newVal]) => {
    const regex = new RegExp(`\\b${old}\\b`, 'g')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, newVal)
      changes += matches.length
    }
  })
  
  // Apply sizing optimizations
  Object.entries(mobileOptimizations.sizing).forEach(([old, newVal]) => {
    const regex = new RegExp(`\\b${old}\\b`, 'g')
    const matches = content.match(regex)
    if (matches) {
      content = content.replace(regex, newVal)
      changes += matches.length
    }
  })
  
  // Add mobile-specific optimizations
  if (content.includes('overflow-x-auto')) {
    // Add mobile-friendly table wrapper
    content = content.replace(
      /<div className="overflow-x-auto">/g,
      '<div className="overflow-x-auto -mx-4 sm:mx-0">'
    )
  }
  
  // Add mobile-friendly image sizing
  if (content.includes('Image') && content.includes('width=')) {
    content = content.replace(
      /sizes="[^"]*"/g,
      'sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"'
    )
  }
  
  // Write back the optimized content
  if (changes > 0) {
    fs.writeFileSync(filePath, content)
    console.log(`✅ Applied ${changes} mobile optimizations`)
  } else {
    console.log(`ℹ️  No changes needed`)
  }
}

// Function to add business images to components
function addBusinessImages(filePath: string) {
  console.log(`🖼️  Adding business images to ${filePath}...`)
  
  let content = fs.readFileSync(filePath, 'utf8')
  let changes = 0
  
  // Add Image import if not present
  if (!content.includes("import Image from 'next/image'")) {
    content = content.replace(
      /import Link from 'next\/link'/g,
      "import Link from 'next/link'\nimport Image from 'next/image'"
    )
    changes++
  }
  
  // Add business image display in cards/tables
  if (content.includes('business.name') && !content.includes('business.images')) {
    // Add image display before business name
    const imagePattern = /<div className="[^"]*">\s*<h3[^>]*>{business\.name}<\/h3>/g
    content = content.replace(imagePattern, (match) => {
      return match.replace(
        /<div className="[^"]*">\s*<h3/,
        `<div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 mb-3">
          {business.images && business.images.length > 0 ? (
            <Image
              src={business.images[0]}
              alt={\`\${business.name} business photo\`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 64px, 80px"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
              <span className="text-2xl">🏢</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3`
      )
    })
    changes++
  }
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content)
    console.log(`✅ Added business images support`)
  } else {
    console.log(`ℹ️  Business images already present`)
  }
}

// Main optimization function
async function optimizeAllPages() {
  console.log('🚀 Starting mobile optimization for all ranking pages...\n')
  
  const filesToOptimize = [
    'app/carpenters/page.tsx',
    'app/coffee-shops/page.tsx',
    'components/BusinessCard.tsx',
    'components/SundayRoastLeagueTable.tsx',
    'components/ChineseTakeawayLeagueTable.tsx'
  ]
  
  for (const file of filesToOptimize) {
    const filePath = path.join(process.cwd(), file)
    
    if (fs.existsSync(filePath)) {
      try {
        optimizeFileForMobile(filePath)
        addBusinessImages(filePath)
        console.log('')
      } catch (error) {
        console.error(`❌ Error optimizing ${file}:`, error.message)
      }
    } else {
      console.log(`⚠️  File not found: ${file}`)
    }
  }
  
  console.log('🎉 Mobile optimization complete!')
  console.log('\n📱 Key improvements applied:')
  console.log('✅ Responsive padding and margins')
  console.log('✅ Mobile-first text sizing')
  console.log('✅ Responsive grid layouts')
  console.log('✅ Mobile-friendly flex layouts')
  console.log('✅ Business image support')
  console.log('✅ Optimized image sizing')
}

// Run the optimization
optimizeAllPages().catch(console.error)
