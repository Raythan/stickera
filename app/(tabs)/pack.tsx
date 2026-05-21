import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { theme } from '@/theme';

export default function PackScreen() {
  const { t } = useTranslation();

  return (
    <ScreenTemplate title={t('screens.pack.title')}>
      <View style={styles.placeholder}>
        <Icon name="gift-outline" size={48} color={theme.colors.primary} />
        <Text variant="body" color={theme.colors.textMuted} style={styles.text}>
          {t('screens.pack.placeholder')}
        </Text>
      </View>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  text: {
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
});
