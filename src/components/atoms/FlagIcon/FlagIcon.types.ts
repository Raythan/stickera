export type FlagLocale = 'en' | 'pt';

export type FlagIconProps = {
  locale: FlagLocale;
  /** Flag width in px; height follows 20:28 aspect ratio. */
  size?: number;
};
