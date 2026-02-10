import Link from 'next/link';

export default function FooterLinks() {
  const quickLinks = [
    { label: 'Add Your Business', href: '/add-business' },
    { label: 'Advertise', href: '/advertise' },
    { label: 'Submit News', href: '/submit-news' },
    { label: 'Contact', href: '/contact' }
  ];

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Slough.co</h3>
            <p className="text-gray-300">
              Independent local news and business directory for Slough, Berkshire. Your trusted source for local information.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/editorial" className="hover:text-white transition-colors">Latest News</a></li>
              <li><a href="/categories" className="hover:text-white transition-colors">Business Directory</a></li>
              <li><a href="/areas" className="hover:text-white transition-colors">Areas</a></li>
              <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="mailto:dean@slough.co" className="hover:text-white transition-colors flex items-center">
                  <span className="mr-2">📧</span>
                  dean@slough.co
                </a>
              </li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Form</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 Slough.co. All rights reserved.</p>
          <p className="text-xs text-gray-500 mt-2">Independent Local News • 270+ Verified Businesses • Serving Slough & Surrounding Areas</p>
        </div>
      </div>
    </footer>
  );
}
