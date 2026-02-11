/**
 * Product Detail Page
 * Displays detailed product information
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { productsApi } from '@/dal';
import type { Product } from '@/constants/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useColorScheme } from '@/lib/useColorScheme';
import { COLORS } from '@/constants/colors';
import { useToast } from '@/components/ui/Toast';

const { width } = Dimensions.get('window');

export default function ProductDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { colorScheme } = useColorScheme();
  const mutedIconColor = colorScheme === 'dark' ? COLORS.dark.foreground : COLORS.grey;
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const productData = await productsApi.getProductById(Number(id));
      setProduct(productData);
      setSelectedImage(productData.image);

      // Fetch related products
      try {
        const related = await productsApi.getRelatedProducts(Number(id));
        setRelatedProducts(related);
      } catch (err) {
        // Non-critical error, just log it
        console.log('Failed to load related products:', err);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load product';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Product',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
        <SafeAreaView className="flex-1 bg-background">
          <LoadingSpinner fullScreen />
        </SafeAreaView>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Stack.Screen
          options={{
            title: 'Product',
            headerShown: true,
            headerBackTitle: 'Back',
          }}
        />
        <SafeAreaView className="flex-1 bg-background">
          <ErrorMessage message={error || 'Product not found'} onRetry={fetchProduct} fullScreen />
        </SafeAreaView>
      </>
    );
  }

  const hasDiscount = product.discount_percentage && product.discount_percentage > 0;

  const handleAddToCart = () => {
    if (!product.in_stock) {
      toast.error('Out of stock', 'This item is currently unavailable.');
      return;
    }
    toast.success('Added to cart', product.name);
  };

  const handleFavoritePress = () => {
    // TODO: Replace with real auth check
    const isSignedIn = false;
    if (!isSignedIn) {
      toast.warning('Sign in required', 'Please sign in to add items to your wishlist.');
      return;
    }
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: product.name,
          headerShown: true,
          headerBackTitle: 'Back',
        }}
      />
      <SafeAreaView className="flex-1 bg-background">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Image Gallery */}
          <View className="relative" style={{ width: '100%', height: width }}>
            <Image source={{ uri: selectedImage }} className="h-full w-full" resizeMode="cover" />
            {hasDiscount && (
              <View className="bg-sale absolute right-4 top-4 rounded-lg px-4 py-2">
                <Text className="text-lg font-bold text-sale-foreground">
                  -{product.discount_percentage}%
                </Text>
              </View>
            )}
            {!product.in_stock && (
              <View className="absolute inset-0 items-center justify-center bg-black/60">
                <Text className="text-xl font-bold text-white">Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Product Images Thumbnails */}
          {product.images && product.images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="max-h-20"
              contentContainerStyle={{ padding: 16, gap: 12 }}>
              <TouchableOpacity onPress={() => setSelectedImage(product.image)}>
                <View
                  className={`overflow-hidden rounded border-2 ${selectedImage === product.image ? 'border-primary' : 'border-border'
                    }`}
                  style={{ width: 60, height: 60 }}>
                  <Image
                    source={{ uri: product.image }}
                    className="h-full w-full"
                    style={{ width: 60, height: 60 }}
                  />
                </View>
              </TouchableOpacity>
              {product.images.map((img) => (
                <TouchableOpacity key={img.id} onPress={() => setSelectedImage(img.image)}>
                  <View
                    className={`overflow-hidden rounded border-2 ${selectedImage === img.image ? 'border-primary' : 'border-border'
                      }`}
                    style={{ width: 60, height: 60 }}>
                    <Image
                      source={{ uri: img.image }}
                      className="h-full w-full"
                      style={{ width: 60, height: 60 }}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Product Info */}
          <View className="p-4">
            <Text className="mb-2 text-2xl font-bold text-foreground">{product.name}</Text>

            {typeof product.category === 'string' && (
              <Text className="mb-4 text-base text-muted-foreground">{product.category}</Text>
            )}

            {/* Price */}
            <View className="mb-4 flex-row items-center">
              <Text className="mr-2 text-3xl font-bold text-primary">AED {product.price}</Text>
              {hasDiscount && product.original_price && (
                <Text className="text-lg text-muted-foreground line-through">
                  AED {product.original_price}
                </Text>
              )}
            </View>

            {/* Badges */}
            <View className="mb-4 flex-row flex-wrap gap-2">
              {product.free_shipping && (
                <View className="flex-row items-center gap-1 rounded-lg bg-green-600 px-2 py-1">
                  <Ionicons name="car-outline" size={16} color="#fff" />
                  <Text className="text-sm font-semibold text-white">Free Shipping</Text>
                </View>
              )}
              {product.fast_delivery && (
                <View className="flex-row items-center gap-1 rounded-lg bg-teal-600 px-2 py-1">
                  <Ionicons name="flash-outline" size={16} color="#fff" />
                  <Text className="text-sm font-semibold text-white">Fast Delivery</Text>
                </View>
              )}
            </View>

            {/* Stock Status */}
            {product.stock_quantity !== undefined && (
              <View className="mb-4 flex-row items-center">
                <Text className="mr-1 text-base text-foreground">Stock:</Text>
                <Text
                  className={`text-base font-semibold ${product.stock_quantity > 0 ? 'text-green-600' : 'text-destructive'
                    }`}>
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} available`
                    : 'Out of stock'}
                </Text>
              </View>
            )}

            {/* Description */}
            {product.description && (
              <View className="mb-6">
                <Text className="mb-2 text-xl font-bold text-foreground">Description</Text>
                <Text className="text-base leading-6 text-foreground">{product.description}</Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="mb-6 flex-row gap-3">
              {/* Add to Cart Button */}
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-4 ${product.in_stock ? 'bg-primary' : 'bg-muted'
                  }`}
                onPress={handleAddToCart}
                activeOpacity={0.7}>
                <Ionicons name="cart-outline" size={24} color="#fff" />
                <Text className="text-lg font-bold text-primary-foreground">
                  {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                </Text>
              </TouchableOpacity>

              {/* Favorite Button */}
              <TouchableOpacity
                className={`items-center justify-center rounded-xl py-4 ${isFavorite ? 'border-2 border-red-500 bg-red-50 dark:bg-red-950/30' : 'border-2 border-border'
                  }`}
                style={{ width: 56 }}
                onPress={handleFavoritePress}
                activeOpacity={0.7}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavorite ? '#EF4444' : mutedIconColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View className="px-4 pb-4 pt-8">
              <Text className="mb-2 text-xl font-bold text-foreground">Related Products</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingTop: 12 }}>
                {relatedProducts.map((relatedProduct) => (
                  <TouchableOpacity
                    key={relatedProduct.id}
                    className="w-[150px] overflow-hidden rounded-xl bg-card shadow-sm"
                    onPress={() => router.push(`/products/${relatedProduct.id}` as any)}>
                    <Image
                      source={{ uri: relatedProduct.image }}
                      className="w-full"
                      style={{ height: 150 }}
                    />
                    <Text
                      className="min-h-10 p-2 text-sm text-foreground"
                      numberOfLines={2}>
                      {relatedProduct.name}
                    </Text>
                    <Text className="px-2 pb-2 text-base font-bold text-primary">
                      AED {relatedProduct.price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
