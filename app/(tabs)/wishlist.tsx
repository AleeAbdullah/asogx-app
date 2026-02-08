/**
 * Wishlist Page
 * Saved products with grid layout
 */

import React, { useState, useEffect, useCallback } from 'react';

import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { productsApi } from '@/dal';
import type { Product, ProductSortBy } from '@/constants/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { THEME, PAGINATION } from '@/constants/config';

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<ProductSortBy>('relevance');

  const fetchProducts = useCallback(
    async (pageNum: number, refresh: boolean = false) => {
      try {
        if (refresh) {
          setRefreshing(true);
          setError(null);
        } else if (pageNum === 1) {
          setLoading(true);
          setError(null);
        }

        const response = await productsApi.getProducts({
          page: pageNum,
          page_size: PAGINATION.DEFAULT_PAGE_SIZE,
          sort: sortBy,
        });

        if (refresh || pageNum === 1) {
          setProducts(response.results);
        } else {
          setProducts((prev) => [...prev, ...response.results]);
        }

        setHasMore(response.next !== null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load products';
        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [sortBy]
  );

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handleRefresh = () => {
    setPage(1);
    fetchProducts(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const handleSortChange = (newSort: ProductSortBy) => {
    setSortBy(newSort);
    setPage(1);
  };

  if (loading && page === 1) {
    return (
      <>
        <Stack.Screen options={{ title: 'Products' }} />
        <SafeAreaView className="flex-1" style={{ backgroundColor: THEME.COLORS.background }}>
          <LoadingSpinner fullScreen />
        </SafeAreaView>
      </>
    );
  }

  if (error && products.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: 'Products' }} />
        <SafeAreaView className="flex-1" style={{ backgroundColor: THEME.COLORS.background }}>
          <ErrorMessage message={error} onRetry={() => fetchProducts(1)} fullScreen />
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Products' }} />
      <SafeAreaView className="flex-1" style={{ backgroundColor: THEME.COLORS.background }}>
        <ProductGrid
          products={products}
          onEndReached={handleLoadMore}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            <View className="mb-4">
              <Text
                className="mb-4 font-bold"
                style={{
                  fontSize: THEME.FONT_SIZES['2xl'],
                  color: THEME.COLORS.foreground,
                }}>
                All Products
              </Text>
              <View className="mb-2">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: THEME.SPACING.xs }}>
                  <SortButton
                    label="Relevance"
                    value="relevance"
                    active={sortBy === 'relevance'}
                    onPress={() => handleSortChange('relevance')}
                  />
                  <SortButton
                    label="Price: Low to High"
                    value="price_asc"
                    active={sortBy === 'price_asc'}
                    onPress={() => handleSortChange('price_asc')}
                  />
                  <SortButton
                    label="Price: High to Low"
                    value="price_desc"
                    active={sortBy === 'price_desc'}
                    onPress={() => handleSortChange('price_desc')}
                  />
                  <SortButton
                    label="Newest"
                    value="newest"
                    active={sortBy === 'newest'}
                    onPress={() => handleSortChange('newest')}
                  />
                  <SortButton
                    label="Best Selling"
                    value="best_selling"
                    active={sortBy === 'best_selling'}
                    onPress={() => handleSortChange('best_selling')}
                  />
                </ScrollView>
              </View>
            </View>
          }
          ListFooterComponent={loading && page > 1 ? <LoadingSpinner /> : undefined}
        />
      </SafeAreaView>
    </>
  );
}

interface SortButtonProps {
  label: string;
  value: ProductSortBy;
  active: boolean;
  onPress: () => void;
}

function SortButton({ label, active, onPress }: SortButtonProps) {
  return (
    <TouchableOpacity
      className="px-4 py-2"
      style={{
        borderRadius: THEME.BORDER_RADIUS.md,
        backgroundColor: active ? THEME.COLORS.primary : THEME.COLORS.secondary,
        borderWidth: 1,
        borderColor: active ? THEME.COLORS.primary : THEME.COLORS.border,
      }}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text
        style={{
          fontSize: THEME.FONT_SIZES.sm,
          color: active ? THEME.COLORS.primaryForeground : THEME.COLORS.secondaryForeground,
          fontWeight: active ? '600' : '500',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
