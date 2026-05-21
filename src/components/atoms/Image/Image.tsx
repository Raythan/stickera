import { Image as RNImage, View, StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

import { Icon } from '@/components/atoms/Icon';
import { theme } from '@/theme';

import type { ImageProps } from './Image.types';

export function Image({
  source,
  accessibilityLabel,
  style,
  placeholder = false,
  error = false,
}: ImageProps) {
  if (error || placeholder || !source) {
    return (
      <View
        style={styles.placeholder}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="image"
      >
        <Icon
          name={error ? 'alert-circle-outline' : 'image-outline'}
          size={32}
          color={theme.colors.textMuted}
        />
      </View>
    );
  }

  return (
    <RNImage
      source={source}
      style={[styles.image, style]}
      accessibilityLabel={accessibilityLabel}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: theme.colors.stickerPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
