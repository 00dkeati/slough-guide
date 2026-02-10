import Image from 'next/image'
import Link from 'next/link'

interface CategoryImageCardProps {
  name: string
  slug: string
  description: string
  businessCount: number
  icon?: string
}

export default function CategoryImageCard({ 
  name, 
  slug, 
  description, 
  businessCount,
  icon = '🏪'
}: CategoryImageCardProps) {
  const imageUrl = `https://source.unsplash.com/400x300/?${encodeURIComponent(slug)}`
  
  return (
    <Link href={`/${slug}`}>
      <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 left-4 text-4xl">{icon}</div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{businessCount} businesses</span>
            <span className="text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
              View all →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
