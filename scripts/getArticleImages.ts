/**
 * Get Real Business Images for Editorial Articles
 * Pulls actual Google images from businesses in the database
 */

import { getBusinessesByCategory } from '../lib/db'
import fs from 'fs'
import path from 'path'

interface Business {
  name: string
  images?: string[]
  rating: number
  review_count: number
}

async function getBestImagesForArticles() {
  console.log('\n📸 Finding Real Business Images for Editorial Articles...\n')
  
  // Get businesses for each category
  const [estateAgents, restaurants, cafes, hairSalons] = await Promise.all([
    getBusinessesByCategory('estate-agents'),
    getBusinessesByCategory('restaurants'),
    getBusinessesByCategory('cafes'),
    getBusinessesByCategory('hair-salons')
  ])
  
  // Find best businesses with images
  const findBestWithImages = (businesses: Business[]) => {
    return businesses
      .filter(b => b.images && b.images.length > 0)
      .sort((a, b) => (b.rating * b.review_count) - (a.rating * a.review_count))
      .slice(0, 1)[0]
  }
  
  const bestEstateAgent = findBestWithImages(estateAgents)
  const bestRestaurant = findBestWithImages(restaurants)
  const bestCafe = findBestWithImages(cafes)
  const bestHairSalon = findBestWithImages(hairSalons)
  
  console.log('Found images:')
  console.log(`🏠 Estate Agents: ${bestEstateAgent?.name} - ${bestEstateAgent?.images?.[0]?.substring(0, 60)}...`)
  console.log(`🍽️  Restaurants: ${bestRestaurant?.name} - ${bestRestaurant?.images?.[0]?.substring(0, 60)}...`)
  console.log(`☕ Cafes: ${bestCafe?.name} - ${bestCafe?.images?.[0]?.substring(0, 60)}...`)
  console.log(`✂️  Hair Salons: ${bestHairSalon?.name} - ${bestHairSalon?.images?.[0]?.substring(0, 60)}...`)
  
  return {
    estateAgents: bestEstateAgent?.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop',
    restaurants: bestRestaurant?.images?.[0] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop',
    cafes: bestCafe?.images?.[0] || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&h=600&fit=crop',
    hairSalons: bestHairSalon?.images?.[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=600&fit=crop',
    plumbing: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&h=600&fit=crop',
    shopping: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop',
    sundayRoast: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=1200&h=600&fit=crop'
  }
}

// Run if called directly
if (require.main === module) {
  getBestImagesForArticles()
    .then((images) => {
      console.log('\n✅ Images found!\n')
      console.log(JSON.stringify(images, null, 2))
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error:', error)
      process.exit(1)
    })
}

export { getBestImagesForArticles }

