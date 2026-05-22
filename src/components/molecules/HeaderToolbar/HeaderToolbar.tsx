import { StyleSheet, View } from 'react-native';

import { HeaderAboutButton } from '@/components/molecules/HeaderAboutButton';
import { HeaderHomeButton } from '@/components/molecules/HeaderHomeButton';
import { HeaderLocaleMenu } from '@/components/molecules/HeaderLocaleMenu';
import { HeaderSyncButton } from '@/components/molecules/HeaderSyncButton';
import { HeaderThemeMenu } from '@/components/molecules/HeaderThemeMenu';
import { useTheme } from '@/theme/ThemeContext';

export type HeaderToolbarProps = {
  showHome?: boolean;
  showSync?: boolean;
  showTheme?: boolean;
  showAbout?: boolean;
  showLocale?: boolean;
};

export function HeaderToolbar({
  showHome = true,
  showSync = true,
  showTheme = true,
  showAbout = true,
  showLocale = true,
}: HeaderToolbarProps) {
  const { spacing } = useTheme();

  return (
    <View style={[styles.row, { gap: spacing.xs, marginRight: spacing.xs }]}>
      {showSync ? <HeaderSyncButton /> : null}
      {showTheme ? <HeaderThemeMenu /> : null}
      {showLocale ? <HeaderLocaleMenu /> : null}
      {showAbout ? <HeaderAboutButton /> : null}
      {showHome ? <HeaderHomeButton /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
