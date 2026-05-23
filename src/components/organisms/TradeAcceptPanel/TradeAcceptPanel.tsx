import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TradeBundlePreview } from '@/components/molecules/TradeBundlePreview';
import { TradeQrScanner } from '@/components/molecules/TradeQrScanner';
import { resolveStickerItemsByIds } from '@/features/trade/tradableStickerItems';
import { formatTradeError } from '@/features/trade/tradeErrorKey';
import { useTradeAccept } from '@/features/trade/useTradeAccept';
import type { TradableStickerItem } from '@/domain/types';
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
    actionRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    actionBtn: {
      flex: 1,
    },
  });
}

export function TradeAcceptPanel({ initialEncoded, onTradeCompleted }: TradeAcceptPanelProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const {
    decode,
    confirm,
    preview,
    offeredIds,
    isAccepting,
    error,
    acceptSuccess,
    clearPreview,
    resetSuccess,
  } = useTradeAccept();
  const [input, setInput] = useState('');
  const [partnerItems, setPartnerItems] = useState<TradableStickerItem[]>([]);
  const [inputMode, setInputMode] = useState<'paste' | 'scan'>('paste');

  useEffect(() => {
    if (initialEncoded?.trim()) {
      setInput(initialEncoded.trim());
      decode(initialEncoded.trim(), { via: 'paste' });
    }
  }, [initialEncoded, decode]);

  useEffect(() => {
    if (acceptSuccess) {
      onTradeCompleted?.();
    }
  }, [acceptSuccess, onTradeCompleted]);

  useEffect(() => {
    if (!preview || offeredIds.length === 0) {
      setPartnerItems([]);
      return;
    }
    void resolveStickerItemsByIds(offeredIds).then(setPartnerItems);
  }, [preview, offeredIds]);

  const handleDecode = useCallback(() => {
    if (input.trim()) {
      resetSuccess();
      decode(input.trim(), { via: 'paste' });
    }
  }, [input, decode, resetSuccess]);

  const handleScan = useCallback(
    (decoded: string) => {
      setInputMode('paste');
      setInput(decoded);
      resetSuccess();
      decode(decoded, { via: 'scan' });
    },
    [decode, resetSuccess],
  );

  const handleConfirm = useCallback(async () => {
    const result = await confirm();
    if (result.ok) {
      onTradeCompleted?.();
    }
  }, [confirm, onTradeCompleted]);

  const handleCancel = useCallback(() => {
    clearPreview();
    setInput('');
  }, [clearPreview]);

  if (acceptSuccess) {
    return (
      <View style={styles.successBlock}>
        <Text variant="bodyBold" color={colors.success} style={styles.successText}>
          {t('screens.trade.success')}
        </Text>
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
        <TradeQrScanner active={!preview && !isAccepting} onScan={handleScan} />
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
            disabled={!input.trim() || isAccepting}
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
            title={t('screens.trade.youReceive')}
          />

          <View style={styles.actionRow}>
            <View style={styles.actionBtn}>
              <Button
                label={t('screens.trade.cancelOffer')}
                variant="secondary"
                onPress={handleCancel}
                disabled={isAccepting}
              />
            </View>
            <View style={styles.actionBtn}>
              <Button
                label={t('screens.trade.acceptOffer')}
                onPress={() => void handleConfirm()}
                disabled={isAccepting}
              />
            </View>
          </View>
        </View>
      ) : null}

      {isAccepting ? (
        <Text variant="caption" color={colors.textMuted} style={styles.from}>
          {t('common.loading')}
        </Text>
      ) : null}
    </View>
  );
}
