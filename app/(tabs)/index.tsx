import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { AlbumGrid } from '@/components/organisms/AlbumGrid';
import { CollectionListToolbar } from '@/components/organisms/CollectionListToolbar';
import { HomeHero } from '@/components/organisms/HomeHero';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useCollectionListControls } from '@/features/collection/useCollectionListControls';
import { useAlbumProgress } from '@/features/collection/useAlbumProgress';
import { useAlbums } from '@/features/collection/useAlbums';
import { useEnabledAlbums } from '@/features/collection/useEnabledAlbums';
import { useContentSync } from '@/features/sync/useContentSync';
import { useTheme } from '@/theme/ThemeContext';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const { albums, loading, reload } = useAlbums();
  const { getOwned, reload: reloadProgress } = useAlbumProgress(albums);
  const { items: enabledItems, reload: reloadEnabled, toggle: togglePackPool } =
    useEnabledAlbums();
  const { sync, syncing } = useContentSync();
  const [refreshing, setRefreshing] = useState(false);

  const enabledByAlbumId = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const item of enabledItems) {
      map.set(item.album.id, item.enabled);
    }
    return map;
  }, [enabledItems]);

  const getAlbumSearchText = useCallback(
    (album: (typeof albums)[0]) => `${album.id} ${album.name_key}`,
    [],
  );

  const list = useCollectionListControls({
    items: albums,
    getSearchText: getAlbumSearchText,
    enableOwnershipFilter: false,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await sync();
      await reload();
      await reloadProgress();
      await reloadEnabled();
    } finally {
      setRefreshing(false);
    }
  }, [sync, reload, reloadProgress, reloadEnabled]);

  const toolbarLabels = useMemo(
    () => ({
      itemCount: t('screens.collection.itemCount', { count: list.total }),
      filterAll: t('screens.collection.filterAll'),
      filterOwned: t('screens.collection.filterOwned'),
      filterMissing: t('screens.collection.filterMissing'),
    }),
    [t, list.total],
  );

  const gridItems = useMemo(
    () =>
      list.visibleItems.map((album) => ({
        album,
        owned: getOwned(album.id),
        total: album.total_stickers,
        packPoolEnabled: enabledByAlbumId.get(album.id) ?? true,
        onTogglePackPool: togglePackPool,
        onPress: () =>
          router.push({ pathname: '/album/[id]', params: { id: album.id } }),
      })),
    [list.visibleItems, getOwned, router, enabledByAlbumId, togglePackPool],
  );

  return (
    <ScreenTemplate
      refreshing={refreshing || syncing}
      onRefresh={onRefresh}
      showBack={false}
      showHome={false}
      showHeader={false}
    >
      <HomeHero
        title={t('screens.home.title')}
        subtitle={t('screens.home.subtitle')}
        packLabel={t('screens.home.openPack')}
        onOpenPack={() => router.push('/pack')}
      />
      <Text variant="caption" color={colors.textMuted} style={{ marginBottom: spacing.md }}>
        {t('screens.home.packPoolHint')}
      </Text>
      {albums.length > 0 ? (
        <CollectionListToolbar
          search={list.search}
          onSearchChange={list.setSearch}
          searchPlaceholder={t('screens.collection.searchPlaceholderAlbums')}
          total={list.total}
          labels={toolbarLabels}
        />
      ) : null}
      {loading && albums.length === 0 ? (
        <Text variant="body" color={colors.textMuted}>
          {t('common.loading')}
        </Text>
      ) : null}
      {!loading && albums.length > 0 && !list.hasResults ? (
        <Text variant="body" color={colors.textMuted}>
          {t('screens.collection.noResults')}
        </Text>
      ) : null}
      {list.hasResults ? <AlbumGrid items={gridItems} /> : null}
    </ScreenTemplate>
  );
}
