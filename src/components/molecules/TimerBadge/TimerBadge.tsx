import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { TimerBadgeProps } from './TimerBadge.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.success,
    },
    waiting: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    text: {
      marginLeft: theme.spacing.sm,
    },
  });
}

export function TimerBadge({ canOpen, pendingPacks, maxPacks, formattedTime }: TimerBadgeProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const atCapacity = pendingPacks >= maxPacks;

  return (
    <View style={styles.wrap}>
      <Text variant="caption" color={colors.textMuted} style={styles.bank}>
        {t('screens.pack.bank', { pending: pendingPacks, max: maxPacks })}
      </Text>
      <View style={[styles.badge, canOpen ? styles.ready : styles.waiting]}>
        <Icon
          name={canOpen ? 'gift-outline' : 'time-outline'}
          size={20}
          color={canOpen ? colors.success : colors.textMuted}
        />
        <Text
          variant="bodyBold"
          color={canOpen ? colors.success : colors.textMuted}
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
