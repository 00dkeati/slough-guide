import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CATEGORIES } from '@/config/categories';
import { Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-6">🔍</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-8">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
            </p>
            
            <div className="space-y-4">
              <div>
                <Link href="/search">
                  <Button className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Search for Businesses
                  </Button>
                </Link>
              </div>
              
              <div>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {CATEGORIES.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.id}`}
                    className="block p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
