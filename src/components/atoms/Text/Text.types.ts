import type { ReactNode } from 'react';
import type { TextStyle } from 'react-native';

export type TextVariant = 'h1' | 'h2' | 'body' | 'bodyBold' | 'caption' | 'label';

export type TextProps = {
  children: ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
};
