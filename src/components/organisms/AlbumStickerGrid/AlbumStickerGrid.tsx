import { useEffect, useState } from 'react';

import { PeekCarousel } from '@/components/molecules/PeekCarousel';
import { StickerCard } from '@/components/molecules/StickerCard';
import { StickerDetailModal } from '@/components/molecules/StickerDetailModal';
import type { StickerDef } from '@/domain/types';
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
  const [detailSticker, setDetailSticker] = useState<StickerDef | null>(null);

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

  const detailEntry = detailSticker ? getCollectionEntry(detailSticker.id) : null;

  return (
    <>
      <PeekCarousel
        data={stickers}
        keyExtractor={(sticker) => sticker.id}
        renderItem={(sticker) => {
          const entry = getCollectionEntry(sticker.id);
          return (
            <StickerCard
              stickerId={sticker.id}
              name={getStickerName(sticker)}
              frameCss={frameCss}
              imageUri={sticker.image ? artUris[sticker.id] : undefined}
              quantity={entry.quantity}
              isNew={entry.isNew}
              rarity={sticker.rarity}
              onPress={() => setDetailSticker(sticker)}
            />
          );
        }}
      />
      {detailSticker && detailEntry ? (
        <StickerDetailModal
          visible
          onClose={() => setDetailSticker(null)}
          name={getStickerName(detailSticker)}
          frameCss={frameCss}
          imageUri={detailSticker.image ? artUris[detailSticker.id] : undefined}
          quantity={detailEntry.quantity}
          isNew={detailEntry.isNew}
          rarity={detailSticker.rarity}
        />
      ) : null}
    </>
  );
}
