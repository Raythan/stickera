import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { TradeQrDisplayProps } from './TradeQrDisplay.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      marginVertical: theme.spacing.md,
    },
    qr: {
      width: 200,
      height: 200,
      borderRadius: 8,
    },
    fallback: {
      width: 200,
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 8,
      alignSelf: 'center',
      marginVertical: theme.spacing.md,
    },
  });
}

export function TradeQrDisplay({ payload }: TradeQrDisplayProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    void QRCode.toDataURL(payload, { width: 200, margin: 2 })
      .then(setDataUrl)
      .catch(() => setDataUrl(null));
  }, [payload]);

  if (!dataUrl) {
    return (
      <View style={styles.fallback}>
        <Text variant="caption" color={colors.textMuted}>
          QR
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: dataUrl }} style={styles.qr} />
    </View>
  );
}
