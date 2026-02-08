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
import { THEME } from '@/constants/config';
import { useToast } from '@/components/ui/Toast';

const { width } = Dimensions.get('window');

export default function ProductDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
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
        <SafeAreaView className="flex-1" style={{ backgroundColor: THEME.COLORS.background }}>
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
        <SafeAreaView className="flex-1" style={{ backgroundColor: THEME.COLORS.background }}>
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
      <SafeAreaView className="flex-1" style={{ backgroundColor: THEME.COLORS.background }}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Image Gallery */}
          <View className="relative" style={{ width: '100%', height: width }}>
            <Image source={{ uri: selectedImage }} className="h-full w-full" resizeMode="cover" />
            {hasDiscount && (
              <View
                className="absolute px-4 py-2"
                style={{
                  top: THEME.SPACING.md,
                  right: THEME.SPACING.md,
                  backgroundColor: THEME.COLORS.sale,
                  borderRadius: THEME.BORDER_RADIUS.md,
                }}>
                <Text
                  className="font-bold"
                  style={{
                    color: THEME.COLORS.saleForeground,
                    fontSize: THEME.FONT_SIZES.lg,
                  }}>
                  -{product.discount_percentage}%
                </Text>
              </View>
            )}
            {!product.in_stock && (
              <View
                className="absolute inset-0 items-center justify-center"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                <Text className="font-bold text-white" style={{ fontSize: THEME.FONT_SIZES.xl }}>
                  Out of Stock
                </Text>
              </View>
            )}
          </View>

          {/* Product Images Thumbnails */}
          {product.images && product.images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ maxHeight: 80 }}
              contentContainerStyle={{ padding: THEME.SPACING.md, gap: THEME.SPACING.sm }}>
              <TouchableOpacity onPress={() => setSelectedImage(product.image)}>
                <Image
                  source={{ uri: product.image }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: THEME.BORDER_RADIUS.sm,
                    borderWidth: 2,
                    borderColor:
                      selectedImage === product.image ? THEME.COLORS.primary : THEME.COLORS.border,
                  }}
                />
              </TouchableOpacity>
              {product.images.map((img) => (
                <TouchableOpacity key={img.id} onPress={() => setSelectedImage(img.image)}>
                  <Image
                    source={{ uri: img.image }}
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: THEME.BORDER_RADIUS.sm,
                      borderWidth: 2,
                      borderColor:
                        selectedImage === img.image ? THEME.COLORS.primary : THEME.COLORS.border,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Product Info */}
          <View style={{ padding: THEME.SPACING.md }}>
            <Text
              className="mb-2 font-bold"
              style={{
                fontSize: THEME.FONT_SIZES['2xl'],
                color: THEME.COLORS.foreground,
              }}>
              {product.name}
            </Text>

            {typeof product.category === 'string' && (
              <Text
                className="mb-4"
                style={{
                  fontSize: THEME.FONT_SIZES.md,
                  color: THEME.COLORS.mutedForeground,
                }}>
                {product.category}
              </Text>
            )}

            {/* Price */}
            <View className="mb-4 flex-row items-center">
              <Text
                className="mr-2 font-bold"
                style={{
                  fontSize: THEME.FONT_SIZES['3xl'],
                  color: THEME.COLORS.primary,
                }}>
                AED {product.price}
              </Text>
              {hasDiscount && product.original_price && (
                <Text
                  className="line-through"
                  style={{
                    fontSize: THEME.FONT_SIZES.lg,
                    color: THEME.COLORS.mutedForeground,
                  }}>
                  AED {product.original_price}
                </Text>
              )}
            </View>

            {/* Badges */}
            <View className="mb-4 flex-row flex-wrap gap-2">
              {product.free_shipping && (
                <View
                  className="flex-row items-center gap-1 px-2 py-1"
                  style={{
                    backgroundColor: THEME.COLORS.success,
                    borderRadius: THEME.BORDER_RADIUS.md,
                  }}>
                  <Ionicons name="car-outline" size={16} color="#fff" />
                  <Text
                    className="font-semibold text-white"
                    style={{ fontSize: THEME.FONT_SIZES.sm }}>
                    Free Shipping
                  </Text>
                </View>
              )}
              {product.fast_delivery && (
                <View
                  className="flex-row items-center gap-1 px-2 py-1"
                  style={{
                    backgroundColor: THEME.COLORS.teal,
                    borderRadius: THEME.BORDER_RADIUS.md,
                  }}>
                  <Ionicons name="flash-outline" size={16} color="#fff" />
                  <Text
                    className="font-semibold text-white"
                    style={{ fontSize: THEME.FONT_SIZES.sm }}>
                    Fast Delivery
                  </Text>
                </View>
              )}
            </View>

            {/* Stock Status */}
            {product.stock_quantity !== undefined && (
              <View className="mb-4 flex-row items-center">
                <Text
                  className="mr-1"
                  style={{
                    fontSize: THEME.FONT_SIZES.md,
                    color: THEME.COLORS.foreground,
                  }}>
                  Stock:
                </Text>
                <Text
                  className="font-semibold"
                  style={{
                    fontSize: THEME.FONT_SIZES.md,
                    color:
                      product.stock_quantity > 0 ? THEME.COLORS.success : THEME.COLORS.destructive,
                  }}>
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} available`
                    : 'Out of stock'}
                </Text>
              </View>
            )}

            {/* Description */}
            {product.description && (
              <View className="mb-6">
                <Text
                  className="mb-2 font-bold"
                  style={{
                    fontSize: THEME.FONT_SIZES.xl,
                    color: THEME.COLORS.foreground,
                  }}>
                  Description
                </Text>
                <Text
                  style={{
                    fontSize: THEME.FONT_SIZES.md,
                    color: THEME.COLORS.foreground,
                    lineHeight: 24,
                  }}>
                  {product.description}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View className="mb-6 flex-row gap-3">
              {/* Add to Cart Button */}
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 py-4"
                style={{
                  backgroundColor: product.in_stock ? THEME.COLORS.primary : THEME.COLORS.muted,
                  borderRadius: THEME.BORDER_RADIUS.lg,
                }}
                onPress={handleAddToCart}
                activeOpacity={0.7}>
                <Ionicons name="cart-outline" size={24} color="#fff" />
                <Text className="font-bold text-white" style={{ fontSize: THEME.FONT_SIZES.lg }}>
                  {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                </Text>
              </TouchableOpacity>

              {/* Favorite Button */}
              <TouchableOpacity
                className="items-center justify-center py-4"
                style={{
                  width: 56,
                  borderRadius: THEME.BORDER_RADIUS.lg,
                  borderWidth: 1.5,
                  borderColor: isFavorite ? '#EF4444' : THEME.COLORS.border,
                  backgroundColor: isFavorite ? '#FEF2F2' : 'transparent',
                }}
                onPress={handleFavoritePress}
                activeOpacity={0.7}>
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavorite ? '#EF4444' : THEME.COLORS.mutedForeground}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={{ padding: THEME.SPACING.md, paddingTop: THEME.SPACING.xl }}>
              <Text
                className="mb-2 font-bold"
                style={{
                  fontSize: THEME.FONT_SIZES.xl,
                  color: THEME.COLORS.foreground,
                }}>
                Related Products
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: THEME.SPACING.md, paddingTop: THEME.SPACING.sm }}>
                {relatedProducts.map((relatedProduct) => (
                  <TouchableOpacity
                    key={relatedProduct.id}
                    className="overflow-hidden"
                    style={{
                      width: 150,
                      backgroundColor: THEME.COLORS.card,
                      borderRadius: THEME.BORDER_RADIUS.lg,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                    onPress={() => router.push(`/products/${relatedProduct.id}` as any)}>
                    <Image
                      source={{ uri: relatedProduct.image }}
                      className="w-full"
                      style={{ height: 150 }}
                    />
                    <Text
                      className="p-2"
                      style={{
                        fontSize: THEME.FONT_SIZES.sm,
                        color: THEME.COLORS.foreground,
                        minHeight: 40,
                      }}
                      numberOfLines={2}>
                      {relatedProduct.name}
                    </Text>
                    <Text
                      className="px-2 pb-2 font-bold"
                      style={{
                        fontSize: THEME.FONT_SIZES.md,
                        color: THEME.COLORS.primary,
                      }}>
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
