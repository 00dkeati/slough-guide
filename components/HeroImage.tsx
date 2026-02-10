'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function HeroImage() {
  const [currentImage, setCurrentImage] = useState(0)
  
  const images = [
    {
      src: '/images/slough/slough-precinct.jpg',
      alt: 'Slough town center',
      caption: 'Your local business directory'
    },
    {
      src: '/images/slough/slough-street.jpg',
      alt: 'London Road, Slough',
      caption: 'Supporting local businesses since 2024'
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl mb-8">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-2">
              Slough Business Directory
            </h2>
            <p className="text-xl">{img.caption}</p>
          </div>
        </div>
      ))}
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 right-4 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentImage ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
