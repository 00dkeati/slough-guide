import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';

// Sample businesses for Slough
const sampleBusinesses = [
  {
    place_id: 'sample_1',
    name: 'The Crown & Cushion',
    slug: 'the-crown-cushion',
    types: ['restaurant', 'food', 'establishment'],
    lat: 51.5105,
    lng: -0.5950,
    last_fetched: new Date().toISOString(),
    categories: ['restaurants'],
    formatted_address: 'High Street, Slough SL1 1DH, UK',
    rating: 4.2,
    user_ratings_total: 156,
    neighbourhood: 'Slough',
    photos: [],
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 12:00 PM – 10:00 PM',
        'Tuesday: 12:00 PM – 10:00 PM',
        'Wednesday: 12:00 PM – 10:00 PM',
        'Thursday: 12:00 PM – 10:00 PM',
        'Friday: 12:00 PM – 11:00 PM',
        'Saturday: 12:00 PM – 11:00 PM',
        'Sunday: 12:00 PM – 9:00 PM'
      ]
    },
    website: 'https://www.crownandcushion-slough.co.uk',
    phone: '+44 1753 521234'
  },
  {
    place_id: 'sample_2',
    name: 'Slough Kebab House',
    slug: 'slough-kebab-house',
    types: ['meal_takeaway', 'food', 'establishment'],
    lat: 51.5089,
    lng: -0.5942,
    last_fetched: new Date().toISOString(),
    categories: ['takeaways'],
    formatted_address: 'Windsor Road, Slough SL1 2EJ, UK',
    rating: 4.0,
    user_ratings_total: 89,
    neighbourhood: 'Slough',
    photos: [],
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 5:00 PM – 11:00 PM',
        'Tuesday: 5:00 PM – 11:00 PM',
        'Wednesday: 5:00 PM – 11:00 PM',
        'Thursday: 5:00 PM – 11:00 PM',
        'Friday: 5:00 PM – 12:00 AM',
        'Saturday: 5:00 PM – 12:00 AM',
        'Sunday: 5:00 PM – 10:00 PM'
      ]
    },
    website: null,
    phone: '+44 1753 523456'
  },
  {
    place_id: 'sample_3',
    name: 'Costa Coffee',
    slug: 'costa-coffee-slough',
    types: ['cafe', 'food', 'establishment'],
    lat: 51.5098,
    lng: -0.5965,
    last_fetched: new Date().toISOString(),
    categories: ['cafes'],
    formatted_address: 'Queensmere Shopping Centre, Slough SL1 1DB, UK',
    rating: 4.1,
    user_ratings_total: 234,
    neighbourhood: 'Slough',
    photos: [],
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 7:00 AM – 7:00 PM',
        'Tuesday: 7:00 AM – 7:00 PM',
        'Wednesday: 7:00 AM – 7:00 PM',
        'Thursday: 7:00 AM – 7:00 PM',
        'Friday: 7:00 AM – 8:00 PM',
        'Saturday: 8:00 AM – 8:00 PM',
        'Sunday: 9:00 AM – 6:00 PM'
      ]
    },
    website: 'https://www.costa.co.uk',
    phone: '+44 1753 524567'
  },
  {
    place_id: 'sample_4',
    name: 'The Red Lion',
    slug: 'the-red-lion-slough',
    types: ['bar', 'food', 'establishment'],
    lat: 51.5112,
    lng: -0.5948,
    last_fetched: new Date().toISOString(),
    categories: ['pubs'],
    formatted_address: 'High Street, Slough SL1 1DH, UK',
    rating: 4.3,
    user_ratings_total: 178,
    neighbourhood: 'Slough',
    photos: [],
    opening_hours: {
      open_now: false,
      weekday_text: [
        'Monday: 12:00 PM – 11:00 PM',
        'Tuesday: 12:00 PM – 11:00 PM',
        'Wednesday: 12:00 PM – 11:00 PM',
        'Thursday: 12:00 PM – 11:00 PM',
        'Friday: 12:00 PM – 12:00 AM',
        'Saturday: 12:00 PM – 12:00 AM',
        'Sunday: 12:00 PM – 10:30 PM'
      ]
    },
    website: 'https://www.redlion-slough.co.uk',
    phone: '+44 1753 525678'
  },
  {
    place_id: 'sample_5',
    name: 'PureGym Slough',
    slug: 'puregym-slough',
    types: ['gym', 'health', 'establishment'],
    lat: 51.5075,
    lng: -0.5923,
    last_fetched: new Date().toISOString(),
    categories: ['gyms'],
    formatted_address: 'Trading Estate, Slough SL1 4QP, UK',
    rating: 4.0,
    user_ratings_total: 312,
    neighbourhood: 'Slough',
    photos: [],
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 6:00 AM – 10:00 PM',
        'Tuesday: 6:00 AM – 10:00 PM',
        'Wednesday: 6:00 AM – 10:00 PM',
        'Thursday: 6:00 AM – 10:00 PM',
        'Friday: 6:00 AM – 10:00 PM',
        'Saturday: 8:00 AM – 8:00 PM',
        'Sunday: 8:00 AM – 8:00 PM'
      ]
    },
    website: 'https://www.puregym.com',
    phone: '+44 1753 526789'
  }
];

export async function GET() {
  try {
    console.log('Adding sample businesses to cache...');
    
    let addedCount = 0;
    
    for (const business of sampleBusinesses) {
      try {
        // Save the business
        await cache.savePlace(business);
        
        // Add to category
        await cache.addPlaceToCategory(business.place_id, business.categories[0]);
        
        // Add to neighbourhood
        await cache.addPlaceToNeighbourhood(business.place_id, business.neighbourhood);
        
        addedCount++;
        console.log(`Added: ${business.name}`);
        
      } catch (error) {
        console.error(`Error adding ${business.name}:`, error);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully added ${addedCount} sample businesses`,
      businesses: sampleBusinesses.map(business => ({
        name: business.name,
        category: business.categories[0],
        rating: business.rating,
        address: business.formatted_address
      }))
    });
    
  } catch (error) {
    console.error('Error adding sample businesses:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to add sample businesses',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}