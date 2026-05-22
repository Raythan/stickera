import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { StickerCard } from '@/components/molecules/StickerCard';
import { MAX_TRADE_STICKERS_PER_SIDE } from '@/domain/trade/constants';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { TradeStickerSelectGridProps } from './TradeStickerSelectGrid.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrap: {
      marginBottom: theme.spacing.lg,
    },
    label: {
      marginBottom: theme.spacing.xs,
    },
    count: {
      marginBottom: theme.spacing.sm,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      justifyContent: 'center',
    },
    cell: {
      borderRadius: 12,
      padding: 4,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    cellSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surface,
    },
    cellDisabled: {
      opacity: 0.45,
    },
  });
}

export function TradeStickerSelectGrid({
  items,
  selectedIds,
  onToggle,
  label,
  maxSelection = MAX_TRADE_STICKERS_PER_SIDE,
}: TradeStickerSelectGridProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const selectedSet = new Set(selectedIds);

  return (
    <View style={styles.wrap}>
      <Text variant="bodyBold" style={styles.label}>
        {label}
      </Text>
      <Text variant="caption" color={colors.textMuted} style={styles.count}>
        {t('screens.trade.selectedCount', { count: selectedIds.length, max: maxSelection })}
      </Text>
      <View style={styles.grid}>
        {items.map((item) => {
          const selected = selectedSet.has(item.stickerId);
          const atMax = selectedIds.length >= maxSelection && !selected;
          return (
            <Pressable
              key={item.stickerId}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => {
                if (atMax) return;
                onToggle(item.stickerId);
              }}
              style={[styles.cell, selected && styles.cellSelected, atMax && styles.cellDisabled]}
            >
              <StickerCard
                stickerId={item.stickerId}
                name={item.name}
                imageUri={item.imageUri}
                frameCss={item.frameCss}
                quantity={item.quantity}
                rarity={item.rarity}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
