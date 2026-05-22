import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/theme/ThemeContext';

import type { IconProps } from './Icon.types';

export function Icon({
  name,
  size = 24,
  color,
  accessibilityLabel,
}: IconProps) {
  const { colors } = useTheme();

  return (
    <Ionicons
      name={name}
      size={size}
      color={color ?? colors.text}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
