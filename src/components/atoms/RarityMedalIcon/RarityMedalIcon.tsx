import Svg, { Circle, Path } from 'react-native-svg';

import { RARITY_COLORS } from '@/theme/rarity';

import type { RarityMedalIconProps } from './RarityMedalIcon.types';

/** Medal + star (svgrepo medal-star-circle style). */
export function RarityMedalIcon({
  rarity,
  size = 20,
  owned = true,
  accessibilityLabel,
}: RarityMedalIconProps) {
  const color = RARITY_COLORS[rarity];
  const opacity = owned ? 1 : 0.45;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      opacity={opacity}
    >
      <Path
        d="M12 2.5c1.2 0 2.2.9 2.4 2.1l.3 1.6h-5.4l.3-1.6c.2-1.2 1.2-2.1 2.4-2.1z"
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx={12}
        cy={13}
        r={8.25}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
      />
      <Path
        d="M12 9.2l1.1 2.3 2.5.4-1.8 1.8.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.8 2.5-.4L12 9.2z"
        fill={color}
        stroke={color}
        strokeWidth={0.4}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
