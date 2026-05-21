import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

import type { EnableAlbumToggleProps } from './EnableAlbumToggle.types';

export function EnableAlbumToggle({ albumId, title, enabled, onToggle }: EnableAlbumToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel={title}
      onPress={() => onToggle(albumId, !enabled)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Text variant="body" style={styles.label} numberOfLines={2}>
        {title}
      </Text>
      <Switch
        value={enabled}
        onValueChange={(value) => onToggle(albumId, value)}
        trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
        thumbColor={theme.colors.surface}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    flex: 1,
  },
});
