import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

import type { TimerBadgeProps } from './TimerBadge.types';

export function TimerBadge({ canOpen, pendingPacks, maxPacks, formattedTime }: TimerBadgeProps) {
  const { t } = useTranslation();
  const atCapacity = pendingPacks >= maxPacks;

  return (
    <View style={styles.wrap}>
      <Text variant="caption" color={theme.colors.textMuted} style={styles.bank}>
        {t('screens.pack.bank', { pending: pendingPacks, max: maxPacks })}
      </Text>
      <View style={[styles.badge, canOpen ? styles.ready : styles.waiting]}>
        <Icon
          name={canOpen ? 'gift-outline' : 'time-outline'}
          size={20}
          color={canOpen ? theme.colors.success : theme.colors.textMuted}
        />
        <Text
          variant="bodyBold"
          color={canOpen ? theme.colors.success : theme.colors.textMuted}
          style={styles.text}
        >
          {canOpen
            ? t('screens.pack.ready')
            : atCapacity
              ? t('screens.pack.cooldown', { time: formattedTime })
              : t('screens.pack.waitingAccrual', { time: formattedTime })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  bank: {
    textAlign: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 12,
  },
  ready: {
    backgroundColor: '#E8F5E9',
  },
  waiting: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  text: {
    marginLeft: theme.spacing.sm,
  },
});
