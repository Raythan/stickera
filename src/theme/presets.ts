import { spacing } from './spacing';
import { typography } from './typography';

export type ThemeId = 'light' | 'dark' | 'bloom' | 'ocean';

export type ColorTokens = {
  background: string;
  surface: string;
  surfaceMuted: string;
  headerBackground: string;
  headerBorder: string;
  primary: string;
  primaryPressed: string;
  secondary: string;
  secondaryMuted: string;
  accent: string;
  text: string;
  textMuted: string;
  textInverse: string;
  border: string;
  success: string;
  error: string;
  stickerPlaceholder: string;
  shadow: string;
};

export type AppTheme = {
  id: ThemeId;
  colors: ColorTokens;
  spacing: typeof spacing;
  typography: typeof typography;
};

const lightColors: ColorTokens = {
  background: '#F7F3ED',
  surface: '#FFFFFF',
  surfaceMuted: '#EDE8DF',
  headerBackground: '#FFFFFF',
  headerBorder: '#C5BCAE',
  primary: '#E85D4C',
  primaryPressed: '#D14A3A',
  secondary: '#1B4D5C',
  secondaryMuted: '#2A6B7D',
  accent: '#F4B942',
  text: '#1A1A1A',
  textMuted: '#5C5C5C',
  textInverse: '#FFFFFF',
  border: '#D9D2C5',
  success: '#3D8B6E',
  error: '#C0392B',
  stickerPlaceholder: '#E8E2D8',
  shadow: 'rgba(26, 26, 26, 0.14)',
};

const darkColors: ColorTokens = {
  background: '#12141A',
  surface: '#1C2028',
  surfaceMuted: '#262B35',
  headerBackground: '#252B36',
  headerBorder: '#3A4250',
  primary: '#FF7B6B',
  primaryPressed: '#E86A5A',
  secondary: '#7EB8D4',
  secondaryMuted: '#5A9AB8',
  accent: '#F4B942',
  text: '#F2F4F8',
  textMuted: '#A8B0BE',
  textInverse: '#12141A',
  border: '#3A4250',
  success: '#5CB896',
  error: '#F07167',
  stickerPlaceholder: '#2A303A',
  shadow: 'rgba(0, 0, 0, 0.45)',
};

const bloomColors: ColorTokens = {
  background: '#FAF5FC',
  surface: '#FFFFFF',
  surfaceMuted: '#F3E8F8',
  headerBackground: '#FFFFFF',
  headerBorder: '#E9D5F5',
  primary: '#A855F7',
  primaryPressed: '#9333EA',
  secondary: '#831843',
  secondaryMuted: '#9D174D',
  accent: '#EC4899',
  text: '#2E1065',
  textMuted: '#6B5B7A',
  textInverse: '#FFFFFF',
  border: '#E9D5F5',
  success: '#10B981',
  error: '#E11D48',
  stickerPlaceholder: '#F3E8F8',
  shadow: 'rgba(88, 28, 135, 0.12)',
};

const oceanColors: ColorTokens = {
  background: '#EFF6FC',
  surface: '#FFFFFF',
  surfaceMuted: '#DBEAFE',
  headerBackground: '#FFFFFF',
  headerBorder: '#BFDBFE',
  primary: '#2563EB',
  primaryPressed: '#1D4ED8',
  secondary: '#0C4A6E',
  secondaryMuted: '#0369A1',
  accent: '#38BDF8',
  text: '#0F172A',
  textMuted: '#475569',
  textInverse: '#FFFFFF',
  border: '#BFDBFE',
  success: '#059669',
  error: '#DC2626',
  stickerPlaceholder: '#E0F2FE',
  shadow: 'rgba(15, 23, 42, 0.12)',
};

export const THEME_PRESETS: Record<ThemeId, ColorTokens> = {
  light: lightColors,
  dark: darkColors,
  bloom: bloomColors,
  ocean: oceanColors,
};

export function buildTheme(id: ThemeId): AppTheme {
  return {
    id,
    colors: THEME_PRESETS[id],
    spacing,
    typography,
  };
}

export const defaultTheme = buildTheme('light');
