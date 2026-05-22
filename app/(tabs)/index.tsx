import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { AlbumGrid } from '@/components/organisms/AlbumGrid';
import { HomeHero } from '@/components/organisms/HomeHero';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useAlbumProgress } from '@/features/collection/useAlbumProgress';
import { useAlbums } from '@/features/collection/useAlbums';
import { useContentSync } from '@/features/sync/useContentSync';
import { theme } from '@/theme';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { albums, loading, reload } = useAlbums();
  const { getOwned, reload: reloadProgress } = useAlbumProgress(albums);
  const { sync, syncing } = useContentSync();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await sync();
      await reload();
      await reloadProgress();
    } finally {
      setRefreshing(false);
    }
  }, [sync, reload, reloadProgress]);

  const gridItems = useMemo(
    () =>
      albums.map((album) => ({
        album,
        owned: getOwned(album.id),
        total: album.total_stickers,
        onPress: () =>
          router.push({ pathname: '/album/[id]', params: { id: album.id } }),
      })),
    [albums, getOwned, router],
  );

  return (
    <ScreenTemplate
      refreshing={refreshing || syncing}
      onRefresh={onRefresh}
      showBack={false}
      showHome={false}
    >
      <HomeHero
        title={t('screens.home.title')}
        subtitle={t('screens.home.subtitle')}
        packLabel={t('screens.home.openPack')}
        onOpenPack={() => router.push('/pack')}
      />
      <Text variant="caption" color={theme.colors.textMuted} style={{ marginBottom: theme.spacing.md }}>
        {t('screens.home.framePreviewHint')}
      </Text>
      {loading && albums.length === 0 ? (
        <Text variant="body" color={theme.colors.textMuted}>
          {t('common.loading')}
        </Text>
      ) : null}
      <AlbumGrid items={gridItems} />
    </ScreenTemplate>
  );
}
