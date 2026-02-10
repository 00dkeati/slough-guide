import Link from 'next/link';
import { Category } from '@/lib/types';

interface TopicStripProps {
  topics: Category[];
}

export default function TopicStrip({ topics }: TopicStripProps) {
  return (
    <section className="mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse Topics</h2>
        <div className="flex flex-wrap gap-3">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/${topic.slug}`}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full transition-colors group"
            >
              {topic.icon && (
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {topic.icon}
                </span>
              )}
              <span className="font-medium text-gray-700 group-hover:text-red-700">
                {topic.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
