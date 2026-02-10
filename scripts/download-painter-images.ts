import { writeFileSync } from 'fs'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'
import { Readable } from 'stream'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY

if (!API_KEY) {
  console.error('Error: GOOGLE_PLACES_API_KEY not set!')
  process.exit(1)
}

// Place IDs of our local painters
const painters = [
  { placeId: 'ChIJ2c6yPr5bdEgRzRgcQ0Kc_QM', name: 'the-decorating-lady-hayling-island-hayling-island' },
  { placeId: 'ChIJhygCKynU2Y4R0exHH3Mxszo', name: 'fin-and-olive-decorating-and-carpentry-ltd-lee-on-the-solent' },
  { placeId: 'ChIJzbqOcnaNdEgRKBfwL6b9V5U', name: 'dwpm-darren-wright-property-maintenance-limited-rowlands-castle' },
  { placeId: 'ChIJeRmNyYBCdEgRJwqEqwQeZiU', name: 'bird-property-services-slough' },
  { placeId: 'ChIJw1R3x8lGdEgRvwJuR1kM5J8', name: 'a-design-build-south-havant' },
]

// Additional painters to download
const additionalPainters: any[] = []

async function getPlacePhotos(placeId: string): Promise<string[]> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`
  const response = await fetch(url)
  const data = await response.json()
  
  if (data.status !== 'OK' || !data.result?.photos) {
    return []
  }
  
  // Get first photo reference
  return data.result.photos.slice(0, 1).map((photo: any) => photo.photo_reference)
}

async function downloadPhoto(photoRef: string, filename: string): Promise<void> {
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${photoRef}&key=${API_KEY}`
  
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`)
  
  const destination = `public/images/businesses/${filename}.jpg`
  const fileStream = createWriteStream(destination)
  
  if (response.body) {
    await pipeline(Readable.fromWeb(response.body as any), fileStream)
  }
}

async function main() {
  console.log('📸 DOWNLOADING PAINTER IMAGES FROM GOOGLE PLACES\n')
  
  // Load additional painters data
  const fs = await import('fs')
  const additionalData = JSON.parse(fs.readFileSync('additional-painters.json', 'utf-8'))
  const additionalPainters = [
    { data: additionalData.find((p: any) => p.name === 'Jade Lisa Interiors'), name: 'jade-lisa-interiors-havant' },
    { data: additionalData.find((p: any) => p.name === 'Lee Baker Professional Decorating Services'), name: 'lee-baker-professional-decorating-services-hayling-island' },
    { data: additionalData.find((p: any) => p.name === 'Brewer C A, Painter and Decorator'), name: 'brewer-c-a-painter-and-decorator-havant' },
    { data: additionalData.find((p: any) => p.name === 'Charles Henry Property Services'), name: 'charles-henry-property-services-emsworth' },
  ]
  
  // Download for main painters
  for (const painter of painters) {
    console.log(`Downloading: ${painter.name}...`)
    try {
      const photos = await getPlacePhotos(painter.placeId)
      if (photos.length > 0) {
        await downloadPhoto(photos[0], painter.name)
        console.log(`✅ Downloaded image for ${painter.name}`)
      } else {
        console.log(`⚠️  No photos found for ${painter.name}`)
      }
    } catch (error) {
      console.log(`❌ Error downloading ${painter.name}: ${error}`)
    }
    await new Promise(r => setTimeout(r, 500))
  }
  
  // Download for additional painters
  for (const painter of additionalPainters) {
    if (!painter.data) continue
    console.log(`Downloading: ${painter.name}...`)
    try {
      const photos = await getPlacePhotos(painter.data.place_id)
      if (photos.length > 0) {
        await downloadPhoto(photos[0], painter.name)
        console.log(`✅ Downloaded image for ${painter.name}`)
      } else {
        console.log(`⚠️  No photos found for ${painter.name}`)
      }
    } catch (error) {
      console.log(`❌ Error downloading ${painter.name}: ${error}`)
    }
    await new Promise(r => setTimeout(r, 500))
  }
  
  console.log('\n✅ COMPLETED IMAGE DOWNLOADS')
}

main().catch(console.error)
