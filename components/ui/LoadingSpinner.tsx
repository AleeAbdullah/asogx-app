/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  color = COLORS.primary,
  fullScreen = false,
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return (
    <View className="items-center justify-center p-6">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
