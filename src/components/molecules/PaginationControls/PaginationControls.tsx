import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { PaginationControlsProps } from './PaginationControls.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrap: {
      gap: theme.spacing.sm,
    },
    meta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    nav: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    navBtn: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
    },
    navBtnDisabled: {
      opacity: 0.4,
    },
    navBtnPressed: {
      opacity: 0.88,
    },
  });
}

export function PaginationControls({
  page,
  totalPages,
  total,
  itemCountLabel,
  pageOfLabel,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <View style={styles.wrap}>
      <View style={styles.meta}>
        <Text variant="caption" color={colors.textMuted}>
          {itemCountLabel}
        </Text>
        <Text variant="caption" color={colors.textMuted}>
          {pageOfLabel}
        </Text>
      </View>
      {total > 0 ? (
        <View style={styles.nav}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={prevLabel}
            disabled={!canPrev}
            onPress={onPrev}
            style={({ pressed }) => [
              styles.navBtn,
              !canPrev && styles.navBtnDisabled,
              pressed && canPrev && styles.navBtnPressed,
            ]}
          >
            <Text variant="body" color={canPrev ? colors.text : colors.textMuted}>
              {prevLabel}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={nextLabel}
            disabled={!canNext}
            onPress={onNext}
            style={({ pressed }) => [
              styles.navBtn,
              !canNext && styles.navBtnDisabled,
              pressed && canNext && styles.navBtnPressed,
            ]}
          >
            <Text variant="body" color={canNext ? colors.text : colors.textMuted}>
              {nextLabel}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
