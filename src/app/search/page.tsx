'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchPlacesAction } from '@/lib/actions';
import { SearchFilters, SearchResults } from '@/lib/types';
import { BusinessCard } from '@/components/business-card';
import { FiltersBar } from '@/components/filters-bar';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResults>({
    places: [],
    total: 0,
    page: 1,
    limit: 20,
    hasMore: false,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'rating',
    sortOrder: 'desc',
  });

  const performSearch = async (searchQuery: string, searchFilters: SearchFilters) => {
    setLoading(true);
    try {
      const searchResults = await searchPlacesAction(searchQuery, searchFilters, 1, 20);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults({
        places: [],
        total: 0,
        page: 1,
        limit: 20,
        hasMore: false,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch(query, filters);
    }
  }, [query, filters]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? `Search results for "${query}"` : 'Search'}
          </h1>
          {query && (
            <p className="text-gray-600">
              {loading ? 'Searching...' : `${results.total} results found`}
            </p>
          )}
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <form action="/search" method="GET" className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search businesses, services, restaurants..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
        </div>

        {/* Filters */}
        {query && (
          <FiltersBar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            totalResults={results.total}
            className="mb-8"
          />
        )}

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Searching...</span>
          </div>
        ) : query ? (
          results.places.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.places.map((place) => (
                <BusinessCard key={place.place_id} place={place} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any businesses matching "{query}". Try different keywords or browse our categories.
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Suggestions:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Check your spelling</li>
                    <li>• Try more general terms</li>
                    <li>• Browse categories instead</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Start your search
              </h3>
              <p className="text-gray-600">
                Enter a business name, service, or category to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
