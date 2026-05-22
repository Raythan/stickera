import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { PageSizeSelectProps } from './PageSizeSelect.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    label: {
      marginRight: theme.spacing.xs,
    },
    options: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    chip: {
      minWidth: 40,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: 8,
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

export function PageSizeSelect({ label, value, options, onChange }: PageSizeSelectProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <Text variant="caption" color={colors.textMuted} style={styles.label}>
        {label}
      </Text>
      <View style={styles.options}>
        {options.map((opt) => {
          const active = value === opt;
          return (
            <Pressable
              key={opt}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${label} ${opt}`}
              onPress={() => onChange(opt)}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && styles.chipPressed,
              ]}
            >
              <Text variant="caption" color={active ? colors.primary : colors.text}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
