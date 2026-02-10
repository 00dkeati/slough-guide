import Link from 'next/link'
import { Category, Area, Business } from '@/lib/db'
import SeoInternalLinks from './SeoInternalLinks'

interface RelatedLinksProps {
  currentCategory?: string
  currentArea?: string
  categories?: Category[]
  areas?: Area[]
  featuredBusinesses?: Business[]
}

export default function RelatedLinks({ 
  currentCategory, 
  currentArea, 
  categories = [], 
  areas = [], 
  featuredBusinesses = [] 
}: RelatedLinksProps) {
  const filteredCategories = categories.filter(cat => cat.slug !== currentCategory)
  const filteredAreas = areas.filter(area => area.slug !== currentArea)

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Links</h3>
      
      <div className="space-y-6">
        {/* Related Categories */}
        {filteredCategories.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Other Categories</h4>
            <div className="flex flex-wrap gap-2">
              {filteredCategories.slice(0, 5).map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Areas */}
        {filteredAreas.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Nearby Areas</h4>
            <div className="flex flex-wrap gap-2">
              {filteredAreas.slice(0, 5).map((area) => (
                <Link
                  key={area.id}
                  href={`/area/${area.slug}`}
                  className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                >
                  {area.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured Businesses */}
        {featuredBusinesses.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Featured Businesses</h4>
            <div className="space-y-2">
              {featuredBusinesses.slice(0, 3).map((business) => (
                <Link
                  key={business.id}
                  href={`/biz/${business.slug}`}
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {business.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* SEO Internal Links - High-value keywords */}
      <SeoInternalLinks currentCategory={currentCategory} />
    </div>
  )
}

