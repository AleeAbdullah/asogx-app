/**
 * Application Configuration
 * Central configuration file for app-wide constants
 */

export const API_CONFIG = {
  BASE_URL: process.env.API_BASE_URL || 'https://api.asogx.com/api/v1',
  BASE_URL_LOCAL: process.env.API_BASE_URL_LOCAL || 'http://localhost:8000/api/v1',
  TIMEOUT: 10000,
};

export const APP_CONFIG = {
  NAME: 'Lybia Store',
  VERSION: '1.0.0',
  DEFAULT_CURRENCY: 'AED',
  DEFAULT_LANGUAGE: 'en',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 24,
  MAX_PAGE_SIZE: 100,
};

export const THEME = {
  COLORS: {
    // Primary - Blue theme (auto-adapts via CSS variables)
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',

    // Secondary
    secondary: 'hsl(var(--secondary))',
    secondaryForeground: 'hsl(var(--secondary-foreground))',

    // Accent
    accent: 'hsl(var(--accent))',
    accentForeground: 'hsl(var(--accent-foreground))',

    // Backgrounds
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',

    // Card
    card: 'hsl(var(--card))',
    cardForeground: 'hsl(var(--card-foreground))',

    // Muted
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',

    // Borders
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',

    // Status colors
    destructive: 'hsl(var(--destructive))',
    destructiveForeground: 'hsl(var(--destructive-foreground))',

    success: 'hsl(var(--success))',
    successForeground: 'hsl(var(--success-foreground))',

    sale: 'hsl(var(--sale))',
    saleForeground: 'hsl(var(--sale-foreground))',

    // Navigation
    header: 'hsl(var(--header-bg))',
    nav: 'hsl(var(--nav-bg))',
    navForeground: 'hsl(var(--nav-foreground))',
    topbar: 'hsl(var(--topbar-bg))',
    topbarForeground: 'hsl(var(--topbar-foreground))',

    // Additional
    orange: 'hsl(var(--orange))',
    orangeForeground: 'hsl(var(--orange-foreground))',
    teal: 'hsl(var(--teal))',
    tealForeground: 'hsl(var(--teal-foreground))',

    // Popover
    popover: 'hsl(var(--popover))',
    popoverForeground: 'hsl(var(--popover-foreground))',

    // Gray scale (static values for consistent grays)
    grey: 'rgb(142, 142, 147)',
    grey2: 'rgb(175, 176, 180)',
    grey3: 'rgb(199, 199, 204)',
    grey4: 'rgb(210, 210, 215)',
    grey5: 'rgb(230, 230, 235)',
    grey6: 'rgb(242, 242, 247)',
  },

  SPACING: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },

  BORDER_RADIUS: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },

  FONT_SIZES: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
};

export const NAVIGATION = {
  ROUTES: {
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/[id]',
    CART: '/cart',
    WISHLIST: '/wishlist',
    PROFILE: '/profile',
  },
};
