import { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TradeBundlePreview } from '@/components/molecules/TradeBundlePreview';
import { TradeQrDisplay } from '@/components/molecules/TradeQrDisplay';
import { ScreenBackLink } from '@/components/molecules/ScreenBackLink';
import { TradeStickerSelectGrid } from '@/components/organisms/TradeStickerSelectGrid';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { QR_RECOMMENDED_MAX_STICKERS } from '@/domain/trade/constants';
import { formatTradeError } from '@/features/trade/tradeErrorKey';
import { useTradableStickerItems } from '@/features/trade/useTradableStickerItems';
import { useTradeOffer } from '@/features/trade/useTradeOffer';
import type { AppTheme } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    actions: {
      marginVertical: theme.spacing.md,
    },
    hint: {
      marginTop: theme.spacing.md,
      textAlign: 'center',
    },
    error: {
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
  });
}

export default function TradeOfferScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { items, loading } = useTradableStickerItems();
  const { createOffer, isCreating } = useTradeOffer();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [encoded, setEncoded] = useState<string | null>(null);
  const [offerCount, setOfferCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);

  const toggleId = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const selectedItems = items.filter((i) => selectedIds.includes(i.stickerId));

  const handleCreate = useCallback(async () => {
    if (selectedIds.length === 0) return;
    setOfferError(null);
    const result = await createOffer({ offeredIds: selectedIds });
    if (result.ok) {
      setEncoded(result.encoded);
      setOfferCount(result.payload.offeredIds.length);
    } else {
      setOfferError(result.reason);
    }
  }, [selectedIds, createOffer]);

  const handleCopy = useCallback(async () => {
    if (!encoded) return;
    if (Platform.OS === 'web' && navigator.clipboard) {
      await navigator.clipboard.writeText(encoded);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [encoded]);

  const screenProps = {
    showHeader: false as const,
    showBack: false as const,
    showHome: false as const,
    showLocale: false as const,
  };

  if (encoded) {
    const showQr = offerCount <= QR_RECOMMENDED_MAX_STICKERS;
    return (
      <ScreenTemplate {...screenProps}>
        <ScreenBackLink title={t('screens.trade.offerReady')} />
        <TradeBundlePreview items={selectedItems} title={t('screens.trade.youGive')} />
        {showQr ? <TradeQrDisplay payload={encoded} /> : null}
        {!showQr ? (
          <Text variant="caption" color={colors.secondary} style={styles.hint}>
            {t('screens.trade.useCopyNotQr')}
          </Text>
        ) : null}
        <View style={styles.actions}>
          <Button
            label={copied ? '✓' : t('screens.trade.copyPayload')}
            onPress={handleCopy}
            variant={copied ? 'ghost' : 'primary'}
          />
        </View>
        <Text variant="caption" color={colors.textMuted} style={styles.hint}>
          {t('screens.trade.savedInTradeLog')}
        </Text>
      </ScreenTemplate>
    );
  }

  return (
    <ScreenTemplate {...screenProps}>
      <ScreenBackLink title={t('screens.trade.createOffer')} />
      {loading ? (
        <Text variant="body" color={colors.textMuted}>
          {t('common.loading')}
        </Text>
      ) : (
        <>
          <TradeStickerSelectGrid
            items={items}
            selectedIds={selectedIds}
            onToggle={toggleId}
            label={t('screens.trade.selectOfferedVisual')}
          />
          {selectedIds.length > 0 ? (
            <TradeBundlePreview items={selectedItems} />
          ) : null}
          {offerError ? (
            <Text variant="caption" color={colors.error} style={styles.error}>
              {formatTradeError(t, offerError)}
            </Text>
          ) : null}
          <Button
            label={t('screens.trade.createOffer')}
            onPress={handleCreate}
            disabled={selectedIds.length === 0 || isCreating}
          />
        </>
      )}
    </ScreenTemplate>
  );
}
