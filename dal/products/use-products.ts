/**
 * Products API Functions
 * API functions for products endpoints
 */

import { apiClient } from '../api';
import { ROUTES } from '../routes';
import type {
  Product,
  PaginatedProductsResponse,
  ProductQueryParams,
  SearchSuggestionsResponse,
} from './products.types';

/**
 * Get paginated list of products
 */
export async function getProducts(params?: ProductQueryParams): Promise<PaginatedProductsResponse> {
  return apiClient.get<PaginatedProductsResponse>(ROUTES.PRODUCTS.LIST, params);
}

/**
 * Get single product by ID
 */
export async function getProduct(id: number | string): Promise<Product> {
  return apiClient.get<Product>(ROUTES.PRODUCTS.DETAIL(id));
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return apiClient.get<Product[]>(ROUTES.PRODUCTS.FEATURED);
}

/**
 * Get new arrival products
 */
export async function getNewArrivals(): Promise<Product[]> {
  return apiClient.get<Product[]>(ROUTES.PRODUCTS.NEW_ARRIVALS);
}

/**
 * Get products with active discounts
 */
export async function getDeals(): Promise<Product[]> {
  return apiClient.get<Product[]>(ROUTES.PRODUCTS.DEALS);
}

/**
 * Get related products for a specific product
 */
export async function getRelatedProducts(id: number | string): Promise<Product[]> {
  return apiClient.get<Product[]>(ROUTES.PRODUCTS.RELATED(id));
}

/**
 * Get search suggestions
 */
export async function getSearchSuggestions(
  query: string,
  limit: number = 5
): Promise<SearchSuggestionsResponse> {
  return apiClient.get<SearchSuggestionsResponse>(ROUTES.PRODUCTS.SEARCH_SUGGESTIONS, {
    q: query,
    limit,
  });
}
