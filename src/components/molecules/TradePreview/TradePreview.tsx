import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

import type { TradePreviewProps } from './TradePreview.types';

function formatLabel(stickerId: string): string {
  const parts = stickerId.split(':');
  return parts.length >= 2 ? `#${parts[1]}` : stickerId;
}

export function TradePreview({ offeredStickerId, wantedStickerId }: TradePreviewProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        <Text variant="caption" color={theme.colors.error}>
          {t('screens.trade.youGive')}
        </Text>
        <Text variant="bodyBold">{formatLabel(offeredStickerId)}</Text>
      </View>
      <Icon name="swap-horizontal" size={28} color={theme.colors.secondary} />
      <View style={styles.side}>
        <Text variant="caption" color={theme.colors.success}>
          {t('screens.trade.youReceive')}
        </Text>
        <Text variant="bodyBold">{formatLabel(wantedStickerId)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  side: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
});
