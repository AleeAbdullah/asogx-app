/**
 * Wishlist Page
 * Shows the user's saved/wishlisted products from the API.
 * Requires sign-in; shows empty state when not signed in or when list is empty.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '@/dal';
import { ROUTES } from '@/dal';
import type { Product } from '@/constants/types';
import { ProductGrid } from '@/components/products/ProductGrid';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useColorScheme } from '@/lib/useColorScheme';
import { THEME } from '@/constants/config';
import { COLORS } from '@/constants/colors';

// API response shape for GET /cart/wishlist/
interface WishlistProduct {
  id: number;
  name: string;
  name_ar?: string;
  image: string;
  price: string;
  original_price: string | null;
  category: string;
  discount: number | null;
  discount_percentage: number | null;
  free_shipping: boolean;
  fast_delivery: boolean;
  in_stock: boolean;
}

interface WishlistResponse {
  id: number;
  user: number;
  products: WishlistProduct[];
  created_at: string;
  updated_at: string;
}

function mapWishlistProductToProduct(p: WishlistProduct): Product {
  return {
    id: p.id,
    name: p.name,
    name_ar: p.name_ar ?? '',
    image: p.image,
    price: p.price,
    original_price: p.original_price,
    category: p.category,
    discount: p.discount,
    discount_percentage: p.discount_percentage,
    free_shipping: p.free_shipping,
    fast_delivery: p.fast_delivery,
    in_stock: p.in_stock,
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === 'dark' ? COLORS.dark.foreground : COLORS.grey;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  const fetchWishlist = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);

      const data = await apiClient.get<WishlistResponse>(ROUTES.WISHLIST.GET);
      const list = data?.products ?? [];
      setProducts(list.map(mapWishlistProductToProduct));
      setIsSignedIn(true);
    } catch (err) {
      // 401 or any error: treat as not signed in, show empty wishlist with sign-in prompt
      setProducts([]);
      setIsSignedIn(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRefresh = () => fetchWishlist(true);

  if (loading && !refreshing && products.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: 'Wishlist' }} />
        <SafeAreaView className="flex-1 bg-background">
          <LoadingSpinner fullScreen />
        </SafeAreaView>
      </>
    );
  }

  // Not signed in: show empty state with sign-in prompt
  if (isSignedIn === false && products.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: 'Wishlist' }} />
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="heart-outline" size={64} color={iconColor} />
            <Text className="mt-4 text-center text-xl font-semibold text-foreground">
              Sign in to view your wishlist
            </Text>
            <Text className="mt-2 text-center text-base text-muted-foreground">
              Save items you like and see them here.
            </Text>
            <TouchableOpacity
              className="mt-6 rounded-xl bg-primary px-6 py-3"
              onPress={() => router.push('/(tabs)/profile')}
              activeOpacity={0.7}>
              <Text className="font-semibold text-primary-foreground">Go to Profile</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  // Signed in but empty wishlist
  if (isSignedIn && products.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: 'Wishlist' }} />
        <SafeAreaView className="flex-1 bg-background">
          <View className="flex-1 items-center justify-center px-8">
            <Ionicons name="heart-outline" size={64} color={iconColor} />
            <Text className="mt-4 text-center text-xl font-semibold text-foreground">
              Your wishlist is empty
            </Text>
            <Text className="mt-2 text-center text-base text-muted-foreground">
              Tap the heart on any product to add it here.
            </Text>
            <TouchableOpacity
              className="mt-6 rounded-xl bg-primary px-6 py-3"
              onPress={() => router.push('/(tabs)/shop')}
              activeOpacity={0.7}>
              <Text className="font-semibold text-primary-foreground">Browse products</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Wishlist' }} />
      <SafeAreaView className="flex-1 bg-background">
        <ProductGrid
          products={products}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListHeaderComponent={
            <View className="mb-4">
              <Text className="text-2xl font-bold text-foreground">Wishlist</Text>
              <Text className="mt-1 text-sm text-muted-foreground">
                {products.length} item{products.length !== 1 ? 's' : ''} saved
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}
