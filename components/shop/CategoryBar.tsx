/**
 * CategoryBar Component
 * Horizontal scrollable category pills with drill-down navigation
 * Shows "All" + main categories, tapping drills into subcategories
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

export interface CategoryNode {
  id: number;
  name_en: string;
  name_ar: string;
  slug: string;
  level: number;
  product_count: number;
  children: CategoryNode[];
}

interface CategoryBarProps {
  categories: CategoryNode[];
  selectedCategory: string | null;
  categoryPath: CategoryNode[]; // breadcrumb path of drilled-down categories
  onSelectCategory: (slug: string | null, node?: CategoryNode) => void;
  onDrillDown: (node: CategoryNode) => void;
  onDrillUp: () => void;
  loading?: boolean;
}

export function CategoryBar({
  categories,
  selectedCategory,
  categoryPath,
  onSelectCategory,
  onDrillDown,
  onDrillUp,
  loading,
}: CategoryBarProps) {
  const scrollRef = useRef<ScrollView>(null);

  // Reset scroll position when categories change
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: 0, animated: true });
  }, [categoryPath.length]);

  // Determine which items to show
  const currentParent = categoryPath.length > 0 ? categoryPath[categoryPath.length - 1] : null;
  const displayItems = currentParent ? currentParent.children : categories;
  const isDrilledDown = categoryPath.length > 0;

  if (loading) {
    return (
      <View className="border-b border-border bg-card px-4 py-3">
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View className="border-b border-border bg-card">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
        {/* Back button when drilled down */}
        {isDrilledDown && (
          <TouchableOpacity
            onPress={onDrillUp}
            className="flex-row items-center rounded-full border border-border px-3 py-2"
            activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={16} color={COLORS.navy} />
            <Text className="ml-1 text-sm font-medium" style={{ color: COLORS.navy }}>
              {categoryPath.length > 1
                ? categoryPath[categoryPath.length - 2].name_en
                : 'All'}
            </Text>
          </TouchableOpacity>
        )}

        {/* "All" pill (only at root level) */}
        {!isDrilledDown && (
          <CategoryPill
            label="All"
            isSelected={selectedCategory === null}
            onPress={() => onSelectCategory(null)}
          />
        )}

        {/* "All in [Category]" pill when drilled down */}
        {isDrilledDown && currentParent && (
          <CategoryPill
            label={`All ${currentParent.name_en}`}
            isSelected={selectedCategory === currentParent.slug}
            onPress={() => onSelectCategory(currentParent.slug, currentParent)}
          />
        )}

        {/* Category pills */}
        {displayItems.map((cat) => {
          const hasChildren = cat.children && cat.children.length > 0;
          const isSelected = selectedCategory === cat.slug;

          return (
            <CategoryPill
              key={cat.id}
              label={cat.name_en}
              count={cat.product_count > 0 ? cat.product_count : undefined}
              isSelected={isSelected}
              hasChildren={hasChildren}
              onPress={() => {
                if (hasChildren) {
                  onDrillDown(cat);
                } else {
                  onSelectCategory(cat.slug, cat);
                }
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

interface CategoryPillProps {
  label: string;
  count?: number;
  isSelected: boolean;
  hasChildren?: boolean;
  onPress: () => void;
}

function CategoryPill({ label, count, isSelected, hasChildren, onPress }: CategoryPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center rounded-full px-4 py-2"
      style={{
        backgroundColor: isSelected ? COLORS.primary : 'transparent',
        borderWidth: 1,
        borderColor: isSelected ? COLORS.primary : 'rgba(0,0,0,0.12)',
      }}>
      <Text
        className="text-sm font-medium"
        style={{
          color: isSelected ? '#fff' : COLORS.navy,
        }}
        numberOfLines={1}>
        {label}
      </Text>
      {count !== undefined && count > 0 && (
        <Text
          className="ml-1 text-xs"
          style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : COLORS.grayText }}>
          ({count})
        </Text>
      )}
      {hasChildren && (
        <Ionicons
          name="chevron-forward"
          size={14}
          color={isSelected ? '#fff' : COLORS.grayText}
          style={{ marginLeft: 2 }}
        />
      )}
    </TouchableOpacity>
  );
}
