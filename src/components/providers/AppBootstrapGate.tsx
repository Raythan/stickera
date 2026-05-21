import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { useAppBootstrap } from '@/features/sync/useAppBootstrap';
import { theme } from '@/theme';

export function AppBootstrapGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { ready, error } = useAppBootstrap();

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text variant="body" color={theme.colors.textMuted} style={styles.text}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text variant="body" color={theme.colors.error}>
          {t('errors.bootstrapFailed')}
        </Text>
        <Text variant="caption" color={theme.colors.textMuted} style={styles.text}>
          {error}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    gap: theme.spacing.md,
  },
  text: {
    marginTop: theme.spacing.sm,
  },
});
