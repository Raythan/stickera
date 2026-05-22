import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';

import { SettingsRepository, SETTINGS_KEYS } from '@/services/db/SettingsRepository';

import { buildTheme, defaultTheme, type AppTheme, type ThemeId } from './presets';
import { useThemeStore } from './themeStore';

const ThemeContext = createContext<AppTheme>(defaultTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeId = useThemeStore((s) => s.themeId);
  const setThemeId = useThemeStore((s) => s.setThemeId);
  const theme = useMemo(() => buildTheme(themeId), [themeId]);

  useEffect(() => {
    void SettingsRepository.get(SETTINGS_KEYS.themeId).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'bloom' || stored === 'ocean') {
        setThemeId(stored);
      }
    });
  }, [setThemeId]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppTheme {
  return useContext(ThemeContext);
}

export async function persistThemeId(id: ThemeId): Promise<void> {
  await SettingsRepository.set(SETTINGS_KEYS.themeId, id);
  useThemeStore.getState().setThemeId(id);
}
