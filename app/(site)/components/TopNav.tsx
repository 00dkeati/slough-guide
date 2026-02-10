'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X } from 'lucide-react';

export default function TopNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'News', href: '/editorial' },
    { label: 'Directory', href: '/categories' },
    { label: 'Areas', href: '/areas' },
    { label: 'About', href: '/about' }
  ];

  const featuredSpot = {
    label: '💈 #1 Barber',
    href: '/editorial/jc-barbering-slough'
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-white/80 border-b border-green-200' 
          : 'bg-white border-b border-green-200'
      }`}>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Image 
                src="/logo.png" 
                alt="Slough.co - Local News, Business Directory & Community Guide" 
                width={180}
                height={48}
                priority
                className="h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              {/* Featured Sponsor Spot */}
              <Link
                href={featuredSpot.href}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1 rounded-full font-semibold text-sm hover:from-amber-500 hover:to-yellow-600 transition-all shadow-sm"
              >
                {featuredSpot.label}
              </Link>
            </div>

            {/* Search & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-4">
              <form role="search" className="relative">
                <input
                  type="search"
                  placeholder="Search businesses, services..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
                >
                  <Search className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {/* Featured Sponsor Spot - Mobile */}
                <Link
                  href={featuredSpot.href}
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-2 rounded-full font-semibold text-sm text-center hover:from-amber-500 hover:to-yellow-600 transition-all shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {featuredSpot.label}
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
