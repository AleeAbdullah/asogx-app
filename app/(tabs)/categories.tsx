/**
 * Products Listing Screen
 * Handles "View All" navigation from home page sections
 * Supports filter, search, and sort params
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '@/dal';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

// Match the actual API response shape
interface ListProduct {
  id: number;
  name: string;
  name_ar: string | null;
  image: string;
  price: number;
  original_price: number | null;
  discount_percentage: number | null;
  primary_category: {
    name: string;
    slug: string;
    full_path?: string;
  } | null;
  stock_quantity: number;
  in_stock: boolean;
  free_shipping: boolean;
  fast_delivery: boolean;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListProduct[];
}

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'best_selling';

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Best Selling', value: 'best_selling' },
];

// Map filter param to page title and API params
function getPageConfig(filter?: string, search?: string) {
  if (search) {
    return { title: `Search: "${search}"`, apiParams: { search } };
  }
  switch (filter) {
    case 'best_selling':
      return { title: 'Best Sellers', apiParams: { sort: 'best_selling' } };
    case 'featured':
      return { title: 'Featured Products', apiParams: {} };
    case 'deals':
      return { title: 'Deals & Offers', apiParams: {} };
    default:
      return { title: 'All Products', apiParams: {} };
  }
}

export default function CategoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string; search?: string }>();
  const { filter, search } = params;

  const pageConfig = getPageConfig(filter, search);

  const [products, setProducts] = useState<ListProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>(
    filter === 'best_selling' ? 'best_selling' : 'relevance'
  );

  const fetchProducts = useCallback(
    async (pageNum: number, refresh: boolean = false) => {
      try {
        if (refresh || pageNum === 1) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        let data: ListProduct[] = [];
        let total = 0;
        let nextPage: string | null = null;

        // Featured and deals use dedicated endpoints (non-paginated)
        if (filter === 'featured' && pageNum === 1) {
          const result = await apiClient.get<any>('/products/featured/');
          // Handle both array and paginated response
          data = Array.isArray(result) ? result : result.results || [];
          total = data.length;
          nextPage = null;
        } else if (filter === 'deals' && pageNum === 1) {
          const result = await apiClient.get<any>('/products/deals/');
          data = Array.isArray(result) ? result : result.results || [];
          total = data.length;
          nextPage = null;
        } else {
          // Use the paginated products list API
          const apiParams: Record<string, any> = {
            page: pageNum,
            page_size: 20,
            sort: sortBy,
            ...pageConfig.apiParams,
          };

          const response = await apiClient.get<PaginatedResponse>('/products/', apiParams);
          data = response.results;
          total = response.count;
          nextPage = response.next;
        }

        if (refresh || pageNum === 1) {
          setProducts(data);
        } else {
          setProducts((prev) => [...prev, ...data]);
        }

        setTotalCount(total);
        setHasMore(nextPage !== null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load products';
        setError(message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filter, search, sortBy, pageConfig.apiParams]
  );

  useEffect(() => {
    setPage(1);
    fetchProducts(1, true);
  }, [fetchProducts]);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setPage(1);
  };

  const handleProductPress = (id: number) => {
    router.push(`/products/${id}`);
  };

  // Render a product card
  const renderProduct = ({ item }: { item: ListProduct }) => {
    const hasDiscount = item.original_price && item.original_price > item.price;

    return (
      <Link href={`/products/${item.id}` as any} asChild>
        <TouchableOpacity
          className="mb-4 overflow-hidden bg-card"
          style={{
            width: CARD_WIDTH,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          activeOpacity={0.7}>
          {/* Product Image */}
          <View style={{ width: '100%', height: CARD_WIDTH }}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center bg-muted">
                <Ionicons name="image-outline" size={40} color={COLORS.grey} />
              </View>
            )}
            {hasDiscount && item.discount_percentage && (
              <View
                className="absolute bg-red-500 px-2 py-1"
                style={{ top: 8, right: 8, borderRadius: 4 }}>
                <Text className="text-xs font-bold text-white">
                  -{item.discount_percentage}%
                </Text>
              </View>
            )}
            {!item.in_stock && (
              <View
                className="absolute inset-0 items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                <Text className="font-bold text-white">Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Product Info */}
          <View className="p-2">
            <Text className="mb-1 text-sm text-foreground" numberOfLines={2} style={{ minHeight: 36 }}>
              {item.name}
            </Text>

            <View className="mb-1 flex-row flex-wrap items-center">
              <Text className="mr-1 text-base font-bold text-primary">
                AED {item.price}
              </Text>
              {hasDiscount && item.original_price && (
                <Text className="text-sm text-muted-foreground line-through">
                  AED {item.original_price}
                </Text>
              )}
            </View>

            <View className="flex-row flex-wrap gap-1">
              {item.free_shipping && (
                <View className="rounded bg-green-600 px-1" style={{ paddingVertical: 2 }}>
                  <Text className="font-semibold text-white" style={{ fontSize: 10 }}>
                    Free Shipping
                  </Text>
                </View>
              )}
              {item.fast_delivery && (
                <View className="rounded bg-teal-600 px-1" style={{ paddingVertical: 2 }}>
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
  };

  // Header with title, count, and sort options
  const ListHeader = () => (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-foreground">{pageConfig.title}</Text>
        {totalCount > 0 && (
          <Text className="text-sm text-muted-foreground">{totalCount} products</Text>
        )}
      </View>

      {/* Sort options (don't show for featured/deals which use dedicated endpoints) */}
      {filter !== 'featured' && filter !== 'deals' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, paddingVertical: 4 }}>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              className="rounded-lg border px-4 py-2"
              style={{
                backgroundColor: sortBy === option.value ? COLORS.primary : 'transparent',
                borderColor: sortBy === option.value ? COLORS.primary : COLORS.grey3,
              }}
              onPress={() => handleSortChange(option.value)}
              activeOpacity={0.7}>
              <Text
                className="text-sm"
                style={{
                  color: sortBy === option.value ? '#fff' : COLORS.navy,
                  fontWeight: sortBy === option.value ? '600' : '400',
                }}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="mt-4 text-muted-foreground">Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.grey} />
          <Text className="mt-4 text-center text-lg text-foreground">{error}</Text>
          <TouchableOpacity
            className="mt-4 rounded-lg px-6 py-3"
            style={{ backgroundColor: COLORS.primary }}
            onPress={() => fetchProducts(1, true)}>
            <Text className="font-semibold text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Empty state
  if (!loading && products.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="search-outline" size={48} color={COLORS.grey} />
          <Text className="mt-4 text-center text-lg text-foreground">No products found</Text>
          <Text className="mt-2 text-center text-sm text-muted-foreground">
            {search
              ? `No results for "${search}". Try a different search term.`
              : 'No products available in this category.'}
          </Text>
          <TouchableOpacity
            className="mt-4 rounded-lg px-6 py-3"
            style={{ backgroundColor: COLORS.primary }}
            onPress={() => router.back()}>
            <Text className="font-semibold text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeader />}
        ListFooterComponent={
          loadingMore ? (
            <View className="py-4">
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : undefined
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}
