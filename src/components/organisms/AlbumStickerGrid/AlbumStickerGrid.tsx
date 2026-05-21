import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { StickerCardFrame } from '@/components/molecules/StickerCardFrame';
import { resolveStickerArtUri } from '@/services/content/AlbumStickerArtUri';

import type { AlbumStickerGridProps } from './AlbumStickerGrid.types';

export function AlbumStickerGrid({ album, frameCss, getStickerName }: AlbumStickerGridProps) {
  const [artUris, setArtUris] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const entries = await Promise.all(
        album.stickers.map(async (sticker) => {
          if (!sticker.image) return [sticker.id, ''] as const;
          const uri = await resolveStickerArtUri(album.id, sticker.image);
          return [sticker.id, uri] as const;
        }),
      );
      if (!cancelled) {
        setArtUris(Object.fromEntries(entries.filter(([, u]) => u)));
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [album]);

  return (
    <View style={styles.grid}>
      {album.stickers.map((sticker) => (
        <StickerCardFrame
          key={sticker.id}
          name={getStickerName(sticker.nameKey)}
          frameCss={frameCss}
          artUri={sticker.image ? artUris[sticker.id] : undefined}
          rarity={sticker.rarity}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
});
