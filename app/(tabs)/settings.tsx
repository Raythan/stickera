import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { AdminToolsPanel } from '@/components/molecules/AdminToolsPanel';
import { ThemePicker } from '@/components/molecules/ThemePicker';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useAdminMode } from '@/features/admin/useAdminMode';
import { useContentSync } from '@/features/sync/useContentSync';
import { SettingsRepository } from '@/services/db/SettingsRepository';
import type { AppTheme } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    hint: {
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    version: {
      marginBottom: theme.spacing.sm,
    },
    result: {
      marginTop: theme.spacing.sm,
    },
    aboutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    pressed: {
      opacity: 0.9,
    },
    codeInput: {
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.sm,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    unlockErr: {
      marginBottom: theme.spacing.sm,
    },
  });
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { sync, syncing, lastResult } = useContentSync();
  const { enabled: adminEnabled, configured, unlockError, unlock, lock } = useAdminMode();
  const [contentVersion, setContentVersion] = useState<string | null>(null);
  const [adminCode, setAdminCode] = useState('');

  const loadVersion = useCallback(async () => {
    setContentVersion(await SettingsRepository.getContentVersion());
  }, []);

  useEffect(() => {
    void loadVersion();
  }, [loadVersion, lastResult]);

  const onSync = useCallback(async () => {
    await sync();
    await loadVersion();
  }, [sync, loadVersion]);

  return (
    <ScreenTemplate showBack={false} showHome={false} showHeader={false}>
      <View style={styles.section}>
        <ThemePicker />
      </View>

      <View style={styles.section}>
        <Text variant="bodyBold">{t('screens.settings.syncAlbums')}</Text>
        <Text variant="caption" color={colors.textMuted} style={styles.hint}>
          {t('screens.settings.syncHint')}
        </Text>
        {contentVersion ? (
          <Text variant="caption" color={colors.textMuted} style={styles.version}>
            {t('screens.settings.contentVersion', { version: contentVersion })}
          </Text>
        ) : null}
        <Button
          label={syncing ? t('screens.settings.syncing') : t('screens.settings.syncButton')}
          onPress={onSync}
          disabled={syncing}
        />
        {lastResult?.albumsUpdated ? (
          <Text variant="caption" color={colors.success} style={styles.result}>
            {t('screens.settings.syncDone', { count: lastResult.albumsUpdated })}
          </Text>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/about')}
        style={({ pressed }) => [styles.aboutRow, pressed && styles.pressed]}
      >
        <Text variant="bodyBold">{t('screens.about.title')}</Text>
        {syncing ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />
        )}
      </Pressable>

      <View style={styles.section}>
        <Text variant="bodyBold">{t('admin.unlockTitle')}</Text>
        <Text variant="caption" color={colors.textMuted} style={styles.hint}>
          {configured ? t('admin.unlockHint') : t('admin.notConfigured')}
        </Text>
        {!adminEnabled && configured ? (
          <>
            <TextInput
              style={styles.codeInput}
              value={adminCode}
              onChangeText={setAdminCode}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
            />
            {unlockError ? (
              <Text variant="caption" color={colors.error} style={styles.unlockErr}>
                {t('admin.unlockError')}
              </Text>
            ) : null}
            <Button
              label={t('admin.unlockButton')}
              size="sm"
              onPress={() => void unlock(adminCode)}
              disabled={!adminCode.trim()}
            />
          </>
        ) : null}
        {adminEnabled ? (
          <AdminToolsPanel onLock={() => void lock()} />
        ) : null}
      </View>
    </ScreenTemplate>
  );
}
