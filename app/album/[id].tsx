import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { AlbumStickerGrid } from '@/components/organisms/AlbumStickerGrid';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useAlbumCollection } from '@/features/collection/useAlbumCollection';
import { useAlbumFramePreview } from '@/features/collection/useAlbumFramePreview';
import { useAlbumManifest } from '@/features/collection/useAlbumManifest';
import { resolveContentLabel } from '@/i18n/resolveContentLabel';
import { theme } from '@/theme';

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { manifest, loading: manifestLoading, error: manifestError } = useAlbumManifest(id);
  const { ownedCount, getEntry, loading: collectionLoading } = useAlbumCollection(id);
  const framePath = manifest?.frameStylePath ?? 'frame.css';
  const { css, loading: frameLoading, error: frameError } = useAlbumFramePreview(
    id ?? null,
    framePath,
  );

  if (!id) {
    return (
      <ScreenTemplate title={t('common.error')} showBack showHome>
        <Text variant="body">{t('common.error')}</Text>
      </ScreenTemplate>
    );
  }

  const loading = manifestLoading || frameLoading || collectionLoading;
  const title = manifest
    ? resolveContentLabel(manifest.nameKey ?? id, manifest.names)
    : id;

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScreenTemplate title={title} showBack showHome>
        {manifest ? (
          <Text variant="caption" color={theme.colors.textMuted} style={styles.meta}>
            {t('screens.album.progress', {
              owned: ownedCount,
              total: manifest.totalStickers,
            })}
          </Text>
        ) : null}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : null}
        {manifestError || frameError ? (
          <Text variant="body" color={theme.colors.error}>
            {manifestError ?? frameError}
          </Text>
        ) : null}
        {css && manifest && manifest.stickers.length > 0 ? (
          <AlbumStickerGrid
            album={manifest}
            frameCss={css}
            getStickerName={(sticker) =>
              resolveContentLabel(sticker.nameKey ?? sticker.id, sticker.names)
            }
            getCollectionEntry={getEntry}
          />
        ) : null}
        {manifest && manifest.stickers.length === 0 ? (
          <Text variant="body" color={theme.colors.textMuted}>
            {t('screens.home.comingSoon')}
          </Text>
        ) : null}
        {!manifest && !loading ? (
          <Text variant="body">{t('common.error')}</Text>
        ) : null}
      </ScreenTemplate>
    </>
  );
}

const styles = StyleSheet.create({
  meta: {
    marginBottom: theme.spacing.lg,
  },
  center: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
});
