import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Text';
import { TradeDisclaimer } from '@/components/molecules/TradeDisclaimer';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useTradableStickers } from '@/features/trade/useTradableStickers';
import { TradeLogRepository } from '@/services/db/TradeLogRepository';
import type { TradeLogEntry } from '@/domain/types';
import { theme } from '@/theme';

export default function TradeHubScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { stickerIds, loading } = useTradableStickers();
  const [recentTrades, setRecentTrades] = useState<TradeLogEntry[]>([]);

  useEffect(() => {
    void TradeLogRepository.listRecent(10).then(setRecentTrades);
  }, []);

  const goOffer = useCallback(() => router.push('/trade/offer'), [router]);
  const goAccept = useCallback(() => router.push('/trade/accept'), [router]);

  return (
    <ScreenTemplate title={t('screens.trade.title')}>
      <TradeDisclaimer />

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
  actions: {
    gap: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  section: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.lg,
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
  tradeId: {
    flex: 1,
  },
});
