import { Business } from '@/lib/db'

interface BusinessSchemaProps {
  business: Business
}

export default function BusinessSchema({ business }: BusinessSchemaProps) {
  const openingHours = business.opening_hours_json 
    ? JSON.parse(business.opening_hours_json) 
    : null

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": business.name,
    "description": business.description,
    "url": `https://slough-directory.vercel.app/biz/${business.slug}`,
    "telephone": business.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": business.address,
      "addressLocality": business.area,
      "postalCode": business.postcode,
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": business.lat,
      "longitude": business.lng
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": business.rating,
      "reviewCount": business.review_count
    },
    "priceRange": "££"
  }

  if (openingHours) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const openingHoursSpecification = days
      .filter(day => openingHours[day] && openingHours[day] !== 'Closed')
      .map(day => ({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": day.charAt(0).toUpperCase() + day.slice(1),
        "opens": openingHours[day].split(' - ')[0],
        "closes": openingHours[day].split(' - ')[1]
      }))
    
    if (openingHoursSpecification.length > 0) {
      schema['openingHoursSpecification'] = openingHoursSpecification
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
