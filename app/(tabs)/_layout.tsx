import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { HeaderHomeButton } from '@/components/molecules/HeaderHomeButton';
import { theme } from '@/theme';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.secondary,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="albums-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pack"
        options={{
          title: t('tabs.pack'),
          headerRight: () => <HeaderHomeButton />,
          tabBarIcon: ({ color, size }) => (
            <Icon name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          headerRight: () => <HeaderHomeButton />,
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
