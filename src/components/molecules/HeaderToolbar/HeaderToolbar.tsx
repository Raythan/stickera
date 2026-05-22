import { StyleSheet, View } from 'react-native';

import { HeaderHomeButton } from '@/components/molecules/HeaderHomeButton';
import { HeaderLocaleMenu } from '@/components/molecules/HeaderLocaleMenu';
import { HeaderSyncButton } from '@/components/molecules/HeaderSyncButton';
import { useTheme } from '@/theme/ThemeContext';

type HeaderToolbarProps = {
  showHome?: boolean;
};

export function HeaderToolbar({ showHome = true }: HeaderToolbarProps) {
  const { spacing } = useTheme();

  return (
    <View style={[styles.row, { gap: spacing.xs, marginRight: spacing.xs }]}>
      <HeaderSyncButton />
      <HeaderLocaleMenu />
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
