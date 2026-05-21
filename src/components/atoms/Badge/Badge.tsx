import { View, StyleSheet } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

import type { BadgeProps } from './Badge.types';

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant]]}>
      <Text variant="label" color={variant === 'accent' ? theme.colors.text : theme.colors.textInverse}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
