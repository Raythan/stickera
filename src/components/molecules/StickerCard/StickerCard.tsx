import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/atoms/Badge';
import { RarityMedalIcon } from '@/components/atoms/RarityMedalIcon';
import { Text } from '@/components/atoms/Text';
import { StickerFramePreview } from '@/components/molecules/StickerFramePreview';
import { isStickerRarity, RARITY_I18N_KEY } from '@/theme/rarity';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { StickerCardProps } from './StickerCard.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrap: {
      width: 120,
      alignItems: 'center',
    },
    frameWrap: {
      position: 'relative',
      width: 120,
    },
    frameLocked: {
      opacity: 0.42,
    },
    overlayStack: {
      position: 'absolute',
      right: 2,
      alignItems: 'center',
      gap: 2,
    },
    overlayStackWithMedal: {
      top: 50,
    },
    overlayStackQtyOnly: {
      top: 72,
    },
    qtyPill: {
      minWidth: 28,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: 10,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlayMuted: {
      opacity: 0.5,
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
  const rarityTier = rarity && isStickerRarity(rarity) ? rarity : undefined;

  const content = (
    <View style={styles.wrap}>
      {frameCss ? (
        <View style={[styles.frameWrap, !owned && styles.frameLocked]}>
          <StickerFramePreview
            frameCss={frameCss}
            artUri={imageUri}
            accessibilityLabel={name}
            rarity={rarityTier}
            owned={owned}
          />
          <View
            style={[
              styles.overlayStack,
              rarityTier ? styles.overlayStackWithMedal : styles.overlayStackQtyOnly,
              !owned && styles.overlayMuted,
            ]}
          >
            {rarityTier ? (
              <RarityMedalIcon
                rarity={rarityTier}
                owned={owned}
                accessibilityLabel={t(RARITY_I18N_KEY[rarityTier])}
              />
            ) : null}
            <View style={styles.qtyPill}>
              <Text
                variant="caption"
                color={owned ? colors.primary : colors.textMuted}
              >
                {t('collection.quantity', { count: quantity })}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
      <View style={styles.meta}>
        {isNew && owned ? (
          <Badge label={t('collection.new')} variant="accent" />
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
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={name} onPress={onPress}>
      {content}
    </Pressable>
  );
}
