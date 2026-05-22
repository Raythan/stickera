import { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Text } from '@/components/atoms/Text';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { TradeQrScannerProps } from './TradeQrScanner.types';

const SCANNER_ELEMENT_ID = 'stickera-trade-qr-scanner';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    wrap: {
      alignItems: 'center',
      marginVertical: theme.spacing.md,
    },
    reader: {
      width: 280,
      height: 280,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: theme.colors.surfaceMuted,
    },
    hint: {
      marginTop: theme.spacing.sm,
      textAlign: 'center',
    },
  });
}

export function TradeQrScanner({ onScan, active = true }: TradeQrScannerProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);
  const [cameraError, setCameraError] = useState(false);
  const handledRef = useRef(false);

  onScanRef.current = onScan;

  useEffect(() => {
    if (Platform.OS !== 'web' || !active) return;

    handledRef.current = false;
    setCameraError(false);

    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;

    const config = { fps: 8, qrbox: { width: 220, height: 220 } };

    void scanner
      .start(
        { facingMode: 'environment' },
        config,
        (decoded) => {
          if (handledRef.current) return;
          handledRef.current = true;
          void scanner.stop().then(() => {
            scannerRef.current = null;
            onScanRef.current(decoded.trim());
          });
        },
        () => {
          /* scan attempt — ignore */
        },
      )
      .catch(() => {
        setCameraError(true);
        scannerRef.current = null;
      });

    return () => {
      const s = scannerRef.current;
      scannerRef.current = null;
      if (s?.isScanning) {
        void s.stop().catch(() => undefined);
      }
    };
  }, [active]);

  if (Platform.OS !== 'web') {
    return (
      <Text variant="caption" color={colors.textMuted} style={styles.hint}>
        {t('screens.trade.scanNotAvailable')}
      </Text>
    );
  }

  if (!active) return null;

  if (cameraError) {
    return (
      <Text variant="caption" color={colors.textMuted} style={styles.hint}>
        {t('screens.trade.scanCameraUnavailable')}
      </Text>
    );
  }

  return (
    <View style={styles.wrap}>
      <View nativeID={SCANNER_ELEMENT_ID} style={styles.reader} />
      <Text variant="caption" color={colors.textMuted} style={styles.hint}>
        {t('screens.trade.scanHint')}
      </Text>
    </View>
  );
}
