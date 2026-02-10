'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin } from 'lucide-react';

interface HeroDirectoryProps {
  initialService?: string;
  initialArea?: string;
}

export default function HeroDirectory({ initialService = '', initialArea = '' }: HeroDirectoryProps) {
  const [service, setService] = useState(initialService);
  const [area, setArea] = useState(initialArea);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service.trim() && !area.trim()) return;
    
    setIsSubmitting(true);
    
    // Build search URL
    const params = new URLSearchParams();
    if (service.trim()) params.set('service', service.trim());
    if (area.trim()) params.set('where', area.trim());
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 lg:p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Slough's Local Directory & News
          </h1>
          
          <p className="text-lg text-red-100 mb-8">
            Find trusted local businesses, read the latest news, and discover what's happening in your community.
          </p>

          {/* Search Form */}
          <form role="search" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Service Input */}
              <div className="relative">
                <label htmlFor="service" className="sr-only">Service or business type</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="service"
                  type="text"
                  placeholder="Service or business type"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Area Input */}
              <div className="relative">
                <label htmlFor="area" className="sr-only">Area or postcode</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="area"
                  type="text"
                  placeholder="Area or postcode"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || (!service.trim() && !area.trim())}
                className="w-full bg-white text-red-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-600"
              >
                {isSubmitting ? 'Searching...' : 'Search Directory'}
              </button>
            </div>
          </form>

          {/* Trust Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-red-100">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              500+ businesses
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              270+ verified reviews
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Updated daily
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
