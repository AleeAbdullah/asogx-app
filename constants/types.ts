/**
 * TypeScript Type Definitions
 * Based on API Documentation v2.0
 */

export interface Product {
  id: number;
  name: string;
  name_ar: string;
  description?: string;
  description_ar?: string;
  image: string;
  price: string;
  original_price: string | null;
  category: string | Category;
  discount: number | null;
  discount_percentage: number | null;
  free_shipping: boolean;
  fast_delivery: boolean;
  in_stock: boolean;
  stock_quantity?: number;
  images?: ProductImage[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  order: number;
}

export interface Category {
  id: number;
  slug: string;
  name_ar: string;
  name_en: string;
  level?: number;
  parent?: number | null;
  product_count: number;
  image: string | null;
  icon?: string | null;
  order?: number;
  is_active?: boolean;
  children?: Category[];
  full_path?: string;
  breadcrumbs?: Breadcrumb[];
  description?: string;
  banner_image?: string;
  meta_title?: string;
  meta_description?: string;
  filters?: Filter[];
  sort_options?: SortOption[];
}

export interface Breadcrumb {
  name: string;
  slug: string;
}

export interface Filter {
  id: number;
  name: string;
  name_ar: string;
  slug: string;
  type: 'multi_select' | 'range' | 'boolean';
  is_collapsible: boolean;
  default_collapsed: boolean;
  show_more_threshold: number | null;
  unit: string | null;
  is_required: boolean;
  order: number;
  is_active: boolean;
  options?: FilterOption[];
  min?: number;
  max?: number;
}

export interface FilterOption {
  value: string;
  slug: string;
  product_count?: number;
}

export interface SortOption {
  value: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'best_selling';
  label: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  detail?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  product_id: number;
  quantity: number;
  subtotal: string;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user: number;
  items: CartItem[];
  total: string;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface Wishlist {
  id: number;
  user: number;
  products: Product[];
  created_at: string;
  updated_at: string;
}

export type ProductSortBy = 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'best_selling';

export interface ProductQueryParams {
  category?: string;
  search?: string;
  sort?: ProductSortBy;
  page?: number;
  page_size?: number;
  [key: string]: string | number | boolean | undefined;
}
