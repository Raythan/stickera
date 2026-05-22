import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { StickerCard } from '@/components/molecules/StickerCard';
import { resolveStickerArtUri } from '@/services/content/AlbumStickerArtUri';

import type { AlbumStickerGridProps } from './AlbumStickerGrid.types';

export function AlbumStickerGrid({
  album,
  stickers,
  frameCss,
  getStickerName,
  getCollectionEntry,
}: AlbumStickerGridProps) {
  const [artUris, setArtUris] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const entries = await Promise.all(
        stickers.map(async (sticker) => {
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
  }, [album.id, stickers]);

  return (
    <View style={styles.grid}>
      {stickers.map((sticker) => {
        const entry = getCollectionEntry(sticker.id);
        return (
          <StickerCard
            key={sticker.id}
            stickerId={sticker.id}
            name={getStickerName(sticker)}
            frameCss={frameCss}
            imageUri={sticker.image ? artUris[sticker.id] : undefined}
            quantity={entry.quantity}
            isNew={entry.isNew}
            rarity={sticker.rarity}
          />
        );
      })}
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
