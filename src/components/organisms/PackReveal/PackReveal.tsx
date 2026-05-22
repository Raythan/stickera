import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Image } from '@/components/atoms/Image';
import { Text } from '@/components/atoms/Text';
import { resolveContentLabel } from '@/i18n/resolveContentLabel';
import { resolveStickerArtUri } from '@/services/content/AlbumStickerArtUri';
import type { AppTheme } from '@/theme/presets';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { PackRevealProps } from './PackReveal.types';

const RARITY_VARIANT: Record<string, 'default' | 'accent' | 'muted'> = {
  legendary: 'accent',
  rare: 'default',
  uncommon: 'muted',
  common: 'muted',
};

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
    scroll: {
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.md,
    },
    card: {
      width: 120,
      alignItems: 'center',
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

  useEffect(() => {
    let cancelled = false;
    async function loadArts() {
      const entries = await Promise.all(
        stickers.map(async (s) => {
          if (!s.image) return [s.id, ''] as const;
          const albumId = s.id.split(':')[0];
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

  return (
    <View style={styles.container}>
      <Text variant="bodyBold" style={styles.title}>
        {t('screens.pack.revealTitle', { count: stickers.length })}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {stickers.map((sticker) => (
          <View key={sticker.id} style={styles.card}>
            <View style={styles.artWrap}>
              {artUris[sticker.id] ? (
                <Image
                  source={{ uri: artUris[sticker.id] }}
                  accessibilityLabel={resolveContentLabel(
                    sticker.nameKey ?? sticker.id,
                    sticker.names,
                  )}
                  style={styles.art}
                />
              ) : (
                <View style={styles.artPlaceholder} />
              )}
            </View>
            {sticker.rarity ? (
              <View style={styles.rarityWrap}>
                <Badge label={sticker.rarity} variant={RARITY_VARIANT[sticker.rarity] ?? 'muted'} />
              </View>
            ) : null}
            <Text variant="caption" style={styles.stickerName} numberOfLines={2}>
              {resolveContentLabel(sticker.nameKey ?? sticker.id, sticker.names)}
            </Text>
          </View>
        ))}
      </ScrollView>
      <Button label={t('common.back')} variant="ghost" onPress={onDismiss} />
    </View>
  );
}
