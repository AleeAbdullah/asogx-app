/**
 * Product Grid Component
 * Grid layout for displaying products
 */

import React from 'react';
import { View, FlatList } from 'react-native';
import type { Product } from '@/constants/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListHeaderComponent?: React.ReactElement;
  ListFooterComponent?: React.ReactElement;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function ProductGrid({
  products,
  onEndReached,
  onEndReachedThreshold = 0.5,
  ListHeaderComponent,
  ListFooterComponent,
  refreshing,
  onRefresh,
}: ProductGridProps) {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
