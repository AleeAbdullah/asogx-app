/**
 * Shop / Products Listing Screen
 * Full product browsing with category bar, filter drawer, and product grid
 * Replaces the Cart tab - provides the main shopping experience
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {
  getProducts,
  getFeaturedProducts,
  getDeals,
  getCategories,
  type Product,
  type PaginatedProductsResponse,
  type ProductQueryParams,
  type Category,
} from '@/dal';
import { COLORS } from '@/constants/colors';
import { CategoryBar, type CategoryNode } from '@/components/shop/CategoryBar';
import { FilterDrawer, type FilterState, type SortOption } from '@/components/shop/FilterDrawer';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/cn';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

// Use Product type from DAL, but create a simpler interface for list view
interface ListProduct {
  id: number;
  name: string;
  name_ar: string | null;
  price: string; // Price comes as string from API
  discounted_price: string | null;
  discount_percentage: number | null;
  primary_category: {
    name: string;
    slug: string;
    full_path?: string;
  } | null;
  stock_quantity: number;
  is_active: boolean;
  images: { image: string; is_primary: boolean }[];
  image?: string;
  original_price?: number;
  in_stock: boolean;
}

// Helper function to transform Product to ListProduct
function transformToListProduct(product: Product): ListProduct {
  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image || product.images?.[0]?.image || '';
  const numPrice = parseFloat(product.price);
  const numDiscountedPrice = product.discounted_price ? parseFloat(product.discounted_price) : null;

  return {
    ...product,
    image: primaryImage,
    price: product.price,
    original_price: numDiscountedPrice ? numPrice : undefined,
    discount_percentage: product.discount_percentage,
    in_stock: product.is_active && product.stock_quantity > 0,
  };
}

// Helper function to transform Category to CategoryNode
function transformToCategoryNode(category: Category): CategoryNode {
  return {
    id: category.id,
    name_en: category.name_en,
    name_ar: category.name_ar || '',
    slug: category.slug,
    level: category.level,
    product_count: category.product_count || 0,
    children: category.children ? category.children.map(transformToCategoryNode) : [],
  };
}

// Build the full category path for API filtering
function buildCategoryPath(
  slug: string,
  categories: CategoryNode[],
  path: string[] = []
): string | null {
  for (const cat of categories) {
    if (cat.slug === slug) {
      return [...path, slug].join('/');
    }
    if (cat.children && cat.children.length > 0) {
      const found = buildCategoryPath(slug, cat.children, [...path, cat.slug]);
      if (found) return found;
    }
  }
  return null;
}

// Find the category node path (breadcrumb trail) for a given slug
function findCategoryPath(slug: string, categories: CategoryNode[]): CategoryNode[] {
  for (const cat of categories) {
    if (cat.slug === slug) {
      return [cat];
    }
    if (cat.children && cat.children.length > 0) {
      const childPath = findCategoryPath(slug, cat.children);
      if (childPath.length > 0) {
        return [cat, ...childPath];
      }
    }
  }
  return [];
}

export default function ShopScreen() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{ filter?: string; search?: string; category?: string }>();

  // Categories state
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoryPath, setCategoryPath] = useState<CategoryNode[]>([]);

  // Products state
  const [products, setProducts] = useState<ListProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    sort: (params.filter === 'best_selling' ? 'best_selling' : 'relevance') as SortOption,
    category: params.category || null,
    inStockOnly: false,
    freeShippingOnly: false,
  });
  const [searchQuery] = useState(params.search || '');
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  // Active filter count for badge
  const activeFilterCount =
    (filters.sort !== 'relevance' ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.freeShippingOnly ? 1 : 0);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const results = await getCategories();
        const transformedCategories = results.map(transformToCategoryNode);
        setCategories(transformedCategories);

        // If category param exists from navigation, set up the category path
        if (params.category && transformedCategories.length > 0) {
          const path = findCategoryPath(params.category, transformedCategories);
          setCategoryPath(path);
        }
      } catch (err) {
        console.log('Categories fetch failed:', err);
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, [params.category]);

  // Fetch products when filters change
  const fetchProducts = useCallback(
    async (pageNum: number, refresh: boolean = false) => {
      try {
        if (refresh || pageNum === 1) {
          setLoading(true);
          setError(null);
        } else {
          setLoadingMore(true);
        }

        // Handle special filter types from home page navigation
        if (params.filter === 'featured' && pageNum === 1 && !filters.category) {
          const result = await getFeaturedProducts();
          const transformedProducts = result.map(transformToListProduct);
          setProducts(transformedProducts);
          setTotalCount(transformedProducts.length);
          setHasMore(false);
          setLoading(false);
          return;
        }

        if (params.filter === 'deals' && pageNum === 1 && !filters.category) {
          const result = await getDeals();
          const transformedProducts = result.map(transformToListProduct);
          setProducts(transformedProducts);
          setTotalCount(transformedProducts.length);
          setHasMore(false);
          setLoading(false);
          return;
        }

        // Build API params
        const apiParams: ProductQueryParams = {
          page: pageNum,
          page_size: 20,
          sort: filters.sort as any, // Cast to match expected sort types
        };

        if (filters.category) {
          // Try building the full category path for the API
          const fullPath = buildCategoryPath(filters.category, categories);
          apiParams.category = fullPath || filters.category;
        }

        if (searchQuery) {
          apiParams.search = searchQuery;
        }

        if (filters.inStockOnly) {
          apiParams.in_stock = 'true' as any;
        }

        const response = await getProducts(apiParams);

        let transformedResults = response.results.map(transformToListProduct);

        if (refresh || pageNum === 1) {
          setProducts(transformedResults);
        } else {
          setProducts((prev) => [...prev, ...transformedResults]);
        }

        setTotalCount(response.count);
        setHasMore(response.next !== null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load products';
        setError(message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters, searchQuery, categories, params.filter]
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

  // Category bar handlers
  const handleSelectCategory = (slug: string | null) => {
    setFilters((f) => ({ ...f, category: slug }));
    setPage(1);
  };

  const handleDrillDown = (node: CategoryNode) => {
    setCategoryPath((prev) => [...prev, node]);
    // Auto-select the parent category when drilling down
    setFilters((f) => ({ ...f, category: node.slug }));
    setPage(1);
  };

  const handleDrillUp = () => {
    setCategoryPath((prev) => {
      const next = prev.slice(0, -1);
      // Select the parent category or clear
      if (next.length > 0) {
        setFilters((f) => ({ ...f, category: next[next.length - 1].slug }));
      } else {
        setFilters((f) => ({ ...f, category: null }));
      }
      return next;
    });
    setPage(1);
  };

  // Filter drawer handler
  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);

    // Sync category path with the selected category from drawer
    if (newFilters.category && newFilters.category !== filters.category) {
      // Find the category node and build the path to it
      const path = findCategoryPath(newFilters.category, categories);
      setCategoryPath(path);
    } else if (!newFilters.category) {
      // Clear category path if no category selected
      setCategoryPath([]);
    }

    setPage(1);
  };

  // Page title
  const getTitle = () => {
    if (searchQuery) return `"${searchQuery}"`;
    if (params.filter === 'featured') return 'Featured';
    if (params.filter === 'deals') return 'Deals';
    if (params.filter === 'best_selling') return 'Best Sellers';
    return 'Shop';
  };

  // Action handlers
  const handleAddToCart = (item: ListProduct) => {
    if (!item.in_stock) {
      toast.error('Out of stock', 'This item is currently unavailable.');
      return;
    }
    toast.success('Added to cart', item.name);
  };

  const handleFavoritePress = (item: ListProduct) => {
    // TODO: Replace with real auth check
    const isSignedIn = false;
    if (!isSignedIn) {
      toast.warning('Sign in required', 'Please sign in to add items to your wishlist.');
      return;
    }
    toast.success('Added to wishlist');
  };

  // Render product card
  const renderProduct = ({ item }: { item: ListProduct }) => {
    const priceNum = parseFloat(item.price);
    const originalPrice = item.original_price;
    const hasDiscount = originalPrice && originalPrice > priceNum;
    const discountPercent = hasDiscount
      ? Math.round(((originalPrice! - priceNum) / originalPrice!) * 100)
      : 0;

    return (
      <Link href={`/products/${item.id}` as any} asChild>
        <TouchableOpacity
          className="mb-4 overflow-hidden bg-card"
          style={{
            width: CARD_WIDTH,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
          activeOpacity={0.7}>
          {/* Image */}
          <View className="relative" style={{ width: '100%', height: CARD_WIDTH }}>
            {item.image ? (
              <Image source={{ uri: item.image }} className="h-full w-full" resizeMode="cover" />
            ) : (
              <View className="h-full w-full items-center justify-center bg-muted">
                <Ionicons name="image-outline" size={40} color={COLORS.grey} />
              </View>
            )}

            {/* Discount badge */}
            {hasDiscount && discountPercent > 0 && (
              <View
                className="absolute items-center justify-center rounded-md px-2 py-1"
                style={{ top: 8, left: 8, backgroundColor: '#EF4444' }}>
                <Text className="text-xs font-bold text-white">-{discountPercent}%</Text>
              </View>
            )}

            {/* Action buttons */}
            <View className="absolute" style={{ top: 8, right: 8, gap: 6 }}>
              <TouchableOpacity
                onPress={() => handleFavoritePress(item)}
                className="items-center justify-center rounded-full bg-white/85"
                style={{ width: 32, height: 32 }}
                activeOpacity={0.7}>
                <Ionicons name="heart-outline" size={16} color={COLORS.grey} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleAddToCart(item)}
                className="items-center justify-center rounded-full bg-white/85"
                style={{ width: 32, height: 32 }}
                activeOpacity={0.7}>
                <Ionicons name="bag-outline" size={16} color={COLORS.navy} />
              </TouchableOpacity>
            </View>

            {/* Out of stock overlay */}
            {!item.in_stock && (
              <View
                className="absolute inset-0 items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
                <Text className="text-sm font-bold text-white">Out of Stock</Text>
              </View>
            )}
          </View>

          {/* Info */}
          <View className="p-3">
            <Text
              className="mb-1.5 text-sm text-foreground"
              numberOfLines={2}
              style={{ minHeight: 36, lineHeight: 18 }}>
              {item.name}
            </Text>

            <View className="flex-row flex-wrap items-baseline">
              <Text className="text-base font-bold text-primary">AED {priceNum.toFixed(0)}</Text>
              {hasDiscount && originalPrice && (
                <Text className="ml-1.5 text-xs text-muted-foreground line-through">
                  AED {originalPrice.toFixed(0)}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  const ListHeader = ({ className }: { className?: string }) => (
    <View className={cn('mb-3', className)}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-foreground">{getTitle()}</Text>
          {totalCount > 0 && (
            <Text className="mt-0.5 text-sm text-muted-foreground">
              {totalCount} product{totalCount !== 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {/* Filter button */}
        <TouchableOpacity
          onPress={() => setFilterDrawerVisible(true)}
          className="flex-row items-center rounded-xl border border-border px-4 py-2.5"
          activeOpacity={0.7}>
          <Ionicons name="options-outline" size={18} color={COLORS.navy} />
          <Text className="ml-1.5 text-sm font-medium" style={{ color: COLORS.navy }}>
            Filters
          </Text>
          {activeFilterCount > 0 && (
            <View
              className="ml-1.5 h-5 w-5 items-center justify-center rounded-full"
              style={{ backgroundColor: COLORS.primary }}>
              <Text className="text-xs font-bold text-white">{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <View className="mt-3 flex-row flex-wrap gap-2">
          {filters.sort !== 'relevance' && (
            <FilterChip
              label={`Sort: ${filters.sort.replace('_', ' ')}`}
              onRemove={() => setFilters((f) => ({ ...f, sort: 'relevance' }))}
            />
          )}
          {filters.inStockOnly && (
            <FilterChip
              label="In Stock"
              onRemove={() => setFilters((f) => ({ ...f, inStockOnly: false }))}
            />
          )}
          {filters.freeShippingOnly && (
            <FilterChip
              label="Free Shipping"
              onRemove={() => setFilters((f) => ({ ...f, freeShippingOnly: false }))}
            />
          )}
        </View>
      )}
    </View>
  );

  // Loading state
  if (loading && products.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="auto" animated />
        <CategoryBar
          categories={categories}
          selectedCategory={filters.category}
          categoryPath={categoryPath}
          onSelectCategory={handleSelectCategory}
          onDrillDown={handleDrillDown}
          onDrillUp={handleDrillUp}
          loading={categoriesLoading}
        />
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
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="auto" animated />
        <ListHeader className="px-6" />

        <CategoryBar
          categories={categories}
          selectedCategory={filters.category}
          categoryPath={categoryPath}
          onSelectCategory={handleSelectCategory}
          onDrillDown={handleDrillDown}
          onDrillUp={handleDrillUp}
        />
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.grey} />
          <Text className="mt-4 text-center text-lg text-foreground">{error}</Text>
          <TouchableOpacity
            className="mt-4 rounded-xl px-6 py-3"
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
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="auto" animated />
        <ListHeader className="px-6" />

        <CategoryBar
          categories={categories}
          selectedCategory={filters.category}
          categoryPath={categoryPath}
          onSelectCategory={handleSelectCategory}
          onDrillDown={handleDrillDown}
          onDrillUp={handleDrillUp}
        />
        <View className="flex-1 items-center justify-center px-5">
          <Ionicons name="bag-outline" size={56} color={COLORS.grey} />
          <Text className="mt-4 text-center text-lg font-semibold text-foreground">
            No products found
          </Text>
          <Text className="mt-2 text-center text-sm text-muted-foreground">
            {searchQuery
              ? `No results for "${searchQuery}". Try different keywords.`
              : 'Try adjusting your filters or browse a different category.'}
          </Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity
              className="mt-4 rounded-xl px-6 py-3"
              style={{ backgroundColor: COLORS.primary }}
              onPress={() => {
                setFilters({
                  sort: 'relevance',
                  category: null,
                  inStockOnly: false,
                  freeShippingOnly: false,
                });
                setCategoryPath([]);
              }}>
              <Text className="font-semibold text-white">Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
        <FilterDrawer
          visible={filterDrawerVisible}
          onClose={() => setFilterDrawerVisible(false)}
          onApply={handleApplyFilters}
          currentFilters={filters}
          categories={categories}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar style="auto" animated />

      <ListHeader className="px-6" />

      {/* Category Bar */}
      <CategoryBar
        categories={categories}
        selectedCategory={filters.category}
        categoryPath={categoryPath}
        onSelectCategory={handleSelectCategory}
        onDrillDown={handleDrillDown}
        onDrillUp={handleDrillUp}
        loading={categoriesLoading}
      />

      {/* Product Grid */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={null}
        ListFooterComponent={
          loadingMore ? (
            <View className="items-center py-6">
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : undefined
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

      {/* Filter Drawer */}
      <FilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
        categories={categories}
      />
    </SafeAreaView>
  );
}

// --- Helper Components ---

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <View
      className="flex-row items-center rounded-full px-3 py-1.5"
      style={{ backgroundColor: `${COLORS.primary}15` }}>
      <Text className="text-xs font-medium" style={{ color: COLORS.white }}>
        {label}
      </Text>
      <TouchableOpacity onPress={onRemove} className="ml-1.5" hitSlop={8}>
        <Ionicons name="close-circle" size={16} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}
