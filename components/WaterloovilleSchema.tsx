export default function SloughSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Slough.co",
    "url": "https://slough.co",
    "description": "Your complete guide to Slough, Berkshire. Local news, business directory, shops, restaurants, services, and community information.",
    "publisher": {
      "@type": "Organization",
      "name": "Slough.co",
      "url": "https://slough.co",
      "logo": {
        "@type": "ImageObject",
        "url": "https://slough.co/logo.png"
      },
      "sameAs": []
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://slough.co/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Slough Business Directory",
    "description": "Comprehensive business directory for Slough, Berkshire",
    "url": "https://slough.co",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Slough",
      "addressRegion": "Berkshire",
      "postalCode": "SL1",
      "addressCountry": "GB"
    },
    "areaServed": {
      "@type": "City",
      "name": "Slough",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Slough",
        "addressRegion": "Berkshire",
        "postalCode": "SL1"
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://slough.co"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}




