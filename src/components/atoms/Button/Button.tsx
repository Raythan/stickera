import { Pressable } from 'react-native';

import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { ButtonProps } from './Button.types';

function createStyles(theme: AppTheme) {
  return {
    base: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      borderRadius: 12,
    },
    sm: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      minHeight: 36,
    },
    md: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      minHeight: 48,
    },
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.secondary,
    },
    pressed: {
      opacity: 0.88,
    },
    disabled: {
      opacity: 0.45,
    },
    fullWidth: {
      alignSelf: 'stretch',
      width: '100%',
    },
  };
}

export function Button({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const labelColor =
    variant === 'ghost' ? colors.secondary : colors.textInverse;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[size],
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        fullWidth && styles.fullWidth,
      ]}
    >
      <Text variant="bodyBold" color={labelColor}>
        {label}
      </Text>
    </Pressable>
  );
}
