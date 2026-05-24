import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { RarityMedalIcon } from '@/components/atoms/RarityMedalIcon';
import { Image } from '@/components/atoms/Image';
import { Text } from '@/components/atoms/Text';
import { PeekCarousel } from '@/components/molecules/PeekCarousel';
import { StickerDetailModal } from '@/components/molecules/StickerDetailModal';
import { useAlbumFramePreview } from '@/features/collection/useAlbumFramePreview';
import { resolveContentLabel } from '@/i18n/resolveContentLabel';
import { resolveStickerArtUri } from '@/services/content/AlbumStickerArtUri';
import type { StickerDef } from '@/domain/types';
import type { AppTheme } from '@/theme/presets';
import { useThemedStyles } from '@/theme/useThemedStyles';

import { isStickerRarity, RARITY_I18N_KEY } from '@/theme/rarity';

import type { PackRevealProps } from './PackReveal.types';

function albumIdFromStickerId(stickerId: string): string {
  const idx = stickerId.indexOf(':');
  return idx > 0 ? stickerId.slice(0, idx) : stickerId;
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    title: {
      marginBottom: theme.spacing.lg,
      textAlign: 'center',
    },
    carousel: {
      width: '100%',
      marginBottom: theme.spacing.md,
    },
    card: {
      width: '100%',
      alignItems: 'center',
      borderRadius: 12,
    },
    cardPressed: {
      opacity: 0.88,
    },
    artWrap: {
      width: 100,
      height: 130,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: theme.colors.stickerPlaceholder,
    },
    art: {
      width: '100%',
      height: '100%',
    },
    artPlaceholder: {
      flex: 1,
      backgroundColor: theme.colors.stickerPlaceholder,
    },
    rarityWrap: {
      marginTop: theme.spacing.xs,
      alignItems: 'center',
    },
    stickerName: {
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
  });
}

export function PackReveal({ stickers, onDismiss }: PackRevealProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(createStyles);
  const [artUris, setArtUris] = useState<Record<string, string>>({});
  const [detailSticker, setDetailSticker] = useState<StickerDef | null>(null);

  const detailAlbumId = detailSticker ? albumIdFromStickerId(detailSticker.id) : null;
  const { css: detailFrameCss } = useAlbumFramePreview(detailAlbumId, 'frame.css');

  useEffect(() => {
    let cancelled = false;
    async function loadArts() {
      const entries = await Promise.all(
        stickers.map(async (s) => {
          if (!s.image) return [s.id, ''] as const;
          const albumId = albumIdFromStickerId(s.id);
          const uri = await resolveStickerArtUri(albumId, s.image);
          return [s.id, uri] as const;
        }),
      );
      if (!cancelled) {
        setArtUris(Object.fromEntries(entries.filter(([, u]) => u)));
      }
    }
    void loadArts();
    return () => {
      cancelled = true;
    };
  }, [stickers]);

  const detailName = useMemo(
    () =>
      detailSticker
        ? resolveContentLabel(detailSticker.nameKey ?? detailSticker.id, detailSticker.names)
        : '',
    [detailSticker],
  );

  return (
    <View style={styles.container}>
      <Text variant="bodyBold" style={styles.title}>
        {t('screens.pack.revealTitle', { count: stickers.length })}
      </Text>
      <View style={styles.carousel}>
        <PeekCarousel
          data={stickers}
          keyExtractor={(sticker) => sticker.id}
          renderItem={(sticker) => {
            const name = resolveContentLabel(sticker.nameKey ?? sticker.id, sticker.names);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={name}
                onPress={() => setDetailSticker(sticker)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              >
                <View style={styles.artWrap}>
                  {artUris[sticker.id] ? (
                    <Image
                      source={{ uri: artUris[sticker.id] }}
                      accessibilityLabel={name}
                      style={styles.art}
                    />
                  ) : (
                    <View style={styles.artPlaceholder} />
                  )}
                </View>
                {sticker.rarity && isStickerRarity(sticker.rarity) ? (
                  <View style={styles.rarityWrap}>
                    <RarityMedalIcon
                      rarity={sticker.rarity}
                      owned
                      accessibilityLabel={t(RARITY_I18N_KEY[sticker.rarity])}
                    />
                  </View>
                ) : null}
                <Text variant="caption" style={styles.stickerName} numberOfLines={2}>
                  {name}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
      <Button label={t('common.back')} variant="ghost" onPress={onDismiss} />
      {detailSticker && detailFrameCss ? (
        <StickerDetailModal
          visible
          onClose={() => setDetailSticker(null)}
          name={detailName}
          frameCss={detailFrameCss}
          imageUri={detailSticker.image ? artUris[detailSticker.id] : undefined}
          quantity={1}
          rarity={detailSticker.rarity}
        />
      ) : null}
    </View>
  );
}
