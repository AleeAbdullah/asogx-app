/**
 * Homepage API Functions
 * API functions for homepage sections endpoints
 */

import { apiClient } from '../api';
import { ROUTES } from '../routes';
import type { HomepageSection } from './homepage.types';

/**
 * Get all active homepage sections with products
 */
export async function getHomepageSections(): Promise<HomepageSection[]> {
  return apiClient.get<HomepageSection[]>(ROUTES.HOMEPAGE_SECTIONS.LIST);
}

/**
 * Get single homepage section by ID
 */
export async function getHomepageSection(id: number | string): Promise<HomepageSection> {
  return apiClient.get<HomepageSection>(ROUTES.HOMEPAGE_SECTIONS.DETAIL(id));
}
