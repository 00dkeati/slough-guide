/**
 * Google Places Photos API utilities
 * Handles photo reference retrieval and URL validation
 */

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY

/**
 * Get the primary photo reference from a Google Place ID
 */
export async function getPlacePrimaryPhotoRef(placeId: string): Promise<string | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('[googlePhotos] GOOGLE_PLACES_API_KEY not found')
    return null
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${GOOGLE_PLACES_API_KEY}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Slough-Directory/1.0'
      }
    })
    
    if (!response.ok) {
      console.warn(`[googlePhotos] Place Details API error: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    
    if (data.status === 'OK' && data.result?.photos?.length > 0) {
      return data.result.photos[0].photo_reference
    }
    
    return null
  } catch (error) {
    console.error(`[googlePhotos] Error fetching photo reference for ${placeId}:`, error)
    return null
  }
}

/**
 * Generate a photo URL from a photo reference
 */
export function getPlacePhotoUrl(photoReference: string, options: { width?: number; height?: number } = {}): string {
  const { width = 800, height = 0 } = options
  
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn('[googlePhotos] GOOGLE_PLACES_API_KEY not found')
    return ''
  }

  const params = new URLSearchParams({
    maxwidth: width.toString(),
    photoreference: photoReference,
    key: GOOGLE_PLACES_API_KEY
  })
  
  if (height > 0) {
    params.set('maxheight', height.toString())
  }
  
  return `https://maps.googleapis.com/maps/api/place/photo?${params.toString()}`
}

/**
 * Validate that a photo URL is accessible (returns 200)
 */
export async function validatePhotoUrl(photoUrl: string): Promise<boolean> {
  try {
    const response = await fetch(photoUrl, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Slough-Directory/1.0'
      }
    })
    
    return response.ok
  } catch (error) {
    console.warn(`[googlePhotos] Photo validation failed for ${photoUrl}:`, error)
    return false
  }
}

/**
 * Get a validated photo URL from a photo reference
 * Returns null if the photo is not accessible
 */
export async function getValidatedPlacePhotoUrl(
  photoReference: string, 
  options: { width?: number; height?: number } = {}
): Promise<string | null> {
  const photoUrl = getPlacePhotoUrl(photoReference, options)
  
  if (!photoUrl) {
    return null
  }
  
  const isValid = await validatePhotoUrl(photoUrl)
  
  if (!isValid) {
    console.warn(`[googlePhotos] Photo validation failed for reference: ${photoReference}`)
    return null
  }
  
  return photoUrl
}

/**
 * Get the best available photo for a place
 * Tries multiple approaches to get a valid photo
 */
export async function getBestPlacePhoto(
  placeId: string, 
  existingPhotoRef?: string,
  options: { width?: number; height?: number } = {}
): Promise<string | null> {
  // First try existing photo reference if provided
  if (existingPhotoRef) {
    const validatedUrl = await getValidatedPlacePhotoUrl(existingPhotoRef, options)
    if (validatedUrl) {
      return validatedUrl
    }
  }
  
  // If no existing photo or validation failed, try to get a new one
  const photoRef = await getPlacePrimaryPhotoRef(placeId)
  if (photoRef) {
    const validatedUrl = await getValidatedPlacePhotoUrl(photoRef, options)
    if (validatedUrl) {
      return validatedUrl
    }
  }
  
  return null
}
