import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { RARITY_TONES } from '@/theme/rarity';

import type { RarityMedalIconProps } from './RarityMedalIcon.types';

const BADGE_SIZE = 28;
const MEDAL_SIZE = 16;

/** Medal + star inside a filled circle badge (three tones per rarity). */
export function RarityMedalIcon({
  rarity,
  size = MEDAL_SIZE,
  owned = true,
  accessibilityLabel,
}: RarityMedalIconProps) {
  const tones = RARITY_TONES[rarity];
  const iconColor = tones.icon;
  const badgeOpacity = owned ? 1 : 0.5;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: tones.fill,
          borderColor: tones.border,
          opacity: badgeOpacity,
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12 2.5c1.2 0 2.2.9 2.4 2.1l.3 1.6h-5.4l.3-1.6c.2-1.2 1.2-2.1 2.4-2.1z"
          fill="none"
          stroke={iconColor}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx={12} cy={13} r={8.25} fill="none" stroke={iconColor} strokeWidth={1.6} />
        <Path
          d="M12 9.2l1.1 2.3 2.5.4-1.8 1.8.4 2.5-2.2-1.2-2.2 1.2.4-2.5-1.8-1.8 2.5-.4L12 9.2z"
          fill={iconColor}
          stroke={iconColor}
          strokeWidth={0.4}
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
