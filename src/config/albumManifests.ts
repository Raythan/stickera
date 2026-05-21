import retroGames from '../../content/albums/retro-games/album.json';
import spaceExplorers from '../../content/albums/space-explorers/album.json';
import worldCup2026 from '../../content/albums/world-cup-2026/album.json';

export type AlbumManifest = {
  id: string;
  revision: number;
  frameStylePath: string;
  totalStickers: number;
  nameKey: string;
  packWeight?: number;
  stickers: Array<{
    id: string;
    number: number;
    nameKey: string;
    image?: string;
    rarity?: string;
  }>;
};

export const albumManifests: Record<string, AlbumManifest> = {
  'retro-games': retroGames as AlbumManifest,
  'space-explorers': spaceExplorers as AlbumManifest,
  'world-cup-2026': worldCup2026 as AlbumManifest,
};
