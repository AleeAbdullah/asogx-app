/**
 * Profile Screen
 * User profile and settings
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/lib/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

export default function ProfileScreen() {
  const { toggleColorScheme, isDarkColorScheme, colorScheme } = useColorScheme();

  // Icon colors need actual values, not Tailwind classes
  const foregroundColor = colorScheme === 'dark' ? COLORS.dark.foreground : COLORS.light.foreground;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center py-6">
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-primary">
            <Ionicons name="person" size={48} color={COLORS.white} />
          </View>
          <Text className="mb-1 text-2xl font-bold text-foreground">Guest User</Text>
          <Text className="text-sm text-muted-foreground">Sign in to access your profile</Text>
        </View>

        <View className="mt-6 overflow-hidden rounded-xl">
          <TouchableOpacity
            className="flex-row items-center border-b border-border py-4"
            activeOpacity={0.7}>
            <Ionicons name="person-outline" size={24} color={foregroundColor} />
            <Text className="ml-4 flex-1 text-base text-foreground">Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center border-b border-border py-4"
            activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color={foregroundColor} />
            <Text className="ml-4 flex-1 text-base text-foreground">Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center border-b border-border py-4"
            onPress={toggleColorScheme}
            activeOpacity={0.7}>
            <Ionicons
              name={isDarkColorScheme ? 'moon' : 'sunny'}
              size={24}
              color={foregroundColor}
            />
            <Text className="ml-4 flex-1 text-base text-foreground">
              {isDarkColorScheme ? 'Dark Mode' : 'Light Mode'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center border-b border-border py-4"
            activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={24} color={foregroundColor} />
            <Text className="ml-4 flex-1 text-base text-foreground">Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.grey} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mt-8 items-center rounded-xl bg-primary py-4"
          activeOpacity={0.8}>
          <Text className="text-base font-semibold text-white">Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
