/**
 * Error Message Component
 * Displays error messages with retry option
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { THEME } from '@/constants/config';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorMessage({ message, onRetry, fullScreen = false }: ErrorMessageProps) {
  return (
    <View className={fullScreen ? 'flex-1 items-center justify-center p-6' : 'items-center p-6'}>
      <Text
        className="mb-4 text-center text-destructive"
        style={{
          fontSize: THEME.FONT_SIZES.md,
        }}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity className="rounded-md bg-primary px-6 py-2" onPress={onRetry}>
          <Text
            className="font-semibold text-primary-foreground"
            style={{
              fontSize: THEME.FONT_SIZES.md,
            }}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
