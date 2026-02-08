/**
 * Home Page
 * Main landing page with carousel, best sellers, promo, and featured products
 * All content fetched from the backend API
 */

import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';

// Import page-specific components
import { TopBar } from './_components/TopBar';
import { SearchBar } from './_components/SearchBar';
import { MainCarousel } from './_components/MainCarousel';
import { BestSellersSection } from './_components/BestSellersSection';
import { PromoBanner } from './_components/PromoBanner';
import { FeaturedProductsSection } from './_components/FeaturedProductsSection';

// Import DAL functions
import { apiClient } from '@/dal';
import { getFeaturedProducts, getNewArrivals, getDeals } from '@/dal';

// Toast notifications
import { useToast } from '@/components/ui/Toast';

// UI Product interface for home page components
interface UIProduct {
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

// Carousel item interface
interface CarouselItem {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

// Transform any product shape from API to component format
function transformProductToUI(product: any): UIProduct {
  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price);

  const originalPrice = product.original_price
    ? (typeof product.original_price === 'number' ? product.original_price : parseFloat(product.original_price))
    : null;
  const discountedPrice = product.discounted_price
    ? (typeof product.discounted_price === 'number' ? product.discounted_price : parseFloat(product.discounted_price))
    : null;

  let displayPrice = price;
  let displayOriginalPrice: number | undefined;
  let hasSale = false;

  if (originalPrice && originalPrice > price) {
    displayPrice = price;
    displayOriginalPrice = originalPrice;
    hasSale = true;
  } else if (discountedPrice && discountedPrice < price) {
    displayPrice = discountedPrice;
    displayOriginalPrice = price;
    hasSale = true;
  }

  // Handle image: API may return `image` (string) or `images` (array)
  let imageUrl = '';
  if (typeof product.image === 'string' && product.image) {
    imageUrl = product.image;
  } else if (product.images && Array.isArray(product.images)) {
    const primaryImage = product.images.find((img: any) => img.is_primary);
    imageUrl = primaryImage?.image || product.images[0]?.image || '';
  }

  return {
    id: String(product.id),
    name: product.name,
    price: displayPrice,
    originalPrice: displayOriginalPrice,
    image: imageUrl,
    rating: product.rating ? (typeof product.rating === 'number' ? product.rating : parseFloat(product.rating)) : 0,
    reviewCount: product.review_count || 0,
    isFavorite: false,
    hasSale,
  };
}

export default function HomePage() {
  const router = useRouter();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // API State
  const [heroCards, setHeroCards] = useState<CarouselItem[]>([]);
  const [bestSellers, setBestSellers] = useState<UIProduct[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<UIProduct[]>([]);
  const [deals, setDeals] = useState<UIProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    async function loadHomeData() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [heroCardsRes, featuredData, newArrivalsData, dealsData] = await Promise.all([
          // Hero cards API returns paginated response
          apiClient.get<any>('/hero-cards/').catch((err) => {
            console.log('Hero cards fetch failed:', err);
            return { results: [] };
          }),
          getFeaturedProducts().catch((err) => {
            console.log('Featured products fetch failed:', err);
            return [];
          }),
          getNewArrivals().catch((err) => {
            console.log('New arrivals fetch failed:', err);
            return [];
          }),
          getDeals().catch((err) => {
            console.log('Deals fetch failed:', err);
            return [];
          }),
        ]);

        // Process hero cards (API returns {count, results} with image_url field)
        const heroResults = heroCardsRes?.results || heroCardsRes || [];
        if (Array.isArray(heroResults) && heroResults.length > 0) {
          setHeroCards(
            heroResults.map((card: any) => ({
              id: String(card.id),
              image: card.image_url || card.image || '',
              title: card.title || undefined,
              subtitle: card.subtitle || undefined,
              link: card.link || undefined,
            }))
          );
        }

        // Best Sellers section (from featured products)
        if (featuredData && featuredData.length > 0) {
          setBestSellers(featuredData.map(transformProductToUI));
        }

        // Featured Products section (from new arrivals)
        if (newArrivalsData && newArrivalsData.length > 0) {
          setFeaturedProducts(newArrivalsData.map(transformProductToUI));
        } else if (featuredData && featuredData.length > 0) {
          setFeaturedProducts(featuredData.map(transformProductToUI));
        }

        // Deals for promo banner
        if (dealsData && dealsData.length > 0) {
          setDeals(dealsData.map(transformProductToUI));
        }
      } catch (err) {
        console.error('Error loading home data:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    loadHomeData();
  }, []);

  // Event handlers
  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleShopPress = () => {
    router.push('/(tabs)/shop');
  };

  const handleProductPress = (id: string) => {
    router.push(`/products/${id}`);
  };

  const handleFavoritePress = (id: string) => {
    // TODO: Replace with real auth check
    const isSignedIn = false;
    if (!isSignedIn) {
      toast.warning('Sign in required', 'Please sign in to add items to your wishlist.');
      return;
    }
    toast.success('Added to wishlist');
  };

  const handleAddToCart = (id: string) => {
    // Find the product name for a better toast message
    const product =
      bestSellers.find((p) => p.id === id) || featuredProducts.find((p) => p.id === id);
    toast.success('Added to cart', product ? product.name : 'Item added to your cart.');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({ pathname: '/(tabs)/shop', params: { search: searchQuery.trim() } });
    }
  };

  const handlePromoPress = () => {
    router.push({ pathname: '/(tabs)/shop', params: { filter: 'deals' } });
  };

  const handleViewAllBestSellers = () => {
    router.push({ pathname: '/(tabs)/shop', params: { filter: 'best_selling' } });
  };

  const handleViewAllFeatured = () => {
    router.push({ pathname: '/(tabs)/shop', params: { filter: 'featured' } });
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView className="flex-1 bg-background">
          <TopBar
            onMenuPress={handleMenuPress}
            onShopPress={handleShopPress}
          />
          <View className="px-5 pt-3">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search products..."
            />
          </View>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#193364" />
            <Text className="text-gray-text mt-4">Loading products...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-background">
        {/* Top Bar */}
        <TopBar onMenuPress={handleMenuPress} onShopPress={handleShopPress} />

        {/* Search Bar */}
        <View className="px-5 pt-3">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSearch={handleSearch}
            placeholder="Search products..."
          />
        </View>

        {/* Main Content */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Hero Carousel - from backend */}
          {heroCards.length > 0 && <MainCarousel items={heroCards} />}

          {/* Best Sellers */}
          {bestSellers.length > 0 && (
            <BestSellersSection
              products={bestSellers}
              onViewAll={handleViewAllBestSellers}
              onProductPress={handleProductPress}
              onFavoritePress={handleFavoritePress}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Promo Banner - only show if deals exist */}
          {deals.length > 0 && (
            <PromoBanner
              title={`${deals.length} deals available!`}
              ctaText="Shop Deals"
              image={deals[0].image}
              onCtaPress={handlePromoPress}
            />
          )}

          {/* Featured Products */}
          {featuredProducts.length > 0 && (
            <FeaturedProductsSection
              products={featuredProducts}
              onViewAll={handleViewAllFeatured}
              onProductPress={handleProductPress}
              onFavoritePress={handleFavoritePress}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Show error message if no products at all */}
          {error && bestSellers.length === 0 && featuredProducts.length === 0 && (
            <View className="items-center justify-center px-5 py-10">
              <Text className="text-gray-text text-center">{error}</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
