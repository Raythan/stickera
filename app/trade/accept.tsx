import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TradePreview } from '@/components/molecules/TradePreview';
import { TradeDisclaimer } from '@/components/molecules/TradeDisclaimer';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useTradeAccept } from '@/features/trade/useTradeAccept';
import { theme } from '@/theme';

export default function TradeAcceptScreen() {
  const { t } = useTranslation();
  const { p } = useLocalSearchParams<{ p?: string }>();
  const { decode, confirm, preview, isAccepting, error } = useTradeAccept();
  const [input, setInput] = useState('');
  const [success, setSuccess] = useState(false);

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
    if (result.ok) setSuccess(true);
  }, [confirm]);

  const errorKey = error ? `errors.trade.${error === 'INVALID_TRADE_PAYLOAD' ? 'invalidPayload' : error}` : null;

  if (success) {
    return (
      <ScreenTemplate title={t('screens.trade.title')}>
        <Text variant="h2" color={theme.colors.success} style={styles.successText}>
          {t('screens.trade.success')}
        </Text>
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
        label={t('screens.trade.confirm')}
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
  },
});
