/**
 * Tabs Layout
 * Bottom tab navigation with unified theme-aware design
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/lib/useColorScheme';
import { AnimatedTabBar } from '@/components/navigation/AnimatedTabBar';
import { COLORS } from '@/constants/colors';

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();

  // Header needs actual color values
  const headerBg = colorScheme === 'dark' ? COLORS.dark.card : COLORS.white;
  const headerTint = colorScheme === 'dark' ? COLORS.dark.foreground : COLORS.light.foreground;

  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: headerBg,
        },
        headerTintColor: headerTint,
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'bag' : 'bag-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />
          ),
        }}
      />
      {/* Hidden routes - accessible via navigation but not shown in tab bar */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarButton: () => null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Shop',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Products',
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="products/[id]"
        options={{
          headerShown: true,
          title: 'Product Details',
          tabBarButton: () => null,
        }}
      />
    </Tabs>
  );
}
