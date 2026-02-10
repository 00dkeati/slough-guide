import Link from 'next/link';
import { Tile } from '@/lib/types';

interface CardTileProps {
  tile: Tile;
}

export default function CardTile({ tile }: CardTileProps) {
  return (
    <Link href={tile.href} className="group block">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6 text-center h-full border border-gray-100 hover:border-red-200">
        {/* Icon */}
        {tile.icon && (
          <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
            {tile.icon}
          </div>
        )}

        {/* Label */}
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
          {tile.label}
        </h3>

        {/* Blurb */}
        {tile.blurb && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {tile.blurb}
          </p>
        )}
      </div>
    </Link>
  );
}
