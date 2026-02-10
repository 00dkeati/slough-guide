import { Business } from '@/lib/types';
import CardBusiness from './CardBusiness';

interface GridBusinessesProps {
  items: Business[];
}

export default function GridBusinesses({ items }: GridBusinessesProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No featured businesses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <CardBusiness key={item.slug} item={item} />
      ))}
    </div>
  );
}
