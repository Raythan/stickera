import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Icon } from '@/components/atoms/Icon';
import { HeaderToolbar } from '@/components/molecules/HeaderToolbar';
import { useTheme } from '@/theme';

export default function TabsLayout() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        headerStyle: {
          backgroundColor: theme.colors.headerBackground,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.headerBorder,
        },
        headerTintColor: theme.colors.secondary,
        headerTitleStyle: { fontWeight: '600', color: theme.colors.text },
        headerShadowVisible: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          headerRight: () => <HeaderToolbar showHome={false} />,
          tabBarIcon: ({ color, size }) => (
            <Icon name="albums-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pack"
        options={{
          title: t('tabs.pack'),
          headerRight: () => <HeaderToolbar />,
          tabBarIcon: ({ color, size }) => (
            <Icon name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: t('tabs.trade'),
          headerRight: () => <HeaderToolbar />,
          tabBarIcon: ({ color, size }) => (
            <Icon name="swap-horizontal-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          headerRight: () => <HeaderToolbar />,
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
