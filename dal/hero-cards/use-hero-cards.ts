/**
 * Hero Cards API Functions
 * API functions for hero cards (homepage carousel) endpoints
 */

import { PaginatedResponse } from '@/constants';
import { apiClient } from '../api';
import { ROUTES } from '../routes';
import type { HeroCard } from './hero-cards.types';

/**
 * Get all active hero cards for homepage carousel
 */
export async function getHeroCards(): Promise<HeroCard[]> {
  const response = await apiClient.get<PaginatedResponse<HeroCard>>(ROUTES.HERO_CARDS.LIST);
  return response.results;
}

/**
 * Get single hero card by ID
 */
export async function getHeroCard(id: number | string): Promise<HeroCard> {
  return apiClient.get<HeroCard>(ROUTES.HERO_CARDS.DETAIL(id));
}
