import Link from 'next/link'

// High-value SEO keywords we want to rank for
const SEO_LINKS = [
  { href: '/plumbers', anchor: 'Best plumbers in Slough', category: 'plumbers' },
  { href: '/electricians', anchor: 'Best electricians in Slough', category: 'electricians' },
  { href: '/builders', anchor: 'Best builders in Slough', category: 'builders' },
  { href: '/roofers', anchor: 'Best roofers in Slough', category: 'roofers' },
  { href: '/restaurants', anchor: 'Best restaurants in Slough', category: 'restaurants' },
  { href: '/cafes', anchor: 'Best cafes in Slough', category: 'cafes' },
  { href: '/pubs', anchor: 'Best pubs in Slough', category: 'pubs' },
  { href: '/estate-agents', anchor: 'Best estate agents in Slough', category: 'estate-agents' },
  { href: '/hairdressers', anchor: 'Best hairdressers in Slough', category: 'hairdressers' },
  { href: '/dentists', anchor: 'Best dentists in Slough', category: 'dentists' },
]

interface SeoInternalLinksProps {
  currentCategory?: string
  title?: string
  maxLinks?: number
}

export default function SeoInternalLinks({ 
  currentCategory, 
  title = "Looking for other services?",
  maxLinks = 5 
}: SeoInternalLinksProps) {
  // Filter out current category and pick random selection
  const availableLinks = SEO_LINKS.filter(link => link.category !== currentCategory)
  const displayLinks = availableLinks.slice(0, maxLinks)

  if (displayLinks.length === 0) return null

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-lg border border-blue-100 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-2">
        {displayLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            <span className="mr-2">→</span>
            {link.anchor}
          </Link>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Find trusted local services in Slough, Berkshire
      </p>
    </div>
  )
}
