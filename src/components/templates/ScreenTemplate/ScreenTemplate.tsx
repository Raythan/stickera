import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenNavBar } from '@/components/molecules/ScreenNavBar';
import type { AppTheme } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import { useThemedStyles } from '@/theme/useThemedStyles';

import type { ScreenTemplateProps } from './ScreenTemplate.types';

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerWrap: {
      backgroundColor: theme.colors.headerBackground,
      paddingHorizontal: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.headerBorder,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 4,
      zIndex: 10,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xl,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
  });
}

export function ScreenTemplate({
  title,
  children,
  footer,
  refreshing = false,
  onRefresh,
  showBack = true,
  showHome = true,
  showLocale = true,
  showHeader: showHeaderProp,
}: ScreenTemplateProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const styles = useThemedStyles(createStyles);
  const showHeader =
    showHeaderProp ?? (showBack || showHome || showLocale || !!title);

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      {showHeader ? (
        <View style={[styles.headerWrap, { paddingTop: insets.top }]}>
          <ScreenNavBar
            title={title}
            showBack={showBack}
            showHome={showHome}
            showLocale={showLocale}
          />
        </View>
      ) : (
        <View style={{ height: insets.top, backgroundColor: theme.colors.background }} />
      )}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}
