/**
 * Star Rating Component
 * Reusable component for displaying product ratings
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

interface StarRatingProps {
  rating: number; // 0-5
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}

export function StarRating({
  rating,
  reviewCount,
  size = 'sm',
  showCount = true,
}: StarRatingProps) {
  const sizeMap = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  const iconSize = sizeMap[size];
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = rating >= i + 1;
    return filled ? 'star' : 'star-outline';
  });

  return (
    <View className="flex-row items-center gap-1">
      {stars.map((icon, index) => (
        <Ionicons key={index} name={icon as any} size={iconSize} color={COLORS.yellow} />
      ))}
      {showCount && reviewCount !== undefined && (
        <Text className="ml-1 text-xs text-gray-text">({reviewCount})</Text>
      )}
    </View>
  );
}
