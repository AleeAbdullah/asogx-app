/**
 * Hero Cards API Functions
 * API functions for hero cards (homepage carousel) endpoints
 */

import { apiClient } from '../api';
import { ROUTES } from '../routes';
import type { HeroCard } from './hero-cards.types';

/**
 * Get all active hero cards for homepage carousel
 */
export async function getHeroCards(): Promise<HeroCard[]> {
  return apiClient.get<HeroCard[]>(ROUTES.HERO_CARDS.LIST);
}

/**
 * Get single hero card by ID
 */
export async function getHeroCard(id: number | string): Promise<HeroCard> {
  return apiClient.get<HeroCard>(ROUTES.HERO_CARDS.DETAIL(id));
}
