import { Tabs } from 'expo-router';
import React from 'react';

import { CartTabIcon } from '@/components/CartTabIcon';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: { height: 72, paddingBottom: 12, paddingTop: 8 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="bag.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Carrinho',
          tabBarIcon: ({ color }) => <CartTabIcon color={color} />,
        }}
      />
    </Tabs>
  );
}
