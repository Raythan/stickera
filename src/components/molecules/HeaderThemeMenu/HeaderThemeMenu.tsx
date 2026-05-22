import { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { THEME_PRESETS, type AppTheme, type ThemeId } from '@/theme/presets';
import { persistThemeId } from '@/theme/ThemeContext';
import { useTheme } from '@/theme/ThemeContext';
import { useThemeStore } from '@/theme/themeStore';
import { useThemedStyles } from '@/theme/useThemedStyles';

const THEME_ORDER: ThemeId[] = ['light', 'dark', 'bloom', 'ocean'];

const LABEL_KEYS: Record<ThemeId, string> = {
  light: 'screens.settings.themeLight',
  dark: 'screens.settings.themeDark',
  bloom: 'screens.settings.themeBloom',
  ocean: 'screens.settings.themeOcean',
};

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    trigger: {
      padding: theme.spacing.xs,
    },
    swatchTrigger: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.25)',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      paddingTop: 56,
      paddingRight: theme.spacing.md,
    },
    menu: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: theme.spacing.sm,
      minWidth: 180,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    menuTitle: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xs,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    optionActive: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    optionPressed: {
      opacity: 0.85,
    },
    swatch: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
  });
}

export function HeaderThemeMenu() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const themeId = useThemeStore((s) => s.themeId);
  const [open, setOpen] = useState(false);

  const currentPreset = THEME_PRESETS[themeId];

  const pick = useCallback((id: ThemeId) => {
    void persistThemeId(id);
    setOpen(false);
  }, []);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.themeMenu')}
        onPress={() => setOpen(true)}
        style={styles.trigger}
        hitSlop={8}
      >
        <View
          style={[
            styles.swatchTrigger,
            {
              backgroundColor: currentPreset.primary,
              borderColor: currentPreset.headerBorder,
            },
          ]}
        />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <Text variant="caption" color={colors.textMuted} style={styles.menuTitle}>
              {t('nav.themeMenu')}
            </Text>
            {THEME_ORDER.map((id) => {
              const preset = THEME_PRESETS[id];
              const selected = themeId === id;
              return (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => pick(id)}
                  style={({ pressed }) => [
                    styles.option,
                    selected && styles.optionActive,
                    pressed && styles.optionPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.swatch,
                      {
                        backgroundColor: preset.primary,
                        borderColor: preset.headerBorder,
                      },
                    ]}
                  />
                  <Text variant="body" color={selected ? colors.primary : colors.text}>
                    {t(LABEL_KEYS[id])}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
