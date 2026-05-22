import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/atoms/Badge';
import { Text } from '@/components/atoms/Text';
import { StickerFramePreview } from '@/components/molecules/StickerFramePreview';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { StickerCardProps } from './StickerCard.types';

const RARITY_VARIANT: Record<string, 'default' | 'accent' | 'muted'> = {
  legendary: 'accent',
  rare: 'default',
  uncommon: 'muted',
  common: 'muted',
};

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrap: {
      width: 120,
      alignItems: 'center',
    },
    meta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      justifyContent: 'center',
      marginTop: theme.spacing.xs,
    },
    name: {
      marginTop: theme.spacing.xs,
      textAlign: 'center',
    },
    qty: {
      marginTop: 2,
      textAlign: 'center',
    },
  });
}

export function StickerCard({
  name,
  imageUri,
  frameCss,
  quantity,
  isNew,
  rarity,
  onPress,
}: StickerCardProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const owned = quantity > 0;

  const content = (
    <View style={styles.wrap}>
      {frameCss ? (
        <StickerFramePreview frameCss={frameCss} artUri={imageUri} accessibilityLabel={name} />
      ) : null}
      <View style={styles.meta}>
        {isNew && owned ? (
          <Badge label={t('collection.new')} variant="accent" />
        ) : null}
        {rarity ? (
          <Badge label={rarity} variant={RARITY_VARIANT[rarity] ?? 'muted'} />
        ) : null}
      </View>
      <Text
        variant="caption"
        style={styles.name}
        color={owned ? colors.text : colors.textMuted}
        numberOfLines={2}
      >
        {name}
      </Text>
      <Text
        variant="caption"
        color={owned ? colors.primary : colors.textMuted}
        style={styles.qty}
      >
        {t('collection.quantity', { count: quantity })}
      </Text>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={onPress}>
      {content}
    </Pressable>
  );
}
