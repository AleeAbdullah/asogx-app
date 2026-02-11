/**
 * Search Bar Component
 * Home page search input with icon
 */

import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/lib/useColorScheme';
import { COLORS } from '@/constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Search shoes...',
}: SearchBarProps) {
  const { colorScheme } = useColorScheme();

  return (
    <View className="mb-4 flex-row items-center rounded-xl border border-border bg-card px-4 py-3">
      <Ionicons name="search-outline" size={20} color={COLORS.grey} style={{ marginRight: 8 }} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.grey}
        className="flex-1 text-base leading-5 text-foreground"
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Ionicons name="close-circle" size={20} color={COLORS.grey} />
        </TouchableOpacity>
      )}
    </View>
  );
}
