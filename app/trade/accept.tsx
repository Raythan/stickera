import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TradeBundlePreview } from '@/components/molecules/TradeBundlePreview';
import { TradeDisclaimer } from '@/components/molecules/TradeDisclaimer';
import { TradeStickerSelectGrid } from '@/components/organisms/TradeStickerSelectGrid';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { resolveStickerItemsByIds } from '@/features/trade/tradableStickerItems';
import { useTradableStickerItems } from '@/features/trade/useTradableStickerItems';
import { useTradeAccept } from '@/features/trade/useTradeAccept';
import type { TradableStickerItem } from '@/domain/types';
import { theme } from '@/theme';

function tradeErrorKey(error: string): string | null {
  const known = [
    'expired',
    'insufficientDuplicate',
    'insufficientWanted',
    'invalidPayload',
    'wantedNotInCatalog',
    'offeredNotInCatalog',
    'tooManyStickers',
    'emptySelection',
  ];
  if (error === 'INVALID_TRADE_PAYLOAD') return 'errors.trade.invalidPayload';
  if (known.includes(error)) return `errors.trade.${error}`;
  return null;
}

export default function TradeAcceptScreen() {
  const { t } = useTranslation();
  const { p } = useLocalSearchParams<{ p?: string }>();
  const { decode, confirm, preview, offeredIds, isAccepting, error } = useTradeAccept();
  const { items: tradableItems, loading: tradableLoading } = useTradableStickerItems();
  const [input, setInput] = useState('');
  const [success, setSuccess] = useState(false);
  const [encodedAck, setEncodedAck] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [partnerItems, setPartnerItems] = useState<TradableStickerItem[]>([]);
  const [selectedAcceptorIds, setSelectedAcceptorIds] = useState<string[]>([]);

  const isV2 = preview?.v === 2;

  useEffect(() => {
    if (p) {
      setInput(p);
      decode(p);
    }
  }, [p, decode]);

  useEffect(() => {
    if (!preview || offeredIds.length === 0) {
      setPartnerItems([]);
      return;
    }
    void resolveStickerItemsByIds(offeredIds).then(setPartnerItems);
  }, [preview, offeredIds]);

  const toggleAcceptor = useCallback((id: string) => {
    setSelectedAcceptorIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const handleDecode = useCallback(() => {
    if (input.trim()) {
      setSelectedAcceptorIds([]);
      decode(input.trim());
    }
  }, [input, decode]);

  const handleConfirm = useCallback(async () => {
    const result = await confirm(isV2 ? selectedAcceptorIds : []);
    if (result.ok) {
      setSuccess(true);
      setEncodedAck(result.encodedAck);
    }
  }, [confirm, isV2, selectedAcceptorIds]);

  const handleCopyAck = useCallback(async () => {
    if (!encodedAck || Platform.OS !== 'web' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(encodedAck);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [encodedAck]);

  const errorKey = error ? tradeErrorKey(error) : null;
  const selectedCounterItems = tradableItems.filter((i) =>
    selectedAcceptorIds.includes(i.stickerId),
  );

  const canConfirmV2 = isV2 && selectedAcceptorIds.length > 0;
  const canConfirmV1 = !isV2 && preview !== null;

  if (success && encodedAck) {
    return (
      <ScreenTemplate title={t('screens.trade.title')}>
        <Text variant="h2" color={theme.colors.success} style={styles.successText}>
          {t('screens.trade.success')}
        </Text>
        <Text variant="caption" color={theme.colors.textMuted} style={styles.hint}>
          {t('screens.trade.ackHint')}
        </Text>
        <Text variant="caption" numberOfLines={3} style={styles.ackPayload}>
          {encodedAck}
        </Text>
        {Platform.OS === 'web' ? (
          <Button label={copied ? '✓' : t('screens.trade.copyAck')} onPress={handleCopyAck} />
        ) : null}
      </ScreenTemplate>
    );
  }

  return (
    <ScreenTemplate title={t('screens.trade.pastePayload')}>
      <TradeDisclaimer />

      <Text variant="caption" color={theme.colors.textMuted} style={styles.hint}>
        {t('screens.trade.pasteHint')}
      </Text>

      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="eyJ2IjoyLC..."
        placeholderTextColor={theme.colors.textMuted}
        multiline
        numberOfLines={3}
      />

      <Button
        label={t('screens.trade.previewOffer')}
        variant="secondary"
        onPress={handleDecode}
        disabled={!input.trim()}
      />

      {error ? (
        <Text variant="caption" color={theme.colors.error} style={styles.error}>
          {errorKey ? t(errorKey) : error}
        </Text>
      ) : null}

      {preview ? (
        <View>
          {preview.fromDisplayName ? (
            <Text variant="caption" color={theme.colors.textMuted} style={styles.from}>
              {preview.fromDisplayName}
            </Text>
          ) : null}

          <TradeBundlePreview
            items={partnerItems}
            title={t('screens.trade.partnerOffers')}
          />

          {isV2 ? (
            tradableLoading ? (
              <Text variant="body" color={theme.colors.textMuted}>
                {t('common.loading')}
              </Text>
            ) : (
              <>
                <TradeStickerSelectGrid
                  items={tradableItems}
                  selectedIds={selectedAcceptorIds}
                  onToggle={toggleAcceptor}
                  label={t('screens.trade.selectCounterOffer')}
                />
                {selectedAcceptorIds.length > 0 ? (
                  <TradeBundlePreview
                    items={selectedCounterItems}
                    title={t('screens.trade.youGive')}
                  />
                ) : null}
              </>
            )
          ) : null}

          <Button
            label={t('screens.trade.confirm')}
            onPress={handleConfirm}
            disabled={isAccepting || (!canConfirmV2 && !canConfirmV1)}
          />
        </View>
      ) : null}
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 14,
    minHeight: 80,
    marginBottom: theme.spacing.md,
    textAlignVertical: 'top',
  },
  error: {
    marginTop: theme.spacing.sm,
  },
  from: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  successText: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  ackPayload: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
});
