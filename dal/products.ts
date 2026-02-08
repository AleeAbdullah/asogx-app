/**
 * Products API
 * All product-related API calls
 */

import { apiClient } from './api';
import type { Product, PaginatedResponse, ProductQueryParams } from '@/constants/types';

export const productsApi = {
  /**
   * Get paginated list of products
   * @param params - Query parameters for filtering, sorting, and pagination
   */
  getProducts: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    return apiClient.get<PaginatedResponse<Product>>('/products/', params);
  },

  /**
   * Get single product by ID
   * @param id - Product ID
   */
  getProductById: async (id: number): Promise<Product> => {
    return apiClient.get<Product>(`/products/${id}/`);
  },

  /**
   * Get featured products
   * @returns Array of featured products (max 10)
   */
  getFeaturedProducts: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/products/featured/');
  },

  /**
   * Get new arrival products
   * @returns Array of newest products (max 10)
   */
  getNewArrivals: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/products/new_arrivals/');
  },

  /**
   * Get products with active discounts
   * @returns Array of products on sale (max 10)
   */
  getDeals: async (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/products/deals/');
  },

  /**
   * Get related products for a specific product
   * @param id - Product ID
   * @returns Array of related products (max 4)
   */
  getRelatedProducts: async (id: number): Promise<Product[]> => {
    return apiClient.get<Product[]>(`/products/${id}/related/`);
  },

  /**
   * Search products with autocomplete
   * @param query - Search query (minimum 2 characters)
   * @param limit - Number of suggestions (default: 5, max: 10)
   */
  searchSuggestions: async (query: string, limit: number = 5): Promise<{ suggestions: any[] }> => {
    return apiClient.get('/products/search/suggestions/', { q: query, limit });
  },
};
