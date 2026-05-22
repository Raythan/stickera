import { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import { useLocale } from '@/features/ui/useLocale';
import { theme } from '@/theme';

type LocaleOption = { code: 'en' | 'pt'; flag: string; label: string };

const OPTIONS: LocaleOption[] = [
  { code: 'en', flag: '🇺🇸', label: 'English' },
  { code: 'pt', flag: '🇧🇷', label: 'Português' },
];

export function HeaderLocaleMenu() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);

  const current = OPTIONS.find((o) => o.code === locale) ?? OPTIONS[0];

  const pick = useCallback(
    (code: 'en' | 'pt') => {
      setLocale(code);
      setOpen(false);
    },
    [setLocale],
  );

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.languageMenu')}
        onPress={() => setOpen(true)}
        style={styles.trigger}
        hitSlop={8}
      >
        <Text style={styles.flag}>{current.flag}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            <Text variant="caption" color={theme.colors.textMuted} style={styles.menuTitle}>
              {t('nav.languageMenu')}
            </Text>
            {OPTIONS.map((opt) => (
              <Pressable
                key={opt.code}
                accessibilityRole="button"
                accessibilityState={{ selected: locale === opt.code }}
                onPress={() => pick(opt.code)}
                style={({ pressed }) => [
                  styles.option,
                  locale === opt.code && styles.optionActive,
                  pressed && styles.optionPressed,
                ]}
              >
                <Text style={styles.optionFlag}>{opt.flag}</Text>
                <Text variant="body" color={locale === opt.code ? theme.colors.primary : undefined}>
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    padding: theme.spacing.xs,
  },
  flag: {
    fontSize: 22,
    lineHeight: 26,
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
  optionFlag: {
    fontSize: 20,
  },
});
