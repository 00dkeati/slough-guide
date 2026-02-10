import { Article } from '@/lib/types';
import CardNews from './CardNews';

interface GridNewsProps {
  articles: Article[];
}

export default function GridNews({ articles }: GridNewsProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No articles available at the moment.</p>
      </div>
    );
  }

  const [firstArticle, ...restArticles] = articles;
  const [secondArticle, thirdArticle, ...remainingArticles] = restArticles;

  return (
    <div className="space-y-6">
      {/* First row: 1 XL + 2 MD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* XL Feature */}
        <div className="lg:col-span-2">
          {firstArticle && <CardNews article={firstArticle} size="xl" />}
        </div>

        {/* MD Cards */}
        <div className="space-y-6">
          {secondArticle && <CardNews article={secondArticle} size="md" />}
          {thirdArticle && <CardNews article={thirdArticle} size="md" />}
        </div>
      </div>

      {/* Remaining articles in small cards */}
      {remainingArticles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {remainingArticles.map((article) => (
            <CardNews key={article.slug} article={article} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
}
