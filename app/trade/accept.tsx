import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TradePreview } from '@/components/molecules/TradePreview';
import { TradeDisclaimer } from '@/components/molecules/TradeDisclaimer';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useTradeAccept } from '@/features/trade/useTradeAccept';
import { theme } from '@/theme';

function tradeErrorKey(error: string): string | null {
  const known = [
    'expired',
    'insufficientDuplicate',
    'insufficientWanted',
    'invalidPayload',
    'wantedNotInCatalog',
    'offeredNotInCatalog',
  ];
  if (error === 'INVALID_TRADE_PAYLOAD') return 'errors.trade.invalidPayload';
  if (known.includes(error)) return `errors.trade.${error}`;
  return null;
}

export default function TradeAcceptScreen() {
  const { t } = useTranslation();
  const { p } = useLocalSearchParams<{ p?: string }>();
  const { decode, confirm, preview, isAccepting, error } = useTradeAccept();
  const [input, setInput] = useState('');
  const [success, setSuccess] = useState(false);
  const [encodedAck, setEncodedAck] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (p) {
      setInput(p);
      decode(p);
    }
  }, [p, decode]);

  const handleDecode = useCallback(() => {
    if (input.trim()) decode(input.trim());
  }, [input, decode]);

  const handleConfirm = useCallback(async () => {
    const result = await confirm();
    if (result.ok) {
      setSuccess(true);
      setEncodedAck(result.encodedAck);
    }
  }, [confirm]);

  const handleCopyAck = useCallback(async () => {
    if (!encodedAck || Platform.OS !== 'web' || !navigator.clipboard) return;
    await navigator.clipboard.writeText(encodedAck);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [encodedAck]);

  const errorKey = error ? tradeErrorKey(error) : null;

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
          <Button
            label={copied ? '✓' : t('screens.trade.copyAck')}
            onPress={handleCopyAck}
          />
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
        placeholder="eyJ2IjoxLC..."
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
          <TradePreview
            offeredStickerId={preview.offered.stickerId}
            wantedStickerId={preview.wanted.stickerId}
          />
          {preview.fromDisplayName ? (
            <Text variant="caption" color={theme.colors.textMuted} style={styles.from}>
              {preview.fromDisplayName}
            </Text>
          ) : null}
          <Button
            label={t('screens.trade.confirm')}
            onPress={handleConfirm}
            disabled={isAccepting}
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
