import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useUiStore } from './uiStore';

export function useLocale() {
  const { i18n } = useTranslation();
  const setLocaleStore = useUiStore((s) => s.setLocale);
  const localeOverride = useUiStore((s) => s.localeOverride);

  const locale = localeOverride ?? (i18n.language === 'pt' ? 'pt' : 'en');

  const setLocale = useCallback(
    (next: 'en' | 'pt') => {
      void i18n.changeLanguage(next);
      setLocaleStore(next);
    },
    [i18n, setLocaleStore],
  );

  return { locale, setLocale };
}
