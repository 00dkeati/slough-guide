import { Metadata } from 'next'
import Link from 'next/link'
import { getCategories, getBusinesses } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Browse Categories 2026',
  description: 'Explore 70+ business categories in Slough. From restaurants and plumbers to beauty salons and pet services — find exactly what you need.',
}

export const dynamic = 'force-dynamic'

// Category groupings with emojis
const categoryGroups: Record<string, { emoji: string; title: string; categories: string[] }> = {
  'food-drink': {
    emoji: '🍽️',
    title: 'Food & Drink',
    categories: ['restaurants', 'cafes', 'pubs', 'takeaways', 'fish-chips', 'coffee-shops', 'bakeries', 'butchers', 'catering-services', 'supermarkets', 'convenience-stores']
  },
  'home-services': {
    emoji: '🔧',
    title: 'Home Services',
    categories: ['plumbers', 'electricians', 'heating-engineers', 'builders', 'roofers', 'carpenters', 'painters', 'handyman', 'locksmiths', 'domestic-cleaners', 'carpet-cleaning', 'pest-control', 'landscapers', 'garden-centers']
  },
  'health-beauty': {
    emoji: '💅',
    title: 'Health & Beauty',
    categories: ['hair-salons', 'barbers', 'beauty-salons', 'nail-technicians', 'massage-therapists', 'gyms', 'personal-trainers', 'yoga-studios', 'dentists', 'pharmacies', 'physiotherapists', 'chiropractors']
  },
  'pets': {
    emoji: '🐾',
    title: 'Pets',
    categories: ['vets', 'pet-shops', 'dog-walkers', 'dog-groomers']
  },
  'motors': {
    emoji: '🚗',
    title: 'Motors & Transport',
    categories: ['car-mechanics', 'mot-centres', 'car-wash', 'mobile-mechanics', 'tyre-shops', 'driving-instructors', 'driving-schools', 'taxi-firms']
  },
  'professional': {
    emoji: '💼',
    title: 'Professional Services',
    categories: ['solicitors', 'accountants', 'estate-agents', 'letting-agents', 'bookkeepers', 'it-services']
  },
  'creative': {
    emoji: '🎨',
    title: 'Creative & Events',
    categories: ['web-designers', 'marketing-agencies', 'printers', 'photographers', 'graphic-designers', 'wedding-planners', 'djs']
  },
  'family': {
    emoji: '👨‍👩‍👧',
    title: 'Family & Education',
    categories: ['nurseries', 'tutors', 'childminders']
  },
  'shopping': {
    emoji: '🛍️',
    title: 'Shopping',
    categories: ['florists', 'gift-shops']
  },
  'community': {
    emoji: '🏛️',
    title: 'Community',
    categories: ['community-centres', 'charities', 'removal-companies']
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  
  // Create a map for quick lookup
  const categoryMap = new Map(categories.map(c => [c.slug, c]))
  
  // Get business counts for popular categories
  const popularSlugs = ['restaurants', 'plumbers', 'hair-salons', 'electricians', 'cafes', 'barbers']
  const popularCounts = await Promise.all(
    popularSlugs.map(async slug => {
      const businesses = await getBusinesses(slug, 'slough')
      return { slug, count: businesses.length }
    })
  )
  const countMap = new Map(popularCounts.map(p => [p.slug, p.count]))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-slate-900">
            Slough<span className="text-blue-600">.co</span>
          </Link>
          <Link href="/editorial" className="text-sm text-slate-600 hover:text-slate-900">
            All Guides →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
            <span>📂</span>
            <span>BUSINESS DIRECTORY</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Browse All Categories
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl">
            {categories.length} categories covering everything from restaurants to roofers. 
            Find trusted local businesses in Slough and surrounding areas.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Categories', value: categories.length, emoji: '📂' },
            { label: 'Restaurants', value: countMap.get('restaurants') || 0, emoji: '🍽️' },
            { label: 'Plumbers', value: countMap.get('plumbers') || 0, emoji: '🔧' },
            { label: 'Salons', value: countMap.get('hair-salons') || 0, emoji: '💇' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm text-center">
              <span className="text-2xl mb-2 block">{stat.emoji}</span>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Popular Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            🔥 Most Popular
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['restaurants', 'plumbers', 'hair-salons', 'electricians', 'cafes', 'barbers'].map(slug => {
              const cat = categoryMap.get(slug)
              if (!cat) return null
              const emojis: Record<string, string> = {
                'restaurants': '🍽️',
                'plumbers': '🔧',
                'hair-salons': '💇‍♀️',
                'electricians': '⚡',
                'cafes': '☕',
                'barbers': '💈'
              }
              return (
                <Link
                  key={slug}
                  href={`/${slug}`}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-blue-50 transition-all text-center group"
                >
                  <span className="text-3xl mb-2 block">{emojis[slug]}</span>
                  <div className="font-semibold text-slate-900 group-hover:text-blue-600 text-sm">
                    {cat.name}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {countMap.get(slug) || '10+'} listings
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Category Groups */}
        {Object.entries(categoryGroups).map(([groupKey, group]) => {
          const groupCategories = group.categories
            .map(slug => categoryMap.get(slug))
            .filter(Boolean)
          
          if (groupCategories.length === 0) return null
          
          return (
            <section key={groupKey} className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span>{group.emoji}</span>
                <span>{group.title}</span>
                <span className="text-sm font-normal text-slate-400">({groupCategories.length})</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {groupCategories.map(cat => (
                  <Link
                    key={cat!.slug}
                    href={`/${cat!.slug}`}
                    className="bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all group"
                  >
                    <div className="font-medium text-slate-900 group-hover:text-blue-600 text-sm truncate">
                      {cat!.name}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}

        {/* All Categories A-Z */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            📑 All Categories A-Z
          </h2>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {categories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(cat => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="text-sm text-slate-600 hover:text-blue-600 hover:underline"
                  >
                    {cat.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Can't find what you're looking for?</h2>
          <p className="text-slate-300 mb-6">Search our directory or check out our detailed local guides</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/search"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition-colors"
            >
              🔍 Search Directory
            </Link>
            <Link 
              href="/editorial"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-medium transition-colors"
            >
              📚 View Guides
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          <Link href="/" className="font-semibold text-slate-900 hover:text-blue-600">
            Slough.co
          </Link>
          <span className="mx-2">•</span>
          Your local business directory
        </div>
      </footer>
    </div>
  )
}
