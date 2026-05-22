import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { useAppBootstrap } from '@/features/sync/useAppBootstrap';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
}

export function AppBootstrapGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { ready, error } = useAppBootstrap();

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text variant="body" color={colors.textMuted} style={styles.text}>
          {t('common.loading')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text variant="body" color={colors.error}>
          {t('errors.bootstrapFailed')}
        </Text>
        <Text variant="caption" color={colors.textMuted} style={styles.text}>
          {error}
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
