/**
 * API Routes Configuration
 * Central location for all API endpoints
 */

export const ROUTES = {
  // Auth Routes
  AUTH: {
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    VERIFY_OTP: '/auth/verify-otp/',
    RESEND_OTP: '/auth/resend-otp/',
    REFRESH_TOKEN: '/auth/refresh-token/',
    LOGOUT: '/auth/logout/',
    RESET_PASSWORD: '/auth/reset-password/',
    VALIDATE_TOKEN: '/auth/validate-token/',
    RESET_PASSWORD_TOKEN: '/auth/reset-password-token/',
    UPDATE_PASSWORD: '/auth/update-password/',
    MAGIC_LINK_LOGIN: '/auth/magic-link-login/',
    UPDATE_ACCOUNT_STATUS: '/auth/update-account-status/',
    GOOGLE_AUTH: '/auth/google/',
    FACEBOOK_AUTH: '/auth/facebook/',
    PROFILE: '/auth/profile/',
  },

  // Product Routes
  PRODUCTS: {
    LIST: '/products/',
    DETAIL: (id: number | string) => `/products/${id}/`,
    FEATURED: '/products/featured/',
    NEW_ARRIVALS: '/products/new_arrivals/',
    DEALS: '/products/deals/',
    RELATED: (id: number | string) => `/products/${id}/related/`,
    SEARCH_SUGGESTIONS: '/products/search/suggestions/',
    FILTERS: '/products/filters/',
    FILTER_OPTIONS: (slug: string) => `/products/filters/${slug}/options/`,
  },

  // Category Routes
  CATEGORIES: {
    LIST: '/products/categories/',
    DETAIL: (id: number | string) => `/products/categories/${id}/`,
    BY_PATH: (path: string) => `/products/categories/${path}/`,
  },

  // Hero Cards Routes (Homepage Carousel)
  HERO_CARDS: {
    LIST: '/hero-cards/',
    DETAIL: (id: number | string) => `/hero-cards/${id}/`,
  },

  // Homepage Sections Routes
  HOMEPAGE_SECTIONS: {
    LIST: '/homepage-sections/',
    DETAIL: (id: number | string) => `/homepage-sections/${id}/`,
  },

  // Cart Routes
  CART: {
    GET: '/cart/',
    ADD_ITEM: '/cart/add_item/',
    UPDATE_ITEM: '/cart/update_item/',
    REMOVE_ITEM: '/cart/remove_item/',
    CLEAR: '/cart/clear/',
  },

  // Wishlist Routes
  WISHLIST: {
    GET: '/cart/wishlist/',
    ADD_PRODUCT: '/cart/wishlist/add_product/',
    REMOVE_PRODUCT: '/cart/wishlist/remove_product/',
    CHECK_PRODUCT: '/cart/wishlist/check_product/',
  },

  // Order Routes
  ORDERS: {
    LIST: '/orders/',
    DETAIL: (id: number | string) => `/orders/${id}/`,
    CREATE: '/orders/',
  },

  // Health Check
  HEALTH: '/health/health/',
} as const;

export default ROUTES;
