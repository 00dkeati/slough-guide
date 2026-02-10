import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/types';

interface HeroFeatureProps {
  article?: Article | null;
}

export default function HeroFeature({ article }: HeroFeatureProps) {
  if (!article) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <section className="mb-8">
      <article className="relative overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 lg:h-80">
            {article.imageUrl && (
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Kicker */}
            {article.kicker && (
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded-full">
                  {article.kicker}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            {article.excerpt && (
              <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {article.author && (
                  <span className="font-medium">{article.author}</span>
                )}
                {article.publishedAt && (
                  <>
                    <span>•</span>
                    <time dateTime={article.publishedAt}>
                      {formatDate(article.publishedAt)}
                    </time>
                  </>
                )}
                {article.readTime && (
                  <>
                    <span>•</span>
                    <span>{article.readTime} min read</span>
                  </>
                )}
              </div>

              <Link
                href={`/editorial/${article.slug}`}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                Read more
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
