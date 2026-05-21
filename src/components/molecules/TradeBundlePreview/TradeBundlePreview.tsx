import { ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { StickerCard } from '@/components/molecules/StickerCard';
import { theme } from '@/theme';

import type { TradeBundlePreviewProps } from './TradeBundlePreview.types';

export function TradeBundlePreview({ items, title }: TradeBundlePreviewProps) {
  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      {title ? (
        <Text variant="bodyBold" style={styles.title}>
          {title}
        </Text>
      ) : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {items.map((item) => (
          <View key={item.stickerId} style={styles.card}>
            <StickerCard
              stickerId={item.stickerId}
              name={item.name}
              imageUri={item.imageUri}
              frameCss={item.frameCss}
              quantity={item.quantity}
              rarity={item.rarity}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginVertical: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  row: {
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  card: {
    opacity: 1,
  },
});
