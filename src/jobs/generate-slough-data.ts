#!/usr/bin/env tsx

import { aiScraper } from '../lib/ai-scraper';
import { cache } from '../lib/cache';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Comprehensive Slough business data generator
async function generateSloughBusinessData() {
  console.log('🚀 Starting comprehensive Slough business data generation...');
  
  try {
    // Step 1: Scrape businesses using AI
    console.log('📡 Scraping businesses with AI...');
    const businesses = await aiScraper.scrapeSloughBusinesses();
    
    console.log(`📊 Found ${businesses.length} businesses`);
    
    // Step 2: Save businesses to cache
    console.log('💾 Saving businesses to cache...');
    for (const business of businesses) {
      await cache.savePlace(business);
      
      // Add to categories
      for (const category of business.types) {
        await cache.addPlaceToCategory(business.place_id, category);
      }
      
      // Add to neighbourhoods (simplified for now)
      await cache.addPlaceToNeighbourhood(business.place_id, 'Slough');
    }
    
    // Step 3: Generate individual business pages
    console.log('📄 Generating individual business pages...');
    await generateBusinessPages(businesses);
    
    // Step 4: Generate category pages
    console.log('📂 Generating category pages...');
    await generateCategoryPages(businesses);
    
    // Step 5: Generate neighbourhood pages
    console.log('🏘️ Generating neighbourhood pages...');
    await generateNeighbourhoodPages(businesses);
    
    // Step 6: Update sitemap
    console.log('🗺️ Updating sitemap...');
    await updateSitemap(businesses);
    
    console.log('✅ Slough business data generation completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Businesses: ${businesses.length}`);
    console.log(`   - Categories: ${new Set(businesses.flatMap(b => b.types)).size}`);
    console.log(`   - Pages generated: ${businesses.length + 22 + 10}`); // businesses + categories + neighbourhoods
    
  } catch (error) {
    console.error('❌ Error generating business data:', error);
    process.exit(1);
  }
}

// Generate individual business pages
async function generateBusinessPages(businesses: any[]) {
  const pagesDir = join(process.cwd(), 'src', 'app', 'business');
  
  for (const business of businesses) {
    const slug = business.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const pageDir = join(pagesDir, slug);
    
    // Create directory
    mkdirSync(pageDir, { recursive: true });
    
    // Generate page content
    const pageContent = generateBusinessPageContent(business);
    
    // Write page file
    writeFileSync(join(pageDir, 'page.tsx'), pageContent);
    
    console.log(`📄 Generated page for ${business.name}`);
  }
}

// Generate business page content
function generateBusinessPageContent(business: any): string {
  return `import { Metadata } from 'next';
import { cache } from '../../../lib/cache';
import { notFound } from 'next/navigation';
import { RatingStars } from '../../../components/ui/rating-stars';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Phone, MapPin, Globe, Clock, Star } from 'lucide-react';

interface BusinessPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const business = await cache.findPlaceBySlug(params.slug);
  
  if (!business) {
    return {
      title: 'Business Not Found | Slough Guide',
      description: 'The requested business could not be found.'
    };
  }

  return {
    title: business.seoContent?.title || \`\${business.name} - \${business.types[0]} in Slough | Slough Guide\`,
    description: business.seoContent?.metaDescription || business.aiGeneratedDescription,
    keywords: business.seoContent?.keywords,
    openGraph: {
      title: business.name,
      description: business.aiGeneratedDescription,
      images: business.photos.length > 0 ? [business.photos[0].photoReference] : [],
      type: 'website',
    },
    other: {
      'business:contact_data:phone_number': business.internationalPhoneNumber,
      'business:contact_data:website': business.website,
      'business:contact_data:street_address': business.formattedAddress,
      'business:contact_data:locality': 'Slough',
      'business:contact_data:region': 'Berkshire',
      'business:contact_data:country_name': 'United Kingdom',
    }
  };
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const business = await cache.findPlaceBySlug(params.slug);
  
  if (!business) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <a href="/" className="hover:text-blue-600">Slough Guide</a>
            <span>/</span>
            <a href="/categories" className="hover:text-blue-600">Categories</a>
            <span>/</span>
            <a href="/category/\${business.types[0]}" className="hover:text-blue-600 capitalize">
              {business.types[0]}
            </a>
            <span>/</span>
            <span className="text-gray-900">{business.name}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{business.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            {business.rating > 0 && (
              <div className="flex items-center gap-2">
                <RatingStars rating={business.rating} />
                <span className="text-sm text-gray-600">
                  {business.rating.toFixed(1)} ({business.userRatingsTotal} reviews)
                </span>
              </div>
            )}
            
            {business.priceLevel > 0 && (
              <div className="flex items-center gap-1">
                {Array.from({ length: business.priceLevel }, (_, i) => (
                  <span key={i} className="text-green-600">£</span>
                ))}
              </div>
            )}
            
            <Badge variant="secondary" className="capitalize">
              {business.types[0]}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About {business.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {business.aiGeneratedDescription}
                </p>
              </CardContent>
            </Card>

            {/* Photos */}
            {business.photos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {business.photos.slice(0, 6).map((photo: any, index: number) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={photo.photoReference}
                          alt={\`\${business.name} photo \${index + 1}\`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {business.scrapedReviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {business.scrapedReviews.map((review: any, index: number) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-2 mb-2">
                          <RatingStars rating={review.rating} />
                          <span className="text-sm font-medium">{review.author}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.text}</p>
                        {review.helpful > 0 && (
                          <div className="text-sm text-gray-500 mt-2">
                            {review.helpful} people found this helpful
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {business.amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {business.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {business.formattedAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-700">{business.formattedAddress}</p>
                    </div>
                  </div>
                )}
                
                {business.internationalPhoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <a 
                      href={\`tel:\${business.internationalPhoneNumber}\`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {business.internationalPhoneNumber}
                    </a>
                  </div>
                )}
                
                {business.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-500" />
                    <a 
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            {Object.keys(business.socialMediaLinks).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Follow Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    {business.socialMediaLinks.facebook && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={business.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer">
                          Facebook
                        </a>
                      </Button>
                    )}
                    {business.socialMediaLinks.instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={business.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer">
                          Instagram
                        </a>
                      </Button>
                    )}
                    {business.socialMediaLinks.twitter && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={business.socialMediaLinks.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Opening Hours */}
            {Object.keys(business.openingHours).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Opening Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(business.openingHours).map(([day, hours]: [string, any]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="font-medium capitalize">{day}</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Structured Data */}
        {business.seoContent?.structuredData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(business.seoContent.structuredData)
            }}
          />
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const businesses = await cache.getAllPlaces();
  return businesses.map((business) => ({
    slug: business.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  }));
}`;
}

// Generate category pages
async function generateCategoryPages(businesses: any[]) {
  const categories = [...new Set(businesses.flatMap(b => b.types))];
  
  for (const category of categories) {
    const categoryBusinesses = businesses.filter(b => b.types.includes(category));
    
    // Generate category page content
    const pageContent = generateCategoryPageContent(category, categoryBusinesses);
    
    // Write category page
    const pageDir = join(process.cwd(), 'src', 'app', 'category', category);
    mkdirSync(pageDir, { recursive: true });
    writeFileSync(join(pageDir, 'page.tsx'), pageContent);
    
    console.log(`📂 Generated category page for ${category}`);
  }
}

// Generate category page content
function generateCategoryPageContent(category: string, businesses: any[]): string {
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  
  return `import { Metadata } from 'next';
import { cache } from '../../../lib/cache';
import { BusinessCard } from '../../../components/business-card';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

export const metadata: Metadata = {
  title: \`\${categoryTitle} in Slough | Slough Guide\`,
  description: \`Find the best \${category} in Slough. Discover top-rated \${category} businesses with reviews, photos, and contact information.\`,
  keywords: \`\${category}, \${category} Slough, best \${category} Slough, \${category} near me\`,
};

export default async function CategoryPage() {
  const businesses = await cache.getCategoryPlaces(category);
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <a href="/" className="hover:text-blue-600">Slough Guide</a>
            <span>/</span>
            <a href="/categories" className="hover:text-blue-600">Categories</a>
            <span>/</span>
            <span className="text-gray-900">{categoryTitle}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryTitle} in Slough
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover the best {category} businesses in Slough. Find top-rated {category} with reviews, photos, and contact information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business.placeId} business={business} />
          ))}
        </div>

        {businesses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No {category} businesses found in Slough.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}`;
}

// Generate neighbourhood pages
async function generateNeighbourhoodPages(businesses: any[]) {
  const neighbourhoods = ['Cippenham', 'Chalvey', 'Britwell', 'Wexham', 'Langley', 'Upton', 'Salt Hill', 'Manor Park', 'Colnbrook', 'Poyle'];
  
  for (const neighbourhood of neighbourhoods) {
    // For now, we'll show all businesses in each neighbourhood
    // In a real implementation, you'd filter by actual neighbourhood
    
    const pageContent = generateNeighbourhoodPageContent(neighbourhood, businesses);
    
    // Write neighbourhood page
    const pageDir = join(process.cwd(), 'src', 'app', 'neighbourhood', neighbourhood.toLowerCase().replace(' ', '-'));
    mkdirSync(pageDir, { recursive: true });
    writeFileSync(join(pageDir, 'page.tsx'), pageContent);
    
    console.log(`🏘️ Generated neighbourhood page for ${neighbourhood}`);
  }
}

// Generate neighbourhood page content
function generateNeighbourhoodPageContent(neighbourhood: string, businesses: any[]): string {
  return `import { Metadata } from 'next';
import { BusinessCard } from '../../../components/business-card';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

export const metadata: Metadata = {
  title: \`Businesses in \${neighbourhood}, Slough | Slough Guide\`,
  description: \`Discover local businesses in \${neighbourhood}, Slough. Find restaurants, shops, services, and more in your neighbourhood.\`,
  keywords: \`\${neighbourhood}, Slough, local businesses, \${neighbourhood} Slough\`,
};

export default async function NeighbourhoodPage() {
  // In a real implementation, you'd filter businesses by neighbourhood
  const businesses = []; // Placeholder

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <a href="/" className="hover:text-blue-600">Slough Guide</a>
            <span>/</span>
            <a href="/neighbourhoods" className="hover:text-blue-600">Neighbourhoods</a>
            <span>/</span>
            <span className="text-gray-900">{neighbourhood}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Businesses in {neighbourhood}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover local businesses in {neighbourhood}, Slough. Find restaurants, shops, services, and more in your neighbourhood.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard key={business.placeId} business={business} />
          ))}
        </div>

        {businesses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No businesses found in {neighbourhood}.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}`;
}

// Update sitemap
async function updateSitemap(businesses: any[]) {
  const sitemapContent = generateSitemapContent(businesses);
  writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemapContent);
  console.log('🗺️ Updated sitemap.xml');
}

// Generate sitemap content
function generateSitemapContent(businesses: any[]): string {
  const baseUrl = 'https://www.sloughguide.co.uk';
  const categories = [...new Set(businesses.flatMap(b => b.types))];
  const neighbourhoods = ['Cippenham', 'Chalvey', 'Britwell', 'Wexham', 'Langley', 'Upton', 'Salt Hill', 'Manor Park', 'Colnbrook', 'Poyle'];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/categories</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/neighbourhoods</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;

  // Add business pages
  businesses.forEach(business => {
    const slug = business.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    sitemap += `
  <url>
    <loc>${baseUrl}/business/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // Add category pages
  categories.forEach(category => {
    sitemap += `
  <url>
    <loc>${baseUrl}/category/${category}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Add neighbourhood pages
  neighbourhoods.forEach(neighbourhood => {
    const slug = neighbourhood.toLowerCase().replace(' ', '-');
    sitemap += `
  <url>
    <loc>${baseUrl}/neighbourhood/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Run the data generation
generateSloughBusinessData();
