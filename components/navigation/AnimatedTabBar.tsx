/**
 * Unified Tab Bar Component
 * Clean bottom navigation with theme support
 */

import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from '@/lib/useColorScheme';
import { COLORS } from '@/constants/colors';

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();

  return (
    <View
      className="border-t border-border bg-card px-2 pt-3"
      style={{
        paddingBottom: Math.max(insets.bottom, 8),
      }}>
      <View className="relative flex-row items-center justify-around pb-2">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // Skip hidden tabs
          if (options.tabBarButton && typeof options.tabBarButton === 'function') {
            const result = options.tabBarButton({ children: null });
            if (result === null) return null;
          }

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const iconName = options.tabBarIcon
            ? (options.tabBarIcon as any)({ focused: isFocused, color: '', size: 24 }).props.name
            : 'help-circle-outline';

          const onPress = () => {
            if (Platform.OS === 'ios') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              label={String(label)}
              iconName={iconName}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

interface TabButtonProps {
  label: string;
  iconName: string;
  isFocused: boolean;
  onPress: () => void;
}

function TabButton({ label, iconName, isFocused, onPress }: TabButtonProps) {
  return (
    <View className="z-10 flex-1 items-center">
      <TouchableOpacity
        className="min-h-[48px] items-center justify-center"
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ selected: isFocused }}
        accessibilityLabel={label}>
        <View
          className="flex-row items-center rounded-full px-4 py-2"
          style={{
            backgroundColor: isFocused ? COLORS.primary : 'transparent',
          }}>
          {/* Icon */}
          <Ionicons
            name={iconName as any}
            size={24}
            color={isFocused ? COLORS.white : COLORS.grey}
            style={{ zIndex: 2 }}
          />

          {/* Label */}
          {isFocused && (
            <Text
              className="z-10 ml-1.5 text-xs font-semibold tracking-wide text-white"
              numberOfLines={1}>
              {label}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
