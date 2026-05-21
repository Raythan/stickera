import { Text as RNText, StyleSheet } from 'react-native';

import { theme } from '@/theme';

import type { TextProps } from './Text.types';

export function Text({
  children,
  variant = 'body',
  color = theme.colors.text,
  style,
  numberOfLines,
}: TextProps) {
  return (
    <RNText
      style={[styles[variant], { color }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  h1: theme.typography.h1,
  h2: theme.typography.h2,
  body: theme.typography.body,
  bodyBold: theme.typography.bodyBold,
  caption: theme.typography.caption,
  label: theme.typography.label,
});
