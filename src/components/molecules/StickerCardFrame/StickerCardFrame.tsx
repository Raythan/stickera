import { StyleSheet, View } from 'react-native';

import { Badge } from '@/components/atoms/Badge';
import { Text } from '@/components/atoms/Text';
import { StickerFramePreview } from '@/components/molecules/StickerFramePreview';
import { theme } from '@/theme';

import type { StickerCardFrameProps } from './StickerCardFrame.types';

const RARITY_VARIANT: Record<string, 'default' | 'accent' | 'muted'> = {
  legendary: 'accent',
  rare: 'default',
  uncommon: 'muted',
  common: 'muted',
};

export function StickerCardFrame({ name, frameCss, artUri, rarity }: StickerCardFrameProps) {
  return (
    <View style={styles.wrap}>
      <StickerFramePreview frameCss={frameCss} artUri={artUri} accessibilityLabel={name} />
      {rarity ? (
        <View style={styles.badge}>
          <Badge label={rarity} variant={RARITY_VARIANT[rarity] ?? 'muted'} />
        </View>
      ) : null}
      <Text variant="caption" style={styles.name} numberOfLines={2}>
        {name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 120,
    alignItems: 'center',
  },
  badge: {
    marginTop: theme.spacing.xs,
  },
  name: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});
