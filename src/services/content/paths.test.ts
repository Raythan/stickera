jest.mock('@/config/contentBase', () => ({
  getContentBaseUrl: () => 'https://raythan.github.io/stickera',
}));

import { albumManifestUrl, albumFrameUrl, albumStickerUrl } from './paths';

describe('content path helpers', () => {
  it('albumManifestUrl builds correct URL', () => {
    expect(albumManifestUrl('world-cup-2026', 1)).toBe(
      'https://raythan.github.io/stickera/albums/world-cup-2026/album.json',
    );
  });

  it('albumFrameUrl builds correct URL', () => {
    expect(albumFrameUrl('retro-games', 'frame.css')).toBe(
      'https://raythan.github.io/stickera/albums/retro-games/frame.css',
    );
  });

  it('albumStickerUrl builds correct URL', () => {
    expect(albumStickerUrl('world-cup-2026', 'stickers/01-neymar.jpeg')).toBe(
      'https://raythan.github.io/stickera/albums/world-cup-2026/stickers/01-neymar.jpeg',
    );
  });
});
