/**
 * Main Carousel Component
 * Hero banner with carousel and dot indicators
 * Supports image-only cards from the hero cards API
 */

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Dimensions, Image, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CarouselItem {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

interface MainCarouselProps {
  items: CarouselItem[];
}

export function MainCarousel({ items }: MainCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  if (items.length === 0) return null;

  return (
    <View className="mb-6">
      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {items.map((item) => (
          <View
            key={item.id}
            className="items-center justify-center overflow-hidden bg-light-bg"
            style={{ width: SCREEN_WIDTH, height: 280 }}>
            {/* Text overlay (only if title provided) */}
            {item.title ? (
              <View className="absolute left-5 top-16 z-10">
                <Text className="mb-0 text-4xl font-bold leading-tight text-navy">{item.title}</Text>
                {item.subtitle && (
                  <Text className="text-4xl font-bold leading-tight text-navy">{item.subtitle}</Text>
                )}
              </View>
            ) : null}

            {/* Hero Image */}
            <Image
              source={{ uri: item.image }}
              style={{ width: SCREEN_WIDTH, height: 280 }}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Dot Indicators (only show if more than 1 item) */}
      {items.length > 1 && (
        <View className="absolute bottom-2 left-0 right-0 flex-row items-center justify-center gap-2">
          {items.map((_, index) => (
            <View
              key={index}
              className="h-1.5 rounded-full"
              style={{
                width: 22,
                backgroundColor: index === activeIndex ? '#193364' : '#E8EFF4',
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
