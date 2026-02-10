import Link from 'next/link';
import { Article } from '@/lib/types';

interface MostReadProps {
  items: Article[];
}

export default function MostRead({ items }: MostReadProps) {
  if (items.length === 0) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <section className="mb-12">
      <div className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Most Read</h2>
        <ol className="space-y-3">
          {items.map((item, index) => (
            <li key={item.slug} className="group">
              <Link 
                href={`/editorial/${item.slug}`}
                className="flex items-start space-x-3 hover:bg-white rounded-lg p-2 -m-2 transition-colors"
              >
                <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    {item.author && <span>{item.author}</span>}
                    {item.publishedAt && (
                      <>
                        <span>•</span>
                        <time dateTime={item.publishedAt}>
                          {formatDate(item.publishedAt)}
                        </time>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
