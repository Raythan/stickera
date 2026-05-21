import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

import type { HomeHeroProps } from './HomeHero.types';

export function HomeHero({ title, subtitle, packLabel, onOpenPack }: HomeHeroProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconCircle}>
        <Icon name="albums" size={28} color={theme.colors.primary} />
      </View>
      <Text variant="h1" style={styles.title}>
        {title}
      </Text>
      <Text variant="body" color={theme.colors.textMuted} style={styles.subtitle}>
        {subtitle}
      </Text>
      <Button label={packLabel} onPress={onOpenPack} variant="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
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
