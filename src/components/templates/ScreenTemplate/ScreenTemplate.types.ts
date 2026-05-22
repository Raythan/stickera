import type { ReactNode } from 'react';

export type ScreenTemplateProps = {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  showBack?: boolean;
  showHome?: boolean;
  showLocale?: boolean;
  /** When false, no custom header (e.g. tab screens use Expo header). Default: derived from title/nav flags. */
  showHeader?: boolean;
};
