'use client'

import { useEffect, useRef } from 'react'
import { Business } from '@/lib/db'

interface BusinessMapProps {
  businesses: Business[]
  center?: {
    lat: number
    lng: number
  }
  zoom?: number
}

export default function BusinessMap({ businesses, center, zoom = 13 }: BusinessMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Only load Leaflet on the client side
    const loadMap = async () => {
      if (typeof window === 'undefined') return

      try {
        // Dynamically import Leaflet
        const L = (await import('leaflet')).default
        
        // Import Leaflet CSS
        await import('leaflet/dist/leaflet.css')

        if (mapRef.current && !mapInstanceRef.current) {
          // Set default center if not provided
          const defaultCenter = center || { lat: 50.8817, lng: -1.0324 } // Slough center

          // Create map
          const map = L.map(mapRef.current).setView([defaultCenter.lat, defaultCenter.lng], zoom)
          mapInstanceRef.current = map

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map)

          // Add markers for businesses with coordinates
          businesses.forEach((business) => {
            if (business.lat && business.lng) {
              const marker = L.marker([business.lat, business.lng]).addTo(map)
              
              // Create popup content
              const popupContent = `
                <div class="p-2">
                  <h3 class="font-semibold text-gray-900 mb-2">${business.name}</h3>
                  <p class="text-sm text-gray-600 mb-2">${business.category} in ${business.area}</p>
                  ${business.address ? `<p class="text-sm text-gray-700 mb-2">${business.address}</p>` : ''}
                  ${business.phone ? `<p class="text-sm text-gray-700 mb-2">📞 ${business.phone}</p>` : ''}
                  <a href="/biz/${business.slug}" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View Details →
                  </a>
                </div>
              `
              
              marker.bindPopup(popupContent)
            }
          })

          // Fit map to show all markers if there are multiple businesses
          if (businesses.length > 1) {
            const markers = businesses
              .filter(b => b.lat && b.lng)
              .map(b => [b.lat!, b.lng!] as [number, number])
            
            if (markers.length > 0) {
              const group = L.featureGroup(markers.map(coords => L.marker(coords)))
              map.fitBounds(group.getBounds().pad(0.1))
            }
          }
        }
      } catch (error) {
        console.error('Error loading map:', error)
      }
    }

    loadMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [businesses, center, zoom])

  return (
    <div className="w-full h-64 rounded-lg overflow-hidden">
      <div 
        ref={mapRef} 
        className="w-full h-full"
        style={{ minHeight: '256px' }}
      />
    </div>
  )
}
