import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

import type { TradeQrDisplayProps } from './TradeQrDisplay.types';

export function TradeQrDisplay({ payload }: TradeQrDisplayProps) {
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
        <Text variant="caption" color={theme.colors.textMuted}>QR</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: dataUrl }} style={styles.qr} />
    </View>
  );
}

const styles = StyleSheet.create({
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
