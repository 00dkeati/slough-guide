import Link from 'next/link';
import Image from 'next/image';
import { Article, NewsCardProps } from '@/lib/types';

export default function CardNews({ article, size }: NewsCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  if (size === 'xl') {
    return (
      <article className="group">
        <Link href={`/editorial/${article.slug}`} className="block">
          <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-48 lg:h-64">
                {article.imageUrl && (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Kicker */}
                {article.kicker && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded">
                      {article.kicker}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                
                {article.excerpt && (
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    {article.author && <span>{article.author}</span>}
                    {article.publishedAt && (
                      <>
                        <span>•</span>
                        <time dateTime={article.publishedAt}>
                          {formatDate(article.publishedAt)}
                        </time>
                      </>
                    )}
                  </div>
                  <span className="text-red-600 font-medium">Read more</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (size === 'md') {
    return (
      <article className="group">
        <Link href={`/editorial/${article.slug}`} className="block">
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Image */}
            <div className="relative h-40">
              {article.imageUrl && (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Kicker */}
              {article.kicker && (
                <div className="absolute top-2 left-2">
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded">
                    {article.kicker}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                {article.title}
              </h3>
              
              {article.excerpt && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  {article.author && <span>{article.author}</span>}
                  {article.publishedAt && (
                    <>
                      <span>•</span>
                      <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt)}
                      </time>
                    </>
                  )}
                </div>
                <span className="text-red-600 font-medium">Read</span>
              </div>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // Small size
  return (
    <article className="group">
      <Link href={`/editorial/${article.slug}`} className="block">
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          {/* Small thumbnail */}
          {article.imageUrl && (
            <div className="relative w-16 h-12 flex-shrink-0">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover rounded"
                sizes="64px"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
              {article.author && <span>{article.author}</span>}
              {article.publishedAt && (
                <>
                  <span>•</span>
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt)}
                  </time>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
