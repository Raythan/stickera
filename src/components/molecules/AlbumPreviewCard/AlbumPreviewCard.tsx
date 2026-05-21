import { Pressable, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/atoms/Badge';
import { Image } from '@/components/atoms/Image';
import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

import type { AlbumPreviewCardProps } from './AlbumPreviewCard.types';

export function AlbumPreviewCard({
  title,
  progress,
  badgeLabel,
  onPress,
}: AlbumPreviewCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.cover}>
        <Image placeholder accessibilityLabel={title} />
        <View style={styles.badgeWrap}>
          <Badge label={badgeLabel} variant="accent" />
        </View>
      </View>
      <Text variant="bodyBold" style={styles.title}>
        {title}
      </Text>
      <Text variant="caption" color={theme.colors.textMuted}>
        {progress}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    maxWidth: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    opacity: 0.92,
  },
  cover: {
    aspectRatio: 3 / 4,
    marginBottom: theme.spacing.sm,
    position: 'relative',
  },
  coverImage: {
    flex: 1,
  },
  badgeWrap: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
});
