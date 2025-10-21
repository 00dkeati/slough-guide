import { Place } from './types';
import axios from 'axios';
import * as cheerio from 'cheerio';

// AI-powered business data enrichment
export class AIBusinessEnrichment {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
  }

  // Enrich a business with AI-generated content and scraped data
  async enrichBusiness(place: Place): Promise<EnrichedPlace> {
    console.log(`🤖 Enriching business: ${place.name}`);
    
    const enrichedData: EnrichedPlace = {
      ...place,
      aiGeneratedDescription: '',
      scrapedReviews: [],
      additionalInfo: {},
      socialMediaLinks: {},
      opening_hours: place.opening_hours || {},
      amenities: [],
      lastEnriched: new Date().toISOString()
    };

    try {
      // 1. Generate AI description
      enrichedData.aiGeneratedDescription = await this.generateBusinessDescription(place);
      
      // 2. Scrape reviews from multiple sources
      enrichedData.scrapedReviews = await this.scrapeReviews(place);
      
      // 3. Get additional business info
      enrichedData.additionalInfo = await this.scrapeAdditionalInfo(place);
      
      // 4. Find social media links
      enrichedData.socialMediaLinks = await this.findSocialMediaLinks(place);
      
      // 5. Extract amenities and features
      enrichedData.amenities = await this.extractAmenities(place);
      
      // 6. Generate SEO-optimized content
      enrichedData.seoContent = await this.generateSEOContent(place);
      
      console.log(`✅ Successfully enriched: ${place.name}`);
      return enrichedData;
      
    } catch (error) {
      console.error(`❌ Error enriching ${place.name}:`, error);
      return enrichedData; // Return partial data
    }
  }

  // Generate AI-powered business description
  private async generateBusinessDescription(place: Place): Promise<string> {
    if (!this.openaiApiKey) {
      return this.generateFallbackDescription(place);
    }

    try {
      const prompt = `Write a compelling 150-word description for ${place.name}, a ${place.types.join(', ')} business in ${place.formatted_address || place.vicinity || 'Slough'}. 
      
      Include:
      - What makes this business special
      - Key services or products
      - Local appeal and community focus
      - Professional but friendly tone
      - Call to action to visit

      Make it engaging and SEO-friendly.`;

      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackDescription(place);
    }
  }

  // Fallback description generation
  private generateFallbackDescription(place: Place): string {
    const typeDescriptions: Record<string, string> = {
      'restaurant': 'A delightful dining experience offering delicious cuisine in a welcoming atmosphere.',
      'cafe': 'A cozy coffee shop perfect for breakfast, lunch, or a relaxing break with friends.',
      'takeaway': 'Quick and convenient takeaway food service with fresh, tasty options for busy lifestyles.',
      'pub': 'A traditional British pub serving great drinks, hearty meals, and warm hospitality.',
      'gym': 'A modern fitness facility with state-of-the-art equipment and expert trainers.',
      'barber': 'Professional grooming services for men with skilled barbers and quality products.',
      'hairdresser': 'Expert hair styling and beauty services in a comfortable, professional salon.',
      'plumber': 'Reliable plumbing services for emergencies and general maintenance needs.',
      'electrician': 'Professional electrical services with certified technicians and quality workmanship.',
      'hotel': 'Comfortable accommodation with modern amenities and excellent service.',
      'dentist': 'Comprehensive dental care with experienced professionals and modern equipment.',
      'veterinary_care': 'Compassionate veterinary services for your beloved pets.',
      'school': 'Quality education with dedicated teachers and excellent facilities.',
      'accountant': 'Professional accounting services to help manage your finances effectively.',
      'lawyer': 'Expert legal advice and representation for various legal matters.',
      'real_estate_agency': 'Professional property services helping you buy, sell, or rent homes.'
    };

    const primaryType = place.types[0] || 'business';
    const baseDescription = typeDescriptions[primaryType] || 'A trusted local business providing quality services to the community.';
    
    return `${place.name} is ${baseDescription.toLowerCase()} Located in ${place.vicinity || 'Slough'}, we're committed to providing excellent service and value to our customers. Visit us today to experience the difference quality makes.`;
  }

  // Scrape reviews from multiple sources
  private async scrapeReviews(place: Place): Promise<Review[]> {
    const reviews: Review[] = [];
    
    try {
      // Try to scrape Google Reviews (if we can find the business page)
      const googleReviews = await this.scrapeGoogleReviews(place);
      reviews.push(...googleReviews);
      
      // Try to scrape TripAdvisor reviews
      const tripAdvisorReviews = await this.scrapeTripAdvisorReviews(place);
      reviews.push(...tripAdvisorReviews);
      
      // Try to scrape Yelp reviews
      const yelpReviews = await this.scrapeYelpReviews(place);
      reviews.push(...yelpReviews);
      
    } catch (error) {
      console.error('Error scraping reviews:', error);
    }
    
    return reviews.slice(0, 10); // Limit to 10 reviews
  }

  // Scrape Google Reviews
  private async scrapeGoogleReviews(place: Place): Promise<Review[]> {
    try {
      // This would require more sophisticated scraping
      // For now, return mock data structure
      return [];
    } catch (error) {
      return [];
    }
  }

  // Scrape TripAdvisor Reviews
  private async scrapeTripAdvisorReviews(place: Place): Promise<Review[]> {
    try {
      // Implementation would go here
      return [];
    } catch (error) {
      return [];
    }
  }

  // Scrape Yelp Reviews
  private async scrapeYelpReviews(place: Place): Promise<Review[]> {
    try {
      // Implementation would go here
      return [];
    } catch (error) {
      return [];
    }
  }

  // Scrape additional business information
  private async scrapeAdditionalInfo(place: Place): Promise<Record<string, any>> {
    const info: Record<string, any> = {};
    
    try {
      if (place.website) {
        const websiteInfo = await this.scrapeWebsite(place.website);
        Object.assign(info, websiteInfo);
      }
    } catch (error) {
      console.error('Error scraping website:', error);
    }
    
    return info;
  }

  // Scrape business website for additional info
  private async scrapeWebsite(url: string): Promise<Record<string, any>> {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SloughGuideBot/1.0)'
        }
      });
      
      const $ = cheerio.load(response.data);
      const info: Record<string, any> = {};
      
      // Extract common information
      info.title = $('title').text();
      info.description = $('meta[name="description"]').attr('content');
      info.keywords = $('meta[name="keywords"]').attr('content');
      
      // Look for contact information
      const phoneRegex = /(\+44|0)[0-9\s-]{10,}/g;
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      
      const pageText = $('body').text() || '';
      const phones = pageText.match(phoneRegex);
      const emails = pageText.match(emailRegex);
      
      if (phones) info.phones = [...new Set(phones)];
      if (emails) info.emails = [...new Set(emails)];
      
      return info;
    } catch (error) {
      console.error('Error scraping website:', error);
      return {};
    }
  }

  // Find social media links
  private async findSocialMediaLinks(place: Place): Promise<Record<string, string>> {
    const socialLinks: Record<string, string> = {};
    
    try {
      if (place.website) {
        const websiteSocialLinks = await this.extractSocialLinksFromWebsite(place.website);
        Object.assign(socialLinks, websiteSocialLinks);
      }
    } catch (error) {
      console.error('Error finding social media links:', error);
    }
    
    return socialLinks;
  }

  // Extract social media links from website
  private async extractSocialLinksFromWebsite(url: string): Promise<Record<string, string>> {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SloughGuideBot/1.0)'
        }
      });
      
      const $ = cheerio.load(response.data);
      const socialLinks: Record<string, string> = {};
      
      // Look for social media links
      $('a[href*="facebook.com"], a[href*="instagram.com"], a[href*="twitter.com"], a[href*="linkedin.com"]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          if (href.includes('facebook.com')) socialLinks.facebook = href;
          if (href.includes('instagram.com')) socialLinks.instagram = href;
          if (href.includes('twitter.com')) socialLinks.twitter = href;
          if (href.includes('linkedin.com')) socialLinks.linkedin = href;
        }
      });
      
      return socialLinks;
    } catch (error) {
      console.error('Error extracting social links:', error);
      return {};
    }
  }

  // Extract amenities and features
  private async extractAmenities(place: Place): Promise<string[]> {
    const amenities: string[] = [];
    
    // Based on business type, suggest common amenities
    const amenityMap: Record<string, string[]> = {
      'restaurant': ['WiFi', 'Parking', 'Takeaway', 'Delivery', 'Outdoor Seating', 'Wheelchair Accessible'],
      'cafe': ['WiFi', 'Parking', 'Takeaway', 'Outdoor Seating', 'Wheelchair Accessible'],
      'pub': ['Parking', 'Outdoor Seating', 'Live Music', 'Sports TV', 'Wheelchair Accessible'],
      'gym': ['Parking', 'Changing Rooms', 'Showers', 'Personal Training', 'Group Classes'],
      'hotel': ['WiFi', 'Parking', 'Restaurant', 'Bar', 'Room Service', 'Wheelchair Accessible'],
      'dentist': ['Parking', 'Wheelchair Accessible', 'Emergency Appointments'],
      'veterinary_care': ['Parking', 'Emergency Services', 'Grooming Services'],
      'school': ['Parking', 'Wheelchair Accessible', 'Sports Facilities', 'Library']
    };
    
    const primaryType = place.types[0];
    if (primaryType && amenityMap[primaryType]) {
      amenities.push(...amenityMap[primaryType]);
    }
    
    return [...new Set(amenities)]; // Remove duplicates
  }

  // Generate SEO-optimized content
  private async generateSEOContent(place: Place): Promise<SEOContent> {
    const location = place.vicinity || place.formatted_address || 'Slough';
    const businessType = place.types[0] || 'business';
    
    return {
      title: `${place.name} - ${businessType} in ${location}`,
      metaDescription: `${place.name} is a ${businessType} located in ${location}. Visit us for quality service.`,
      keywords: [
        place.name.toLowerCase(),
        businessType,
        location.toLowerCase(),
        'slough',
        'berkshire',
        'uk'
      ].join(', '),
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: place.name,
        address: place.formatted_address,
        telephone: place.phone,
        url: place.website,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: place.lat,
          longitude: place.lng
        }
      }
    };
  }
}

// Types for enriched data
export interface EnrichedPlace extends Place {
  aiGeneratedDescription: string;
  scrapedReviews: Review[];
  additionalInfo: Record<string, any>;
  socialMediaLinks: Record<string, string>;
  amenities: string[];
  seoContent?: SEOContent;
  lastEnriched: string;
}

export interface Review {
  source: 'google' | 'tripadvisor' | 'yelp' | 'facebook';
  rating: number;
  text: string;
  author: string;
  date: string;
  helpful?: number;
}

export interface SEOContent {
  title: string;
  metaDescription: string;
  keywords: string;
  structuredData: any;
}

// Export singleton instance
export const aiEnrichment = new AIBusinessEnrichment();
