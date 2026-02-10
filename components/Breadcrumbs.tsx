import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link href="/" className="breadcrumb-link">
        Home
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <span className="breadcrumb-separator">/</span>
          {item.href ? (
            <Link href={item.href} className="breadcrumb-link">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}

