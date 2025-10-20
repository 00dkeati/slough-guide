export const CITY = {
  name: "Slough",
  country: "UK",
  lat: 51.510, // central Slough (approx)
  lng: -0.595,
  postcodes: ["SL1", "SL2", "SL3", "SL95"],
  neighbourhoods: [
    "Cippenham",
    "Chalvey", 
    "Britwell",
    "Wexham",
    "Langley",
    "Upton",
    "Salt Hill",
    "Manor Park",
    "Colnbrook",
    "Poyle"
  ],
  radiusMetersDefault: 7000
} as const;

// Neighbourhood coordinates for distance calculations
export const NEIGHBOURHOOD_COORDS: Record<string, { lat: number; lng: number }> = {
  "Cippenham": { lat: 51.520, lng: -0.610 },
  "Chalvey": { lat: 51.505, lng: -0.580 },
  "Britwell": { lat: 51.525, lng: -0.620 },
  "Wexham": { lat: 51.540, lng: -0.580 },
  "Langley": { lat: 51.500, lng: -0.550 },
  "Upton": { lat: 51.515, lng: -0.600 },
  "Salt Hill": { lat: 51.510, lng: -0.590 },
  "Manor Park": { lat: 51.520, lng: -0.600 },
  "Colnbrook": { lat: 51.480, lng: -0.520 },
  "Poyle": { lat: 51.480, lng: -0.530 }
};
