import Link from 'next/link';
import { CATEGORIES } from '@/config/categories';
import { CITY } from '@/config/city';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                SG
              </div>
              <span className="text-xl font-bold">Slough Guide</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your local guide to the best businesses and services in Slough, Berkshire.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 8).map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/category/${category.id}`}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {category.icon} {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas */}
          <div>
            <h3 className="font-semibold mb-4">Areas in Slough</h3>
            <ul className="space-y-2">
              {CITY.neighbourhoods.slice(0, 8).map((neighbourhood) => (
                <li key={neighbourhood}>
                  <Link 
                    href={`/neighbourhood/${neighbourhood.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {neighbourhood}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/add-business" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Add Your Business
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} Slough Guide. All rights reserved.
            </div>
            
            <div className="text-gray-400 text-xs text-center md:text-right max-w-md">
              <p>
                Business data and photos sourced from Google Places. 
                © respective owners. Contact us for updates/corrections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
