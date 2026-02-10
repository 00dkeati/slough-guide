import fs from 'fs'
import path from 'path'

/**
 * Script to add social media URLs to businesses
 * 
 * You can manually add social media links or integrate with APIs to auto-discover them
 * 
 * Usage: tsx scripts/addSocialMedia.ts
 */

interface Business {
  id: string
  name: string
  slug: string
  website?: string
  facebook_url?: string
  instagram_url?: string
  twitter_url?: string
  [key: string]: any
}

async function addSocialMediaLinks() {
  const businessesPath = path.join(process.cwd(), 'public/data/businesses.json')
  const businesses: Business[] = JSON.parse(fs.readFileSync(businessesPath, 'utf8'))

  console.log(`📱 Adding social media links to ${businesses.length} businesses...`)

  // Example: Add social media for specific businesses
  // You can expand this with actual social media URLs or API integration
  
  const socialMediaMap: { [businessName: string]: { facebook?: string, instagram?: string, twitter?: string } } = {
    // Add your business social media here
    // Example:
    // "Number 73 Bar and Kitchen": {
    //   facebook: "https://facebook.com/number73bar",
    //   instagram: "https://instagram.com/number73bar"
    // }
  }

  let updatedCount = 0

  businesses.forEach((business) => {
    const socialLinks = socialMediaMap[business.name]
    
    if (socialLinks) {
      if (socialLinks.facebook) business.facebook_url = socialLinks.facebook
      if (socialLinks.instagram) business.instagram_url = socialLinks.instagram
      if (socialLinks.twitter) business.twitter_url = socialLinks.twitter
      updatedCount++
    }

    // Auto-generate Facebook search URLs if website exists
    if (!business.facebook_url && business.website) {
      // This creates a Facebook search link (not ideal but better than nothing)
      const businessNameEncoded = encodeURIComponent(business.name)
      business.facebook_url = `https://www.facebook.com/search/pages/?q=${businessNameEncoded}`
    }
  })

  // Save updated data
  fs.writeFileSync(businessesPath, JSON.stringify(businesses, null, 2))
  
  console.log(`✅ Updated ${updatedCount} businesses with specific social media links`)
  console.log(`✅ Added Facebook search links for businesses with websites`)
  console.log(`📝 Total businesses: ${businesses.length}`)
  console.log(`\n💡 To add specific social media URLs, edit the socialMediaMap in this script`)
}

addSocialMediaLinks().catch(console.error)

