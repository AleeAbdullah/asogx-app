/**
 * Products API Types
 * Type definitions matching backend API responses
 */

// Product Image Type
export interface ProductImage {
  id: number;
  image: string;
  alt_text: string | null;
  is_primary: boolean;
  order: number;
}

// Product Variant Type
export interface ProductVariant {
  id: number;
  sku: string;
  name: string;
  name_ar: string | null;
  price: string;
  discounted_price: string | null;
  stock_quantity: number;
  attributes: Record<string, any>;
  is_active: boolean;
}

// Category Type
export interface Category {
  id: number;
  name: string;
  name_ar: string | null;
  slug: string;
  description: string | null;
  description_ar: string | null;
  parent: number | null;
  level: number;
  is_active: boolean;
  created_at: string;
}

// Product Type (matches API response)
export interface Product {
  id: number;
  name: string;
  name_ar: string | null;
  slug: string;
  description: string;
  description_ar: string | null;
  sku: string;
  price: string;
  discounted_price: string | null;
  discount_percentage: number | null;
  currency: string;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_featured: boolean;
  weight: string | null;
  dimensions: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sales_count: number;
  view_count: number;
  rating: string;
  review_count: number;
  primary_category: Category;
  additional_categories: Category[];
  images: ProductImage[];
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

// Paginated Response Type
export interface PaginatedProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

// Product Query Params
export interface ProductQueryParams {
  category?: string;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'best_selling' | 'relevance';
  page?: number;
  page_size?: number;
  [key: string]: any; // For dynamic filters
}

// Search Suggestion Type
export interface SearchSuggestion {
  id: number;
  name: string;
  name_ar: string | null;
  price: string;
  discounted_price: string | null;
  primary_image: string | null;
  category: string;
}

// Search Suggestions Response
export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}

// Filter Option Type
export interface FilterOption {
  value: string;
  label: string;
  label_ar: string | null;
  product_count: number;
}

// Filter Type
export interface Filter {
  id: number;
  name: string;
  name_ar: string | null;
  slug: string;
  filter_type: 'single' | 'multi' | 'range' | 'boolean';
  is_active: boolean;
  order: number;
}

// Filter with Options
export interface FilterWithOptions extends Filter {
  options: FilterOption[];
}
