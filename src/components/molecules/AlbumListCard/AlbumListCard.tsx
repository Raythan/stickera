import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { StickerFramePreview } from '@/components/molecules/StickerFramePreview';
import { useAlbumFramePreview } from '@/features/collection/useAlbumFramePreview';
import { useAlbumManifest } from '@/features/collection/useAlbumManifest';
import { resolveContentLabel } from '@/i18n/resolveContentLabel';
import { resolveStickerArtUri } from '@/services/content/AlbumStickerArtUri';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { AlbumListCardProps } from './AlbumListCard.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
    poolRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xs,
      gap: theme.spacing.sm,
    },
    poolLabel: {
      flex: 1,
    },
  });
}

export function AlbumListCard({
  album,
  owned,
  total,
  packPoolEnabled,
  onTogglePackPool,
  onPress,
}: AlbumListCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { manifest } = useAlbumManifest(album.id);
  const title = manifest
    ? resolveContentLabel(manifest.nameKey ?? album.name_key, manifest.names)
    : album.name_key;
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
      <Text variant="caption" color={colors.textMuted}>
        {t('screens.album.progress', { owned, total })}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={onPress}
        style={styles.preview}
      >
        {loading ? <ActivityIndicator color={colors.primary} /> : null}
        {error ? (
          <Text variant="caption" color={colors.error}>
            {error}
          </Text>
        ) : null}
        {css ? <StickerFramePreview frameCss={css} artUri={artUri} /> : null}
      </Pressable>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: packPoolEnabled }}
        accessibilityLabel={t('screens.home.packPoolToggle')}
        onPress={() => onTogglePackPool(album.id, !packPoolEnabled)}
        style={styles.poolRow}
      >
        <Text variant="caption" color={colors.textMuted} style={styles.poolLabel}>
          {t('screens.home.packPoolToggle')}
        </Text>
        <Switch
          value={packPoolEnabled}
          onValueChange={(value) => onTogglePackPool(album.id, value)}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </Pressable>
      <Button
        label={t('screens.album.openAlbum')}
        variant="ghost"
        size="sm"
        onPress={onPress}
      />
    </View>
  );
}
