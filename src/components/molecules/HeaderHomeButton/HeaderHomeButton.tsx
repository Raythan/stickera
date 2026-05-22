import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    btn: {
      padding: theme.spacing.xs,
    },
  });
}

export function HeaderHomeButton() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('nav.homeLong')}
      onPress={() => router.replace('/(tabs)')}
      style={styles.btn}
      hitSlop={8}
    >
      <Icon name="home-outline" size={24} color={colors.secondary} />
    </Pressable>
  );
}
