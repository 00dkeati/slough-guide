import Link from 'next/link';
import Image from 'next/image';
import { Business } from '@/lib/types';

interface CardBusinessProps {
  item: Business;
}

export default function CardBusiness({ item }: CardBusinessProps) {
  const formatRating = (rating?: number) => {
    if (!rating) return '';
    const safeRating = Math.max(0, Math.min(5, rating));
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;
    return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
  };

  return (
    <article className="group">
      <Link href={`/biz/${item.slug}`} className="block">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
          {/* Image */}
          <div className="relative h-32">
            {item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <span className="text-2xl text-blue-600 font-bold">
                  {item.name.charAt(0)}
                </span>
              </div>
            )}
            
            {/* Featured badge */}
            {item.featured && (
              <div className="absolute top-2 right-2">
                <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
              {item.name}
            </h3>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {item.shortUSP || item.description}
            </p>

            {/* Rating */}
            {item.rating && (
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-yellow-400 text-sm">
                  {formatRating(item.rating)}
                </span>
                <span className="text-sm text-gray-600">
                  {item.rating.toFixed(1)}
                </span>
                {item.reviewCount && (
                  <span className="text-sm text-gray-500">
                    ({item.reviewCount} reviews)
                  </span>
                )}
              </div>
            )}

            {/* Category & Area */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span className="bg-gray-100 px-2 py-1 rounded">
                {item.category}
              </span>
              <span>{item.area}</span>
            </div>

            {/* CTA */}
            <div className="mt-auto">
              <span className="inline-flex items-center text-red-600 font-medium text-sm group-hover:text-red-700">
                View details
                <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
