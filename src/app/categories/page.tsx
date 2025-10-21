import Link from 'next/link';
import { Metadata } from 'next';
import { CATEGORIES } from '@/config/categories';
import { cache } from '@/lib/cache';
import { generateMetaTags } from '@/lib/seo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = generateMetaTags({
  title: 'All Categories - Slough Guide',
  description: 'Browse all business categories in Slough. Find restaurants, services, shops and more.',
  canonical: '/categories',
});

export default async function CategoriesPage() {
  const categoryCounts = await cache.getCategoryCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Categories</h1>
          <p className="text-lg text-gray-600">
            Explore all business categories available in Slough
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group block"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-3xl">{category.icon}</span>
                    <div>
                      <div className="text-xl">{category.label}</div>
                      <div className="text-sm text-gray-500 font-normal">
                        {categoryCounts[category.id] || 0} businesses
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
