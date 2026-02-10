'use client'

import { useState } from 'react'

interface BusinessGalleryProps {
  businessName: string
  images?: string[]
}

export default function BusinessGallery({ businessName, images }: BusinessGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  
  // Create fallback images if no images provided or if images fail to load
  const createFallbackImages = () => [
    `https://placehold.co/800x600/3b82f6/ffffff?text=${encodeURIComponent(businessName)}`,
    `https://placehold.co/800x600/8b5cf6/ffffff?text=Business+Gallery`,
    `https://placehold.co/800x600/10b981/ffffff?text=Local+Business`
  ]
  
  const galleryImages = images && images.length > 0 ? images : createFallbackImages()

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-8">
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={galleryImages[selectedImage]}
          alt="Business image"
          className="w-full h-full object-cover"
        />
      </div>
      
      {galleryImages.length > 1 && (
        <div className="flex gap-2 p-4 bg-gray-50 overflow-x-auto">
          {galleryImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2"
            >
              <img
                src={img}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
