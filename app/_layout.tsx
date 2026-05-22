import '@/i18n';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppBootstrapGate } from '@/components/providers/AppBootstrapGate';
import { ThemedNavigationRoot } from '@/components/providers/ThemedNavigationRoot';
import { WebPwaSetup } from '@/components/providers/WebPwaSetup';
import i18n from '@/i18n';
import { ThemeProvider } from '@/theme';

export default function RootLayout() {
  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <ThemeProvider>
          <WebPwaSetup />
          <AppBootstrapGate>
            <ThemedNavigationRoot />
          </AppBootstrapGate>
        </ThemeProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
}
