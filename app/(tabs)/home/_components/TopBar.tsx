/**
 * Top Bar Component
 * Header with menu button and shop button
 */

import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface TopBarProps {
  onMenuPress: () => void;
  onShopPress: () => void;
}

export function TopBar({ onMenuPress, onShopPress }: TopBarProps) {
  return (
    <View
      className="flex-row items-center justify-between border-b border-border bg-background px-5 py-3">
      {/* Menu Button */}
      <TouchableOpacity onPress={onMenuPress} activeOpacity={0.7} className="p-2">
        <Ionicons name="menu-outline" size={24} color={COLORS.navy} />
      </TouchableOpacity>

      {/* Shop / Browse Button */}
      <TouchableOpacity onPress={onShopPress} activeOpacity={0.7} className="p-2">
        <Ionicons name="storefront-outline" size={24} color={COLORS.navy} />
      </TouchableOpacity>
    </View>
  );
}
