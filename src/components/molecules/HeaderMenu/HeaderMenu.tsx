import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FlagIcon } from '@/components/atoms/FlagIcon';
import type { FlagLocale } from '@/components/atoms/FlagIcon';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import type { HeaderMenuProps } from './HeaderMenu.types';
import { useCatalogUpdateAvailable } from '@/features/sync/useCatalogUpdateAvailable';
import { useLocale } from '@/features/ui/useLocale';
import { THEME_PRESETS, type AppTheme, type ThemeId } from '@/theme/presets';
import { persistThemeId } from '@/theme/ThemeContext';
import { useTheme } from '@/theme/ThemeContext';
import { useThemeStore } from '@/theme/themeStore';
import { useThemedStyles } from '@/theme/useThemedStyles';

const THEME_ORDER: ThemeId[] = ['light', 'dark', 'bloom', 'ocean'];

const THEME_LABEL_KEYS: Record<ThemeId, string> = {
  light: 'screens.settings.themeLight',
  dark: 'screens.settings.themeDark',
  bloom: 'screens.settings.themeBloom',
  ocean: 'screens.settings.themeOcean',
};

const LOCALE_OPTIONS: { code: FlagLocale; labelKey: string }[] = [
  { code: 'en', labelKey: 'nav.languageEn' },
  { code: 'pt', labelKey: 'nav.languagePt' },
];

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
      minWidth: 220,
      maxWidth: 280,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    menuTitle: {
      paddingHorizontal: theme.spacing.md,
      paddingBottom: theme.spacing.xs,
    },
    sectionTitle: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    rowActive: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    rowPressed: {
      opacity: 0.85,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.border,
      marginVertical: theme.spacing.xs,
      marginHorizontal: theme.spacing.md,
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

export function HeaderMenu({
  showHome = true,
  showSync = true,
  showTheme = true,
  showAbout = true,
  showLocale = true,
}: HeaderMenuProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const themeId = useThemeStore((s) => s.themeId);
  const { locale, setLocale } = useLocale();
  const { updateAvailable, syncing, sync } = useCatalogUpdateAvailable();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  const pickTheme = useCallback(
    (id: ThemeId) => {
      void persistThemeId(id);
      close();
    },
    [close],
  );

  const pickLocale = useCallback(
    (code: FlagLocale) => {
      setLocale(code);
      close();
    },
    [setLocale, close],
  );

  const goAbout = useCallback(() => {
    close();
    router.push('/about');
  }, [close, router]);

  const goHome = useCallback(() => {
    close();
    router.replace('/(tabs)');
  }, [close, router]);

  const handleSync = useCallback(() => {
    void sync();
    close();
  }, [sync, close]);

  const showSyncRow = showSync && updateAvailable;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('nav.menu')}
        onPress={() => setOpen(true)}
        style={styles.trigger}
        hitSlop={8}
      >
        <Icon name="menu" size={26} color={colors.secondary} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.backdrop} onPress={close}>
          <View style={styles.menu}>
            <Text variant="caption" color={colors.textMuted} style={styles.menuTitle}>
              {t('nav.menu')}
            </Text>

            {showSyncRow ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('nav.syncUpdate')}
                onPress={handleSync}
                disabled={syncing}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                {syncing ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Icon name="cloud-download-outline" size={22} color={colors.primary} />
                )}
                <Text variant="body" color={colors.text}>
                  {t('nav.syncUpdate')}
                </Text>
              </Pressable>
            ) : null}

            {showSyncRow && (showTheme || showLocale || showAbout || showHome) ? (
              <View style={styles.divider} />
            ) : null}

            {showTheme ? (
              <>
                <Text variant="caption" color={colors.textMuted} style={styles.sectionTitle}>
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
                      onPress={() => pickTheme(id)}
                      style={({ pressed }) => [
                        styles.row,
                        selected && styles.rowActive,
                        pressed && styles.rowPressed,
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
                        {t(THEME_LABEL_KEYS[id])}
                      </Text>
                    </Pressable>
                  );
                })}
              </>
            ) : null}

            {showTheme && showLocale ? <View style={styles.divider} /> : null}

            {showLocale ? (
              <>
                <Text variant="caption" color={colors.textMuted} style={styles.sectionTitle}>
                  {t('nav.languageMenu')}
                </Text>
                {LOCALE_OPTIONS.map((opt) => {
                  const selected = locale === opt.code;
                  return (
                    <Pressable
                      key={opt.code}
                      accessibilityRole="button"
                      accessibilityLabel={t(opt.labelKey)}
                      accessibilityState={{ selected }}
                      onPress={() => pickLocale(opt.code)}
                      style={({ pressed }) => [
                        styles.row,
                        selected && styles.rowActive,
                        pressed && styles.rowPressed,
                      ]}
                    >
                      <FlagIcon locale={opt.code} size={24} />
                      <Text variant="body" color={selected ? colors.primary : colors.text}>
                        {t(opt.labelKey)}
                      </Text>
                    </Pressable>
                  );
                })}
              </>
            ) : null}

            {(showAbout || showHome) && (showTheme || showLocale || showSyncRow) ? (
              <View style={styles.divider} />
            ) : null}

            {showAbout ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('nav.about')}
                onPress={goAbout}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <Icon name="help-circle-outline" size={22} color={colors.secondary} />
                <Text variant="body" color={colors.text}>
                  {t('nav.about')}
                </Text>
              </Pressable>
            ) : null}

            {showHome ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('nav.homeLong')}
                onPress={goHome}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <Icon name="home-outline" size={22} color={colors.secondary} />
                <Text variant="body" color={colors.text}>
                  {t('nav.home')}
                </Text>
              </Pressable>
            ) : null}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
