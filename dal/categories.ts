/**
 * Categories API
 * All category-related API calls
 */

import { apiClient } from './api';
import type { Category, PaginatedResponse } from '@/constants/types';

export const categoriesApi = {
  /**
   * Get category tree with nested hierarchy
   */
  getCategories: async (): Promise<PaginatedResponse<Category>> => {
    return apiClient.get<PaginatedResponse<Category>>('/products/categories/');
  },

  /**
   * Get category details by ID
   * @param id - Category ID
   */
  getCategoryById: async (id: number): Promise<Category> => {
    return apiClient.get<Category>(`/products/categories/${id}/`);
  },

  /**
   * Get category details by hierarchical path
   * @param path - Category path (e.g., 'electronics/laptops/gaming-laptops')
   */
  getCategoryByPath: async (path: string): Promise<Category> => {
    return apiClient.get<Category>(`/products/categories/${path}/`);
  },
};
