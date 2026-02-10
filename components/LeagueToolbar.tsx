'use client'

import { useState } from 'react'

interface LeagueToolbarProps {
  onSortChange: (sortBy: string) => void
  onFilterChange: (area: string) => void
  currentSort: string
  currentFilter: string
  totalCount: number
}

const AREAS = [
  { value: 'all', label: 'All Areas' },
  { value: 'slough', label: 'Slough' },
  { value: 'horndean', label: 'Horndean' },
  { value: 'cowplain', label: 'Langley' },
  { value: 'purbrook', label: 'Chalvey' },
  { value: 'clanfield', label: 'Clanfield' },
  { value: 'denmead', label: 'Cippenham' }
]

const SORT_OPTIONS = [
  { value: 'score', label: 'Overall Score' },
  { value: 'rating', label: 'Rating' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'name', label: 'Name A-Z' },
  { value: 'area', label: 'Area' }
]

export default function LeagueToolbar({ 
  onSortChange, 
  onFilterChange, 
  currentSort, 
  currentFilter,
  totalCount 
}: LeagueToolbarProps) {
  const [isSticky, setIsSticky] = useState(false)

  // Handle sticky behavior
  const handleScroll = () => {
    const scrollTop = window.scrollY
    setIsSticky(scrollTop > 200)
  }

  // Add scroll listener
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
  }

  return (
    <div className={`bg-white border-b border-gray-200 transition-all duration-200 ${
      isSticky ? 'sticky top-0 z-40 shadow-md' : ''
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Results count */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">{totalCount}</span> barbers found
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Area Filter */}
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <label htmlFor="area-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Area:
              </label>
              <select
                id="area-filter"
                value={currentFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                aria-label="Filter by area"
              >
                {AREAS.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
              <label htmlFor="sort-options" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort-options"
                value={currentSort}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                aria-label="Sort barbers"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filter chips for mobile */}
        <div className="mt-3 sm:hidden">
          <div className="flex flex-wrap gap-2">
            {AREAS.slice(1).map((area) => (
              <button
                key={area.value}
                onClick={() => onFilterChange(area.value)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  currentFilter === area.value
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={`Filter by ${area.label}`}
              >
                {area.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
