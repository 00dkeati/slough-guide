'use client'

import React from 'react'
import { Barber } from '@/lib/barbers'

interface LeagueToolbarProps {
  barbers: Barber[]
  onSort: (sortKey: keyof Barber | 'overallScore', direction: 'asc' | 'desc') => void
  onFilter: (area: string) => void
  onReset: () => void
  currentSort: { key: keyof Barber | 'overallScore'; direction: 'asc' | 'desc' }
  currentFilter: string
}

const areas = ['All', 'Slough', 'Horndean', 'Langley', 'Chalvey', 'Clanfield', 'Cippenham']

const LeagueToolbar: React.FC<LeagueToolbarProps> = ({
  onSort,
  onFilter,
  onReset,
  currentSort,
  currentFilter,
}) => {
  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Sort Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 mr-2">Sort by:</span>
            <select
              value={`${currentSort.key}-${currentSort.direction}`}
              onChange={(e) => {
                const [key, direction] = e.target.value.split('-') as [keyof Barber | 'overallScore', 'asc' | 'desc']
                onSort(key, direction)
              }}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              aria-label="Sort barbers"
            >
              <option value="overallScore-desc">Overall Score (High to Low)</option>
              <option value="overallScore-asc">Overall Score (Low to High)</option>
              <option value="rating-desc">Rating (High to Low)</option>
              <option value="rating-asc">Rating (Low to High)</option>
              <option value="review_count-desc">Reviews (Most to Least)</option>
              <option value="review_count-asc">Reviews (Least to Most)</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
              <option value="area-asc">Area (A to Z)</option>
              <option value="area-desc">Area (Z to A)</option>
            </select>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-700 mr-2">Filter by Area:</span>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => onFilter(area)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset transition-colors ${
                    currentFilter === area
                      ? 'bg-green-600 text-white ring-green-600 shadow-sm'
                      : 'bg-white text-gray-700 ring-gray-300 hover:bg-gray-50 hover:ring-gray-400'
                  }`}
                  aria-label={`Filter by ${area}`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            aria-label="Reset filters and sorting"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default LeagueToolbar
