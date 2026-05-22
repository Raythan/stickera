import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { useCatalogUpdateAvailable } from '@/features/sync/useCatalogUpdateAvailable';
import { useTheme } from '@/theme/ThemeContext';

export function HeaderSyncButton() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { updateAvailable, syncing, sync } = useCatalogUpdateAvailable();

  if (!updateAvailable) return null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('nav.syncUpdate')}
      onPress={() => void sync()}
      disabled={syncing}
      style={styles.btn}
      hitSlop={8}
    >
      {syncing ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Icon name="cloud-download-outline" size={22} color={colors.primary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 4,
  },
});
