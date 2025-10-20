import { MetadataRoute } from 'next';
import { KVStore } from '@/lib/kv';
import { CATEGORIES } from '@/config/categories';
import { CITY } from '@/config/city';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_CANONICAL || 'https://www.sloughguide.co.uk';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((category) => ({
    url: `${baseUrl}/category/${category.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // Intent pages
  const intentPages: MetadataRoute.Sitemap = CATEGORIES.flatMap((category) =>
    category.intents.map((intent) => ({
      url: `${baseUrl}/category/${category.id}/${intent}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }))
  );

  // Neighbourhood pages
  const neighbourhoodPages: MetadataRoute.Sitemap = CITY.neighbourhoods.map((neighbourhood) => ({
    url: `${baseUrl}/neighbourhood/${neighbourhood.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // Neighbourhood × Category pages
  const neighbourhoodCategoryPages: MetadataRoute.Sitemap = CITY.neighbourhoods.flatMap((neighbourhood) =>
    CATEGORIES.slice(0, 10).map((category) => ({
      url: `${baseUrl}/neighbourhood/${neighbourhood.toLowerCase().replace(/\s+/g, '-')}/${category.id}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    }))
  );

  // Business pages (top 5000 by rating)
  let businessPages: MetadataRoute.Sitemap = [];
  try {
    const allPlaces = await KVStore.getPlaceCount();
    if (allPlaces > 0) {
      // Get top rated places from each category
      const topPlaces = await Promise.all(
        CATEGORIES.slice(0, 10).map(async (category) => {
          const places = await KVStore.getTopRatedPlaces(category.id, 50, 5);
          return places.map((place) => ({
            url: `${baseUrl}/business/${place.slug}`,
            lastModified: new Date(place.last_fetched),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          }));
        })
      );
      businessPages = topPlaces.flat().slice(0, 5000);
    }
  } catch (error) {
    console.error('Error generating business pages for sitemap:', error);
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...intentPages,
    ...neighbourhoodPages,
    ...neighbourhoodCategoryPages,
    ...businessPages,
  ];
}
