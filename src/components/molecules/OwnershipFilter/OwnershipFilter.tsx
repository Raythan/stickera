import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import type { OwnershipFilter } from '@/domain/collection/listQuery';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { OwnershipFilterProps } from './OwnershipFilter.types';

const OPTIONS: OwnershipFilter[] = ['all', 'owned', 'missing'];

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    chip: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xs,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
    },
    chipActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surfaceMuted,
    },
    chipPressed: {
      opacity: 0.88,
    },
  });
}

export function OwnershipFilter({ value, onChange, labels }: OwnershipFilterProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const labelByValue: Record<OwnershipFilter, string> = {
    all: labels.all,
    owned: labels.owned,
    missing: labels.missing,
  };

  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const active = value === opt;
        return (
          <Pressable
            key={opt}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(opt)}
            style={({ pressed }) => [
              styles.chip,
              active && styles.chipActive,
              pressed && styles.chipPressed,
            ]}
          >
            <Text variant="caption" color={active ? colors.primary : colors.text}>
              {labelByValue[opt]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
