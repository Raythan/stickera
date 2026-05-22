import { Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { EnableAlbumToggle } from '@/components/molecules/EnableAlbumToggle';
import { AlbumStickerGrid } from '@/components/organisms/AlbumStickerGrid';
import { CollectionListToolbar } from '@/components/organisms/CollectionListToolbar';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useAlbumCollection } from '@/features/collection/useAlbumCollection';
import { useAlbumFramePreview } from '@/features/collection/useAlbumFramePreview';
import { useAlbumManifest } from '@/features/collection/useAlbumManifest';
import { useCollectionListControls } from '@/features/collection/useCollectionListControls';
import { usePageSizePreference } from '@/features/collection/usePageSizePreference';
import { resolveContentLabel } from '@/i18n/resolveContentLabel';
import { EnabledAlbumRepository } from '@/services/db/EnabledAlbumRepository';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
}

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { manifest, loading: manifestLoading, error: manifestError } = useAlbumManifest(id);
  const { ownedCount, getEntry, loading: collectionLoading } = useAlbumCollection(id);
  const { pageSize, setPageSize, options: pageSizeOptions, ready: pageSizeReady } =
    usePageSizePreference('stickers');
  const framePath = manifest?.frameStylePath ?? 'frame.css';
  const { css, loading: frameLoading, error: frameError } = useAlbumFramePreview(
    id ?? null,
    framePath,
  );

  const getStickerName = useCallback(
    (sticker: { id: string; nameKey?: string; names?: { en?: string; pt?: string } }) =>
      resolveContentLabel(sticker.nameKey ?? sticker.id, sticker.names),
    [],
  );

  const stickers = manifest?.stickers ?? [];

  const list = useCollectionListControls({
    items: stickers,
    pageSize: pageSizeReady ? pageSize : stickers.length || 1,
    getSearchText: (sticker) => `${getStickerName(sticker)} ${sticker.id}`,
    isOwned: (sticker) => getEntry(sticker.id).quantity > 0,
    enableOwnershipFilter: true,
  });

  const toolbarLabels = useMemo(
    () => ({
      itemCount: t('screens.collection.itemCount', { count: list.total }),
      pageOf: t('screens.collection.pageOf', {
        page: list.page,
        totalPages: list.totalPages,
      }),
      prev: t('screens.collection.prev'),
      next: t('screens.collection.next'),
      filterAll: t('screens.collection.filterAll'),
      filterOwned: t('screens.collection.filterOwned'),
      filterMissing: t('screens.collection.filterMissing'),
    }),
    [t, list.total, list.page, list.totalPages],
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
            <Text variant="caption" color={colors.textMuted} style={styles.meta}>
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
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null}
        {manifestError || frameError ? (
          <Text variant="body" color={colors.error}>
            {manifestError ?? frameError}
          </Text>
        ) : null}
        {manifest && stickers.length > 0 && pageSizeReady && !loading ? (
          <CollectionListToolbar
            search={list.search}
            onSearchChange={list.setSearch}
            searchPlaceholder={t('screens.collection.searchPlaceholderStickers')}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageSizeChange={setPageSize}
            pageSizeLabel={t('screens.collection.pageSizeStickers')}
            page={list.page}
            totalPages={list.totalPages}
            total={list.total}
            onPrevPage={() => list.setPage(list.page - 1)}
            onNextPage={() => list.setPage(list.page + 1)}
            labels={toolbarLabels}
            showOwnershipFilter
            ownershipFilter={list.ownershipFilter}
            onOwnershipFilterChange={list.setOwnershipFilter}
          />
        ) : null}
        {!loading && manifest && stickers.length > 0 && !list.hasResults ? (
          <Text variant="body" color={colors.textMuted}>
            {t('screens.collection.noResults')}
          </Text>
        ) : null}
        {css && manifest && list.hasResults ? (
          <AlbumStickerGrid
            album={manifest}
            stickers={list.visibleItems}
            frameCss={css}
            getStickerName={getStickerName}
            getCollectionEntry={getEntry}
          />
        ) : null}
        {manifest && manifest.stickers.length === 0 ? (
          <Text variant="body" color={colors.textMuted}>
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
