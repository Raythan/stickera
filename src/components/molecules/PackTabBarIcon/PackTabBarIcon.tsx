import { StyleSheet, View } from 'react-native';

import { ExclamationBadge } from '@/components/atoms/ExclamationBadge';
import { Icon } from '@/components/atoms/Icon';

import type { PackTabBarIconProps } from './PackTabBarIcon.types';

const BADGE_SIZE = 12;

export function PackTabBarIcon({ color, size, showBadge = false }: PackTabBarIconProps) {
  const wrap = size + 6;

  return (
    <View style={[styles.wrap, { width: wrap, height: wrap }]}>
      <Icon name="gift-outline" size={size} color={color} />
      {showBadge ? (
        <View style={styles.badge} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <ExclamationBadge size={BADGE_SIZE} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
  },
});
