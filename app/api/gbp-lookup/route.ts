import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  rating: number | null;
  reviewCount: number;
  photoCount: number;
  categories: string[];
  hasWebsite: boolean;
  websiteUrl: string | null;
  phone: string | null;
  hasHours: boolean;
  hours: string[];
  isOpen: boolean | null;
  recentReviews: {
    rating: number;
    text: string;
    time: string;
    authorName: string;
  }[];
  priceLevel: number | null;
  totalPhotos: number;
}

export async function POST(request: NextRequest) {
  try {
    const { businessName, location } = await request.json();

    if (!businessName || !location) {
      return NextResponse.json(
        { error: 'Business name and location are required' },
        { status: 400 }
      );
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return NextResponse.json(
        { error: 'Google Places API not configured' },
        { status: 500 }
      );
    }

    // Step 1: Search for the business using Text Search
    const searchQuery = `${businessName} ${location}`;
    const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)}&key=${GOOGLE_PLACES_API_KEY}`;
    
    const searchResponse = await fetch(textSearchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
      return NextResponse.json(
        { error: 'Business not found. Please check the name and location.' },
        { status: 404 }
      );
    }

    const place = searchData.results[0];
    const placeId = place.place_id;

    // Step 2: Get detailed place information
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,rating,user_ratings_total,photos,types,website,formatted_phone_number,opening_hours,reviews,price_level,business_status&key=${GOOGLE_PLACES_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK') {
      return NextResponse.json(
        { error: 'Unable to fetch business details' },
        { status: 500 }
      );
    }

    const details = detailsData.result;

    // Format categories from types
    const categoryMap: Record<string, string> = {
      'restaurant': 'Restaurant',
      'cafe': 'Cafe',
      'bar': 'Bar',
      'store': 'Store',
      'establishment': 'Business',
      'food': 'Food & Drink',
      'point_of_interest': 'Point of Interest',
      'health': 'Health',
      'beauty_salon': 'Beauty Salon',
      'hair_care': 'Hair Salon',
      'gym': 'Gym',
      'car_repair': 'Auto Repair',
      'electrician': 'Electrician',
      'plumber': 'Plumber',
      'accounting': 'Accounting',
      'lawyer': 'Lawyer',
      'real_estate_agency': 'Real Estate',
      'dentist': 'Dentist',
      'doctor': 'Doctor',
      'pharmacy': 'Pharmacy',
      'veterinary_care': 'Veterinary',
      'lodging': 'Hotel',
      'shopping_mall': 'Shopping',
      'supermarket': 'Supermarket',
      'convenience_store': 'Convenience Store',
      'bakery': 'Bakery',
      'florist': 'Florist',
    };

    const categories = (details.types || [])
      .map((type: string) => categoryMap[type])
      .filter(Boolean)
      .slice(0, 3);

    if (categories.length === 0) {
      categories.push('Local Business');
    }

    // Format opening hours
    const hours = details.opening_hours?.weekday_text || [];
    const isOpen = details.opening_hours?.open_now ?? null;

    // Format recent reviews
    const recentReviews = (details.reviews || [])
      .slice(0, 5)
      .map((review: any) => ({
        rating: review.rating,
        text: review.text?.substring(0, 300) || '',
        time: review.relative_time_description || '',
        authorName: review.author_name || 'Anonymous',
      }));

    const placeDetails: PlaceDetails = {
      placeId,
      name: details.name,
      address: details.formatted_address,
      rating: details.rating || null,
      reviewCount: details.user_ratings_total || 0,
      photoCount: details.photos?.length || 0,
      totalPhotos: details.photos?.length || 0,
      categories,
      hasWebsite: !!details.website,
      websiteUrl: details.website || null,
      phone: details.formatted_phone_number || null,
      hasHours: hours.length > 0,
      hours,
      isOpen,
      recentReviews,
      priceLevel: details.price_level || null,
    };

    return NextResponse.json({ success: true, data: placeDetails });
  } catch (error) {
    console.error('GBP Lookup error:', error);
    return NextResponse.json(
      { error: 'Failed to lookup business' },
      { status: 500 }
    );
  }
}
