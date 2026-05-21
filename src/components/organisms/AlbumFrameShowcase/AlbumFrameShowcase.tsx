import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { StickerFramePreview } from '@/components/molecules/StickerFramePreview';
import { useAlbumFramePreview } from '@/features/collection/useAlbumFramePreview';
import { useAlbumManifest } from '@/features/collection/useAlbumManifest';
import { resolveStickerArtUri } from '@/services/content/AlbumStickerArtUri';
import { theme } from '@/theme';

import type { AlbumFrameShowcaseProps } from './AlbumFrameShowcase.types';

export function AlbumFrameShowcase({ album, title }: AlbumFrameShowcaseProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { manifest } = useAlbumManifest(album.id);
  const framePath = manifest?.frameStylePath ?? 'frame.css';
  const { css, loading, error } = useAlbumFramePreview(album.id, framePath);
  const [artUri, setArtUri] = useState<string | null>(null);

  const previewImage = manifest?.stickers[0]?.image;

  useEffect(() => {
    let cancelled = false;
    async function loadArt() {
      if (!previewImage) {
        setArtUri(null);
        return;
      }
      const uri = await resolveStickerArtUri(album.id, previewImage);
      if (!cancelled) setArtUri(uri);
    }
    void loadArt();
    return () => {
      cancelled = true;
    };
  }, [album.id, previewImage]);

  return (
    <View style={styles.card}>
      <Text variant="bodyBold" style={styles.title}>
        {title}
      </Text>
      <Text variant="caption" color={theme.colors.textMuted}>
        {manifest?.stickers.length
          ? `${manifest.stickers.length} / ${album.total_stickers}`
          : `0 / ${album.total_stickers}`}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={() =>
          router.push({ pathname: '/album/[id]', params: { id: album.id } })
        }
        style={styles.preview}
      >
        {loading ? <ActivityIndicator color={theme.colors.primary} /> : null}
        {error ? (
          <Text variant="caption" color={theme.colors.error}>
            {error}
          </Text>
        ) : null}
        {css ? <StickerFramePreview frameCss={css} artUri={artUri} /> : null}
      </Pressable>
      <Button
        label={t('screens.album.openAlbum')}
        variant="ghost"
        size="sm"
        onPress={() =>
          router.push({ pathname: '/album/[id]', params: { id: album.id } })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    maxWidth: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
  preview: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
});
