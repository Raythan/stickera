import { Image as RNImage, View, StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

import { Icon } from '@/components/atoms/Icon';
import type { AppTheme } from '@/theme/presets';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { ImageProps } from './Image.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
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
}

export function Image({
  source,
  accessibilityLabel,
  style,
  placeholder = false,
  error = false,
}: ImageProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

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
          color={colors.textMuted}
        />
      </View>
    );
  }

  return (
    <RNImage
      source={source}
      style={[styles.image, style as StyleProp<ImageStyle>]}
      accessibilityLabel={accessibilityLabel}
      resizeMode="cover"
    />
  );
}
