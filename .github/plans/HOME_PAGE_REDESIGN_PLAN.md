# Home Page Redesign Implementation Plan

## 📋 Overview
Redesign the home page based on Figma design: StepHub - Shoes Store Mobile App
- **Figma Link**: https://www.figma.com/design/q0xEMsC8dRQSuwmcbUtGba/StepHub---Shoes-Store-Mobile-App-Figma-UI-Template?node-id=17-404
- **Current File**: `app/(tabs)/index.tsx`
- **New Structure**: `app/(tabs)/home/index.tsx` with `_components/` subdirectory

## 🎨 Design Analysis

### Color Palette (from Figma)
- **Main Color**: `#193364` (Navy Blue)
- **Text Color**: `#60708E` (Gray)
- **Main Yellow**: `#F5C102` (Accent Yellow)
- **Accent Color**: `#FF4343` (Red)
- **Background**: `#F2F7FC` (Light Blue/Gray)

### Typography (Mulish Font Family)
- **H1**: Bold 32px, line-height 1.2
- **H2**: Bold 22px, line-height 1.2
- **H3**: Bold 20px, line-height 1.2
- **Body**: Regular 14px, line-height 1.5

### Page Structure
1. **Top Bar** (Header with menu + cart)
2. **Main Carousel** (Hero banner with product image)
3. **Best Sellers Section** (Horizontal scroll with large product cards)
4. **Promo Banner** (50% off promotional section)
5. **Featured Products Section** (Horizontal scroll with small product cards)

---

## 📁 Directory Structure

```
app/(tabs)/home/
├── index.tsx                        # Main home page
└── _components/
    ├── TopBar.tsx                   # Header with menu + cart badge
    ├── MainCarousel.tsx             # Hero banner carousel
    ├── BestSellersSection.tsx       # Best sellers horizontal list
    ├── PromoBanner.tsx              # Promotional banner
    ├── FeaturedProductsSection.tsx  # Featured products horizontal list
    ├── ProductCardLarge.tsx         # Large product card (for Best Sellers)
    └── ProductCardSmall.tsx         # Small product card (for Featured)
```

---

## 🎯 Implementation Steps

### Phase 1: Setup & Color System
**Priority**: HIGH | **Estimated Time**: 30 mins

#### 1.1 Add New Colors to `global.css`
```css
/* Add to :root (light mode) */
--navy: 220 54% 30%;        /* #193364 */
--gray-text: 220 20% 52%;   /* #60708E */
--yellow: 45 98% 48%;       /* #F5C102 */
--red-accent: 0 100% 63%;   /* #FF4343 */
--light-bg: 215 67% 97%;    /* #F2F7FC */

/* Add to .dark (dark mode) - adjusted for dark theme */
--navy: 220 54% 35%;
--gray-text: 220 20% 60%;
--yellow: 45 98% 55%;
--red-accent: 0 100% 68%;
--light-bg: 220 15% 15%;
```

#### 1.2 Update `constants/colors.ts`
```typescript
// Add new color values
export const COLORS = {
  // ... existing colors
  navy: 'hsl(220, 54%, 30%)',
  grayText: 'hsl(220, 20%, 52%)',
  yellow: 'hsl(45, 98%, 48%)',
  redAccent: 'hsl(0, 100%, 63%)',
  lightBg: 'hsl(215, 67%, 97%)',
  
  light: {
    // ... existing
    navy: 'hsl(220, 54%, 30%)',
    grayText: 'hsl(220, 20%, 52%)',
  },
  dark: {
    // ... existing
    navy: 'hsl(220, 54%, 35%)',
    grayText: 'hsl(220, 20%, 60%)',
  }
};
```

#### 1.3 Update `tailwind.config.js`
```javascript
theme: {
  extend: {
    colors: {
      navy: 'hsl(var(--navy))',
      'gray-text': 'hsl(var(--gray-text))',
      yellow: 'hsl(var(--yellow))',
      'red-accent': 'hsl(var(--red-accent))',
      'light-bg': 'hsl(var(--light-bg))',
    }
  }
}
```

---

### Phase 2: Create Directory Structure
**Priority**: HIGH | **Estimated Time**: 10 mins

#### 2.1 Create Directories
```bash
mkdir -p app/(tabs)/home/_components
```

#### 2.2 Move Current File
```bash
mv app/(tabs)/index.tsx app/(tabs)/home/index.tsx
```

---

### Phase 3: Build Reusable Components
**Priority**: HIGH | **Estimated Time**: 2-3 hours

#### 3.1 TopBar Component
**File**: `app/(tabs)/home/_components/TopBar.tsx`

**Features**:
- Menu icon (hamburger) on left
- Shopping bag icon with badge on right
- Badge shows cart total ($0)
- Height: 44px + status bar height
- Background: transparent or light

**Props**:
```typescript
interface TopBarProps {
  cartTotal: number;
  onMenuPress: () => void;
  onCartPress: () => void;
}
```

**UI Library Components**:
- Use `Ionicons` for menu (`menu-outline`) and cart (`bag-outline`)
- Custom badge component with red background

**Styling**:
- Tailwind classes: `flex-row`, `items-center`, `justify-between`, `px-5`, `py-3`
- Badge: `bg-red-accent`, `rounded-full`, `absolute`, `-top-1`, `-right-1`

---

#### 3.2 MainCarousel Component
**File**: `app/(tabs)/home/_components/MainCarousel.tsx`

**Features**:
- Full-width hero banner
- Product image (shoes)
- Heading: "Welcome to StepHub! 50% off"
- Dot indicators at bottom (3 dots, first active)
- Height: ~328px
- Background: light blue/gray

**Props**:
```typescript
interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

interface MainCarouselProps {
  items: CarouselItem[];
}
```

**Implementation**:
- Use `ScrollView` with `horizontal` and `pagingEnabled`
- Use `FlatList` for better performance (alternative)
- Dot indicators: custom component with active state
- Image: use `expo-image` for optimization

**UI Library Components**:
- Custom carousel (no direct library component)
- Use `ActivityIndicator` for loading state

**Styling**:
- Container: `bg-light-bg`, `rounded-b-3xl`, `overflow-hidden`
- Title: `text-navy`, `text-4xl`, `font-bold`, `mb-2`
- Dots: `bg-navy` (active), `bg-gray-200` (inactive)

---

#### 3.3 ProductCardLarge Component
**File**: `app/(tabs)/home/_components/ProductCardLarge.tsx`

**Features**:
- Product image (250px height)
- Favorite icon (top right)
- Add to cart icon (top right, below favorite)
- Product name
- Star rating (5 stars + review count)
- Price
- Width: 200px

**Props**:
```typescript
interface ProductCardLargeProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  isFavorite?: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
  onAddToCart: () => void;
}
```

**UI Library Components**:
- `TouchableOpacity` for card wrapper
- `Ionicons`: `heart-outline`/`heart` for favorite, `bag-outline` for cart
- Custom star rating component

**Styling**:
- Card: `bg-light-bg`, `rounded-xl`, `overflow-hidden`, `w-[200px]`
- Image container: `h-[250px]`, `bg-light-bg`, `items-center`, `justify-center`
- Icons: absolute positioned, `top-3`, `right-3`
- Name: `text-gray-text`, `text-sm`
- Price: `text-navy`, `text-base`, `font-semibold`

---

#### 3.4 ProductCardSmall Component
**File**: `app/(tabs)/home/_components/ProductCardSmall.tsx`

**Features**:
- Smaller version (170px height image)
- Same features as large card but compact
- Width: 138px

**Props**:
```typescript
// Same as ProductCardLargeProps
```

**Styling**:
- Card: `w-[138px]`
- Image container: `h-[170px]`
- Font sizes smaller than large card

---

#### 3.5 BestSellersSection Component
**File**: `app/(tabs)/home/_components/BestSellersSection.tsx`

**Features**:
- Section title: "Best sellers"
- "view all" link with chevron
- Horizontal ScrollView with ProductCardLarge items
- Gap between cards: 14px

**Props**:
```typescript
interface BestSellersSectionProps {
  products: Product[];
  onViewAll: () => void;
  onProductPress: (id: string) => void;
  onFavoritePress: (id: string) => void;
  onAddToCart: (id: string) => void;
}
```

**UI Library Components**:
- `ScrollView` with `horizontal`
- `Ionicons` for chevron (`chevron-forward-outline`)
- `ProductCardLarge` component

**Styling**:
- Container: `mb-6`
- Header: `flex-row`, `justify-between`, `items-center`, `mb-4`, `px-5`
- Title: `text-navy`, `text-xl`, `font-bold`
- ScrollView: `px-5`, horizontal gap using `contentContainerStyle`

---

#### 3.6 PromoBanner Component
**File**: `app/(tabs)/home/_components/PromoBanner.tsx`

**Features**:
- Full-width banner (height: 150px)
- Background image (shoes on right side)
- Text: "Take 50% off now!"
- CTA button: "Get Started"
- Background: light blue/gray

**Props**:
```typescript
interface PromoBannerProps {
  title: string;
  ctaText: string;
  image: string;
  onCtaPress: () => void;
}
```

**UI Library Components**:
- `Button` from nativewindui (or custom TouchableOpacity)
- `Image` from expo-image

**Styling**:
- Container: `h-[150px]`, `bg-light-bg`, `px-5`, `flex-row`, `items-center`
- Title: `text-navy`, `text-2xl`, `font-bold`, `flex-1`
- Button: `bg-navy`, `px-6`, `py-3`, `rounded-xl`
- Button text: `text-yellow`, `font-black`, `text-sm`

---

#### 3.7 FeaturedProductsSection Component
**File**: `app/(tabs)/home/_components/FeaturedProductsSection.tsx`

**Features**:
- Section title: "Featured products"
- "view all" link with chevron
- Horizontal ScrollView with ProductCardSmall items
- Gap between cards: 14px

**Props**:
```typescript
// Same as BestSellersSectionProps
```

**Implementation**:
- Same structure as BestSellersSection but uses ProductCardSmall

---

### Phase 4: Main Page Assembly
**Priority**: HIGH | **Estimated Time**: 1 hour

#### 4.1 Update `app/(tabs)/home/index.tsx`

**Structure**:
```typescript
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

// Import page-specific components
import { TopBar } from './_components/TopBar';
import { MainCarousel } from './_components/MainCarousel';
import { BestSellersSection } from './_components/BestSellersSection';
import { PromoBanner } from './_components/PromoBanner';
import { FeaturedProductsSection } from './_components/FeaturedProductsSection';

// Import from DAL
import { productsApi } from '@/dal';

export default function HomePage() {
  // State management
  // Data fetching
  // Event handlers
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false // Hide default header, use TopBar
        }} 
      />
      <SafeAreaView className="flex-1 bg-background">
        <TopBar
          cartTotal={cartTotal}
          onMenuPress={handleMenuPress}
          onCartPress={handleCartPress}
        />
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1">
          {/* Main Carousel */}
          <MainCarousel items={carouselItems} />
          
          {/* Best Sellers */}
          <BestSellersSection
            products={bestSellers}
            onViewAll={() => router.push('/products?filter=best-sellers')}
            onProductPress={handleProductPress}
            onFavoritePress={handleFavoritePress}
            onAddToCart={handleAddToCart}
          />
          
          {/* Promo Banner */}
          <PromoBanner
            title="Take 50% off now!"
            ctaText="Get Started"
            image={promoBannerImage}
            onCtaPress={handlePromoPress}
          />
          
          {/* Featured Products */}
          <FeaturedProductsSection
            products={featuredProducts}
            onViewAll={() => router.push('/products?filter=featured')}
            onProductPress={handleProductPress}
            onFavoritePress={handleFavoritePress}
            onAddToCart={handleAddToCart}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
```

---

### Phase 5: Data Integration
**Priority**: MEDIUM | **Estimated Time**: 1 hour

#### 5.1 Update Product Type
Add fields if needed in `constants/types.ts`:
```typescript
export interface Product {
  // ... existing fields
  isFeatured?: boolean;
  isBestSeller?: boolean;
  reviewCount?: number;
}
```

#### 5.2 Create API Endpoints
Update `dal/products.ts`:
```typescript
// Add new methods
export const productsApi = {
  // ... existing methods
  
  getBestSellers: async (limit: number = 10) => {
    return api.get<ProductsResponse>('/products/', {
      params: { 
        is_best_seller: true,
        page_size: limit 
      }
    });
  },
  
  getFeaturedProducts: async (limit: number = 10) => {
    return api.get<ProductsResponse>('/products/', {
      params: { 
        is_featured: true,
        page_size: limit 
      }
    });
  },
};
```

#### 5.3 Add React Query Hooks
Create `hooks/useProducts.ts`:
```typescript
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/dal';

export const useBestSellers = (limit: number = 10) => {
  return useQuery({
    queryKey: ['products', 'best-sellers', limit],
    queryFn: () => productsApi.getBestSellers(limit),
  });
};

export const useFeaturedProducts = (limit: number = 10) => {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => productsApi.getFeaturedProducts(limit),
  });
};
```

---

### Phase 6: Star Rating Component
**Priority**: MEDIUM | **Estimated Time**: 30 mins

#### 6.1 Create StarRating Component
**File**: `components/ui/StarRating.tsx` (NOT page-specific, reusable)

**Features**:
- Display 5 stars
- Filled/half-filled/empty states
- Review count display
- Size variants (small, medium, large)

**Props**:
```typescript
interface StarRatingProps {
  rating: number; // 0-5
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
}
```

**Implementation**:
```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';

export function StarRating({ 
  rating, 
  reviewCount, 
  size = 'sm',
  showCount = true 
}: StarRatingProps) {
  const sizeMap = {
    sm: 12,
    md: 16,
    lg: 20,
  };
  
  const iconSize = sizeMap[size];
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = rating >= i + 1;
    return filled ? 'star' : 'star-outline';
  });
  
  return (
    <View className="flex-row items-center gap-1">
      {stars.map((icon, index) => (
        <Ionicons
          key={index}
          name={icon as any}
          size={iconSize}
          color={COLORS.yellow}
        />
      ))}
      {showCount && reviewCount !== undefined && (
        <Text className="text-gray-text text-xs ml-1">
          ({reviewCount})
        </Text>
      )}
    </View>
  );
}
```

---

### Phase 7: Navigation Updates
**Priority**: LOW | **Estimated Time**: 20 mins

#### 7.1 Update Tab Navigator
Update `app/(tabs)/_layout.tsx`:
```typescript
// Change home route from 'index' to 'home/index'
<Tabs.Screen
  name="home/index"
  options={{
    title: 'Home',
    tabBarIcon: ({ color, focused }) => (
      <Ionicons 
        name={focused ? 'home' : 'home-outline'} 
        size={24} 
        color={color} 
      />
    ),
  }}
/>
```

#### 7.2 Handle Deep Links
Ensure `app/(tabs)/home/index.tsx` is accessible at `/home` route.

---

### Phase 8: Image Assets
**Priority**: HIGH | **Estimated Time**: 30 mins

#### 8.1 Asset Strategy
- Use Figma-provided image URLs (7-day expiry)
- Download and add to `assets/images/` for production
- Create placeholder images for development

#### 8.2 Image Categories
```
assets/images/home/
├── carousel/
│   ├── hero-1.png
│   ├── hero-2.png
│   └── hero-3.png
├── promo/
│   └── promo-banner.png
└── placeholders/
    └── product-placeholder.png
```

---

## 🧪 Testing Checklist

### Functional Testing
- [ ] Top bar displays correctly with cart badge
- [ ] Carousel swipes smoothly with dot indicators
- [ ] Best sellers scroll horizontally
- [ ] Promo banner CTA navigates correctly
- [ ] Featured products scroll horizontally
- [ ] Product cards navigate to detail page
- [ ] Favorite toggle works
- [ ] Add to cart works
- [ ] "View all" links navigate correctly

### Visual Testing
- [ ] Matches Figma design proportions
- [ ] Colors match design spec
- [ ] Typography sizes correct
- [ ] Spacing/padding matches design
- [ ] Dark mode adapts properly
- [ ] Safe area insets work on iPhone X+

### Performance Testing
- [ ] Smooth scrolling (60fps)
- [ ] Images load progressively
- [ ] No memory leaks
- [ ] Fast initial render

### Responsiveness Testing
- [ ] iPhone SE (small screen)
- [ ] iPhone 14 Pro (standard)
- [ ] iPhone 14 Pro Max (large)
- [ ] Android devices

---

## 📦 Dependencies Check

### Already Available
- ✅ `react-native`
- ✅ `expo-router`
- ✅ `@tanstack/react-query`
- ✅ `@expo/vector-icons`
- ✅ `react-native-safe-area-context`
- ✅ NativeWindUI components

### May Need to Add
- ❓ `expo-image` (for optimized images) - CHECK IF INSTALLED
- ❓ Carousel library (optional, can use ScrollView)

---

## 🚀 Deployment Order

1. **Phase 1** - Setup & Color System (MUST DO FIRST)
2. **Phase 2** - Create Directory Structure
3. **Phase 6** - Star Rating Component (needed by cards)
4. **Phase 3.4** - ProductCardSmall Component
5. **Phase 3.3** - ProductCardLarge Component
6. **Phase 3.1** - TopBar Component
7. **Phase 3.2** - MainCarousel Component
8. **Phase 3.5** - BestSellersSection Component
9. **Phase 3.6** - PromoBanner Component
10. **Phase 3.7** - FeaturedProductsSection Component
11. **Phase 5** - Data Integration
12. **Phase 4** - Main Page Assembly
13. **Phase 7** - Navigation Updates
14. **Phase 8** - Image Assets

---

## ⚠️ Important Notes

### Styling Rules
- **ALWAYS use Tailwind classes in `className`** for styling
- **ONLY use `COLORS` from `constants/colors.ts`** for icon colors and native component props
- **NEVER calculate colors based on theme** in components
- **NO StyleSheet.create** anywhere
- Use inline `style` ONLY for:
  - Dynamic dimensions (width, height with variables)
  - Border radius from THEME.BORDER_RADIUS
  - Spacing from THEME.SPACING
  - Native component props that don't support className

### Component Organization
- Page-specific components → `app/(tabs)/home/_components/`
- Reusable components → `components/ui/` or `components/products/`
- StarRating is reusable → `components/ui/StarRating.tsx`

### Dark Mode Strategy
- CSS variables in `global.css` handle theme switching
- No manual theme checks in components
- Use `dark:` prefix in Tailwind classes where needed
- Example: `className="bg-background dark:bg-card"`

### Performance Considerations
- Use `React.memo()` for product cards
- Implement `FlatList` for long lists (if needed)
- Lazy load images with `expo-image`
- Use `useCallback` for event handlers passed to lists

---

## 📊 Estimated Total Time
- **Phase 1**: 30 mins
- **Phase 2**: 10 mins
- **Phase 3**: 2-3 hours
- **Phase 4**: 1 hour
- **Phase 5**: 1 hour
- **Phase 6**: 30 mins
- **Phase 7**: 20 mins
- **Phase 8**: 30 mins

**Total: 6-7 hours** (one full workday)

---

## 🎯 Success Criteria
1. ✅ Home page visually matches Figma design
2. ✅ All components follow project styling rules (Tailwind + minimal colors.ts)
3. ✅ Dark mode works seamlessly
4. ✅ No StyleSheet.create usage
5. ✅ Page-specific components in `_components/` directory
6. ✅ Reusable components in proper shared locations
7. ✅ All navigation working correctly
8. ✅ Data fetching integrated with React Query
9. ✅ Smooth performance (60fps scrolling)
10. ✅ Zero TypeScript errors

---

## 📝 Next Steps After Implementation
1. User testing for UX feedback
2. Add skeleton loaders for data fetching states
3. Implement pull-to-refresh
4. Add analytics tracking
5. Optimize images for production
6. A/B test promo banner CTAs
7. Consider adding more carousel slides
