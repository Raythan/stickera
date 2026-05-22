import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { EnableAlbumToggle } from '@/components/molecules/EnableAlbumToggle';
import { AlbumStickerGrid } from '@/components/organisms/AlbumStickerGrid';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useAlbumCollection } from '@/features/collection/useAlbumCollection';
import { useAlbumFramePreview } from '@/features/collection/useAlbumFramePreview';
import { useAlbumManifest } from '@/features/collection/useAlbumManifest';
import { resolveContentLabel } from '@/i18n/resolveContentLabel';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';
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

  const [packPoolEnabled, setPackPoolEnabled] = useState(true);

  useEffect(() => {
    if (!id) return;
    void EnabledAlbumRepository.isEnabled(id).then(setPackPoolEnabled);
  }, [id]);

  const onTogglePackPool = useCallback(async (_albumId: string, enabled: boolean) => {
    if (!id) return;
    await EnabledAlbumRepository.setEnabled(id, enabled);
    setPackPoolEnabled(enabled);
  }, [id]);

  const loading = manifestLoading || frameLoading || collectionLoading;
  const title = manifest
    ? resolveContentLabel(manifest.nameKey ?? id, manifest.names)
    : id;

  return (
    <>
      <Stack.Screen options={{ title }} />
      <ScreenTemplate title={title} showBack showHome>
        {manifest ? (
          <>
            <Text variant="caption" color={theme.colors.textMuted} style={styles.meta}>
              {t('screens.album.progress', {
                owned: ownedCount,
                total: manifest.totalStickers,
              })}
            </Text>
            <View style={styles.poolSection}>
              <EnableAlbumToggle
                albumId={id}
                title={t('screens.home.packPoolToggle')}
                enabled={packPoolEnabled}
                onToggle={onTogglePackPool}
              />
            </View>
          </>
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
    marginBottom: theme.spacing.sm,
  },
  poolSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  center: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
});
