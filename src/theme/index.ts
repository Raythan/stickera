import { defaultTheme } from './presets';

/** @deprecated Prefer useTheme() — kept for gradual migration */
export const theme = defaultTheme;

export { spacing } from './spacing';
export { typography } from './typography';
export type { AppTheme, ColorTokens, ThemeId } from './presets';
export { THEME_PRESETS, buildTheme, defaultTheme } from './presets';
export { ThemeProvider, useTheme, persistThemeId } from './ThemeContext';
export { useThemeStore } from './themeStore';
export { useThemedStyles } from './useThemedStyles';
export { NARROW_MAX_WIDTH, useIsNarrowLayout } from './useLayoutBreakpoint';
