import { useMemo } from 'react';

import type { AppTheme } from './presets';
import { useTheme } from './ThemeContext';

export function useThemedStyles<T>(factory: (theme: AppTheme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme, factory]);
}
