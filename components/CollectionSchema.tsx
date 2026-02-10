interface CollectionSchemaProps {
  name: string
  description: string
  url: string
  numberOfItems: number
}

export default function CollectionSchema({ name, description, url, numberOfItems }: CollectionSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": `https://slough-directory.vercel.app${url}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": numberOfItems
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
