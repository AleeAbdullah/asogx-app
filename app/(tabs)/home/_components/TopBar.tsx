/**
 * Top Bar Component
 * Header with menu button and shop button
 */

import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopBarProps {
  onShopPress: () => void;
}

export function TopBar({ onShopPress }: TopBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="absolute z-10 w-full bg-primary" style={{ paddingTop: insets.top }}>
      <View className="py- flex-row items-center justify-between px-5 pb-2">
        {/* App Title */}
        <Text className="text-xl font-bold text-primary-foreground">Lybia Store</Text>
        {/* Shop / Browse Button */}
        <TouchableOpacity onPress={onShopPress} activeOpacity={0.7} className="p-2">
          <Ionicons name="storefront-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
