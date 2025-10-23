import { NextResponse } from 'next/server';
import { sampleBusinesses } from '../../../data/sample-businesses';

export async function GET() {
  try {
    // Add static additional businesses
    const staticBusinesses = [
      {
        place_id: 'static_1',
        name: 'The Golden Dragon',
        slug: 'the-golden-dragon',
        types: ['restaurant'],
        lat: 51.5115,
        lng: -0.5945,
        last_fetched: new Date().toISOString(),
        categories: ['restaurants'],
        formatted_address: 'High Street, Slough SL1 1DH, UK',
        vicinity: 'Slough',
        phone: '+44 1753 521234',
        rating: 4.3,
        user_ratings_total: 89,
        price_level: 2,
        business_status: 'OPERATIONAL',
        opening_hours: { open_now: true, weekday_text: ['Monday: 12:00 PM – 10:00 PM'] },
        photos: []
      },
      {
        place_id: 'static_2',
        name: 'Slough Pizza Palace',
        slug: 'slough-pizza-palace',
        types: ['meal_takeaway'],
        lat: 51.5120,
        lng: -0.5930,
        last_fetched: new Date().toISOString(),
        categories: ['takeaways'],
        formatted_address: 'Windsor Road, Slough SL1 2EJ, UK',
        vicinity: 'Slough',
        phone: '+44 1753 523456',
        rating: 4.1,
        user_ratings_total: 156,
        price_level: 1,
        business_status: 'OPERATIONAL',
        opening_hours: { open_now: true, weekday_text: ['Monday: 5:00 PM – 11:00 PM'] },
        photos: []
      },
      {
        place_id: 'static_3',
        name: 'Cafe Central',
        slug: 'cafe-central',
        types: ['cafe'],
        lat: 51.5098,
        lng: -0.5958,
        last_fetched: new Date().toISOString(),
        categories: ['cafes'],
        formatted_address: 'Queensmere Shopping Centre, Slough SL1 1DB, UK',
        vicinity: 'Slough',
        phone: '+44 1753 524567',
        rating: 4.2,
        user_ratings_total: 234,
        price_level: 2,
        business_status: 'OPERATIONAL',
        opening_hours: { open_now: true, weekday_text: ['Monday: 7:00 AM – 7:00 PM'] },
        photos: []
      },
      {
        place_id: 'static_4',
        name: 'The Crown Inn',
        slug: 'the-crown-inn',
        types: ['bar'],
        lat: 51.5102,
        lng: -0.5952,
        last_fetched: new Date().toISOString(),
        categories: ['pubs'],
        formatted_address: 'High Street, Slough SL1 1DH, UK',
        vicinity: 'Slough',
        phone: '+44 1753 525678',
        rating: 4.0,
        user_ratings_total: 178,
        price_level: 2,
        business_status: 'OPERATIONAL',
        opening_hours: { open_now: false, weekday_text: ['Monday: 12:00 PM – 11:00 PM'] },
        photos: []
      },
      {
        place_id: 'static_5',
        name: 'FitLife Gym',
        slug: 'fitlife-gym',
        types: ['gym'],
        lat: 51.5125,
        lng: -0.5925,
        last_fetched: new Date().toISOString(),
        categories: ['gyms'],
        formatted_address: 'Trading Estate, Slough SL1 4QP, UK',
        vicinity: 'Slough',
        phone: '+44 1753 526789',
        rating: 4.4,
        user_ratings_total: 312,
        price_level: 2,
        business_status: 'OPERATIONAL',
        opening_hours: { open_now: true, weekday_text: ['Monday: 6:00 AM – 10:00 PM'] },
        photos: []
      }
    ];
    
    const totalBusinesses = [...sampleBusinesses, ...staticBusinesses];
    
    return NextResponse.json({ 
      success: true, 
      count: totalBusinesses.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in business-count API:', error);
    return NextResponse.json({ 
      success: false, 
      count: sampleBusinesses.length,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
