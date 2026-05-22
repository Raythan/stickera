import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TradeBundlePreview } from '@/components/molecules/TradeBundlePreview';
import { getInitiatorOfferedIds } from '@/domain/trade/payloadHelpers';
import { parsePayloadFromLog } from '@/domain/trade/tradeLogHelpers';
import type { TradableStickerItem } from '@/domain/types';
import { resolveStickerItemsByIds } from '@/features/trade/tradableStickerItems';
import { theme } from '@/theme';

import type { TradePendingOfferPreviewProps } from './TradePendingOfferPreview.types';

export function TradePendingOfferPreview({ payloadJson, title }: TradePendingOfferPreviewProps) {
  const { t } = useTranslation();
  const [items, setItems] = useState<TradableStickerItem[]>([]);

  useEffect(() => {
    const payload = parsePayloadFromLog(payloadJson);
    if (!payload) {
      setItems([]);
      return;
    }
    const ids = getInitiatorOfferedIds(payload);
    void resolveStickerItemsByIds(ids).then(setItems);
  }, [payloadJson]);

  if (items.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <TradeBundlePreview
        items={items}
        title={title ?? t('screens.trade.pendingOfferPreview')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: theme.spacing.sm,
  },
});
