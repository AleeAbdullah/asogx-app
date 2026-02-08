/**
 * Product Card Small Component
 * Small product card for Featured Products section (138px wide)
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { StarRating } from '@/components/ui/StarRating';

interface ProductCardSmallProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isFavorite?: boolean;
  hasSale?: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
  onAddToCart: () => void;
}

export function ProductCardSmall({
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  isFavorite = false,
  hasSale = false,
  onPress,
  onFavoritePress,
  onAddToCart,
}: ProductCardSmallProps) {
  // Show sale badge if there's a discount
  const showSaleBadge = hasSale || (originalPrice && originalPrice > price);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="w-[138px]"
      style={{ width: 138 }}>
      {/* Image Container */}
      <View className="bg-light-bg relative mb-2 h-[170px] items-center justify-center overflow-hidden rounded-xl">
        <Image
          source={{ uri: image }}
          className="h-[125px] w-[124px]"
          resizeMode="contain"
          style={{ width: 124, height: 125 }}
        />

        {/* Sale Badge */}
        {showSaleBadge && (
          <View className="bg-yellow absolute left-2 top-2 rounded-md px-1.5 py-0.5">
            <Text className="text-navy text-[10px] font-bold">SALE</Text>
          </View>
        )}

        {/* Favorite Icon */}
        <TouchableOpacity
          onPress={onFavoritePress}
          className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5"
          activeOpacity={0.7}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={16}
            color={isFavorite ? COLORS.redAccent : COLORS.grey}
          />
        </TouchableOpacity>

        {/* Add to Cart Icon */}
        <TouchableOpacity
          onPress={onAddToCart}
          className="absolute right-2 top-12 rounded-full bg-white/80 p-1.5"
          activeOpacity={0.7}>
          <Ionicons name="bag-outline" size={16} color={COLORS.navy} />
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View className="px-0.5">
        {/* Rating */}
        <StarRating rating={rating} reviewCount={reviewCount} size="sm" showCount={true} />

        {/* Product Name */}
        <Text className="text-gray-text mt-1 text-sm" numberOfLines={1}>
          {name}
        </Text>

        {/* Price */}
        <View className="mt-1 flex-row items-center gap-1">
          {originalPrice && originalPrice > price && (
            <Text className="text-gray-text text-xs line-through">${originalPrice.toFixed(2)}</Text>
          )}
          <Text
            className={`text-sm font-semibold ${originalPrice && originalPrice > price ? 'text-red-accent' : 'text-navy'}`}>
            ${price.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
