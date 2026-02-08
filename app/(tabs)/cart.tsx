/**
 * Cart Screen
 * View shopping cart and checkout
 */

import React from 'react';
import { Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

export default function CartScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
        <Ionicons name="cart-outline" size={64} color={COLORS.grey} />
        <Text className="mb-2 mt-4 text-2xl font-bold text-foreground">Your Cart is Empty</Text>
        <Text className="text-center text-base text-muted-foreground">
          Add products to your cart to see them here.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
