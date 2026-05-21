import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/atoms/Icon';
import { Text } from '@/components/atoms/Text';
import { theme } from '@/theme';

import type { SignatureBlockProps } from './SignatureBlock.types';

export function SignatureBlock({
  authorName,
  tagline,
  madeWith,
  githubUrl,
  linkedinUrl,
}: SignatureBlockProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.avatar}>
        <Icon name="person-circle-outline" size={64} color={theme.colors.secondary} />
      </View>
      <Text variant="h2" style={styles.name}>
        {authorName}
      </Text>
      <Text variant="body" color={theme.colors.textMuted} style={styles.tagline}>
        {tagline}
      </Text>
      <Text variant="caption" color={theme.colors.textMuted} style={styles.madeWith}>
        {madeWith}
      </Text>
      <View style={styles.links}>
        {githubUrl ? (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="GitHub"
            onPress={() => void Linking.openURL(githubUrl)}
            style={styles.linkBtn}
          >
            <Icon name="logo-github" size={22} color={theme.colors.secondary} />
          </Pressable>
        ) : null}
        {linkedinUrl ? (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="LinkedIn"
            onPress={() => void Linking.openURL(linkedinUrl)}
            style={styles.linkBtn}
          >
            <Icon name="logo-linkedin" size={22} color={theme.colors.secondary} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  avatar: {
    marginBottom: theme.spacing.md,
  },
  name: {
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  tagline: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  madeWith: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  links: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  linkBtn: {
    padding: theme.spacing.sm,
  },
});
