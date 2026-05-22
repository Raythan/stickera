import { View, StyleSheet } from 'react-native';

import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { BadgeProps } from './Badge.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    base: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: 8,
      alignSelf: 'flex-start',
    },
    default: {
      backgroundColor: theme.colors.secondary,
    },
    accent: {
      backgroundColor: theme.colors.accent,
    },
    muted: {
      backgroundColor: theme.colors.surfaceMuted,
    },
  });
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const labelColor =
    variant === 'accent' ? colors.text : variant === 'muted' ? colors.text : colors.textInverse;

  return (
    <View style={[styles.base, styles[variant]]}>
      <Text variant="label" color={labelColor}>
        {label}
      </Text>
    </View>
  );
}
