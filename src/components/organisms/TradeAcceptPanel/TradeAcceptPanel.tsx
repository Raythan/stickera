import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TradeBundlePreview } from '@/components/molecules/TradeBundlePreview';
import { TradeQrScanner } from '@/components/molecules/TradeQrScanner';
import { TradeStickerSelectGrid } from '@/components/organisms/TradeStickerSelectGrid';
import type { TradableStickerItem } from '@/domain/types';
import { resolveStickerItemsByIds } from '@/features/trade/tradableStickerItems';
import { formatTradeError } from '@/features/trade/tradeErrorKey';
import { useTradableStickerItems } from '@/features/trade/useTradableStickerItems';
import { useTradeAccept } from '@/features/trade/useTradeAccept';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { TradeAcceptPanelProps } from './TradeAcceptPanel.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    modeRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    input: {
      backgroundColor: theme.colors.background,
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
      marginBottom: theme.spacing.sm,
    },
    from: {
      textAlign: 'center',
      marginBottom: theme.spacing.sm,
    },
    successBlock: {
      gap: theme.spacing.md,
      marginTop: theme.spacing.sm,
    },
    successText: {
      textAlign: 'center',
    },
    ackPayload: {
      textAlign: 'center',
    },
  });
}

export function TradeAcceptPanel({ initialEncoded, onTradeCompleted }: TradeAcceptPanelProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { decode, confirm, preview, offeredIds, isAccepting, error } = useTradeAccept();
  const { items: tradableItems, loading: tradableLoading } = useTradableStickerItems();
  const [input, setInput] = useState('');
  const [success, setSuccess] = useState(false);
  const [encodedAck, setEncodedAck] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [partnerItems, setPartnerItems] = useState<TradableStickerItem[]>([]);
  const [selectedAcceptorIds, setSelectedAcceptorIds] = useState<string[]>([]);
  const [inputMode, setInputMode] = useState<'paste' | 'scan'>('paste');

  const isV2 = preview?.v === 2;

  useEffect(() => {
    if (initialEncoded?.trim()) {
      setInput(initialEncoded.trim());
      setSelectedAcceptorIds([]);
      setSuccess(false);
      setEncodedAck(null);
      decode(initialEncoded.trim());
    }
  }, [initialEncoded, decode]);

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
      setSuccess(false);
      decode(input.trim());
    }
  }, [input, decode]);

  const handleScan = useCallback(
    (decoded: string) => {
      setInputMode('paste');
      setInput(decoded);
      setSelectedAcceptorIds([]);
      setSuccess(false);
      decode(decoded);
    },
    [decode],
  );

  const handleConfirm = useCallback(async () => {
    const result = await confirm(isV2 ? selectedAcceptorIds : []);
    if (result.ok) {
      setSuccess(true);
      setEncodedAck(result.encodedAck);
      onTradeCompleted?.();
    }
  }, [confirm, isV2, selectedAcceptorIds, onTradeCompleted]);

  const handleCopyAck = useCallback(async () => {
    if (!encodedAck || Platform.OS !== 'web' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(encodedAck);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [encodedAck]);

  const selectedCounterItems = tradableItems.filter((i) =>
    selectedAcceptorIds.includes(i.stickerId),
  );

  const canConfirmV2 = isV2 && selectedAcceptorIds.length > 0;
  const canConfirmV1 = !isV2 && preview !== null;

  if (success && encodedAck) {
    return (
      <View style={styles.successBlock}>
        <Text variant="bodyBold" color={colors.success} style={styles.successText}>
          {t('screens.trade.success')}
        </Text>
        <Text variant="caption" color={colors.textMuted} style={styles.successText}>
          {t('screens.trade.ackHint')}
        </Text>
        <Text variant="caption" color={colors.textMuted} numberOfLines={4} style={styles.ackPayload}>
          {encodedAck}
        </Text>
        {Platform.OS === 'web' ? (
          <Button label={copied ? '✓' : t('screens.trade.copyAck')} onPress={handleCopyAck} />
        ) : null}
      </View>
    );
  }

  return (
    <View>
      <View style={styles.modeRow}>
        <Button
          label={t('screens.trade.inputModePaste')}
          size="sm"
          variant={inputMode === 'paste' ? 'primary' : 'secondary'}
          onPress={() => setInputMode('paste')}
        />
        {Platform.OS === 'web' ? (
          <Button
            label={t('screens.trade.inputModeScan')}
            size="sm"
            variant={inputMode === 'scan' ? 'primary' : 'secondary'}
            onPress={() => setInputMode('scan')}
          />
        ) : null}
      </View>

      {inputMode === 'scan' && Platform.OS === 'web' ? (
        <TradeQrScanner active={!preview} onScan={handleScan} />
      ) : (
        <>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="eyJ2IjoyLC..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
          />

          <Button
            label={t('screens.trade.previewOffer')}
            variant="secondary"
            onPress={handleDecode}
            disabled={!input.trim()}
          />
        </>
      )}

      {error ? (
        <Text variant="caption" color={colors.error} style={styles.error}>
          {formatTradeError(t, error)}
        </Text>
      ) : null}

      {preview ? (
        <View>
          {preview.fromDisplayName ? (
            <Text variant="caption" color={colors.textMuted} style={styles.from}>
              {preview.fromDisplayName}
            </Text>
          ) : null}

          <TradeBundlePreview
            items={partnerItems}
            title={t('screens.trade.partnerOffers')}
          />

          {isV2 ? (
            tradableLoading ? (
              <Text variant="body" color={colors.textMuted}>
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
    </View>
  );
}
