import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { TimerBadge } from '@/components/molecules/TimerBadge';
import { PackReveal } from '@/components/organisms/PackReveal';
import { ScreenTemplate } from '@/components/templates/ScreenTemplate';
import { usePackCooldown } from '@/features/packs/usePackCooldown';
import { usePackOpen } from '@/features/packs/usePackOpen';
import type { StickerDef } from '@/domain/types';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

const ERROR_KEYS: Record<string, string> = {
  cooldown: 'errors.pack.notReady',
  poolTooSmall: 'errors.pack.poolTooSmall',
  noEnabledAlbums: 'errors.pack.noEnabledAlbums',
};

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    content: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: theme.spacing.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
      gap: theme.spacing.lg,
    },
    iconWrap: {
      marginBottom: theme.spacing.sm,
    },
    error: {
      textAlign: 'center',
    },
  });
}

export default function PackScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { canOpen, pendingPacks, maxPacks, formattedTime, refresh } = usePackCooldown();
  const { openPack, isOpening } = usePackOpen();
  const [revealStickers, setRevealStickers] = useState<StickerDef[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = useCallback(async () => {
    setError(null);
    const result = await openPack();
    if (result.ok) {
      setRevealStickers(result.stickers);
    } else {
      const key = ERROR_KEYS[result.reason];
      setError(key ? t(key) : (result.message ?? t('common.error')));
    }
    void refresh();
  }, [openPack, refresh, t]);

  const handleDismiss = useCallback(() => {
    setRevealStickers(null);
  }, []);

  return (
    <ScreenTemplate showBack={false} showHome={false} showHeader={false}>
      {revealStickers ? (
        <PackReveal stickers={revealStickers} onDismiss={handleDismiss} />
      ) : (
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Icon name="gift-outline" size={64} color={colors.primary} />
          </View>
          <TimerBadge
            canOpen={canOpen}
            pendingPacks={pendingPacks}
            maxPacks={maxPacks}
            formattedTime={formattedTime}
          />
          {error ? (
            <Text variant="caption" color={colors.error} style={styles.error}>
              {error}
            </Text>
          ) : null}
          <Button
            label={isOpening ? t('common.loading') : t('screens.pack.openButton')}
            onPress={handleOpen}
            disabled={!canOpen || isOpening}
          />
        </View>
      )}
    </ScreenTemplate>
  );
}
