/**
 * Homepage Sections Types
 * Type definitions for homepage sections API responses
 */

import type { Product } from '../products/products.types';

export interface HomepageSection {
  id: number;
  title: string;
  title_ar: string | null;
  section_type: 'featured' | 'new_arrivals' | 'deals' | 'best_sellers' | 'custom';
  product_ids: number[];
  max_products: number;
  products: HomepageSectionProduct[];
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Product as returned in homepage section (simplified)
export interface HomepageSectionProduct {
  id: number;
  name: string;
  name_ar: string | null;
  image: string;
  price: string;
  original_price: string | null;
  category: string;
  discount: number | null;
  discount_percentage: number | null;
  free_shipping: boolean;
  fast_delivery: boolean;
  in_stock: boolean;
}
