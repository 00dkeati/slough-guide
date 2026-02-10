import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface SectionProps {
  title: string;
  seeAllHref?: string;
  children: React.ReactNode;
}

export default function Section({ title, seeAllHref, children }: SectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium transition-colors group"
          >
            <span>See all</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
