# 🚀 Quick Start Guide

## Your New App Structure

Your Lybia Store app now has a complete products listing and detail page implementation with a blue theme!

## 🗂️ File Structure Overview

### Key Files Created

#### **Configuration & Constants**
- `.env` - API URLs and environment config
- `constants/config.ts` - Blue theme colors, app settings
- `constants/types.ts` - TypeScript types from API docs
- `constants/index.ts` - Export all constants

#### **Data Access Layer (DAL)**
- `dal/api.ts` - Base API client
- `dal/products.ts` - Products API methods
- `dal/categories.ts` - Categories API methods  
- `dal/index.ts` - Export all DAL

#### **Reusable Components**
- `components/ui/LoadingSpinner.tsx`
- `components/ui/ErrorMessage.tsx`
- `components/products/ProductCard.tsx`
- `components/products/ProductGrid.tsx`
- `components/navigation/Navbar.tsx`
- `components/index.ts` - Export all components

#### **App Pages**
- `app/(tabs)/_layout.tsx` - Layout with Navbar
- `app/(tabs)/index.tsx` - **Products Listing (Home)**
- `app/(tabs)/products/[id].tsx` - **Product Detail Page**

## 🎯 How to Use

### 1. Start the App

```bash
npm start
# Then press 'i' for iOS or 'a' for Android
```

### 2. Navigate the App

- **Home**: Opens to products listing with grid view
- **Click any product**: Goes to detail page
- **Sort products**: Use buttons at top (Price, Newest, etc.)
- **Pull down**: Refresh products list
- **Scroll down**: Loads more products (pagination)

### 3. Using Components in Your Code

```typescript
// Import from centralized exports
import { ProductCard, LoadingSpinner, ErrorMessage } from '@/components';
import { productsApi } from '@/dal';
import { THEME, Product } from '@/constants';

// Use the blue theme
<View style={{ backgroundColor: THEME.COLORS.primary }}>
  <Text>This is blue!</Text>
</View>
```

### 4. Making API Calls

```typescript
import { productsApi } from '@/dal';

// Get products with filters
const response = await productsApi.getProducts({
  page: 1,
  page_size: 24,
  sort: 'price_asc',
  category: 'electronics/laptops'
});

// Get single product
const product = await productsApi.getProductById(123);

// Get featured products
const featured = await productsApi.getFeaturedProducts();
```

## 🎨 Blue Theme Usage

### In JSX (NativeWind/Tailwind)
```tsx
<View className="bg-primary text-primary-foreground">
  <Text className="text-lg font-bold">Blue themed!</Text>
</View>
```

### In StyleSheet
```typescript
import { THEME } from '@/constants/config';

const styles = StyleSheet.create({
  button: {
    backgroundColor: THEME.COLORS.primary,
    color: THEME.COLORS.primaryForeground,
  }
});
```

## 📱 Current Features

✅ **Products Listing**
- Grid layout (2 columns)
- Sort by: Relevance, Price (↑↓), Newest, Best Selling
- Infinite scroll pagination
- Pull to refresh
- Product cards with images, prices, badges

✅ **Product Detail**
- Full product info
- Image gallery with thumbnails
- Stock status
- Price with discount badges
- Free shipping & fast delivery indicators
- Related products section
- Add to cart button (UI ready)

✅ **Navigation**
- Custom blue navbar
- Home button (active state)
- Search & cart icons (ready for implementation)

## 🔧 Customization

### Change API URL
Edit `.env`:
```env
API_BASE_URL=https://your-api.com/api/v1
```

### Modify Blue Theme
Edit `constants/config.ts` and `global.css`:
```typescript
// constants/config.ts
COLORS: {
  primary: 'hsl(220, 90%, 56%)', // Change this!
}
```

### Add New API Endpoint
Edit `dal/products.ts`:
```typescript
export const productsApi = {
  // ... existing methods
  
  myNewMethod: async () => {
    return apiClient.get('/new-endpoint/');
  },
};
```

## 📝 Notes

- The original `app/index.tsx` (demo file) still exists
- Main app routes are in `app/(tabs)/`
- The `(tabs)` folder name means it's a route group in Expo Router
- TypeScript errors for dynamic routes are suppressed with `as any` (Expo Router limitation)

## 🔜 To Implement Next

- Search functionality (icon is in navbar)
- Cart functionality (icon is in navbar)
- Wishlist
- User authentication
- Categories navigation
- Filters

## 📚 Resources

All documentation links are saved in `.env`:
- Expo Router patterns
- Stack navigation
- Layouts

## 🆘 Troubleshooting

### API not connecting?
1. Check `.env` has correct API_BASE_URL
2. Verify API is running
3. Check network connection

### Styles not working?
1. Ensure NativeWind is installed: `npm install nativewind`
2. Check `tailwind.config.js` exists
3. Verify `global.css` is imported in layout

### Navigation not working?
1. Clear cache: `npx expo start -c`
2. Check file structure matches Expo Router conventions
3. Verify `(tabs)/_layout.tsx` is properly configured

---

**🎉 You're all set! Run `npm start` and enjoy your new blue-themed products app!**
