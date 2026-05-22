import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useTheme } from '@/theme';
import { useThemeStore } from '@/theme/themeStore';

export function ThemedNavigationRoot() {
  const theme = useTheme();
  const themeId = useThemeStore((s) => s.themeId);
  const isDark = themeId === 'dark';

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        key={themeId}
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.headerBackground,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.headerBorder,
          },
          headerTintColor: theme.colors.secondary,
          headerTitleStyle: { fontWeight: '600', color: theme.colors.text },
          contentStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: true,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="album/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="trade/index" options={{ headerShown: false }} />
        <Stack.Screen name="trade/offer" options={{ headerShown: false }} />
        <Stack.Screen name="trade/accept" options={{ headerShown: false }} />
        <Stack.Screen
          name="about"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </>
  );
}
