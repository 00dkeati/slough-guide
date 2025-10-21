// Static business data for Slough
export const sampleBusinesses = [
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
    vicinity: 'Slough',
    phone: '+44 1753 521234',
    website: 'https://www.crownandcushion-slough.co.uk',
    rating: 4.2,
    user_ratings_total: 156,
    price_level: 2,
    business_status: 'OPERATIONAL',
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
    photos: []
  },
  {
    place_id: 'sample_2',
    name: 'Slough Kebab House',
    slug: 'slough-kebab-house',
    types: ['meal_takeaway', 'food', 'establishment'],
    lat: 51.5115,
    lng: -0.5940,
    last_fetched: new Date().toISOString(),
    categories: ['takeaways'],
    formatted_address: 'Windsor Road, Slough SL1 2EJ, UK',
    vicinity: 'Slough',
    phone: '+44 1753 523456',
    website: undefined,
    rating: 4.0,
    user_ratings_total: 89,
    price_level: 1,
    business_status: 'OPERATIONAL',
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
    photos: []
  },
  {
    place_id: 'sample_3',
    name: 'Costa Coffee',
    slug: 'costa-coffee-slough',
    types: ['cafe', 'food', 'establishment'],
    lat: 51.5095,
    lng: -0.5960,
    last_fetched: new Date().toISOString(),
    categories: ['cafes'],
    formatted_address: 'Queensmere Shopping Centre, Slough SL1 1DB, UK',
    vicinity: 'Slough',
    phone: '+44 1753 524567',
    website: 'https://www.costa.co.uk',
    rating: 4.1,
    user_ratings_total: 234,
    price_level: 2,
    business_status: 'OPERATIONAL',
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
    photos: []
  },
  {
    place_id: 'sample_4',
    name: 'The Red Lion',
    slug: 'the-red-lion-slough',
    types: ['bar', 'food', 'establishment'],
    lat: 51.5100,
    lng: -0.5955,
    last_fetched: new Date().toISOString(),
    categories: ['pubs'],
    formatted_address: 'High Street, Slough SL1 1DH, UK',
    vicinity: 'Slough',
    phone: '+44 1753 525678',
    website: 'https://www.redlion-slough.co.uk',
    rating: 4.3,
    user_ratings_total: 178,
    price_level: 2,
    business_status: 'OPERATIONAL',
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
    photos: []
  },
  {
    place_id: 'sample_5',
    name: 'PureGym Slough',
    slug: 'puregym-slough',
    types: ['gym', 'health', 'establishment'],
    lat: 51.5120,
    lng: -0.5930,
    last_fetched: new Date().toISOString(),
    categories: ['gyms'],
    formatted_address: 'Trading Estate, Slough SL1 4QP, UK',
    vicinity: 'Slough',
    phone: '+44 1753 526789',
    website: 'https://www.puregym.com',
    rating: 4.0,
    user_ratings_total: 312,
    price_level: 2,
    business_status: 'OPERATIONAL',
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
    photos: []
  },
  {
    place_id: 'sample_6',
    name: 'Tony\'s Barber Shop',
    slug: 'tonys-barber-shop',
    types: ['hair_care', 'beauty_salon', 'establishment'],
    lat: 51.5110,
    lng: -0.5945,
    last_fetched: new Date().toISOString(),
    categories: ['barbers'],
    formatted_address: 'Church Street, Slough SL1 2HJ, UK',
    vicinity: 'Slough',
    phone: '+44 1753 527890',
    website: undefined,
    rating: 4.5,
    user_ratings_total: 67,
    price_level: 1,
    business_status: 'OPERATIONAL',
    opening_hours: {
      open_now: false,
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
    photos: []
  },
  {
    place_id: 'sample_7',
    name: 'Slough Hair Studio',
    slug: 'slough-hair-studio',
    types: ['hair_care', 'beauty_salon', 'establishment'],
    lat: 51.5102,
    lng: -0.5952,
    last_fetched: new Date().toISOString(),
    categories: ['hairdressers'],
    formatted_address: 'High Street, Slough SL1 1DH, UK',
    vicinity: 'Slough',
    phone: '+44 1753 528901',
    website: 'https://www.sloughhairstudio.co.uk',
    rating: 4.3,
    user_ratings_total: 98,
    price_level: 2,
    business_status: 'OPERATIONAL',
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 9:00 AM – 7:00 PM',
        'Tuesday: 9:00 AM – 7:00 PM',
        'Wednesday: 9:00 AM – 7:00 PM',
        'Thursday: 9:00 AM – 7:00 PM',
        'Friday: 9:00 AM – 8:00 PM',
        'Saturday: 9:00 AM – 6:00 PM',
        'Sunday: 10:00 AM – 4:00 PM'
      ]
    },
    photos: []
  },
  {
    place_id: 'sample_8',
    name: 'Slough Plumbing Services',
    slug: 'slough-plumbing-services',
    types: ['plumber', 'home_goods_store', 'establishment'],
    lat: 51.5125,
    lng: -0.5925,
    last_fetched: new Date().toISOString(),
    categories: ['plumbers'],
    formatted_address: 'Industrial Estate, Slough SL1 4QP, UK',
    vicinity: 'Slough',
    phone: '+44 1753 529012',
    website: 'https://www.sloughplumbing.co.uk',
    rating: 4.4,
    user_ratings_total: 145,
    price_level: 2,
    business_status: 'OPERATIONAL',
    opening_hours: {
      open_now: true,
      weekday_text: [
        'Monday: 8:00 AM – 6:00 PM',
        'Tuesday: 8:00 AM – 6:00 PM',
        'Wednesday: 8:00 AM – 6:00 PM',
        'Thursday: 8:00 AM – 6:00 PM',
        'Friday: 8:00 AM – 6:00 PM',
        'Saturday: 9:00 AM – 4:00 PM',
        'Sunday: Emergency only'
      ]
    },
    photos: []
  }
];