# Lybia Store App

Modern e-commerce mobile app built with Expo, React Native, and NativeWind.

## 📱 Features

- **Product Listing**: Browse products with infinite scroll pagination
- **Product Detail**: View detailed product information with image gallery
- **Filtering & Sorting**: Sort products by price, relevance, newest, and best selling
- **Responsive Design**: Optimized for iOS and Android
- **Blue Theme**: Modern blue color scheme with dark mode support
- **Type-Safe**: Full TypeScript support

## 🏗️ Project Structure

```
lybia-app/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation group
│   │   ├── _layout.tsx    # Tab layout with navbar
│   │   ├── index.tsx      # Products listing page
│   │   └── products/
│   │       └── [id].tsx   # Product detail page
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # UI components
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   ├── products/         # Product-specific components
│   │   ├── ProductCard.tsx
│   │   └── ProductGrid.tsx
│   └── navigation/       # Navigation components
│       └── Navbar.tsx
├── dal/                  # Data Access Layer
│   ├── api.ts           # Base API client
│   ├── products.ts      # Products API
│   ├── categories.ts    # Categories API
│   └── index.ts
├── constants/           # App constants
│   ├── config.ts       # App configuration
│   └── types.ts        # TypeScript types
├── theme/              # Theme configuration
└── .env               # Environment variables
```

## 🎨 Design System

### Colors (Blue Theme)
- **Primary**: `hsl(220, 90%, 56%)` - Blue
- **Secondary**: `hsl(220, 14%, 96%)` - Light gray
- **Success**: `hsl(142, 71%, 45%)` - Green
- **Destructive**: `hsl(0, 84%, 60%)` - Red
- **Accent**: Blue theme variations

### Components
All components are built with:
- **NativeWind** for Tailwind-style styling
- **TypeScript** for type safety
- **Reusable** and **modular** design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📡 API Integration

The app connects to the Lybia Store Backend API:

- **Base URL**: `https://api.asogx.com/api/v1`
- **Local URL**: `http://localhost:8000/api/v1`

API documentation is based on `API_DOCUMENTATION_V2.md`.

### Environment Variables

Create a `.env` file:

```env
API_BASE_URL=https://api.asogx.com/api/v1
API_BASE_URL_LOCAL=http://localhost:8000/api/v1
NODE_ENV=development
```

## 📚 Documentation References

- **Expo Router**: https://docs.expo.dev/router/basics/common-navigation-patterns
- **Stack Navigator**: https://docs.expo.dev/router/advanced/stack
- **Layout Documentation**: https://docs.expo.dev/router/basics/layout

## 🛠️ Best Practices

1. **File Structure**: Organized by feature and functionality
2. **Component Reusability**: Shared components in `/components`
3. **API Abstraction**: Centralized API calls in `/dal`
4. **Type Safety**: Full TypeScript coverage
5. **Constants Management**: Centralized in `/constants`
6. **Theme Configuration**: Single source of truth in `config.ts`

## 📱 Features Implemented

- ✅ Product listing with pagination
- ✅ Product detail page with image gallery
- ✅ Sort functionality (price, relevance, newest, etc.)
- ✅ Related products section
- ✅ Stock status display
- ✅ Discount badges
- ✅ Free shipping & fast delivery indicators
- ✅ Loading states
- ✅ Error handling with retry
- ✅ Pull to refresh
- ✅ Infinite scroll
- ✅ Navigation bar with home button
- ✅ Blue theme with dark mode support

## 🎯 Next Steps

- [ ] Implement search functionality
- [ ] Add cart functionality
- [ ] Add wishlist functionality
- [ ] Add user authentication
- [ ] Add filters sidebar
- [ ] Add category navigation
- [ ] Add product reviews
- [ ] Add order management

## 📄 License

This project is part of the Lybia Store ecosystem.
