import { Business } from './db'

export interface ImageData {
  url: string
  alt: string
  businessName: string
  photoReference?: string
}

// Get photo URL from API endpoint
export function getPhotoUrl(photoReference: string, maxWidth: number = 800): string {
  return `/api/photo?ref=${encodeURIComponent(photoReference)}&maxwidth=${maxWidth}`
}

// Extract images from businesses
export function getBusinessImages(businesses: Business[], limit: number = 6): ImageData[] {
  const images: ImageData[] = []
  
  for (const business of businesses) {
    if (images.length >= limit) break
    
    // Check if business has images array
    if (business.images && business.images.length > 0) {
      for (const photoRef of business.images) {
        if (images.length >= limit) break
        
        images.push({
          url: getPhotoUrl(photoRef, 800),
          alt: `${business.name} - ${business.category} in ${business.area}`,
          businessName: business.name,
          photoReference: photoRef
        })
      }
    }
  }
  
  return images
}

// Get featured image (first available)
export function getFeaturedImage(business: Business): ImageData | null {
  if (business.images && business.images.length > 0) {
    return {
      url: getPhotoUrl(business.images[0], 1200),
      alt: `${business.name} - ${business.category} in ${business.area}`,
      businessName: business.name,
      photoReference: business.images[0]
    }
  }
  
  return null
}

// Get multiple images from a single business
export function getBusinessGalleryImages(business: Business, limit: number = 4): ImageData[] {
  if (!business.images || business.images.length === 0) {
    return []
  }
  
  return business.images.slice(0, limit).map(photoRef => ({
    url: getPhotoUrl(photoRef, 800),
    alt: `${business.name} - ${business.category} in ${business.area}`,
    businessName: business.name,
    photoReference: photoRef
  }))
}

// Generate image gallery HTML/JSX structure
export function generateImageGalleryData(images: ImageData[]): {
  images: ImageData[]
  hasImages: boolean
  imageCount: number
} {
  return {
    images,
    hasImages: images.length > 0,
    imageCount: images.length
  }
}

// Get fallback image data when no photos available
export function getFallbackImage(category: string, area: string): ImageData {
  return {
    url: '/images/placeholder-business.jpg',
    alt: `${category} in ${area}`,
    businessName: 'Local Business'
  }
}

// Validate image URL
export function isValidImageUrl(url: string): boolean {
  return url.startsWith('/api/photo?ref=') || url.startsWith('/images/') || url.startsWith('http')
}

// Generate srcset for responsive images
export function generateSrcSet(photoReference: string): string {
  const widths = [400, 600, 800, 1200]
  return widths
    .map(width => `${getPhotoUrl(photoReference, width)} ${width}w`)
    .join(', ')
}

// Get optimized image dimensions
export function getOptimizedDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number = 800
): { width: number; height: number } {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight }
  }
  
  const ratio = maxWidth / originalWidth
  return {
    width: maxWidth,
    height: Math.round(originalHeight * ratio)
  }
}

// Create image alt text with SEO keywords
export function createSEOAltText(
  businessName: string,
  category: string,
  area: string,
  index?: number
): string {
  const parts = [businessName]
  
  if (category) {
    parts.push(category)
  }
  
  if (area) {
    parts.push(`in ${area}`)
  }
  
  if (index !== undefined && index > 0) {
    parts.push(`- Image ${index + 1}`)
  }
  
  return parts.join(' ')
}

// Extract photo references from business data
export function extractPhotoReferences(business: Business): string[] {
  if (business.images && Array.isArray(business.images)) {
    return business.images
  }
  
  return []
}

// Group images by business for gallery display
export function groupImagesByBusiness(businesses: Business[], imagesPerBusiness: number = 2): Map<string, ImageData[]> {
  const grouped = new Map<string, ImageData[]>()
  
  for (const business of businesses) {
    const images = getBusinessGalleryImages(business, imagesPerBusiness)
    if (images.length > 0) {
      grouped.set(business.id, images)
    }
  }
  
  return grouped
}

// Calculate total images available
export function countAvailableImages(businesses: Business[]): number {
  return businesses.reduce((total, business) => {
    return total + (business.images?.length || 0)
  }, 0)
}

// Select diverse images from multiple businesses
export function selectDiverseImages(businesses: Business[], targetCount: number = 6): ImageData[] {
  const images: ImageData[] = []
  const businessesWithImages = businesses.filter(b => b.images && b.images.length > 0)
  
  if (businessesWithImages.length === 0) {
    return images
  }
  
  // Round-robin selection to get diverse images
  let currentIndex = 0
  let imageIndex = 0
  
  while (images.length < targetCount && imageIndex < 10) { // Max 10 iterations to prevent infinite loop
    for (let i = 0; i < businessesWithImages.length && images.length < targetCount; i++) {
      const business = businessesWithImages[i]
      if (business.images && business.images[imageIndex]) {
        images.push({
          url: getPhotoUrl(business.images[imageIndex], 800),
          alt: createSEOAltText(business.name, business.category, business.area, imageIndex),
          businessName: business.name,
          photoReference: business.images[imageIndex]
        })
      }
    }
    imageIndex++
  }
  
  return images
}

