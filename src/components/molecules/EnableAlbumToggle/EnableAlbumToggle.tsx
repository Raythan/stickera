import { Pressable, StyleSheet, Switch } from 'react-native';

import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { EnableAlbumToggleProps } from './EnableAlbumToggle.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
}

export function EnableAlbumToggle({ albumId, title, enabled, onToggle }: EnableAlbumToggleProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

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
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={colors.surface}
      />
    </Pressable>
  );
}
