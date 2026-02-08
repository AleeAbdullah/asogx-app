/**
 * Featured Products Section Component
 * Section with horizontal scrolling small product cards
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductCardSmall } from './ProductCardSmall';
import { COLORS } from '@/constants/colors';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isFavorite?: boolean;
  hasSale?: boolean;
}

interface FeaturedProductsSectionProps {
  products: Product[];
  onViewAll: () => void;
  onProductPress: (id: string) => void;
  onFavoritePress: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export function FeaturedProductsSection({
  products,
  onViewAll,
  onProductPress,
  onFavoritePress,
  onAddToCart,
}: FeaturedProductsSectionProps) {
  return (
    <View className="mb-6">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between px-5">
        <Text className="text-navy text-xl font-bold">Featured products</Text>

        <TouchableOpacity
          onPress={onViewAll}
          activeOpacity={0.7}
          className="flex-row items-center gap-1">
          <Text className="text-navy text-base">view all</Text>
          <Ionicons name="chevron-forward-outline" size={16} color={COLORS.navy} />
        </TouchableOpacity>
      </View>

      {/* Products Horizontal List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
        {products.map((product) => (
          <ProductCardSmall
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.image}
            rating={product.rating}
            reviewCount={product.reviewCount}
            isFavorite={product.isFavorite}
            hasSale={product.hasSale}
            onPress={() => onProductPress(product.id)}
            onFavoritePress={() => onFavoritePress(product.id)}
            onAddToCart={() => onAddToCart(product.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
