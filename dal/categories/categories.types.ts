/**
 * Categories Types
 * Type definitions for categories API responses
 */

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
  product_count: number;
  image: string | null;
  icon: string | null;
  order: number;
  children?: Category[];
  created_at: string;
}

export interface CategoryWithBreadcrumbs extends Category {
  breadcrumbs: Breadcrumb[];
  full_path: string;
  banner_image?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface Breadcrumb {
  name: string;
  slug: string;
}
