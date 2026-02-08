/**
 * DAL (Data Access Layer) Index
 * Centralized export for all API services
 */

// Base API Client
export { apiClient } from './api';

// Routes
export { ROUTES } from './routes';

// Products
export * from './products/use-products';
export type {
  Product,
  ProductImage,
  ProductVariant,
  PaginatedProductsResponse,
  ProductQueryParams,
  SearchSuggestion,
  SearchSuggestionsResponse,
  Filter,
  FilterOption,
  FilterWithOptions,
} from './products/products.types';

// Categories
export * from './categories/use-categories';
export type { Category, CategoryWithBreadcrumbs, Breadcrumb } from './categories/categories.types';

// Hero Cards (Homepage Carousel)
export * from './hero-cards/use-hero-cards';
export type { HeroCard } from './hero-cards/hero-cards.types';

// Homepage Sections
export * from './homepage/use-homepage';
export type { HomepageSection, HomepageSectionProduct } from './homepage/homepage.types';

// Legacy exports (for backwards compatibility)
export { productsApi } from './products';
export { categoriesApi } from './categories';
