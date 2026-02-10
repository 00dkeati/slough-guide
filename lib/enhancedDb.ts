export interface EnhancedBusiness {
  // Basic Info
  id: string
  name: string
  slug: string
  category: string
  area: string
  
  // Contact
  phone: string
  email?: string
  website: string
  
  // Location
  address: string
  postcode: string
  lat: number
  lng: number
  directions?: string
  parking?: 'free' | 'paid' | 'street' | 'none'
  
  // Description
  description: string
  tagline?: string // Short catchy description
  yearEstablished?: number
  
  // Services
  services?: string[] // ["Emergency Callout", "Free Quotes", "Installation"]
  specialties?: string[] // ["Boiler Repair", "Bathroom Fitting"]
  certifications?: string[] // ["Gas Safe Registered", "NICEIC Approved"]
  
  // Pricing
  priceRange?: '£' | '££' | '£££' | '££££'
  avgJobCost?: string // "£80-150"
  freeConsultation?: boolean
  
  // Hours
  opening_hours_json: string
  emergencyService?: boolean
  appointmentOnly?: boolean
  
  // Reviews
  rating: number
  review_count: number
  featured: boolean
  
  // Additional Features
  features?: string[] // ["Wheelchair Accessible", "Free WiFi", "Card Payments"]
  payment_methods?: string[] // ["Cash", "Card", "Bank Transfer"]
  languages?: string[] // ["English", "Polish"]
  
  // Social Proof
  yearsInBusiness?: number
  jobsCompleted?: number
  responseTime?: string // "Usually responds within 2 hours"
  
  // Media
  images?: string[]
  video?: string
  
  // Dates
  created_at: string
  updated_at: string
  lastVerified?: string // When business owner last verified info
}
