'use client'

import React, { useState, useMemo } from 'react'
import { Barber } from '@/lib/barbers'
import LeagueToolbar from './LeagueToolbar'
import BarberTable from './BarberTable'
import BarberCards from './BarberCards'

interface InteractiveLeagueTableProps {
  barbers: Barber[]
}

const InteractiveLeagueTable: React.FC<InteractiveLeagueTableProps> = ({ barbers }) => {
  const [sortKey, setSortKey] = useState<keyof Barber | 'overallScore'>('overallScore')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterArea, setFilterArea] = useState<string>('All')

  const handleSort = (key: keyof Barber | 'overallScore', direction: 'asc' | 'desc') => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const handleFilter = (area: string) => {
    setFilterArea(area)
  }

  const handleReset = () => {
    setSortKey('overallScore')
    setSortDirection('desc')
    setFilterArea('All')
  }

  const filteredAndSortedBarbers = useMemo(() => {
    let filtered = barbers

    // Apply area filter
    if (filterArea !== 'All') {
      filtered = barbers.filter(barber => 
        barber.area?.toLowerCase().includes(filterArea.toLowerCase())
      )
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any
      let bValue: any

      if (sortKey === 'overallScore') {
        aValue = a.overallScore || 0
        bValue = b.overallScore || 0
      } else {
        aValue = a[sortKey]
        bValue = b[sortKey]
      }

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortDirection === 'asc' ? comparison : -comparison
      }

      // Handle numeric comparison
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    // Re-assign ranks based on current sort order
    return sorted.map((barber, index) => ({
      ...barber,
      rank: index + 1
    }))
  }, [barbers, sortKey, sortDirection, filterArea])

  return (
    <div className="space-y-6">
      <LeagueToolbar
        barbers={filteredAndSortedBarbers}
        onSort={handleSort}
        onFilter={handleFilter}
        onReset={handleReset}
        currentSort={{ key: sortKey, direction: sortDirection }}
        currentFilter={filterArea}
      />
      
      <BarberTable barbers={filteredAndSortedBarbers} />
      <BarberCards barbers={filteredAndSortedBarbers} />
    </div>
  )
}

export default InteractiveLeagueTable
