import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';

// Sample businesses for Slough
const sampleBusinesses = [
  {
    place_id: 'sample_1',
    name: 'The Crown & Cushion',
    formatted_address: 'High Street, Slough SL1 1DH, UK',
    rating: 4.2,
    user_ratings_total: 156,
    types: ['restaurant', 'food', 'establishment'],
    slug: 'the-crown-cushion',
    categories: ['restaurants'],
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
    international_phone_number: '+44 1753 521234'
  },
  {
    place_id: 'sample_2',
    name: 'Slough Kebab House',
    formatted_address: 'Windsor Road, Slough SL1 2EJ, UK',
    rating: 4.0,
    user_ratings_total: 89,
    types: ['meal_takeaway', 'food', 'establishment'],
    slug: 'slough-kebab-house',
    categories: ['takeaways'],
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
    international_phone_number: '+44 1753 523456'
  },
  {
    place_id: 'sample_3',
    name: 'Costa Coffee',
    formatted_address: 'Queensmere Shopping Centre, Slough SL1 1DB, UK',
    rating: 4.1,
    user_ratings_total: 234,
    types: ['cafe', 'food', 'establishment'],
    slug: 'costa-coffee-slough',
    categories: ['cafes'],
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
    international_phone_number: '+44 1753 524567'
  },
  {
    place_id: 'sample_4',
    name: 'The Red Lion',
    formatted_address: 'High Street, Slough SL1 1DH, UK',
    rating: 4.3,
    user_ratings_total: 178,
    types: ['bar', 'food', 'establishment'],
    slug: 'the-red-lion-slough',
    categories: ['pubs'],
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
    international_phone_number: '+44 1753 525678'
  },
  {
    place_id: 'sample_5',
    name: 'PureGym Slough',
    formatted_address: 'Trading Estate, Slough SL1 4QP, UK',
    rating: 4.0,
    user_ratings_total: 312,
    types: ['gym', 'health', 'establishment'],
    slug: 'puregym-slough',
    categories: ['gyms'],
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
    international_phone_number: '+44 1753 526789'
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
    
    // Set last refresh time
    cache.setLastRefresh(new Date());
    await cache.saveLastRefresh();
    
    return NextResponse.json({
      success: true,
      message: `Successfully added ${addedCount} sample businesses`,
      businesses: sampleBusinesses.map(b => ({
        name: b.name,
        category: b.categories[0],
        rating: b.rating,
        address: b.formatted_address
      }))
    });
    
  } catch (error) {
    console.error('Error adding sample businesses:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to add sample businesses',
      error: String(error)
    }, { status: 500 });
  }
}
