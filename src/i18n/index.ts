import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { resources } from './resources';

const deviceLocale = (typeof navigator !== 'undefined' ? navigator.language?.split('-')[0] : 'en') ?? 'en';
const fallbackLng = process.env.EXPO_PUBLIC_DEFAULT_LOCALE ?? 'en';
const initialLng = deviceLocale === 'pt' ? 'pt' : fallbackLng;

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
