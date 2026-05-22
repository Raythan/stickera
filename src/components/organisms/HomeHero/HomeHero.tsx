import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useIsNarrowLayout } from '@/theme/useLayoutBreakpoint';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { HomeHeroProps } from './HomeHero.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrap: {
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: theme.spacing.lg,
    },
    iconCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      marginBottom: theme.spacing.sm,
    },
    subtitle: {
      marginBottom: theme.spacing.lg,
    },
  });
}

export function HomeHero({ title, subtitle, packLabel, onOpenPack }: HomeHeroProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const narrow = useIsNarrowLayout();

  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Icon name="albums" size={28} color={colors.primary} />
      </View>
      <Text variant={narrow ? 'h2' : 'h1'} style={styles.title}>
        {title}
      </Text>
      <Text variant="body" color={colors.textMuted} style={styles.subtitle}>
        {subtitle}
      </Text>
      <Button label={packLabel} onPress={onOpenPack} variant="primary" fullWidth />
    </View>
  );
}
