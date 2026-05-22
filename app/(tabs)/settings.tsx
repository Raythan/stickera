import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { AdminToolsPanel } from '@/components/molecules/AdminToolsPanel';
import { EnableAlbumToggle } from '@/components/molecules/EnableAlbumToggle';
import { useAdminMode } from '@/features/admin/useAdminMode';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { useEnabledAlbums } from '@/features/collection/useEnabledAlbums';
import { useAlbumManifest } from '@/features/collection/useAlbumManifest';
import { useContentSync } from '@/features/sync/useContentSync';
import { useLocale } from '@/features/ui/useLocale';
import { resolveContentLabel } from '@/i18n/resolveContentLabel';
import { SettingsRepository } from '@/services/db/SettingsRepository';
import { theme } from '@/theme';

function EnabledAlbumRow({
  albumId,
  nameKey,
  enabled,
  onToggle,
}: {
  albumId: string;
  nameKey: string;
  enabled: boolean;
  onToggle: (id: string, value: boolean) => void;
}) {
  const { manifest } = useAlbumManifest(albumId);
  const title = manifest
    ? resolveContentLabel(manifest.nameKey ?? nameKey, manifest.names)
    : nameKey;

  return (
    <EnableAlbumToggle
      albumId={albumId}
      title={title}
      enabled={enabled}
      onToggle={onToggle}
    />
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const { sync, syncing, lastResult } = useContentSync();
  const { items, reload: reloadEnabled, toggle } = useEnabledAlbums();
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
    await reloadEnabled();
    await loadVersion();
  }, [sync, reloadEnabled, loadVersion]);

  return (
    <ScreenTemplate showBack={false} showHome={false} showHeader={false}>
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
        <Text variant="bodyBold">{t('screens.settings.enabledAlbums')}</Text>
        <Text variant="caption" color={theme.colors.textMuted} style={styles.hint}>
          {t('screens.settings.enabledAlbumsHint')}
        </Text>
        {items.map(({ album, enabled }) => (
          <EnabledAlbumRow
            key={album.id}
            albumId={album.id}
            nameKey={album.name_key}
            enabled={enabled}
            onToggle={toggle}
          />
        ))}
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
        onPress={() => router.push('/trade')}
        style={({ pressed }) => [styles.aboutRow, pressed && styles.pressed]}
      >
        <Text variant="bodyBold">{t('screens.trade.title')}</Text>
        <Icon name="swap-horizontal" size={20} color={theme.colors.textMuted} />
      </Pressable>

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

      <View style={styles.section}>
        <Text variant="bodyBold">{t('admin.unlockTitle')}</Text>
        <Text variant="caption" color={theme.colors.textMuted} style={styles.hint}>
          {configured ? t('admin.unlockHint') : t('admin.notConfigured')}
        </Text>
        {!adminEnabled && configured ? (
          <>
            <TextInput
              style={styles.codeInput}
              value={adminCode}
              onChangeText={setAdminCode}
              placeholder="••••••••"
              placeholderTextColor={theme.colors.textMuted}
              secureTextEntry
              autoCapitalize="none"
            />
            {unlockError ? (
              <Text variant="caption" color={theme.colors.error} style={styles.unlockErr}>
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
