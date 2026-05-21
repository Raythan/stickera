import type { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

export type ImageProps = {
  source?: ImageSourcePropType;
  accessibilityLabel?: string;
  style?: StyleProp<ImageStyle>;
  placeholder?: boolean;
  error?: boolean;
};
