import { create } from 'zustand';

import type { StickerDef } from '@/domain/types';

type UiStore = {
  localeOverride: 'en' | 'pt' | null;
  setLocale: (locale: 'en' | 'pt') => void;
  packRevealQueue: StickerDef[] | null;
  setPackRevealQueue: (stickers: StickerDef[] | null) => void;
  clearPackReveal: () => void;
};

export const useUiStore = create<UiStore>((set) => ({
  localeOverride: null,
  setLocale: (locale) => {
    set({ localeOverride: locale });
  },
  packRevealQueue: null,
  setPackRevealQueue: (stickers) => {
    set({ packRevealQueue: stickers });
  },
  clearPackReveal: () => {
    set({ packRevealQueue: null });
  },
}));
