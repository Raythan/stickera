import { StyleSheet, TextInput, View } from 'react-native';

import { Icon } from '@/components/atoms/Icon';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { SearchFieldProps } from './SearchField.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.sm,
      minHeight: 44,
      gap: theme.spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      paddingVertical: theme.spacing.sm,
    },
  });
}

export function SearchField({
  value,
  onChangeText,
  placeholder,
  accessibilityLabel,
}: SearchFieldProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <Icon name="search-outline" size={20} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}
