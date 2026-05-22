import { Text as RNText, StyleSheet } from 'react-native';

import { defaultTheme } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';

import type { TextProps } from './Text.types';

export function Text({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
}: TextProps) {
  const { colors } = useTheme();
  const resolvedColor = color ?? colors.text;

  return (
    <RNText
      style={[styles[variant], { color: resolvedColor }, style]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  h1: defaultTheme.typography.h1,
  h2: defaultTheme.typography.h2,
  body: defaultTheme.typography.body,
  bodyBold: defaultTheme.typography.bodyBold,
  caption: defaultTheme.typography.caption,
  label: defaultTheme.typography.label,
});
