import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { theme } from '@/theme';

import type { StickerFramePreviewProps } from './StickerFramePreview.types';

function buildFrameHtml(frameCss: string, artUri?: string | null): string {
  const artTag = artUri
    ? `<img class="sticker-art" src="${artUri}" alt="" />`
    : '<div class="sticker-art-placeholder">★</div>';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    background: transparent;
    font-family: system-ui, sans-serif;
  }
  .sticker-art-placeholder {
    width: 92%;
    height: 92%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: rgba(255,255,255,0.35);
    z-index: 1;
  }
  ${frameCss}
</style>
</head>
<body>
  <div class="sticker-frame">${artTag}</div>
</body>
</html>`;
}

export function StickerFramePreview({
  frameCss,
  artUri,
  accessibilityLabel = 'Sticker frame preview',
}: StickerFramePreviewProps) {
  const html = useMemo(() => buildFrameHtml(frameCss, artUri), [frameCss, artUri]);

  return (
    <View style={styles.wrap} accessibilityLabel={accessibilityLabel}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 120,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.colors.stickerPlaceholder,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
