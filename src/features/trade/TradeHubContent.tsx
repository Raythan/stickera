import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { TradeCompletedSummary } from '@/components/molecules/TradeCompletedSummary';
import { TradeDisclaimer } from '@/components/molecules/TradeDisclaimer';
import { TradePendingOfferPreview } from '@/components/molecules/TradePendingOfferPreview';
import { TradeAcceptPanel } from '@/components/organisms/TradeAcceptPanel';
import {
  encodedPayloadFromEntry,
  getOfferIdFromPayloadJson,
} from '@/domain/trade/tradeLogHelpers';
import type { TradeLogEntry } from '@/domain/types';
import { formatTradeError } from '@/features/trade/tradeErrorKey';
import { useCopyTradeToken } from '@/features/trade/useCopyTradeToken';
import { useTradableStickers } from '@/features/trade/useTradableStickers';
import { useTradeInitiatorSync } from '@/features/trade/useTradeInitiatorSync';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import {
  assertRegistryAvailable,
  isTradeRegistryConfigured,
} from '@/services/trade/TradeRegistryClient';
import type { AppTheme } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

export type TradeHubContentProps = {
  initialEncoded?: string;
};

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    emptyWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      gap: theme.spacing.md,
      minHeight: 280,
    },
    emptyIcon: {
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      textAlign: 'center',
    },
    topActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    topActionBtn: {
      flex: 1,
    },
    banner: {
      textAlign: 'center',
      marginBottom: theme.spacing.md,
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
      marginBottom: theme.spacing.sm,
    },
    pendingRow: {
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.xs,
    },
    pendingFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
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
    completedCard: {
      paddingVertical: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    completedLabel: {
      marginBottom: theme.spacing.xs,
    },
    historyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
      flexWrap: 'wrap',
    },
    historyTitleBlock: {
      flex: 1,
      minWidth: 120,
    },
  });
}

export function TradeHubContent({ initialEncoded }: TradeHubContentProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { stickerIds, loading, reload: reloadTradable } = useTradableStickers();
  const { copyText, copiedId } = useCopyTradeToken();
  const [sentOffers, setSentOffers] = useState<TradeLogEntry[]>([]);
  const [completedTrades, setCompletedTrades] = useState<TradeLogEntry[]>([]);
  const [acceptPanelOpen, setAcceptPanelOpen] = useState(Boolean(initialEncoded));
  const [acceptInitialEncoded, setAcceptInitialEncoded] = useState<string | undefined>(
    initialEncoded,
  );
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [registryOk, setRegistryOk] = useState<boolean | null>(null);

  const reloadTrades = useCallback(async () => {
    await TradeLogRepository.archiveStaleSentOffers();
    const [sent, completed] = await Promise.all([
      TradeLogRepository.listSentOffers(),
      TradeLogRepository.listCompleted(),
    ]);
    setSentOffers(sent);
    setCompletedTrades(completed);
  }, []);

  const handleTradeCompleted = useCallback(async () => {
    await reloadTrades();
    await reloadTradable();
  }, [reloadTrades, reloadTradable]);

  useTradeInitiatorSync(registryOk === true, handleTradeCompleted);

  useEffect(() => {
    void reloadTrades();
  }, [reloadTrades]);

  useEffect(() => {
    void (async () => {
      if (!isTradeRegistryConfigured()) {
        setRegistryOk(false);
        return;
      }
      const check = await assertRegistryAvailable(true);
      setRegistryOk(check.ok);
    })();
  }, []);

  useEffect(() => {
    if (initialEncoded?.trim()) {
      setAcceptInitialEncoded(initialEncoded.trim());
      setAcceptPanelOpen(true);
    }
  }, [initialEncoded]);

  const goOffer = useCallback(() => router.push('/(tabs)/trade/offer'), [router]);

  const handleCopyPayload = useCallback(
    async (entry: TradeLogEntry) => {
      try {
        const encoded = encodedPayloadFromEntry(entry);
        await copyText(encoded, `payload-${entry.id}`);
      } catch {
        // ignore
      }
    },
    [copyText],
  );

  const renderPendingRow = (entry: TradeLogEntry, actions: ReactNode) => {
    const offerId = getOfferIdFromPayloadJson(entry.payload_json);
    return (
      <View key={entry.id} style={styles.pendingRow}>
        <TradePendingOfferPreview payloadJson={entry.payload_json} />
        <View style={styles.pendingFooter}>
          <View style={styles.rowMeta}>
            <Text variant="caption" numberOfLines={1} style={styles.tradeId}>
              {offerId?.slice(0, 8) ?? entry.id.slice(0, 8)}…
            </Text>
            <Text variant="caption" color={colors.textMuted}>
              {t('screens.trade.waitingPartnerClaim')}
            </Text>
          </View>
          {actions}
        </View>
      </View>
    );
  };

  if (!loading && stickerIds.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyIcon}>
          <Icon name="swap-horizontal" size={56} color={colors.textMuted} />
        </View>
        <Text variant="body" color={colors.textMuted} style={styles.emptyText}>
          {t('screens.trade.noDuplicates')}
        </Text>
        <Text variant="caption" color={colors.textMuted} style={styles.emptyText}>
          {t('screens.trade.noDuplicatesHint')}
        </Text>
      </View>
    );
  }

  const tradeBlocked = registryOk === false;

  return (
    <>
      <View style={styles.topActions}>
        <View style={styles.topActionBtn}>
          <Button
            label={t('screens.trade.createOffer')}
            onPress={goOffer}
            disabled={loading || stickerIds.length === 0 || tradeBlocked}
            fullWidth
          />
        </View>
        <View style={styles.topActionBtn}>
          <Button
            label={t('screens.trade.acceptOffer')}
            variant={acceptPanelOpen ? 'primary' : 'secondary'}
            onPress={() => setAcceptPanelOpen((v) => !v)}
            disabled={tradeBlocked}
            fullWidth
          />
        </View>
      </View>

      {tradeBlocked ? (
        <Text variant="caption" color={colors.error} style={styles.banner}>
          {formatTradeError(
            t,
            isTradeRegistryConfigured() ? 'REGISTRY_UNAVAILABLE' : 'REGISTRY_NOT_CONFIGURED',
          )}
        </Text>
      ) : null}

      <TradeDisclaimer />

      {acceptPanelOpen ? (
        <View style={styles.section}>
          <Text variant="caption" color={colors.textMuted} style={styles.sectionHint}>
            {t('screens.trade.roleAcceptorHint')}
          </Text>
          <TradeAcceptPanel
            initialEncoded={acceptInitialEncoded}
            onTradeCompleted={handleTradeCompleted}
          />
        </View>
      ) : null}

      {sentOffers.length > 0 ? (
        <View style={styles.section}>
          <Text variant="bodyBold">{t('screens.trade.yourOffers')}</Text>
          <Text variant="caption" color={colors.textMuted} style={styles.sectionHint}>
            {t('screens.trade.yourOffersHint')}
          </Text>
          {sentOffers.map((entry) =>
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
                />
              </View>,
            ),
          )}
        </View>
      ) : null}

      <View style={styles.section}>
        <View style={styles.historyHeader}>
          <View style={styles.historyTitleBlock}>
            <Text variant="bodyBold">{t('screens.trade.completedTrades')}</Text>
            <Text variant="caption" color={colors.textMuted}>
              {completedTrades.length === 0
                ? t('screens.trade.noTrades')
                : t('screens.trade.historyCount', { count: completedTrades.length })}
            </Text>
          </View>
          {completedTrades.length > 0 ? (
            <Button
              label={
                historyExpanded
                  ? t('screens.trade.hideHistory')
                  : t('screens.trade.viewHistory')
              }
              size="sm"
              variant="ghost"
              onPress={() => setHistoryExpanded((v) => !v)}
            />
          ) : null}
        </View>
        {historyExpanded && completedTrades.length > 0 ? (
          <>
            <Text variant="caption" color={colors.textMuted} style={styles.sectionHint}>
              {t('screens.trade.completedTradesHint')}
            </Text>
            {completedTrades.map((entry) => (
              <View key={entry.id} style={styles.completedCard}>
                <Text variant="caption" color={colors.success} style={styles.completedLabel}>
                  {t('screens.trade.accepted')}
                </Text>
                <TradeCompletedSummary entry={entry} />
              </View>
            ))}
          </>
        ) : null}
      </View>
    </>
  );
}
