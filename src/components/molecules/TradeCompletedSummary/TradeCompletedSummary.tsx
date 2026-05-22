import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { TradeBundlePreview } from '@/components/molecules/TradeBundlePreview';
import { getTradeSidesFromEntry } from '@/domain/trade/tradeLogHelpers';
import type { TradableStickerItem } from '@/domain/types';
import { resolveStickerItemsByIds } from '@/features/trade/tradableStickerItems';
import { theme } from '@/theme';

import type { TradeCompletedSummaryProps } from './TradeCompletedSummary.types';

export function TradeCompletedSummary({ entry }: TradeCompletedSummaryProps) {
  const { t } = useTranslation();
  const [gaveItems, setGaveItems] = useState<TradableStickerItem[]>([]);
  const [receivedItems, setReceivedItems] = useState<TradableStickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const { gaveIds, receivedIds } = getTradeSidesFromEntry(entry);
    void (async () => {
      const [gave, received] = await Promise.all([
        resolveStickerItemsByIds(gaveIds),
        resolveStickerItemsByIds(receivedIds),
      ]);
      if (!cancelled) {
        setGaveItems(gave);
        setReceivedItems(received);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [entry]);

  if (loading) {
    return (
      <Text variant="caption" color={theme.colors.textMuted}>
        {t('common.loading')}
      </Text>
    );
  }

  return (
    <View style={styles.wrap}>
      <TradeBundlePreview items={gaveItems} title={t('screens.trade.youGive')} />
      <TradeBundlePreview items={receivedItems} title={t('screens.trade.youReceive')} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.sm,
  },
});
