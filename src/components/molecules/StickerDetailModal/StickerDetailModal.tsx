import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { StickerFramePreview } from '@/components/molecules/StickerFramePreview';
import { isStickerRarity, RARITY_I18N_KEY } from '@/theme/rarity';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { StickerDetailModalProps } from './StickerDetailModal.types';

const DETAIL_WIDTH = 338;
const DETAIL_HEIGHT = Math.round(DETAIL_WIDTH * (160 / 120));

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.lg,
    },
    sheet: {
      width: '100%',
      maxWidth: 400,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    title: {
      flex: 1,
    },
    closeBtn: {
      padding: theme.spacing.xs,
      borderRadius: 999,
    },
    closeBtnPressed: {
      opacity: 0.75,
    },
    preview: {
      alignItems: 'center',
      marginVertical: 0,
    },
    meta: {
      width: '100%',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
  });
}

export function StickerDetailModal({
  visible,
  onClose,
  name,
  imageUri,
  frameCss,
  quantity,
  isNew,
  rarity,
}: StickerDetailModalProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const owned = quantity > 0;
  const rarityTier = rarity && isStickerRarity(rarity) ? rarity : undefined;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityRole="button">
        <Pressable onPress={() => {}} style={styles.sheet}>
          <View style={styles.header}>
            <Text variant="bodyBold" style={styles.title}>
              {t('screens.collection.stickerDetailTitle')}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
              onPress={onClose}
              style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}
            >
              <Icon name="close" size={22} color={colors.text} />
            </Pressable>
          </View>
          {frameCss ? (
            <View style={styles.preview}>
              <StickerFramePreview
                frameCss={frameCss}
                artUri={imageUri}
                accessibilityLabel={name}
                rarity={rarityTier}
                owned={owned}
                width={DETAIL_WIDTH}
                height={DETAIL_HEIGHT}
              />
            </View>
          ) : null}
          <View style={styles.meta}>
            <Text variant="bodyBold" style={{ textAlign: 'center' }}>
              {name}
            </Text>
            <Text variant="caption" color={colors.textMuted}>
              {t('collection.quantity', { count: quantity })}
            </Text>
            {rarityTier ? (
              <Text variant="caption" color={colors.textMuted}>
                {t(RARITY_I18N_KEY[rarityTier])}
              </Text>
            ) : null}
            {isNew && owned ? (
              <Text variant="caption" color={colors.primary}>
                {t('collection.new')}
              </Text>
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
