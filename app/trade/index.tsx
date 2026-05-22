import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TradeCompletedSummary } from '@/components/molecules/TradeCompletedSummary';
import { TradeDisclaimer } from '@/components/molecules/TradeDisclaimer';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import {
  encodedPayloadFromEntry,
  getOfferIdFromPayloadJson,
  isTradePayloadExpired,
  parsePayloadFromLog,
} from '@/domain/trade/tradeLogHelpers';
import { useCopyTradeToken } from '@/features/trade/useCopyTradeToken';
import { useTradableStickers } from '@/features/trade/useTradableStickers';
import { useTradeConfirm } from '@/features/trade/useTradeConfirm';
import { useTradeRegistryHealth } from '@/features/trade/useTradeRegistryHealth';
import type { TradeLogEntry } from '@/domain/types';
import { TradeConsumedRepository } from '@/services/db/TradeConsumedRepository';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import { theme } from '@/theme';

export default function TradeHubScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { stickerIds, loading, reload: reloadTradable } = useTradableStickers();
  const { confirmByOfferId, confirmByAck, isConfirming } = useTradeConfirm();
  const { copyText, copiedId } = useCopyTradeToken();
  const { configured: registryConfigured, online: registryOnline } = useTradeRegistryHealth();
  const [sentOffers, setSentOffers] = useState<TradeLogEntry[]>([]);
  const [importedDrafts, setImportedDrafts] = useState<TradeLogEntry[]>([]);
  const [completedTrades, setCompletedTrades] = useState<TradeLogEntry[]>([]);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [ackInput, setAckInput] = useState('');

  const reloadTrades = useCallback(async () => {
    await TradeConsumedRepository.syncFromTradeLog();
    const [sent, drafts, completed] = await Promise.all([
      TradeLogRepository.listSentOffers(),
      TradeLogRepository.listImportedDrafts(),
      TradeLogRepository.listCompleted(),
    ]);
    setSentOffers(sent);
    setImportedDrafts(drafts);
    setCompletedTrades(completed);
  }, []);

  useEffect(() => {
    void reloadTrades();
  }, [reloadTrades]);

  const goOffer = useCallback(() => router.push('/trade/offer'), [router]);
  const goAccept = useCallback(() => router.push('/trade/accept'), [router]);

  const handleCopyPayload = useCallback(
    async (entry: TradeLogEntry) => {
      try {
        const encoded = encodedPayloadFromEntry(entry);
        await copyText(encoded, `payload-${entry.id}`);
      } catch {
        setConfirmError('INVALID_TRADE_PAYLOAD');
      }
    },
    [copyText],
  );

  const handleContinueDraft = useCallback(
    (entry: TradeLogEntry) => {
      if (!entry.encoded_payload) return;
      router.push(`/trade/accept?p=${encodeURIComponent(entry.encoded_payload)}`);
    },
    [router],
  );

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

  const renderPendingRow = (entry: TradeLogEntry, actions: ReactNode) => {
    const offerId = getOfferIdFromPayloadJson(entry.payload_json);
    const expired = isTradePayloadExpired(entry.payload_json);
    return (
      <View key={entry.id} style={styles.pendingRow}>
        <View style={styles.rowMeta}>
          <Text variant="caption" numberOfLines={1} style={styles.tradeId}>
            {offerId?.slice(0, 8) ?? entry.id.slice(0, 8)}…
          </Text>
          {expired ? (
            <Text variant="caption" color={theme.colors.error}>
              {t('screens.trade.offerExpired')}
            </Text>
          ) : null}
        </View>
        {actions}
      </View>
    );
  };

  return (
    <ScreenTemplate title={t('screens.trade.title')}>
      <TradeDisclaimer />

      <Text variant="caption" color={theme.colors.textMuted} style={styles.trustNote}>
        {t('screens.trade.trustLimitNote')}
      </Text>

      {registryConfigured ? (
        <Text
          variant="caption"
          color={registryOnline ? theme.colors.success : theme.colors.textMuted}
          style={styles.registryBadge}
        >
          {registryOnline
            ? t('screens.trade.registryOnline')
            : t('screens.trade.registryOffline')}
        </Text>
      ) : (
        <Text variant="caption" color={theme.colors.textMuted} style={styles.registryBadge}>
          {t('screens.trade.registryNotConfigured')}
        </Text>
      )}

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

      {sentOffers.length > 0 ? (
        <View style={styles.section}>
          <Text variant="bodyBold">{t('screens.trade.yourOffers')}</Text>
          <Text variant="caption" color={theme.colors.textMuted} style={styles.sectionHint}>
            {t('screens.trade.copyPayloadAgainHint')}
          </Text>
          {sentOffers.map((entry) => {
            const offerId = getOfferIdFromPayloadJson(entry.payload_json);
            const payload = parsePayloadFromLog(entry.payload_json);
            const isV1 = payload?.v === 1;
            return renderPendingRow(
              entry,
              <View style={styles.rowActions}>
                <Button
                  label={
                    copiedId === `payload-${entry.id}`
                      ? '✓'
                      : t('screens.trade.copyPayloadAgain')
                  }
                  size="sm"
                  variant="secondary"
                  onPress={() => void handleCopyPayload(entry)}
                  disabled={isTradePayloadExpired(entry.payload_json)}
                />
                {isV1 && offerId ? (
                  <Button
                    label={t('screens.trade.confirmIncoming')}
                    size="sm"
                    onPress={() => void handleConfirm(offerId)}
                    disabled={isConfirming}
                  />
                ) : (
                  <Text variant="caption" color={theme.colors.textMuted}>
                    {t('screens.trade.pasteAck')}
                  </Text>
                )}
              </View>,
            );
          })}
        </View>
      ) : null}

      {importedDrafts.length > 0 ? (
        <View style={styles.section}>
          <Text variant="bodyBold">{t('screens.trade.importedOffers')}</Text>
          {importedDrafts.map((entry) =>
            renderPendingRow(
              entry,
              <View style={styles.rowActions}>
                <Button
                  label={
                    copiedId === `payload-${entry.id}`
                      ? '✓'
                      : t('screens.trade.copyPayloadAgain')
                  }
                  size="sm"
                  variant="secondary"
                  onPress={() => void handleCopyPayload(entry)}
                  disabled={isTradePayloadExpired(entry.payload_json)}
                />
                <Button
                  label={t('screens.trade.continueAccept')}
                  size="sm"
                  onPress={() => handleContinueDraft(entry)}
                  disabled={!entry.encoded_payload || isTradePayloadExpired(entry.payload_json)}
                />
              </View>,
            ),
          )}
        </View>
      ) : null}

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

      <View style={styles.section}>
        <Text variant="bodyBold">{t('screens.trade.completedTrades')}</Text>
        <Text variant="caption" color={theme.colors.textMuted} style={styles.sectionHint}>
          {t('screens.trade.completedTradesHint')}
        </Text>
        {completedTrades.length === 0 ? (
          <Text variant="caption" color={theme.colors.textMuted} style={styles.noTrades}>
            {t('screens.trade.noTrades')}
          </Text>
        ) : (
          completedTrades.map((entry) => (
            <View key={entry.id} style={styles.completedCard}>
              <Text variant="caption" color={theme.colors.success} style={styles.completedLabel}>
                {t('screens.trade.accepted')}
              </Text>
              <TradeCompletedSummary entry={entry} />
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
  trustNote: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  registryBadge: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
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
  sectionHint: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  noTrades: {
    marginTop: theme.spacing.sm,
  },
  completedCard: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  completedLabel: {
    marginBottom: theme.spacing.xs,
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
  rowMeta: {
    flex: 1,
    gap: 2,
  },
  rowActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    justifyContent: 'flex-end',
  },
  tradeId: {
    flexShrink: 1,
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
