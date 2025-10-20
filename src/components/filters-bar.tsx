'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CITY } from '@/config/city';
import { SearchFilters } from '@/lib/types';
import { Filter, SortAsc, SortDesc, X } from 'lucide-react';

interface FiltersBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults?: number;
  className?: string;
}

export function FiltersBar({ 
  filters, 
  onFiltersChange, 
  totalResults,
  className 
}: FiltersBarProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy: sortBy as any });
  };

  const handleSortOrderChange = (sortOrder: string) => {
    onFiltersChange({ ...filters, sortOrder: sortOrder as 'asc' | 'desc' });
  };

  const handleNeighbourhoodChange = (neighbourhood: string) => {
    onFiltersChange({ 
      ...filters, 
      neighbourhood: neighbourhood === 'all' ? undefined : neighbourhood 
    });
  };

  const handleMinRatingChange = (rating: string) => {
    onFiltersChange({ 
      ...filters, 
      minRating: rating === 'all' ? undefined : parseFloat(rating) 
    });
  };

  const handleOpenNowChange = (openNow: boolean) => {
    onFiltersChange({ ...filters, openNow });
  };

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'rating',
      sortOrder: 'desc',
    });
  };

  const hasActiveFilters = filters.neighbourhood || filters.openNow || filters.minRating;

  return (
    <div className={`bg-white border-b ${className}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Results Count */}
          <div className="flex items-center gap-2">
            {totalResults !== undefined && (
              <span className="text-sm text-gray-600">
                {totalResults.toLocaleString()} results
              </span>
            )}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear filters
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSortOrderChange(filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1"
              >
                {filters.sortOrder === 'asc' ? (
                  <SortAsc className="w-4 h-4" />
                ) : (
                  <SortDesc className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Advanced Filters */}
            <DropdownMenu open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                      !
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <div className="p-2 space-y-4">
                  {/* Open Now */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Availability</label>
                    <DropdownMenuCheckboxItem
                      checked={filters.openNow || false}
                      onCheckedChange={handleOpenNowChange}
                    >
                      Open Now
                    </DropdownMenuCheckboxItem>
                  </div>

                  {/* Neighbourhood */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Area</label>
                    <Select value={filters.neighbourhood || 'all'} onValueChange={handleNeighbourhoodChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
                        {CITY.neighbourhoods.map((neighbourhood) => (
                          <SelectItem key={neighbourhood} value={neighbourhood}>
                            {neighbourhood}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Min Rating */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Minimum Rating</label>
                    <Select 
                      value={filters.minRating?.toString() || 'all'} 
                      onValueChange={handleMinRatingChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Rating</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
                        <SelectItem value="4.0">4.0+ Stars</SelectItem>
                        <SelectItem value="3.5">3.5+ Stars</SelectItem>
                        <SelectItem value="3.0">3.0+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.openNow && (
              <Badge variant="secondary" className="gap-1">
                Open Now
                <button
                  onClick={() => handleOpenNowChange(false)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.neighbourhood && (
              <Badge variant="secondary" className="gap-1">
                {filters.neighbourhood}
                <button
                  onClick={() => handleNeighbourhoodChange('all')}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.minRating && (
              <Badge variant="secondary" className="gap-1">
                {filters.minRating}+ Stars
                <button
                  onClick={() => handleMinRatingChange('all')}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
