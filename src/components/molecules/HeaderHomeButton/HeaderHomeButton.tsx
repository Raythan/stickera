import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { theme } from '@/theme';

export function HeaderHomeButton() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('nav.homeLong')}
      onPress={() => router.replace('/(tabs)')}
      style={styles.btn}
      hitSlop={8}
    >
      <Icon name="home-outline" size={24} color={theme.colors.secondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: theme.spacing.xs,
  },
});
