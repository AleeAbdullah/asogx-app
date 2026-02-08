/**
 * Promo Banner Component
 * Promotional banner with CTA button
 */

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

interface PromoBannerProps {
  title: string;
  ctaText: string;
  image: string;
  onCtaPress: () => void;
}

export function PromoBanner({ title, ctaText, image, onCtaPress }: PromoBannerProps) {
  return (
    <View className="mb-6 h-[150px] overflow-hidden bg-light-bg">
      <View className="relative h-full w-full">
        {/* Background Image */}
        <Image
          source={{ uri: image }}
          className="absolute right-0 top-0"
          style={{ width: 250, height: 250 }}
          resizeMode="contain"
        />

        {/* Content */}
        <View className="absolute left-5 top-8">
          <Text className="mb-4 text-2xl font-bold capitalize leading-tight text-navy">
            {title}
          </Text>

          <TouchableOpacity
            onPress={onCtaPress}
            activeOpacity={0.7}
            className="items-center justify-center rounded-xl bg-navy px-6 py-3"
            style={{ alignSelf: 'flex-start' }}>
            <Text className="text-sm font-black capitalize text-yellow">{ctaText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
