import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { PeekCarousel } from '@/components/molecules/PeekCarousel';
import { StickerCard } from '@/components/molecules/StickerCard';
import { StickerDetailModal } from '@/components/molecules/StickerDetailModal';
import type { AppTheme } from '@/theme/presets';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { TradeBundlePreviewProps } from './TradeBundlePreview.types';
import type { TradableStickerItem } from '@/domain/types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrap: {
      marginVertical: theme.spacing.md,
    },
    title: {
      marginBottom: theme.spacing.sm,
    },
  });
}

export function TradeBundlePreview({ items, title }: TradeBundlePreviewProps) {
  const styles = useThemedStyles(createStyles);
  const [detailItem, setDetailItem] = useState<TradableStickerItem | null>(null);

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      {title ? (
        <Text variant="bodyBold" style={styles.title}>
          {title}
        </Text>
      ) : null}
      <PeekCarousel
        data={items}
        keyExtractor={(item) => item.stickerId}
        renderItem={(item) => (
          <StickerCard
            stickerId={item.stickerId}
            name={item.name}
            imageUri={item.imageUri}
            frameCss={item.frameCss}
            quantity={item.quantity}
            rarity={item.rarity}
            onPress={() => setDetailItem(item)}
          />
        )}
      />
      {detailItem ? (
        <StickerDetailModal
          visible
          onClose={() => setDetailItem(null)}
          name={detailItem.name}
          frameCss={detailItem.frameCss}
          imageUri={detailItem.imageUri}
          quantity={detailItem.quantity}
          rarity={detailItem.rarity}
        />
      ) : null}
    </View>
  );
}
