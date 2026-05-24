import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';

import { isStickerRarity } from '@/theme/rarity';

import type { StickerFramePreviewProps } from './StickerFramePreview.types';

function buildFrameClassNames(rarity?: string, owned = true): string {
  const classes = ['sticker-frame'];
  if (rarity && isStickerRarity(rarity)) {
    classes.push(`sticker-frame--${rarity}`);
  }
  if (!owned) {
    classes.push('sticker-frame--locked');
  }
  return classes.join(' ');
}

function buildFrameHtml(
  frameCss: string,
  artUri?: string | null,
  rarity?: string,
  owned = true,
): string {
  const artTag = artUri
    ? `<img class="sticker-art" src="${artUri}" alt="" />`
    : '<div class="sticker-art-placeholder">★</div>';
  const frameClass = buildFrameClassNames(rarity, owned);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; }
  body {
    display: flex;
    align-items: center;
    justify-content: center;
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
  <div class="${frameClass}">${artTag}</div>
</body>
</html>`;
}

const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 160;

function createStyles(theme: AppTheme, width: number, height: number) {
  return StyleSheet.create({
    wrap: {
      width,
      height,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: theme.colors.stickerPlaceholder,
    },
    iframe: {
      width: '100%',
      height: '100%',
      borderWidth: 0,
      backgroundColor: 'transparent',
    },
  });
}

export function StickerFramePreview({
  frameCss,
  artUri,
  accessibilityLabel = 'Sticker frame preview',
  rarity,
  owned = true,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  pointerEventsDisabled = false,
}: StickerFramePreviewProps) {
  const theme = useTheme();
  const styles = useMemo(
    () => createStyles(theme, width, height),
    [theme, width, height],
  );
  const html = useMemo(
    () => buildFrameHtml(frameCss, artUri, rarity, owned),
    [frameCss, artUri, rarity, owned],
  );

  const passthrough =
    pointerEventsDisabled && Platform.OS === 'web'
      ? ({ pointerEvents: 'none' } as const)
      : undefined;

  return (
    <View
      style={[styles.wrap, passthrough]}
      accessibilityLabel={accessibilityLabel}
      pointerEvents={pointerEventsDisabled ? 'box-none' : 'auto'}
    >
      <iframe
        title={accessibilityLabel}
        srcDoc={html}
        style={[styles.iframe, passthrough] as object}
        sandbox="allow-same-origin"
      />
    </View>
  );
}
