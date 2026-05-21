import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useAlbums } from '@/features/collection/useAlbums';
import { useContentSync } from '@/features/sync/useContentSync';
import { useLocale } from '@/features/ui/useLocale';
import { SettingsRepository } from '@/services/db/SettingsRepository';
import { theme } from '@/theme';

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const { sync, syncing, lastResult } = useContentSync();
  const { reload } = useAlbums();
  const [contentVersion, setContentVersion] = useState<string | null>(null);

  const loadVersion = useCallback(async () => {
    setContentVersion(await SettingsRepository.getContentVersion());
  }, []);

  useEffect(() => {
    void loadVersion();
  }, [loadVersion, lastResult]);

  const onSync = useCallback(async () => {
    await sync();
    await reload();
    await loadVersion();
  }, [sync, reload, loadVersion]);

  return (
    <ScreenTemplate title={t('screens.settings.title')}>
      <View style={styles.section}>
        <Text variant="bodyBold">{t('screens.settings.syncAlbums')}</Text>
        <Text variant="caption" color={theme.colors.textMuted} style={styles.hint}>
          {t('screens.settings.syncHint')}
        </Text>
        {contentVersion ? (
          <Text variant="caption" color={theme.colors.textMuted} style={styles.version}>
            {t('screens.settings.contentVersion', { version: contentVersion })}
          </Text>
        ) : null}
        <Button
          label={syncing ? t('screens.settings.syncing') : t('screens.settings.syncButton')}
          onPress={onSync}
          disabled={syncing}
        />
        {lastResult?.albumsUpdated ? (
          <Text variant="caption" color={theme.colors.success} style={styles.result}>
            {t('screens.settings.syncDone', { count: lastResult.albumsUpdated })}
          </Text>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text variant="bodyBold">{t('screens.settings.language')}</Text>
        <Text variant="caption" color={theme.colors.textMuted} style={styles.hint}>
          {t('screens.settings.languageHint')}
        </Text>
        <View style={styles.row}>
          <Button
            label="English"
            variant={locale === 'en' ? 'primary' : 'ghost'}
            size="sm"
            onPress={() => setLocale('en')}
          />
          <Button
            label="Português"
            variant={locale === 'pt' ? 'primary' : 'ghost'}
            size="sm"
            onPress={() => setLocale('pt')}
          />
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/about')}
        style={({ pressed }) => [styles.aboutRow, pressed && styles.pressed]}
      >
        <Text variant="bodyBold">{t('screens.about.title')}</Text>
        {syncing ? (
          <ActivityIndicator color={theme.colors.primary} />
        ) : (
          <Icon name="chevron-forward" size={20} color={theme.colors.textMuted} />
        )}
      </Pressable>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
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
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.9,
  },
});
