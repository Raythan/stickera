import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { HeaderLocaleMenu } from '@/components/molecules/HeaderLocaleMenu';
import { HeaderHomeButton } from '@/components/molecules/HeaderHomeButton';
import type { AppTheme } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { ScreenNavBarProps } from './ScreenNavBar.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 44,
      paddingVertical: theme.spacing.xs,
    },
    side: {
      width: 48,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    sideEnd: {
      alignItems: 'flex-end',
      width: 96,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    sidePlaceholder: {
      width: 48,
    },
    btn: {
      padding: theme.spacing.xs,
    },
    title: {
      flex: 1,
      textAlign: 'center',
      marginHorizontal: theme.spacing.xs,
      color: theme.colors.text,
    },
    titleSpacer: {
      flex: 1,
    },
  });
}

export function ScreenNavBar({
  title,
  showBack = true,
  showHome = true,
  showLocale = true,
}: ScreenNavBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const canGoBack = router.canGoBack();

  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {showBack && canGoBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('nav.back')}
            onPress={() => router.back()}
            style={styles.btn}
            hitSlop={8}
          >
            <Icon name="arrow-back" size={24} color={colors.secondary} />
          </Pressable>
        ) : (
          <View style={styles.sidePlaceholder} />
        )}
      </View>

      {title ? (
        <Text variant="bodyBold" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.titleSpacer} />
      )}

      <View style={[styles.side, styles.sideEnd]}>
        {showLocale || showHome ? (
          <View style={styles.actions}>
            {showLocale ? <HeaderLocaleMenu /> : null}
            {showHome ? <HeaderHomeButton /> : null}
          </View>
        ) : (
          <View style={styles.sidePlaceholder} />
        )}
      </View>
    </View>
  );
}
