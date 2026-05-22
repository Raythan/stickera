import { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FlagIcon } from '@/components/atoms/FlagIcon';
import type { FlagLocale } from '@/components/atoms/FlagIcon';
import { Text } from '@/components/atoms/Text';
import { useLocale } from '@/features/ui/useLocale';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

type LocaleOption = { code: FlagLocale; labelKey: string };

const OPTIONS: LocaleOption[] = [
  { code: 'en', labelKey: 'nav.languageEn' },
  { code: 'pt', labelKey: 'nav.languagePt' },
];

const FLAG_TRIGGER_SIZE = 28;
const FLAG_MENU_SIZE = 24;

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    trigger: {
      padding: theme.spacing.xs,
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
      minWidth: 160,
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
  });
}

export function HeaderLocaleMenu() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);

  const current = OPTIONS.find((o) => o.code === locale) ?? OPTIONS[0];

  const pick = useCallback(
    (code: FlagLocale) => {
      setLocale(code);
      setOpen(false);
    },
    [setLocale],
  );

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t(current.labelKey)}
        onPress={() => setOpen(true)}
        style={styles.trigger}
        hitSlop={8}
      >
        <FlagIcon locale={current.code} size={FLAG_TRIGGER_SIZE} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <Text variant="caption" color={colors.textMuted} style={styles.menuTitle}>
              {t('nav.languageMenu')}
            </Text>
            {OPTIONS.map((opt) => (
              <Pressable
                key={opt.code}
                accessibilityRole="button"
                accessibilityLabel={t(opt.labelKey)}
                accessibilityState={{ selected: locale === opt.code }}
                onPress={() => pick(opt.code)}
                style={({ pressed }) => [
                  styles.option,
                  locale === opt.code && styles.optionActive,
                  pressed && styles.optionPressed,
                ]}
              >
                <FlagIcon locale={opt.code} size={FLAG_MENU_SIZE} />
                <Text variant="body" color={locale === opt.code ? colors.primary : colors.text}>
                  {t(opt.labelKey)}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
