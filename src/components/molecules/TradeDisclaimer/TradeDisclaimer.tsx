import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
}

export function TradeDisclaimer() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      <Icon name="alert-circle-outline" size={18} color={colors.textMuted} />
      <Text variant="caption" color={colors.textMuted} style={styles.text}>
        {t('screens.trade.disclaimer')}
      </Text>
    </View>
  );
}
