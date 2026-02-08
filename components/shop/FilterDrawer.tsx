/**
 * FilterDrawer Component
 * Bottom sheet drawer with sort options, category tree, and filters
 * Slides up from bottom with backdrop overlay
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'best_selling';

interface CategoryNode {
  id: number;
  name_en: string;
  slug: string;
  level: number;
  product_count: number;
  children: CategoryNode[];
}

export interface FilterState {
  sort: SortOption;
  category: string | null;
  inStockOnly: boolean;
  freeShippingOnly: boolean;
}

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters: FilterState;
  categories: CategoryNode[];
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Best Selling', value: 'best_selling' },
];

export function FilterDrawer({
  visible,
  onClose,
  onApply,
  currentFilters,
  categories,
}: FilterDrawerProps) {
  const insets = useSafeAreaInsets();
  const [slideAnim] = useState(new Animated.Value(SCREEN_HEIGHT));
  const [backdropAnim] = useState(new Animated.Value(0));

  // Local filter state (changes are not applied until user hits Apply)
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  // Sync local state when modal opens
  useEffect(() => {
    if (visible) {
      setLocalFilters(currentFilters);
      // Animate in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 25,
          stiffness: 200,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({
      sort: 'relevance',
      category: null,
      inStockOnly: false,
      freeShippingOnly: false,
    });
  };

  const toggleCategory = (catId: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const activeFilterCount =
    (localFilters.sort !== 'relevance' ? 1 : 0) +
    (localFilters.category ? 1 : 0) +
    (localFilters.inStockOnly ? 1 : 0) +
    (localFilters.freeShippingOnly ? 1 : 0);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: backdropAnim,
        }}>
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-card"
        style={{
          maxHeight: SCREEN_HEIGHT * 0.85,
          transform: [{ translateY: slideAnim }],
          paddingBottom: insets.bottom + 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 20,
        }}>
        {/* Handle bar */}
        <View className="items-center py-3">
          <View className="h-1 w-10 rounded-full bg-border" />
        </View>

        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-border px-5 pb-4">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-foreground">Filters</Text>
            {activeFilterCount > 0 && (
              <View
                className="ml-2 items-center justify-center rounded-full px-2 py-0.5"
                style={{ backgroundColor: COLORS.primary }}>
                <Text className="text-xs font-bold text-white">{activeFilterCount}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
            <Text className="text-sm font-medium" style={{ color: COLORS.primary }}>
              Reset All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Filter Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
          {/* Sort Section */}
          <FilterSection title="Sort By" icon="swap-vertical-outline">
            <View className="flex-row flex-wrap gap-2">
              {SORT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setLocalFilters((f) => ({ ...f, sort: opt.value }))}
                  className="rounded-lg border px-3 py-2"
                  style={{
                    backgroundColor: localFilters.sort === opt.value ? COLORS.primary : 'transparent',
                    borderColor: localFilters.sort === opt.value ? COLORS.primary : 'rgba(0,0,0,0.12)',
                  }}
                  activeOpacity={0.7}>
                  <Text
                    className="text-sm"
                    style={{
                      color: localFilters.sort === opt.value ? '#fff' : COLORS.navy,
                      fontWeight: localFilters.sort === opt.value ? '600' : '400',
                    }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </FilterSection>

          {/* Category Section */}
          {categories.length > 0 && (
            <FilterSection title="Category" icon="grid-outline">
              {/* All option */}
              <TouchableOpacity
                onPress={() => setLocalFilters((f) => ({ ...f, category: null }))}
                className="mb-1 flex-row items-center rounded-lg px-3 py-2.5"
                style={{
                  backgroundColor: localFilters.category === null ? `${COLORS.primary}15` : 'transparent',
                }}
                activeOpacity={0.7}>
                <View
                  className="mr-3 h-5 w-5 items-center justify-center rounded-full border-2"
                  style={{
                    borderColor: localFilters.category === null ? COLORS.primary : 'rgba(0,0,0,0.2)',
                    backgroundColor: localFilters.category === null ? COLORS.primary : 'transparent',
                  }}>
                  {localFilters.category === null && (
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  )}
                </View>
                <Text
                  className="flex-1 text-sm"
                  style={{
                    color: localFilters.category === null ? COLORS.primary : COLORS.navy,
                    fontWeight: localFilters.category === null ? '600' : '400',
                  }}>
                  All Categories
                </Text>
              </TouchableOpacity>

              {/* Category tree */}
              {categories.map((cat) => (
                <CategoryTreeItem
                  key={cat.id}
                  category={cat}
                  selectedSlug={localFilters.category}
                  expandedIds={expandedCategories}
                  onSelect={(slug) => setLocalFilters((f) => ({ ...f, category: slug }))}
                  onToggle={toggleCategory}
                  depth={0}
                />
              ))}
            </FilterSection>
          )}

          {/* Quick Filters */}
          <FilterSection title="Quick Filters" icon="flash-outline">
            <ToggleFilter
              label="In Stock Only"
              icon="checkmark-circle-outline"
              isActive={localFilters.inStockOnly}
              onToggle={() =>
                setLocalFilters((f) => ({ ...f, inStockOnly: !f.inStockOnly }))
              }
            />
            <ToggleFilter
              label="Free Shipping"
              icon="airplane-outline"
              isActive={localFilters.freeShippingOnly}
              onToggle={() =>
                setLocalFilters((f) => ({ ...f, freeShippingOnly: !f.freeShippingOnly }))
              }
            />
          </FilterSection>
        </ScrollView>

        {/* Apply Button */}
        <View className="border-t border-border px-5 pt-4">
          <TouchableOpacity
            onPress={handleApply}
            className="items-center rounded-xl py-4"
            style={{ backgroundColor: COLORS.primary }}
            activeOpacity={0.8}>
            <Text className="text-base font-bold text-white">
              Apply Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

// --- Sub-components ---

function FilterSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <View className="mb-3 flex-row items-center">
        <Ionicons name={icon as any} size={18} color={COLORS.navy} />
        <Text className="ml-2 text-base font-bold text-foreground">{title}</Text>
      </View>
      {children}
    </View>
  );
}

function ToggleFilter({
  label,
  icon,
  isActive,
  onToggle,
}: {
  label: string;
  icon: string;
  isActive: boolean;
  onToggle: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      className="mb-2 flex-row items-center rounded-lg border px-4 py-3"
      style={{
        borderColor: isActive ? COLORS.primary : 'rgba(0,0,0,0.08)',
        backgroundColor: isActive ? `${COLORS.primary}10` : 'transparent',
      }}
      activeOpacity={0.7}>
      <Ionicons
        name={icon as any}
        size={20}
        color={isActive ? COLORS.primary : COLORS.grayText}
      />
      <Text
        className="ml-3 flex-1 text-sm"
        style={{ color: isActive ? COLORS.primary : COLORS.navy, fontWeight: isActive ? '600' : '400' }}>
        {label}
      </Text>
      <View
        className="h-6 w-6 items-center justify-center rounded-md"
        style={{
          backgroundColor: isActive ? COLORS.primary : 'transparent',
          borderWidth: isActive ? 0 : 2,
          borderColor: 'rgba(0,0,0,0.15)',
        }}>
        {isActive && <Ionicons name="checkmark" size={16} color="#fff" />}
      </View>
    </TouchableOpacity>
  );
}

function CategoryTreeItem({
  category,
  selectedSlug,
  expandedIds,
  onSelect,
  onToggle,
  depth,
}: {
  category: CategoryNode;
  selectedSlug: string | null;
  expandedIds: Set<number>;
  onSelect: (slug: string) => void;
  onToggle: (id: number) => void;
  depth: number;
}) {
  const hasChildren = category.children && category.children.length > 0;
  const isExpanded = expandedIds.has(category.id);
  const isSelected = selectedSlug === category.slug;

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (hasChildren) {
            onToggle(category.id);
          }
          onSelect(category.slug);
        }}
        className="mb-0.5 flex-row items-center rounded-lg px-3 py-2.5"
        style={{
          paddingLeft: 12 + depth * 20,
          backgroundColor: isSelected ? `${COLORS.primary}15` : 'transparent',
        }}
        activeOpacity={0.7}>
        {/* Selection indicator */}
        <View
          className="mr-3 h-5 w-5 items-center justify-center rounded-full border-2"
          style={{
            borderColor: isSelected ? COLORS.primary : 'rgba(0,0,0,0.2)',
            backgroundColor: isSelected ? COLORS.primary : 'transparent',
          }}>
          {isSelected && <Ionicons name="checkmark" size={12} color="#fff" />}
        </View>

        <Text
          className="flex-1 text-sm"
          style={{
            color: isSelected ? COLORS.primary : COLORS.navy,
            fontWeight: isSelected ? '600' : '400',
          }}
          numberOfLines={1}>
          {category.name_en}
        </Text>

        {category.product_count > 0 && (
          <Text className="mr-2 text-xs" style={{ color: COLORS.grayText }}>
            {category.product_count}
          </Text>
        )}

        {hasChildren && (
          <Ionicons
            name={isExpanded ? 'chevron-down' : 'chevron-forward'}
            size={16}
            color={COLORS.grayText}
          />
        )}
      </TouchableOpacity>

      {/* Children */}
      {hasChildren && isExpanded && (
        <View>
          {category.children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              selectedSlug={selectedSlug}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
              depth={depth + 1}
            />
          ))}
        </View>
      )}
    </View>
  );
}
