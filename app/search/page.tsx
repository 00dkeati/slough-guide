'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { getBusinesses, getCategories, getAreas } from '@/lib/db'
import BusinessCard from '@/components/BusinessCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import TopNav from "@/app/(site)/components/TopNav"
import { Business, Category, Area } from '@/lib/db'

function SearchContent() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedArea, setSelectedArea] = useState('')
  
  const searchParams = useSearchParams()

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      const [cats, areasData] = await Promise.all([
        fetch('/api/categories').then(res => res.json()),
        fetch('/api/areas').then(res => res.json())
      ])
      setCategories(cats)
      setAreas(areasData)
    }
    loadData()

    // Check for URL search params
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const area = searchParams.get('area')

    if (query || category || area) {
      setSearchTerm(query || '')
      setSelectedCategory(category || '')
      setSelectedArea(area || '')
      performSearch(query || '', category || '', area || '')
    }
  }, [searchParams])

  const performSearch = async (term: string, category: string, area: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (term) params.append('q', term)
      if (category) params.append('category', category)
      if (area) params.append('area', area)

      const response = await fetch(`/api/search?${params}`)
      const data = await response.json()
      setBusinesses(data)
    } catch (error) {
      // Search failed silently
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchTerm, selectedCategory, selectedArea)
  }

  return (
    <>
      <TopNav />
      <Breadcrumbs items={[
        { label: 'Search' }
      ]} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Local Businesses
          </h1>
          <p className="text-xl text-gray-700">
            Find the perfect local business for your needs
          </p>
        </header>

        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Term
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Business name or service..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                  Area
                </label>
                <select
                  id="area"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Areas</option>
                  {areas.map((area) => (
                    <option key={area.id} value={area.slug}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Search Results */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Search Results
            {businesses.length > 0 && (
              <span className="text-lg font-normal text-gray-600 ml-2">
                ({businesses.length} found)
              </span>
            )}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : businesses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                No businesses found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse our categories and areas.
              </p>
              <div className="space-x-4">
                <a 
                  href="/categories" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Browse Categories
                </a>
                <a 
                  href="/areas" 
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Browse Areas
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function SearchLoading() {
  return (
    <>
      <TopNav />
      <Breadcrumbs items={[
        { label: 'Search' }
      ]} />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Search Local Businesses
          </h1>
          <p className="text-xl text-gray-700">
            Find the perfect local business for your needs
          </p>
        </header>

        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading search...</p>
        </div>
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  )
}
