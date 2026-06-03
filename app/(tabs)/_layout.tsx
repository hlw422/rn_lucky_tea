import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { BrandColors } from '../../constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: BrandColors.primary,
        tabBarInactiveTintColor: BrandColors.textSecondary,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: BrandColors.borderLight,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: '菜单',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: '订单',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="receipt" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: '购物车',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="cart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
