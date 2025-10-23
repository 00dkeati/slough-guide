import { Place } from './types';
import { CITY } from '../config/city';

export interface BusinessGenerationOptions {
  count: number;
  categories?: string[];
  neighbourhoods?: string[];
  includeReviews?: boolean;
  includeImages?: boolean;
}

export class SloughBusinessGenerator {
  private businessTemplates: Record<string, Record<string, string[]>> = {};

  constructor() {
    this.initializeBusinessTemplates();
  }

  private initializeBusinessTemplates() {
    this.businessTemplates = {
      restaurants: {
        names: [
          'The {adjective} {cuisine} House',
          '{cuisine} Garden',
          '{owner}\'s {cuisine} Kitchen',
          'The {adjective} {cuisine}',
          '{cuisine} Corner',
          'Spice of {cuisine}',
          '{cuisine} Express',
          'The {adjective} Table'
        ],
        cuisines: ['Italian', 'Indian', 'Chinese', 'Thai', 'Mexican', 'French', 'Greek', 'Turkish', 'Lebanese', 'Japanese', 'Korean', 'Vietnamese', 'Spanish', 'Mediterranean', 'British', 'American', 'Caribbean', 'African', 'Persian', 'Moroccan'],
        adjectives: ['Golden', 'Royal', 'Grand', 'Elite', 'Premium', 'Classic', 'Modern', 'Traditional', 'Authentic', 'Exotic', 'Spicy', 'Fresh', 'Gourmet', 'Artisan', 'Boutique', 'Cozy', 'Elegant', 'Rustic', 'Contemporary', 'Vintage']
      },
      takeaways: {
        names: [
          '{cuisine} Express',
          'Quick {cuisine}',
          '{owner}\'s {cuisine}',
          'The {adjective} {cuisine}',
          '{cuisine} Corner',
          'Fast {cuisine}',
          '{cuisine} Hub',
          'The {adjective} Kitchen'
        ],
        cuisines: ['Pizza', 'Kebab', 'Burger', 'Fish & Chips', 'Chinese', 'Indian', 'Thai', 'Mexican', 'Italian', 'Turkish', 'Lebanese', 'Chicken', 'Sandwich', 'Wrap', 'Noodle', 'Sushi', 'Fried Chicken', 'Curry', 'Taco', 'Pasta'],
        adjectives: ['Golden', 'Crispy', 'Fresh', 'Spicy', 'Hot', 'Quick', 'Fast', 'Premium', 'Gourmet', 'Artisan', 'Classic', 'Modern', 'Traditional', 'Authentic', 'Exotic', 'Elite', 'Royal', 'Grand', 'Boutique', 'Cozy']
      },
      cafes: {
        names: [
          'The {adjective} Bean',
          '{owner}\'s Coffee House',
          '{adjective} Brew',
          'Coffee {adjective}',
          'The {adjective} Cup',
          '{adjective} Roast',
          'Bean {adjective}',
          'The {adjective} Corner'
        ],
        cuisines: ['Coffee', 'Tea', 'Cafe', 'Bakery', 'Brunch', 'Breakfast', 'Lunch', 'Dessert', 'Pastry', 'Sandwich', 'Salad', 'Smoothie', 'Juice', 'Cake', 'Cookie', 'Muffin', 'Croissant', 'Bagel', 'Panini', 'Soup'],
        adjectives: ['Golden', 'Royal', 'Grand', 'Elite', 'Premium', 'Classic', 'Modern', 'Traditional', 'Authentic', 'Exotic', 'Spicy', 'Fresh', 'Gourmet', 'Artisan', 'Boutique', 'Cozy', 'Elegant', 'Rustic', 'Contemporary', 'Vintage']
      },
      pubs: {
        names: [
          'The {adjective} {animal}',
          '{owner}\'s {adjective} Inn',
          'The {adjective} {noun}',
          '{adjective} Arms',
          'The {adjective} Tavern',
          '{adjective} Head',
          'The {adjective} {animal}',
          '{adjective} Crown'
        ],
        cuisines: ['Pub', 'Bar', 'Inn', 'Tavern', 'Ale House', 'Beer House', 'Sports Bar', 'Cocktail Bar', 'Wine Bar', 'Gastropub', 'Brewery', 'Distillery', 'Lounge', 'Club', 'Nightclub', 'Bistro', 'Grill', 'Steakhouse', 'BBQ', 'Seafood'],
        adjectives: ['Golden', 'Royal', 'Grand', 'Elite', 'Premium', 'Classic', 'Modern', 'Traditional', 'Authentic', 'Exotic', 'Spicy', 'Fresh', 'Gourmet', 'Artisan', 'Boutique', 'Cozy', 'Elegant', 'Rustic', 'Contemporary', 'Vintage'],
        animals: ['Lion', 'Eagle', 'Bear', 'Fox', 'Wolf', 'Stag', 'Bull', 'Horse', 'Dog', 'Cat', 'Swan', 'Dove', 'Hawk', 'Falcon', 'Owl', 'Raven', 'Crow', 'Sparrow', 'Robin', 'Wren'],
        nouns: ['Arms', 'Head', 'Crown', 'Cross', 'Star', 'Moon', 'Sun', 'Rose', 'Oak', 'Pine', 'Willow', 'Ash', 'Elm', 'Beech', 'Chestnut', 'Maple', 'Birch', 'Cedar', 'Fir', 'Spruce']
      },
      gyms: {
        names: [
          '{adjective} Fitness',
          '{owner}\'s Gym',
          '{adjective} Strength',
          'Fit {adjective}',
          'The {adjective} Gym',
          '{adjective} Training',
          'Power {adjective}',
          'The {adjective} Center'
        ],
        cuisines: ['Gym', 'Fitness', 'Training', 'Strength', 'Cardio', 'CrossFit', 'Boxing', 'Martial Arts', 'Yoga', 'Pilates', 'Swimming', 'Cycling', 'Running', 'Weightlifting', 'Bodybuilding', 'Personal Training', 'Group Fitness', 'Dance', 'Aerobics', 'Zumba'],
        adjectives: ['Golden', 'Royal', 'Grand', 'Elite', 'Premium', 'Classic', 'Modern', 'Traditional', 'Authentic', 'Exotic', 'Spicy', 'Fresh', 'Gourmet', 'Artisan', 'Boutique', 'Cozy', 'Elegant', 'Rustic', 'Contemporary', 'Vintage']
      },
      barbers: {
        names: [
          '{owner}\'s Barber Shop',
          'The {adjective} Cut',
          '{adjective} Barbers',
          'Cut {adjective}',
          'The {adjective} Razor',
          '{adjective} Style',
          'The {adjective} Trim',
          '{adjective} Grooming'
        ],
        cuisines: ['Barber', 'Haircut', 'Styling', 'Grooming', 'Shave', 'Trim', 'Cut', 'Style', 'Hair', 'Beard', 'Mustache', 'Facial', 'Massage', 'Spa', 'Salon', 'Beauty', 'Wellness', 'Relaxation', 'Treatment', 'Therapy'],
        adjectives: ['Golden', 'Royal', 'Grand', 'Elite', 'Premium', 'Classic', 'Modern', 'Traditional', 'Authentic', 'Exotic', 'Spicy', 'Fresh', 'Gourmet', 'Artisan', 'Boutique', 'Cozy', 'Elegant', 'Rustic', 'Contemporary', 'Vintage']
      },
      hairdressers: {
        names: [
          '{owner}\'s Hair Studio',
          'The {adjective} Salon',
          '{adjective} Hair',
          'Style {adjective}',
          'The {adjective} Cut',
          '{adjective} Beauty',
          'The {adjective} Studio',
          '{adjective} Hair Design'
        ],
        cuisines: ['Hair', 'Styling', 'Cut', 'Color', 'Highlight', 'Perm', 'Straighten', 'Curly', 'Blow Dry', 'Updo', 'Bridal', 'Wedding', 'Special Occasion', 'Hair Treatment', 'Scalp Treatment', 'Hair Care', 'Beauty', 'Makeup', 'Nails', 'Spa'],
        adjectives: ['Golden', 'Royal', 'Grand', 'Elite', 'Premium', 'Classic', 'Modern', 'Traditional', 'Authentic', 'Exotic', 'Spicy', 'Fresh', 'Gourmet', 'Artisan', 'Boutique', 'Cozy', 'Elegant', 'Rustic', 'Contemporary', 'Vintage']
      },
      plumbers: {
        names: [
          '{owner}\'s Plumbing',
          '{adjective} Plumbing',
          'The {adjective} Plumber',
          '{adjective} Services',
          'The {adjective} Fix',
          '{adjective} Solutions',
          'The {adjective} Repair',
          '{adjective} Maintenance'
        ],
        cuisines: ['Plumbing', 'Heating', 'Boiler', 'Radiator', 'Pipe', 'Drain', 'Toilet', 'Bathroom', 'Kitchen', 'Installation', 'Repair', 'Maintenance', 'Emergency', 'Service', 'Gas', 'Water', 'Leak', 'Blockage', 'Replacement', 'Upgrade'],
        adjectives: ['Golden', 'Royal', 'Grand', 'Elite', 'Premium', 'Classic', 'Modern', 'Traditional', 'Authentic', 'Exotic', 'Spicy', 'Fresh', 'Gourmet', 'Artisan', 'Boutique', 'Cozy', 'Elegant', 'Rustic', 'Contemporary', 'Vintage']
      }
    };
  }

  private generateBusinessName(category: string, template: Record<string, string[]>): string {
    const nameTemplate = template.names[Math.floor(Math.random() * template.names.length)];
    const cuisine = template.cuisines[Math.floor(Math.random() * template.cuisines.length)];
    const adjective = template.adjectives[Math.floor(Math.random() * template.adjectives.length)];
    
    let name = nameTemplate
      .replace('{cuisine}', cuisine)
      .replace('{adjective}', adjective);

    if (template.animals) {
      const animal = template.animals[Math.floor(Math.random() * template.animals.length)];
      name = name.replace('{animal}', animal);
    }

    if (template.nouns) {
      const noun = template.nouns[Math.floor(Math.random() * template.nouns.length)];
      name = name.replace('{noun}', noun);
    }

    const owners = ['Tony', 'Sarah', 'Mike', 'Lisa', 'David', 'Emma', 'James', 'Anna', 'Chris', 'Maria', 'John', 'Kate', 'Paul', 'Sophie', 'Mark', 'Rachel', 'Steve', 'Helen', 'Tom', 'Laura'];
    const owner = owners[Math.floor(Math.random() * owners.length)];
    name = name.replace('{owner}', owner);

    return name;
  }

  private generateSloughAddress(neighbourhood: string): { address: string; lat: number; lng: number } {
    const streets = [
      'High Street', 'Church Street', 'Station Road', 'Main Road', 'Park Road', 'Victoria Road',
      'Queen Street', 'King Street', 'Mill Lane', 'School Lane', 'Church Lane', 'Park Lane',
      'The Green', 'The Square', 'Market Place', 'Castle Street', 'Bridge Street', 'Water Street',
      'New Road', 'Old Road', 'North Street', 'South Street', 'East Street', 'West Street',
      'Manor Road', 'Temple Road', 'Grove Road', 'Hill Road', 'Valley Road', 'Meadow Road'
    ];

    const street = streets[Math.floor(Math.random() * streets.length)];
    const number = Math.floor(Math.random() * 200) + 1;
    const postcode = this.generateSloughPostcode();
    
    const address = `${number} ${street}, ${neighbourhood}, Slough ${postcode}, UK`;
    
    // Generate realistic coordinates within Slough
    const baseLat = 51.5105;
    const baseLng = -0.5950;
    const lat = baseLat + (Math.random() - 0.5) * 0.02; // ±0.01 degrees
    const lng = baseLng + (Math.random() - 0.5) * 0.02; // ±0.01 degrees

    return { address, lat, lng };
  }

  private generateSloughPostcode(): string {
    const prefixes = ['SL1', 'SL2', 'SL3', 'SL4'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(Math.random() * 9) + 1;
    const suffix2 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return `${prefix} ${suffix}${suffix2}${suffix}`;
  }

  private generatePhoneNumber(): string {
    const areaCode = '1753';
    const number = Math.floor(Math.random() * 900000) + 100000;
    return `+44 ${areaCode} ${number}`;
  }

  private generateWebsite(businessName: string): string {
    const domain = businessName.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const extensions = ['.co.uk', '.com', '.uk', '.net'];
    const extension = extensions[Math.floor(Math.random() * extensions.length)];
    
    return `https://www.${domain}${extension}`;
  }

  private generateOpeningHours(): Record<string, boolean | string[]> {
    const hours = [
      {
        open_now: Math.random() > 0.3,
        weekday_text: [
          'Monday: 9:00 AM – 6:00 PM',
          'Tuesday: 9:00 AM – 6:00 PM',
          'Wednesday: 9:00 AM – 6:00 PM',
          'Thursday: 9:00 AM – 6:00 PM',
          'Friday: 9:00 AM – 7:00 PM',
          'Saturday: 9:00 AM – 5:00 PM',
          'Sunday: Closed'
        ]
      },
      {
        open_now: Math.random() > 0.3,
        weekday_text: [
          'Monday: 8:00 AM – 8:00 PM',
          'Tuesday: 8:00 AM – 8:00 PM',
          'Wednesday: 8:00 AM – 8:00 PM',
          'Thursday: 8:00 AM – 8:00 PM',
          'Friday: 8:00 AM – 9:00 PM',
          'Saturday: 9:00 AM – 6:00 PM',
          'Sunday: 10:00 AM – 4:00 PM'
        ]
      },
      {
        open_now: Math.random() > 0.3,
        weekday_text: [
          'Monday: 10:00 AM – 10:00 PM',
          'Tuesday: 10:00 AM – 10:00 PM',
          'Wednesday: 10:00 AM – 10:00 PM',
          'Thursday: 10:00 AM – 10:00 PM',
          'Friday: 10:00 AM – 11:00 PM',
          'Saturday: 10:00 AM – 11:00 PM',
          'Sunday: 12:00 PM – 9:00 PM'
        ]
      }
    ];

    return hours[Math.floor(Math.random() * hours.length)];
  }

  private generateSlug(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private generateAIDescription(businessName: string, category: string, neighbourhood: string): string {
    const descriptions = [
      `${businessName} is a popular ${category} in ${neighbourhood}, Slough, known for its quality service and friendly atmosphere.`,
      `Located in ${neighbourhood}, ${businessName} offers excellent ${category} services with a focus on customer satisfaction.`,
      `${businessName} has been serving the ${neighbourhood} community in Slough with outstanding ${category} for years.`,
      `A trusted ${category} in ${neighbourhood}, ${businessName} is known for its professional service and local expertise.`,
      `${businessName} provides top-quality ${category} services to residents and visitors in ${neighbourhood}, Slough.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  async generateBusinesses(options: BusinessGenerationOptions): Promise<Place[]> {
    const { count, categories = [], neighbourhoods = [] } = options;
    const businesses: Place[] = [];

    console.log(`🏭 Generating ${count} businesses for Slough...`);

    for (let i = 0; i < count; i++) {
      try {
        // Select random category
        const categoryKeys = categories.length > 0 ? categories : Object.keys(this.businessTemplates);
        const categoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const template = this.businessTemplates[categoryKey];

        if (!template) continue;

        // Generate business name
        const name = this.generateBusinessName(categoryKey, template);

        // Select random neighbourhood
        const availableNeighbourhoods = neighbourhoods.length > 0 ? neighbourhoods : CITY.neighbourhoods;
        const neighbourhood = availableNeighbourhoods[Math.floor(Math.random() * availableNeighbourhoods.length)];

        // Generate address and coordinates
        const { address, lat, lng } = this.generateSloughAddress(neighbourhood);

        // Generate other details
        const phone = this.generatePhoneNumber();
        const website = Math.random() > 0.3 ? this.generateWebsite(name) : null;
        const rating = Math.random() * 2 + 3; // 3.0 to 5.0
        const userRatingsTotal = Math.floor(Math.random() * 500) + 10;
        const priceLevel = Math.floor(Math.random() * 4); // 0-3
        const openingHours = this.generateOpeningHours();
        const slug = this.generateSlug(name);

        // Generate description
        const aiDescription = this.generateAIDescription(name, categoryKey, neighbourhood);

        // Map Google types to category IDs
        const categoryMap: Record<string, string> = {
          'restaurant': 'restaurants',
          'meal_takeaway': 'takeaways',
          'cafe': 'cafes',
          'bar': 'pubs',
          'gym': 'gyms',
          'hair_care': 'barbers',
          'beauty_salon': 'hairdressers',
          'plumber': 'plumbers',
          'electrician': 'electricians',
          'general_contractor': 'builders',
          'locksmith': 'locksmiths',
          'car_wash': 'car_wash',
          'taxi_stand': 'taxi',
          'lodging': 'hotels',
          'park': 'parks',
          'dentist': 'dentists',
          'veterinary_care': 'vets',
          'preschool': 'nurseries',
          'school': 'schools',
          'accountant': 'accountants',
          'lawyer': 'solicitors',
          'real_estate_agency': 'estate_agents'
        };

        const categoryId = categoryMap[categoryKey] || categoryKey;
        
        // Ensure we have a valid category ID
        const validCategoryId = CATEGORIES.find(cat => cat.id === categoryId) ? categoryId : 'restaurants';

        const business: Place = {
          place_id: `generated_${Date.now()}_${i}`,
          name,
          slug,
          types: [categoryKey],
          lat,
          lng,
          last_fetched: new Date().toISOString(),
          categories: [validCategoryId],
          formatted_address: address,
          vicinity: neighbourhood,
          phone,
          website: website || undefined,
          rating: Math.round(rating * 10) / 10,
          user_ratings_total: userRatingsTotal,
          price_level: priceLevel,
          business_status: 'OPERATIONAL',
          opening_hours: openingHours,
          photos: []
        };

        businesses.push(business);

        // Add delay to avoid rate limiting
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (i % 50 === 0) {
          console.log(`📊 Generated ${i + 1}/${count} businesses...`);
        }

      } catch (error) {
        console.error(`Error generating business ${i}:`, error);
      }
    }

    console.log(`✅ Successfully generated ${businesses.length} businesses!`);
    return businesses;
  }

  async generateDailyBusinesses(targetCount: number = 100): Promise<Place[]> {
    console.log(`🚀 Starting daily business generation for ${targetCount} businesses...`);
    
    const businesses = await this.generateBusinesses({
      count: targetCount,
      includeReviews: true,
      includeImages: false
    });

    return businesses;
  }
}

export const businessGenerator = new SloughBusinessGenerator();
