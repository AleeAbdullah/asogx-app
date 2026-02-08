/**
 * Product Card Component
 * Reusable product card for lists and grids
 */

import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import type { Product } from '@/constants/types';
import { THEME } from '@/constants/config';

interface ProductCardProps {
  product: Product;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - THEME.SPACING.lg * 3) / 2;

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;

  return (
    <Link href={`/products/${product.id}` as any} asChild>
      <TouchableOpacity
        className="mb-4 overflow-hidden bg-card"
        style={{
          width: CARD_WIDTH,
          borderRadius: THEME.BORDER_RADIUS.lg,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        activeOpacity={0.7}>
        <View className="relative" style={{ width: '100%', height: CARD_WIDTH }}>
          <Image source={{ uri: product.image }} className="h-full w-full" resizeMode="cover" />
          {hasDiscount && (
            <View
              className="bg-sale absolute px-2 py-1"
              style={{
                top: THEME.SPACING.sm,
                right: THEME.SPACING.sm,
                borderRadius: THEME.BORDER_RADIUS.sm,
              }}>
              <Text
                className="text-sale-foreground font-bold"
                style={{
                  fontSize: THEME.FONT_SIZES.xs,
                }}>
                -{product.discount_percentage}%
              </Text>
            </View>
          )}
          {!product.in_stock && (
            <View
              className="absolute inset-0 items-center justify-center"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              <Text className="font-bold text-white" style={{ fontSize: THEME.FONT_SIZES.md }}>
                Out of Stock
              </Text>
            </View>
          )}
        </View>

        <View style={{ padding: THEME.SPACING.sm }}>
          <Text
            className="mb-1 text-foreground"
            style={{
              fontSize: THEME.FONT_SIZES.sm,
              minHeight: 36,
            }}
            numberOfLines={2}>
            {product.name}
          </Text>

          <View className="mb-1 flex-row flex-wrap items-center">
            <Text
              className="mr-1 font-bold text-primary"
              style={{
                fontSize: THEME.FONT_SIZES.md,
              }}>
              AED {product.price}
            </Text>
            {hasDiscount && product.original_price && (
              <Text
                className="text-muted-foreground line-through"
                style={{
                  fontSize: THEME.FONT_SIZES.sm,
                }}>
                AED {product.original_price}
              </Text>
            )}
          </View>

          <View className="flex-row flex-wrap gap-1">
            {product.free_shipping && (
              <View
                className="bg-success px-1"
                style={{
                  paddingVertical: 2,
                  borderRadius: THEME.BORDER_RADIUS.sm,
                }}>
                <Text className="font-semibold text-white" style={{ fontSize: 10 }}>
                  Free Shipping
                </Text>
              </View>
            )}
            {product.fast_delivery && (
              <View
                className="bg-teal px-1"
                style={{
                  paddingVertical: 2,
                  borderRadius: THEME.BORDER_RADIUS.sm,
                }}>
                <Text className="font-semibold text-white" style={{ fontSize: 10 }}>
                  Fast Delivery
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
