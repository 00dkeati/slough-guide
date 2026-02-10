// Sources for enriching business data:

export const dataEnrichmentSources = {
  // 1. GOOGLE PLACES API
  // https://developers.google.com/maps/documentation/places/web-service
  googlePlaces: {
    provides: [
      'Reviews and ratings',
      'Opening hours',
      'Phone number',
      'Website',
      'Photos',
      'Popular times',
      'Price level',
      'Types/categories'
    ],
    cost: 'Pay per request, first $200/month free',
    integration: 'Place Details API'
  },

  // 2. COMPANIES HOUSE API (UK)
  // https://developer-specs.company-information.service.gov.uk/
  companiesHouse: {
    provides: [
      'Company registration number',
      'Year established',
      'Company status',
      'Registered address',
      'Directors',
      'Company type'
    ],
    cost: 'Free',
    integration: 'Companies House REST API'
  },

  // 3. YELP FUSION API
  // https://www.yelp.com/developers
  yelp: {
    provides: [
      'Reviews',
      'Rating',
      'Photos',
      'Business hours',
      'Categories',
      'Price range',
      'Attributes (parking, WiFi, etc.)'
    ],
    cost: 'Free tier available',
    integration: 'Yelp Fusion API'
  },

  // 4. FACEBOOK GRAPH API
  // https://developers.facebook.com/docs/graph-api
  facebook: {
    provides: [
      'Page likes',
      'Reviews',
      'Check-ins',
      'Events',
      'Posts',
      'Photos'
    ],
    cost: 'Free',
    integration: 'Graph API - Pages endpoint'
  },

  // 5. WEB SCRAPING (Ethical)
  webScraping: {
    sources: [
      'Yell.com',
      'Thomson Local',
      'Trustpilot',
      'Checkatrade',
      'Google Maps (limited)'
    ],
    provides: [
      'Reviews',
      'Business info',
      'Services offered',
      'Certifications'
    ],
    note: 'Check robots.txt and terms of service'
  },

  // 6. CERTIFICATIONS & REGISTRATIONS
  certifications: {
    sources: [
      'Gas Safe Register API',
      'NICEIC (electricians)',
      'Checkatrade',
      'Trust Mark',
      'Which? Trusted Traders'
    ],
    provides: [
      'Certification status',
      'Registration numbers',
      'Verified credentials'
    ]
  }
}

// Example: Google Places API Integration
export async function enrichFromGooglePlaces(placeId: string) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,website,opening_hours,price_level,photos,reviews,user_ratings_total&key=${apiKey}`
  )
  
  const data = await response.json()
  
  if (data.status === 'OK') {
    return {
      rating: data.result.rating,
      reviewCount: data.result.user_ratings_total,
      phone: data.result.formatted_phone_number,
      website: data.result.website,
      openingHours: data.result.opening_hours,
      priceLevel: data.result.price_level,
      photos: data.result.photos?.map((p: any) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photo_reference}&key=${apiKey}`
      ),
      reviews: data.result.reviews
    }
  }
  
  return null
}

// Example: Companies House Integration  
export async function enrichFromCompaniesHouse(companyNumber: string) {
  const apiKey = process.env.COMPANIES_HOUSE_API_KEY
  
  const response = await fetch(
    `https://api.company-information.service.gov.uk/company/${companyNumber}`,
    {
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`
      }
    }
  )
  
  const data = await response.json()
  
  return {
    yearEstablished: new Date(data.date_of_creation).getFullYear(),
    companyStatus: data.company_status,
    companyType: data.type,
    registeredAddress: data.registered_office_address
  }
}
