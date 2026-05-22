import { StyleSheet, View } from 'react-native';

import { HeaderHomeButton } from '@/components/molecules/HeaderHomeButton';
import { HeaderLocaleMenu } from '@/components/molecules/HeaderLocaleMenu';
import { theme } from '@/theme';

type HeaderNavActionsProps = {
  showHome?: boolean;
};

export function HeaderNavActions({ showHome = true }: HeaderNavActionsProps) {
  return (
    <View style={styles.row}>
      <HeaderLocaleMenu />
      {showHome ? <HeaderHomeButton /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
});
