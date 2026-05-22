import '@/i18n';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppBootstrapGate } from '@/components/providers/AppBootstrapGate';
import { WebPwaSetup } from '@/components/providers/WebPwaSetup';
import i18n from '@/i18n';
import { theme } from '@/theme';

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <WebPwaSetup />
        <AppBootstrapGate>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: theme.colors.background },
              headerTintColor: theme.colors.secondary,
              headerTitleStyle: { fontWeight: '600' },
              contentStyle: { backgroundColor: theme.colors.background },
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
        </AppBootstrapGate>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
