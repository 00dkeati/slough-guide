export interface Category {
  id: string;
  label: string;
  googleTypes: string[];
  intents: string[];
  icon?: string;
  description?: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "restaurants",
    label: "Restaurants",
    googleTypes: ["restaurant"],
    intents: ["best", "open-now", "near-me", "24-hours", "cheap", "top-rated"],
    icon: "🍽️",
    description: "Fine dining and casual restaurants in Slough"
  },
  {
    id: "takeaways",
    label: "Takeaways",
    googleTypes: ["meal_takeaway"],
    intents: ["best", "open-now", "near-me", "24-hours", "cheap", "top-rated"],
    icon: "🥡",
    description: "Quick takeaway food and delivery options"
  },
  {
    id: "cafes",
    label: "Cafes",
    googleTypes: ["cafe", "coffee_shop"],
    intents: ["best", "open-now", "near-me", "cheap", "top-rated"],
    icon: "☕",
    description: "Coffee shops and cafes for breakfast and lunch"
  },
  {
    id: "pubs",
    label: "Pubs",
    googleTypes: ["bar"],
    intents: ["best", "open-now", "near-me", "top-rated"],
    icon: "🍺",
    description: "Traditional pubs and bars in Slough"
  },
  {
    id: "gyms",
    label: "Gyms",
    googleTypes: ["gym"],
    intents: ["best", "open-now", "near-me", "24-hours", "cheap", "top-rated"],
    icon: "💪",
    description: "Fitness centers and gyms"
  },
  {
    id: "barbers",
    label: "Barbers",
    googleTypes: ["hair_care"],
    intents: ["best", "open-now", "near-me", "cheap", "top-rated"],
    icon: "✂️",
    description: "Men's barbershops and grooming"
  },
  {
    id: "hairdressers",
    label: "Hairdressers",
    googleTypes: ["beauty_salon", "hair_care"],
    intents: ["best", "open-now", "near-me", "cheap", "top-rated"],
    icon: "💇",
    description: "Hair salons and beauty services"
  },
  {
    id: "plumbers",
    label: "Plumbers",
    googleTypes: ["plumber"],
    intents: ["best", "open-now", "near-me", "24-hours", "top-rated"],
    icon: "🔧",
    description: "Emergency and general plumbing services"
  },
  {
    id: "electricians",
    label: "Electricians",
    googleTypes: ["electrician"],
    intents: ["best", "open-now", "near-me", "24-hours", "top-rated"],
    icon: "⚡",
    description: "Electrical contractors and emergency services"
  },
  {
    id: "builders",
    label: "Builders",
    googleTypes: ["general_contractor"],
    intents: ["best", "near-me", "top-rated"],
    icon: "🏗️",
    description: "Construction and building contractors"
  },
  {
    id: "locksmiths",
    label: "Locksmiths",
    googleTypes: ["locksmith"],
    intents: ["best", "open-now", "near-me", "24-hours", "top-rated"],
    icon: "🔐",
    description: "Emergency locksmith services"
  },
  {
    id: "car_wash",
    label: "Car Wash",
    googleTypes: ["car_wash"],
    intents: ["best", "open-now", "near-me", "cheap", "top-rated"],
    icon: "🚗",
    description: "Car cleaning and valeting services"
  },
  {
    id: "taxi",
    label: "Taxi",
    googleTypes: ["taxi_stand"],
    intents: ["best", "open-now", "near-me", "24-hours", "top-rated"],
    icon: "🚕",
    description: "Taxi services and cab companies"
  },
  {
    id: "hotels",
    label: "Hotels",
    googleTypes: ["lodging"],
    intents: ["best", "near-me", "cheap", "top-rated"],
    icon: "🏨",
    description: "Hotels and accommodation"
  },
  {
    id: "parks",
    label: "Parks",
    googleTypes: ["park"],
    intents: ["best", "near-me", "top-rated"],
    icon: "🌳",
    description: "Parks and green spaces"
  },
  {
    id: "dentists",
    label: "Dentists",
    googleTypes: ["dentist"],
    intents: ["best", "open-now", "near-me", "top-rated"],
    icon: "🦷",
    description: "Dental practices and clinics"
  },
  {
    id: "vets",
    label: "Vets",
    googleTypes: ["veterinary_care"],
    intents: ["best", "open-now", "near-me", "24-hours", "top-rated"],
    icon: "🐕",
    description: "Veterinary clinics and animal hospitals"
  },
  {
    id: "nurseries",
    label: "Nurseries",
    googleTypes: ["school"],
    intents: ["best", "near-me", "top-rated"],
    icon: "👶",
    description: "Childcare and nursery schools"
  },
  {
    id: "schools",
    label: "Schools",
    googleTypes: ["school", "secondary_school", "primary_school"],
    intents: ["best", "near-me", "top-rated"],
    icon: "🎓",
    description: "Primary and secondary schools"
  },
  {
    id: "accountants",
    label: "Accountants",
    googleTypes: ["accounting"],
    intents: ["best", "near-me", "top-rated"],
    icon: "📊",
    description: "Accounting and tax services"
  },
  {
    id: "solicitors",
    label: "Solicitors",
    googleTypes: ["lawyer"],
    intents: ["best", "near-me", "top-rated"],
    icon: "⚖️",
    description: "Legal services and solicitors"
  },
  {
    id: "estate_agents",
    label: "Estate Agents",
    googleTypes: ["real_estate_agency"],
    intents: ["best", "near-me", "top-rated"],
    icon: "🏠",
    description: "Property sales and lettings"
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.id === id);
};

export const getCategoriesByGoogleType = (googleType: string): Category[] => {
  return CATEGORIES.filter(cat => cat.googleTypes.includes(googleType));
};
