import { create } from 'zustand';

type UiStore = {
  localeOverride: 'en' | 'pt' | null;
  setLocale: (locale: 'en' | 'pt') => void;
};

export const useUiStore = create<UiStore>((set) => ({
  localeOverride: null,
  setLocale: (locale) => {
    set({ localeOverride: locale });
  },
}));
