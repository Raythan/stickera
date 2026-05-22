import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { ScreenBackLinkProps } from './ScreenBackLink.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.md,
      minHeight: 40,
    },
    btn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.xs,
      paddingRight: theme.spacing.sm,
    },
    title: {
      flex: 1,
    },
  });
}

export function ScreenBackLink({ title }: ScreenBackLinkProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!router.canGoBack()) {
    return title ? (
      <Text variant="h2" style={styles.title}>
        {title}
      </Text>
    ) : null;
  }

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.back')}
        onPress={() => router.back()}
        style={styles.btn}
        hitSlop={8}
      >
        <Icon name="arrow-back" size={24} color={colors.secondary} />
        <Text variant="body" color={colors.secondary}>
          {t('nav.back')}
        </Text>
      </Pressable>
      {title ? (
        <Text variant="h2" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : null}
    </View>
  );
}
