'use client'

import { useState, useMemo } from 'react'
import LeagueToolbar from './LeagueToolbar'
import BarberTable from './BarberTable'
import BarberCards from './BarberCards'
import { Barber, filterBarbersByArea, sortBarbers } from '@/lib/barbers'

interface BarberLeagueTableProps {
  barbers: Barber[]
}

export default function BarberLeagueTable({ barbers }: BarberLeagueTableProps) {
  const [sortBy, setSortBy] = useState('score')
  const [filterArea, setFilterArea] = useState('all')

  // Filter and sort barbers
  const filteredAndSortedBarbers = useMemo(() => {
    const filtered = filterBarbersByArea(barbers, filterArea)
    return sortBarbers(filtered, sortBy)
  }, [barbers, filterArea, sortBy])

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
  }

  const handleFilterChange = (newArea: string) => {
    setFilterArea(newArea)
  }

  if (barbers.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-gray-500">
          <div className="text-4xl mb-4">✂️</div>
          <h3 className="text-lg font-semibold mb-2">No Barbers Found</h3>
          <p>We couldn't find any barbers in the Slough area at the moment.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <LeagueToolbar
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        currentSort={sortBy}
        currentFilter={filterArea}
        totalCount={filteredAndSortedBarbers.length}
      />

      {/* Results */}
      <div>
        {/* Desktop Table */}
        <BarberTable barbers={filteredAndSortedBarbers} />
        
        {/* Mobile Cards */}
        <BarberCards barbers={filteredAndSortedBarbers} />
      </div>

      {/* How We Ranked Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">How We Ranked</h3>
        <div className="prose max-w-none text-gray-700">
          <p className="mb-4">
            Our ranking system combines multiple factors to give you the most accurate assessment of each barber:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li><strong>Rating (70% weight):</strong> Google rating normalized to 0-100 scale</li>
            <li><strong>Review Count (30% weight):</strong> Number of reviews using logarithmic scale (0-1000 reviews = 0-100)</li>
          </ul>
          <p className="text-sm text-gray-600">
            <strong>Formula:</strong> Overall Score = (Rating/5 × 100 × 0.7) + (log₁₀(reviews+1)/log₁₀(1000) × 100 × 0.3)
          </p>
          <p className="text-sm text-gray-600 mt-2">
            If a barber is missing rating or review data, we calculate the score proportionally with available data.
          </p>
        </div>
      </div>
    </div>
  )
}
