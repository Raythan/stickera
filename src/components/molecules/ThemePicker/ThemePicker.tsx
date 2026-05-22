import { Pressable, StyleSheet, View } from 'react-native';
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
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: 12,
      borderWidth: 2,
      minWidth: '46%',
      flexGrow: 1,
    },
    chipSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surfaceMuted,
    },
    chipIdle: {
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
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

export function ThemePicker() {
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const themeId = useThemeStore((s) => s.themeId);

  return (
    <View>
      <Text variant="bodyBold">{t('screens.settings.theme')}</Text>
      <Text variant="caption" color={theme.colors.textMuted} style={{ marginTop: theme.spacing.xs }}>
        {t('screens.settings.themeHint')}
      </Text>
      <View style={styles.row}>
        {THEME_ORDER.map((id) => {
          const preset = THEME_PRESETS[id];
          const selected = themeId === id;
          return (
            <Pressable
              key={id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => void persistThemeId(id)}
              style={[styles.chip, selected ? styles.chipSelected : styles.chipIdle]}
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
              <Text variant="label">{t(LABEL_KEYS[id])}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
