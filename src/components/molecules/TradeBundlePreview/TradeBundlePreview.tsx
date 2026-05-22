import { ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { StickerCard } from '@/components/molecules/StickerCard';
import type { AppTheme } from '@/theme/presets';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { TradeBundlePreviewProps } from './TradeBundlePreview.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
}

export function TradeBundlePreview({ items, title }: TradeBundlePreviewProps) {
  const styles = useThemedStyles(createStyles);

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
