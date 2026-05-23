import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import type { AppTheme } from '@/theme/presets';
import { useThemedStyles } from '@/theme/useThemedStyles';

type PeekCarouselNavProps = {
  onPrev: () => void;
  onNext: () => void;
};

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    prev: {
      position: 'absolute',
      left: theme.spacing.xs,
      top: '50%',
      marginTop: -22,
      zIndex: 2,
    },
    next: {
      position: 'absolute',
      right: theme.spacing.xs,
      top: '50%',
      marginTop: -22,
      zIndex: 2,
    },
    btn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      opacity: 0.92,
    },
    btnPressed: {
      opacity: 0.75,
    },
  });
}

export function PeekCarouselNav({ onPrev, onNext }: PeekCarouselNavProps) {
  const { t } = useTranslation();
  const styles = useThemedStyles(createStyles);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('collection.carousel.prev')}
        onPress={onPrev}
        style={styles.prev}
        hitSlop={8}
      >
        {({ pressed }) => (
          <View style={[styles.btn, pressed && styles.btnPressed]}>
            <Icon name="chevron-back" size={28} />
          </View>
        )}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('collection.carousel.next')}
        onPress={onNext}
        style={styles.next}
        hitSlop={8}
      >
        {({ pressed }) => (
          <View style={[styles.btn, pressed && styles.btnPressed]}>
            <Icon name="chevron-forward" size={28} />
          </View>
        )}
      </Pressable>
    </View>
  );
}
