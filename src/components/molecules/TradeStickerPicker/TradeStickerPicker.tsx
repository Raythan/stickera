import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

import type { TradeStickerPickerProps } from './TradeStickerPicker.types';

function formatLabel(stickerId: string): string {
  const parts = stickerId.split(':');
  return parts.length >= 2 ? `#${parts[1]}` : stickerId;
}

export function TradeStickerPicker({
  stickerIds,
  selectedId,
  onSelect,
  label,
}: TradeStickerPickerProps) {
  return (
    <View style={styles.container}>
      <Text variant="bodyBold" style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
        {stickerIds.map((id) => (
          <Pressable
            key={id}
            onPress={() => onSelect(id)}
            style={[styles.chip, selectedId === id && styles.chipSelected]}
          >
            <Text
              variant="caption"
              color={selectedId === id ? theme.colors.textInverse : theme.colors.text}
            >
              {formatLabel(id)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    marginBottom: theme.spacing.sm,
  },
  list: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
});
