import { create } from 'zustand';

import type { ThemeId } from './presets';

type ThemeStore = {
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  themeId: 'light',
  setThemeId: (themeId) => set({ themeId }),
}));
