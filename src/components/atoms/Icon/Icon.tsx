import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/theme';

import type { IconProps } from './Icon.types';

export function Icon({
  name,
  size = 24,
  color = theme.colors.text,
  accessibilityLabel,
}: IconProps) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
