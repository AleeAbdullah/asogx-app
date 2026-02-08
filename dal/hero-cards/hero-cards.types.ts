/**
 * Hero Cards Types
 * Type definitions for hero cards API responses
 * Used for homepage carousel banners
 */

export interface HeroCard {
  id: number;
  title: string;
  title_ar: string | null;
  subtitle: string | null;
  subtitle_ar: string | null;
  image: string;
  link: string | null;
  button_text: string | null;
  button_text_ar: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
