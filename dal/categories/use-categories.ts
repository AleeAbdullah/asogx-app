/**
 * Categories API Functions
 * API functions for categories endpoints
 */

import { PaginatedResponse } from '@/constants';
import { apiClient } from '../api';
import { ROUTES } from '../routes';
import type { Category, CategoryWithBreadcrumbs } from './categories.types';

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<PaginatedResponse<Category>>(ROUTES.CATEGORIES.LIST);
  return response.results;
}

/**
 * Get single category by ID
 */
export async function getCategory(id: number | string): Promise<CategoryWithBreadcrumbs> {
  return apiClient.get<CategoryWithBreadcrumbs>(ROUTES.CATEGORIES.DETAIL(id));
}

/**
 * Get category by path/slug
 */
export async function getCategoryByPath(path: string): Promise<CategoryWithBreadcrumbs> {
  return apiClient.get<CategoryWithBreadcrumbs>(ROUTES.CATEGORIES.BY_PATH(path));
}
