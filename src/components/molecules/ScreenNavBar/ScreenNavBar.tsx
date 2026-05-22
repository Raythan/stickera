import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { theme } from '@/theme';

import type { ScreenNavBarProps } from './ScreenNavBar.types';

export function ScreenNavBar({ showBack = true, showHome = true }: ScreenNavBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const canGoBack = router.canGoBack();

  return (
    <View style={styles.row}>
      {showBack && canGoBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('nav.back')}
          onPress={() => router.back()}
          style={styles.btn}
        >
          <Icon name="arrow-back" size={26} color={theme.colors.secondary} />
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
      <View style={styles.flex} />
      {showHome ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('nav.home')}
          onPress={() => router.replace('/(tabs)')}
          style={styles.btn}
        >
          <Icon name="home-outline" size={26} color={theme.colors.secondary} />
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    minHeight: 40,
  },
  btn: {
    padding: theme.spacing.xs,
  },
  placeholder: {
    width: 40,
  },
  flex: {
    flex: 1,
  },
});
