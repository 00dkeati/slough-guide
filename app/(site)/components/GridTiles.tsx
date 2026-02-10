import { Tile } from '@/lib/types';
import CardTile from './CardTile';

interface GridTilesProps {
  tiles: Tile[];
}

export default function GridTiles({ tiles }: GridTilesProps) {
  if (tiles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No items available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {tiles.map((tile, index) => (
        <CardTile key={`${tile.href}-${index}`} tile={tile} />
      ))}
    </div>
  );
}
