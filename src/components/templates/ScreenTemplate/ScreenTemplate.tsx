import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenNavBar } from '@/components/molecules/ScreenNavBar';
import { theme } from '@/theme';

import type { ScreenTemplateProps } from './ScreenTemplate.types';

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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerWrap: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
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
