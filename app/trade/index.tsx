import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TradeDisclaimer } from '@/components/molecules/TradeDisclaimer';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import type { TradeLogEntry } from '@/domain/types';
import { useTradableStickers } from '@/features/trade/useTradableStickers';
import { useTradeConfirm } from '@/features/trade/useTradeConfirm';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import { theme } from '@/theme';

function parseOfferId(payloadJson: string): string | null {
  try {
    const payload = JSON.parse(payloadJson) as { offerId?: string };
    return payload.offerId ?? null;
  } catch {
    return null;
  }
}

export default function TradeHubScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { stickerIds, loading, reload: reloadTradable } = useTradableStickers();
  const { confirmByOfferId, confirmByAck, isConfirming } = useTradeConfirm();
  const [recentTrades, setRecentTrades] = useState<TradeLogEntry[]>([]);
  const [pendingSent, setPendingSent] = useState<TradeLogEntry[]>([]);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [ackInput, setAckInput] = useState('');

  const reloadTrades = useCallback(async () => {
    const all = await TradeLogRepository.listRecent(20);
    setRecentTrades(all);
    setPendingSent(all.filter((e) => e.status === 'sent'));
  }, []);

  useEffect(() => {
    void reloadTrades();
  }, [reloadTrades]);

  const goOffer = useCallback(() => router.push('/trade/offer'), [router]);
  const goAccept = useCallback(() => router.push('/trade/accept'), [router]);

  const handleConfirm = useCallback(
    async (offerId: string) => {
      setConfirmError(null);
      setConfirmSuccess(false);
      const result = await confirmByOfferId(offerId);
      if (result.ok) {
        setConfirmSuccess(true);
        await reloadTrades();
        await reloadTradable();
      } else {
        setConfirmError(result.reason);
      }
    },
    [confirmByOfferId, reloadTrades, reloadTradable],
  );

  const handleConfirmAck = useCallback(async () => {
    setConfirmError(null);
    setConfirmSuccess(false);
    const result = await confirmByAck(ackInput);
    if (result.ok) {
      setConfirmSuccess(true);
      setAckInput('');
      await reloadTrades();
      await reloadTradable();
    } else {
      setConfirmError(result.reason);
    }
  }, [confirmByAck, ackInput, reloadTrades, reloadTradable]);

  return (
    <ScreenTemplate title={t('screens.trade.title')}>
      <TradeDisclaimer />

      {confirmSuccess ? (
        <Text variant="body" color={theme.colors.success} style={styles.banner}>
          {t('screens.trade.success')}
        </Text>
      ) : null}

      {confirmError ? (
        <Text variant="caption" color={theme.colors.error} style={styles.banner}>
          {confirmError}
        </Text>
      ) : null}

      {!loading && stickerIds.length === 0 ? (
        <Text variant="body" color={theme.colors.textMuted} style={styles.empty}>
          {t('screens.trade.noDuplicates')}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Button
          label={t('screens.trade.createOffer')}
          onPress={goOffer}
          disabled={loading || stickerIds.length === 0}
        />
        <Button
          label={t('screens.trade.pastePayload')}
          variant="secondary"
          onPress={goAccept}
        />
      </View>

      <View style={styles.section}>
        <Text variant="bodyBold">{t('screens.trade.pasteAck')}</Text>
        <TextInput
          style={styles.ackInput}
          value={ackInput}
          onChangeText={setAckInput}
          placeholder="ack…"
          placeholderTextColor={theme.colors.textMuted}
          multiline
        />
        <Button
          label={t('screens.trade.confirmIncoming')}
          size="sm"
          onPress={() => void handleConfirmAck()}
          disabled={isConfirming || !ackInput.trim()}
        />
      </View>

      {pendingSent.length > 0 ? (
        <View style={styles.section}>
          <Text variant="bodyBold">{t('screens.trade.pendingIncoming')}</Text>
          {pendingSent.map((entry) => {
            const offerId = parseOfferId(entry.payload_json);
            if (!offerId) return null;
            return (
              <View key={entry.id} style={styles.pendingRow}>
                <Text variant="caption" numberOfLines={1} style={styles.tradeId}>
                  {offerId.slice(0, 8)}…
                </Text>
                <Button
                  label={t('screens.trade.confirmIncoming')}
                  size="sm"
                  onPress={() => void handleConfirm(offerId)}
                  disabled={isConfirming}
                />
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={styles.section}>
        <Text variant="bodyBold">{t('screens.trade.recentTrades')}</Text>
        {recentTrades.length === 0 ? (
          <Text variant="caption" color={theme.colors.textMuted} style={styles.noTrades}>
            {t('screens.trade.noTrades')}
          </Text>
        ) : (
          recentTrades.map((entry) => (
            <View key={entry.id} style={styles.tradeRow}>
              <Text variant="caption" numberOfLines={1} style={styles.tradeId}>
                {entry.id.slice(0, 8)}…
              </Text>
              <Text
                variant="caption"
                color={entry.status === 'completed' ? theme.colors.success : theme.colors.textMuted}
              >
                {entry.status}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  empty: {
    textAlign: 'center',
    marginVertical: theme.spacing.xl,
  },
  banner: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  actions: {
    gap: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  noTrades: {
    marginTop: theme.spacing.sm,
  },
  tradeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  pendingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  tradeId: {
    flex: 1,
  },
  ackInput: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm,
    color: theme.colors.text,
    minHeight: 48,
    marginBottom: theme.spacing.sm,
    textAlignVertical: 'top',
  },
});
