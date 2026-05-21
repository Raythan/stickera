import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { AlbumFrameShowcase } from '@/components/organisms/AlbumFrameShowcase';
import { HomeHero } from '@/components/organisms/HomeHero';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useAlbums } from '@/features/collection/useAlbums';
import { useContentSync } from '@/features/sync/useContentSync';
import { theme } from '@/theme';

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { albums, loading, reload } = useAlbums();
  const { sync, syncing } = useContentSync();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await sync();
      await reload();
    } finally {
      setRefreshing(false);
    }
  }, [sync, reload]);

  return (
    <ScreenTemplate refreshing={refreshing || syncing} onRefresh={onRefresh}>
      <HomeHero
        title={t('screens.home.title')}
        subtitle={t('screens.home.subtitle')}
        packLabel={t('screens.home.openPack')}
        onOpenPack={() => router.push('/pack')}
      />
      <Text variant="caption" color={theme.colors.textMuted} style={styles.hint}>
        {t('screens.home.framePreviewHint')}
      </Text>
      {loading && albums.length === 0 ? (
        <Text variant="body" color={theme.colors.textMuted}>
          {t('common.loading')}
        </Text>
      ) : null}
      <View style={styles.grid}>
        {albums.map((album) => (
          <AlbumFrameShowcase key={album.id} album={album} />
        ))}
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginBottom: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    justifyContent: 'space-between',
  },
});
