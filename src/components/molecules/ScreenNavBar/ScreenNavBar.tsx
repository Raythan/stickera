import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

import type { ScreenNavBarProps } from './ScreenNavBar.types';

export function ScreenNavBar({ title, showBack = true, showHome = true }: ScreenNavBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
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
          >
            <Icon name="arrow-back" size={22} color={theme.colors.secondary} />
            <Text variant="caption" color={theme.colors.secondary} style={styles.btnLabel}>
              {t('nav.back')}
            </Text>
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
        {showHome ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('nav.homeLong')}
            onPress={() => router.replace('/(tabs)')}
            style={[styles.btn, styles.btnEnd]}
          >
            <Text variant="caption" color={theme.colors.secondary} style={styles.btnLabel}>
              {t('nav.homeLong')}
            </Text>
            <Icon name="home-outline" size={22} color={theme.colors.secondary} />
          </Pressable>
        ) : (
          <View style={styles.sidePlaceholder} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  side: {
    minWidth: 88,
    maxWidth: '32%',
  },
  sideEnd: {
    alignItems: 'flex-end',
  },
  sidePlaceholder: {
    minWidth: 88,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.xs,
  },
  btnEnd: {
    justifyContent: 'flex-end',
  },
  btnLabel: {
    flexShrink: 1,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: theme.spacing.xs,
  },
  titleSpacer: {
    flex: 1,
  },
});
