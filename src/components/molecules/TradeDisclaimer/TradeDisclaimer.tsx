import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

export function TradeDisclaimer() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Icon name="alert-circle-outline" size={18} color={theme.colors.textMuted} />
      <Text variant="caption" color={theme.colors.textMuted} style={styles.text}>
        {t('screens.trade.disclaimer')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  text: {
    flex: 1,
  },
});
