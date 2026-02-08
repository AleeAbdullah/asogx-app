# API Documentation v2.0

Complete API reference for Lybia Store Backend - Verified and up-to-date as of January 31, 2026.

**Base URL Production:** `https://api.asogx.com/api/v1`  
**Base URL Local:** `http://localhost:8000/api/v1`

**Authentication:** Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Table of Contents

1. [Health Check](#health-check)
2. [Authentication APIs](#authentication-apis)
3. [OAuth APIs](#oauth-apis)
4. [User Profile APIs](#user-profile-apis)
5. [Product APIs](#product-apis)
6. [Category APIs](#category-apis)
7. [Filter APIs](#filter-apis)
8. [Search APIs](#search-apis)
9. [Cart APIs](#cart-apis)
10. [Wishlist APIs](#wishlist-apis)
11. [Order APIs](#order-apis)
12. [Hero Cards APIs](#hero-cards-apis)
13. [Homepage Sections APIs](#homepage-sections-apis)
14. [Error Responses](#error-responses)

---

## Health Check

### GET /health/health/

Check application health and database connectivity.

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
{
  "status": "healthy",
  "database": "connected",
  "debug": false
}
```

**Status Codes:**
- `200 OK` - Application is healthy
- `503 Service Unavailable` - Application is unhealthy

---

## Authentication APIs

### POST /api/v1/auth/register/

Register a new user account.

**Authentication:** Not required

**Request Payload:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123",
  "password_confirm": "securepassword123",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+971501234567"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access_token_expires_at": 1234567890,
    "refresh_token_expires_at": 1234567890,
    "role": "buyer"
  },
  "message": "User registered successfully."
}
```

**Status Codes:**
- `201 Created` - User registered successfully
- `400 Bad Request` - Validation errors (email exists, passwords don't match, etc.)

---

### POST /api/v1/auth/login/

Login user with email and password. Supports MFA (Multi-Factor Authentication).

**Authentication:** Not required

**Request Payload:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK) - Without MFA:**
```json
{
  "mfa_required": false,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access_token_expires_at": 1234567890,
    "refresh_token_expires_at": 1234567890,
    "role": "buyer"
  },
  "message": "Logged in successfully."
}
```

**Response (200 OK) - With MFA Enabled:**
```json
{
  "mfa_required": true,
  "user_id": 1,
  "message": "MFA is enabled. Please verify OTP."
}
```

**Status Codes:**
- `200 OK` - Login successful or MFA required
- `400 Bad Request` - Invalid credentials or validation errors

---

### POST /api/v1/auth/verify-otp/

Verify OTP code for MFA login.

**Authentication:** Not required

**Request Payload:**
```json
{
  "user_id": 1,
  "otp_code": "123456"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access_token_expires_at": 1234567890,
    "refresh_token_expires_at": 1234567890,
    "role": "buyer"
  },
  "message": "OTP verified successfully."
}
```

**Status Codes:**
- `200 OK` - OTP verified successfully
- `400 Bad Request` - Invalid or expired OTP

---

### POST /api/v1/auth/resend-otp/

Resend OTP code to user's email.

**Authentication:** Not required

**Request Payload:**
```json
{
  "user_id": 1
}
```

**Response (200 OK):**
```json
{
  "message": "OTP has been resent to your email."
}
```

**Status Codes:**
- `200 OK` - OTP resent successfully
- `400 Bad Request` - Missing user_id
- `404 Not Found` - User not found

---

### POST /api/v1/auth/refresh-token/

Refresh access token using refresh token.

**Authentication:** Not required

**Request Payload:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "access_token_expires_at": 1234567890
}
```

**Status Codes:**
- `200 OK` - Token refreshed successfully
- `400 Bad Request` - Invalid or expired refresh token

---

### POST /api/v1/auth/logout/

Logout user and blacklist refresh token.

**Authentication:** Required

**Request Payload:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully."
}
```

**Status Codes:**
- `200 OK` - Logged out successfully
- `400 Bad Request` - Invalid token
- `401 Unauthorized` - Authentication required

---

### POST /api/v1/auth/reset-password/

Request password reset (sends magic link to email).

**Authentication:** Not required

**Request Payload:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "If the email exists, a password reset link has been sent."
}
```

**Note:** Always returns success for security (prevents email enumeration).

**Status Codes:**
- `200 OK` - Request processed

---

### GET /api/v1/auth/validate-token/

Validate password reset token without resetting password.

**Authentication:** Not required

**Query Parameters:**
- `token` (required) - The reset token from email

**Request:** No payload

**Response (200 OK) - Valid Token:**
```json
{
  "valid": true,
  "message": "Token is valid."
}
```

**Response (400 Bad Request) - Invalid Token:**
```json
{
  "valid": false,
  "message": "Token is invalid or expired."
}
```

**Status Codes:**
- `200 OK` - Token is valid
- `400 Bad Request` - Token is invalid or expired

---

### POST /api/v1/auth/reset-password-token/

Reset password using token from magic link.

**Authentication:** Not required

**Request Payload:**
```json
{
  "token": "abc123def456...",
  "new_password": "newsecurepassword123",
  "password_confirm": "newsecurepassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password has been reset successfully."
}
```

**Status Codes:**
- `200 OK` - Password reset successfully
- `400 Bad Request` - Invalid token or passwords don't match

---

### POST /api/v1/auth/update-password/

Update password for authenticated user.

**Authentication:** Required

**Request Payload:**
```json
{
  "old_password": "currentpassword123",
  "new_password": "newsecurepassword123",
  "password_confirm": "newsecurepassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password updated successfully."
}
```

**Status Codes:**
- `200 OK` - Password updated successfully
- `400 Bad Request` - Invalid current password or passwords don't match
- `401 Unauthorized` - Authentication required

---

### POST /api/v1/auth/magic-link-login/

Login using magic link token.

**Authentication:** Not required

**Request Payload:**
```json
{
  "token": "abc123def456..."
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access_token_expires_at": 1234567890,
    "refresh_token_expires_at": 1234567890,
    "role": "buyer"
  },
  "message": "Logged in successfully via magic link."
}
```

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Invalid or expired token

---

### POST /api/v1/auth/update-account-status/

Update user account status (activate/deactivate). **Admin only.**

**Authentication:** Required (Admin)

**Request Payload:**
```json
{
  "user_id": 2,
  "is_active": true
}
```

**Response (200 OK):**
```json
{
  "message": "User account activated successfully."
}
```

**Status Codes:**
- `200 OK` - Account status updated successfully
- `400 Bad Request` - Missing user_id
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Admin access required
- `404 Not Found` - User not found

---

## OAuth APIs

### POST /api/v1/auth/google/

Authenticate user with Google OAuth.

**Authentication:** Not required

**Request Payload:**
```json
{
  "id_token": "google_id_token_from_client",
  "access_token": "google_access_token_from_client"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email": "user@gmail.com",
    "username": "user_gmail_com",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access_token_expires_at": 1234567890,
    "refresh_token_expires_at": 1234567890,
    "role": "buyer"
  },
  "message": "Logged in successfully with Google."
}
```

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Invalid token or Google authentication failed

**Note:** If the user doesn't exist, a new account is created automatically.

---

### POST /api/v1/auth/facebook/

Authenticate user with Facebook OAuth.

**Authentication:** Not required

**Request Payload:**
```json
{
  "access_token": "facebook_access_token_from_client"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email": "user@facebook.com",
    "username": "user_facebook_com",
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access_token_expires_at": 1234567890,
    "refresh_token_expires_at": 1234567890,
    "role": "buyer"
  },
  "message": "Logged in successfully with Facebook."
}
```

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Invalid token or Facebook authentication failed

**Note:** If the user doesn't exist, a new account is created automatically.

---

## User Profile APIs

### GET /api/v1/auth/profile/

Get current user's profile.

**Authentication:** Required

**Request:** No payload

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+971501234567",
    "location": "أبوظبي",
    "currency": "AED",
    "role": "buyer",
    "role_display": "Buyer",
    "is_buyer": true,
    "is_admin": false,
    "groups": ["buyer"],
    "mfa_enabled": false,
    "mfa_method": "email",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Status Codes:**
- `200 OK` - Profile retrieved successfully
- `401 Unauthorized` - Authentication required

---

### PUT /api/v1/auth/profile/

Update current user's profile (full update - all fields required).

**Authentication:** Required

**Request Payload:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+971501234567",
  "location": "دبي",
  "currency": "AED"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+971501234567",
    "location": "دبي",
    "currency": "AED",
    "role": "buyer",
    "role_display": "Buyer",
    "is_buyer": true,
    "is_admin": false,
    "groups": ["buyer"],
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Profile updated successfully."
}
```

**Status Codes:**
- `200 OK` - Profile updated successfully
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Authentication required

---

### PATCH /api/v1/auth/profile/

Partially update current user's profile (only provided fields are updated).

**Authentication:** Required

**Request Payload:**
```json
{
  "phone": "+971509876543"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+971509876543",
    "location": "أبوظبي",
    "currency": "AED",
    "role": "buyer",
    "role_display": "Buyer",
    "is_buyer": true,
    "is_admin": false,
    "groups": ["buyer"],
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Profile updated successfully."
}
```

**Status Codes:**
- `200 OK` - Profile updated successfully
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Authentication required

---

## Product APIs

### GET /api/v1/products/

List products with advanced filtering, search, and sorting.

**Authentication:** Not required

**Query Parameters:**
- `category` - Hierarchical category path (e.g., `electronics/laptops`)
- `search` - Search term (searches in name, name_ar, description, description_ar)
- `sort` - Sort option: `price_asc`, `price_desc`, `newest`, `best_selling`, `relevance` (default)
- `page` - Page number for pagination (default: 1)
- `page_size` - Items per page (default: 24, max: 100)
- Dynamic filter params (any filter slug):
  - Multi-select: `?manufacturer=asus,msi`
  - Range: `?price_min=1000&price_max=5000`
  - Boolean: `?in_stock=true`

**Request:** No payload

**Response (200 OK):**
```json
{
  "count": 150,
  "next": "https://api.asogx.com/api/v1/products/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "ASUS ROG Laptop",
      "name_ar": "لابتوب ASUS ROG",
      "image": "https://api.asogx.com/media/products/asus-rog.jpg",
      "price": "3499.00",
      "original_price": "3999.00",
      "category": "Gaming Laptops",
      "discount": null,
      "discount_percentage": 12,
      "free_shipping": true,
      "fast_delivery": false,
      "in_stock": true
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Products retrieved successfully

---

### GET /api/v1/products/{id}/

Get detailed product information.

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "ASUS ROG Laptop",
  "name_ar": "لابتوب ASUS ROG",
  "description": "High-performance gaming laptop with RTX 3070",
  "description_ar": "لابتوب ألعاب عالي الأداء مع RTX 3070",
  "image": "https://api.asogx.com/media/products/asus-rog.jpg",
  "price": "3499.00",
  "original_price": "3999.00",
  "category": {
    "id": 5,
    "slug": "gaming-laptops",
    "name_ar": "لابتوبات الألعاب",
    "name_en": "Gaming Laptops",
    "image": null,
    "product_count": 45
  },
  "discount": null,
  "discount_percentage": 12,
  "free_shipping": true,
  "fast_delivery": false,
  "in_stock": true,
  "stock_quantity": 15,
  "images": [
    {
      "id": 1,
      "image": "https://api.asogx.com/media/products/asus-rog-1.jpg",
      "alt_text": "Front view",
      "order": 0
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Product retrieved successfully
- `404 Not Found` - Product not found

---

### GET /api/v1/products/featured/

Get featured products (high sales, recent additions).

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "ASUS ROG Laptop",
    "name_ar": "لابتوب ASUS ROG",
    "image": "https://api.asogx.com/media/products/asus-rog.jpg",
    "price": "3499.00",
    "original_price": "3999.00",
    "category": "Gaming Laptops",
    "discount": null,
    "discount_percentage": 12,
    "free_shipping": true,
    "fast_delivery": false,
    "in_stock": true
  }
]
```

**Note:** Returns maximum 10 products.

**Status Codes:**
- `200 OK` - Featured products retrieved successfully

---

### GET /api/v1/products/new_arrivals/

Get newest products.

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "name": "MSI Gaming Laptop",
    "name_ar": "لابتوب MSI للألعاب",
    "image": "https://api.asogx.com/media/products/msi-gaming.jpg",
    "price": "2999.00",
    "original_price": null,
    "category": "Gaming Laptops",
    "discount": null,
    "discount_percentage": null,
    "free_shipping": true,
    "fast_delivery": true,
    "in_stock": true
  }
]
```

**Note:** Returns maximum 10 products, ordered by creation date (newest first).

**Status Codes:**
- `200 OK` - New arrivals retrieved successfully

---

### GET /api/v1/products/deals/

Get products with active discounts.

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "ASUS ROG Laptop",
    "name_ar": "لابتوب ASUS ROG",
    "image": "https://api.asogx.com/media/products/asus-rog.jpg",
    "price": "3499.00",
    "original_price": "3999.00",
    "category": "Gaming Laptops",
    "discount": null,
    "discount_percentage": 12,
    "free_shipping": true,
    "fast_delivery": false,
    "in_stock": true
  }
]
```

**Note:** Returns maximum 10 products with highest discount percentage.

**Status Codes:**
- `200 OK` - Deals retrieved successfully

---

### GET /api/v1/products/{id}/related/

Get related products (same primary category).

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
[
  {
    "id": 3,
    "name": "Razer Blade Gaming Laptop",
    "name_ar": "لابتوب Razer Blade للألعاب",
    "image": "https://api.asogx.com/media/products/razer-blade.jpg",
    "price": "4299.00",
    "original_price": null,
    "category": "Gaming Laptops",
    "discount": null,
    "discount_percentage": null,
    "free_shipping": true,
    "fast_delivery": false,
    "in_stock": true
  }
]
```

**Note:** Returns maximum 4 related products, excluding the current product.

**Status Codes:**
- `200 OK` - Related products retrieved successfully
- `404 Not Found` - Product not found

---

## Category APIs

### GET /api/v1/products/categories/

Get category tree with nested hierarchy (3 levels).

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "slug": "electronics",
      "name_ar": "إلكترونيات",
      "name_en": "Electronics",
      "level": 0,
      "parent": null,
      "product_count": 1250,
      "image": "https://api.asogx.com/media/categories/electronics.jpg",
      "icon": "https://api.asogx.com/media/categories/icons/electronics.png",
      "order": 0,
      "is_active": true,
      "children": [
        {
          "id": 5,
          "slug": "laptops",
          "name_ar": "لابتوبات",
          "name_en": "Laptops",
          "level": 1,
          "parent": 1,
          "product_count": 450,
          "image": null,
          "icon": null,
          "order": 0,
          "is_active": true,
          "children": [
            {
              "id": 12,
              "slug": "gaming-laptops",
              "name_ar": "لابتوبات الألعاب",
              "name_en": "Gaming Laptops",
              "level": 2,
              "parent": 5,
              "product_count": 120,
              "image": null,
              "icon": null,
              "order": 0,
              "is_active": true,
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Categories retrieved successfully

---

### GET /api/v1/products/categories/{id}/

Get category details by ID.

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
{
  "id": 1,
  "slug": "electronics",
  "name_ar": "إلكترونيات",
  "name_en": "Electronics",
  "image": "https://api.asogx.com/media/categories/electronics.jpg",
  "product_count": 1250,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Category retrieved successfully
- `404 Not Found` - Category not found

---

### GET /api/v1/products/categories/{path}/

Get category details by hierarchical path (e.g., `electronics/laptops/`).

**Authentication:** Not required

**Path Examples:**
- `/api/v1/products/categories/electronics/`
- `/api/v1/products/categories/electronics/laptops/`
- `/api/v1/products/categories/electronics/laptops/gaming-laptops/`

**Request:** No payload

**Response (200 OK):**
```json
{
  "id": 12,
  "slug": "gaming-laptops",
  "name_ar": "لابتوبات الألعاب",
  "name_en": "Gaming Laptops",
  "level": 2,
  "full_path": "electronics/laptops/gaming-laptops",
  "breadcrumbs": [
    {"name": "Home", "slug": "/"},
    {"name": "Electronics", "slug": "electronics"},
    {"name": "Laptops", "slug": "electronics/laptops"},
    {"name": "Gaming Laptops", "slug": "electronics/laptops/gaming-laptops"}
  ],
  "product_count": 120,
  "description": "High-performance laptops designed for gaming",
  "image": "https://api.asogx.com/media/categories/gaming-laptops.jpg",
  "icon": "https://api.asogx.com/media/categories/icons/gaming-laptops.png",
  "banner_image": "https://api.asogx.com/media/categories/banners/gaming-laptops.jpg",
  "meta_title": "Gaming Laptops - Best Deals",
  "meta_description": "Shop the best gaming laptops with top performance",
  "filters": [
    {
      "id": 1,
      "name": "Manufacturer",
      "slug": "manufacturer",
      "type": "multi_select",
      "options": [
        {"value": "ASUS", "slug": "asus"},
        {"value": "MSI", "slug": "msi"}
      ]
    }
  ],
  "sort_options": [
    {"value": "relevance", "label": "Relevance"},
    {"value": "price_asc", "label": "Price: Low to High"},
    {"value": "price_desc", "label": "Price: High to Low"},
    {"value": "newest", "label": "Newest First"},
    {"value": "best_selling", "label": "Best Selling"}
  ]
}
```

**Status Codes:**
- `200 OK` - Category retrieved successfully
- `400 Bad Request` - Invalid category path
- `404 Not Found` - Category not found

---

## Filter APIs

### GET /api/v1/products/filters/

List all active filters.

**Authentication:** Not required

**Query Parameters:**
- `category` (optional) - Filter by category slug to get category-specific filters

**Request:** No payload

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Manufacturer",
    "name_ar": "الشركة المصنعة",
    "slug": "manufacturer",
    "type": "multi_select",
    "is_collapsible": true,
    "default_collapsed": false,
    "show_more_threshold": 5,
    "unit": null,
    "is_required": false,
    "order": 1,
    "is_active": true,
    "options": [
      {"value": "ASUS", "slug": "asus"},
      {"value": "MSI", "slug": "msi"},
      {"value": "Razer", "slug": "razer"}
    ]
  },
  {
    "id": 2,
    "name": "Price",
    "name_ar": "السعر",
    "slug": "price",
    "type": "range",
    "is_collapsible": true,
    "default_collapsed": false,
    "show_more_threshold": null,
    "unit": "AED",
    "is_required": false,
    "order": 2,
    "is_active": true,
    "min": 0,
    "max": 15000
  }
]
```

**Status Codes:**
- `200 OK` - Filters retrieved successfully

---

### GET /api/v1/products/filters/{slug}/options/

Get filter options with product counts.

**Authentication:** Not required

**Query Parameters:**
- `category` (optional) - Get counts for specific category

**Request:** No payload

**Response (200 OK):**
```json
{
  "filter": {
    "id": 1,
    "name": "Manufacturer",
    "name_ar": "الشركة المصنعة",
    "slug": "manufacturer",
    "type": "multi_select"
  },
  "options": [
    {"value": "ASUS", "slug": "asus", "product_count": 45},
    {"value": "MSI", "slug": "msi", "product_count": 38},
    {"value": "Razer", "slug": "razer", "product_count": 22}
  ]
}
```

**Status Codes:**
- `200 OK` - Filter options retrieved successfully
- `404 Not Found` - Filter not found

---

## Search APIs

### GET /api/v1/products/search/suggestions/

Provide autocomplete suggestions as user types.

**Authentication:** Not required

**Query Parameters:**
- `q` (required) - Search query (minimum 2 characters)
- `limit` (optional) - Number of suggestions (default: 5, max: 10)

**Request:** No payload

**Response (200 OK):**
```json
{
  "suggestions": [
    {
      "type": "product",
      "text": "ASUS ROG Laptop",
      "url": "/products/1/",
      "image": "https://api.asogx.com/media/products/asus-rog.jpg",
      "price": "3499.00"
    },
    {
      "type": "category",
      "text": "Laptops",
      "url": "/categories/electronics/laptops/"
    },
    {
      "type": "product",
      "text": "Laptop Stand",
      "url": "/products/25/",
      "image": "https://api.asogx.com/media/products/laptop-stand.jpg",
      "price": "49.99"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Suggestions retrieved successfully
- `400 Bad Request` - Query too short (less than 2 characters)

---

## Cart APIs

### GET /api/v1/cart/

Get user's cart with all items.

**Authentication:** Required

**Request:** No payload

**Response (200 OK):**
```json
{
  "id": 1,
  "user": 1,
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "ASUS ROG Laptop",
        "name_ar": "لابتوب ASUS ROG",
        "image": "https://api.asogx.com/media/products/asus-rog.jpg",
        "price": "3499.00",
        "original_price": "3999.00",
        "category": "Gaming Laptops",
        "discount": null,
        "discount_percentage": 12,
        "free_shipping": true,
        "fast_delivery": false,
        "in_stock": true
      },
      "product_id": 1,
      "quantity": 2,
      "subtotal": "6998.00",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": "6998.00",
  "item_count": 2,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Cart retrieved successfully
- `401 Unauthorized` - Authentication required

---

### POST /api/v1/cart/add_item/

Add item to cart or update quantity if already exists.

**Authentication:** Required

**Request Payload:**
```json
{
  "product_id": 1,
  "quantity": 2
}
```

**Response (201 Created) - Item Added:**
```json
{
  "id": 1,
  "product": {
    "id": 1,
    "name": "ASUS ROG Laptop",
    "name_ar": "لابتوب ASUS ROG",
    "image": "https://api.asogx.com/media/products/asus-rog.jpg",
    "price": "3499.00",
    "original_price": "3999.00",
    "category": "Gaming Laptops",
    "discount": null,
    "discount_percentage": 12,
    "free_shipping": true,
    "fast_delivery": false,
    "in_stock": true
  },
  "product_id": 1,
  "quantity": 2,
  "subtotal": "6998.00",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Response (200 OK) - Quantity Updated:**
```json
{
  "id": 1,
  "product": {...},
  "product_id": 1,
  "quantity": 4,
  "subtotal": "13996.00",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `201 Created` - Item added to cart
- `200 OK` - Item quantity updated (if already exists)
- `404 Not Found` - Product not found or out of stock
- `401 Unauthorized` - Authentication required

---

### PUT /api/v1/cart/update_item/

Update cart item quantity.

**Authentication:** Required

**Request Payload:**
```json
{
  "item_id": 1,
  "quantity": 3
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "product": {...},
  "product_id": 1,
  "quantity": 3,
  "subtotal": "10497.00",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Response (200 OK) - Item Removed (if quantity <= 0):**
```json
{
  "message": "Item removed from cart"
}
```

**Status Codes:**
- `200 OK` - Item updated or removed successfully
- `404 Not Found` - Item not found in cart
- `401 Unauthorized` - Authentication required

---

### PATCH /api/v1/cart/update_item/

Partially update cart item (same as PUT).

**Authentication:** Required

**Request Payload:**
```json
{
  "item_id": 1,
  "quantity": 3
}
```

**Response:** Same as PUT

---

### DELETE /api/v1/cart/remove_item/

Remove specific item from cart.

**Authentication:** Required

**Query Parameters:**
- `item_id` (required) - ID of the cart item to remove

**Request:** No payload

**Response (200 OK):**
```json
{
  "message": "Item removed from cart"
}
```

**Status Codes:**
- `200 OK` - Item removed successfully
- `404 Not Found` - Item not found in cart
- `401 Unauthorized` - Authentication required

---

### DELETE /api/v1/cart/clear/

Clear all items from cart.

**Authentication:** Required

**Request:** No payload

**Response (200 OK):**
```json
{
  "message": "Cart cleared"
}
```

**Status Codes:**
- `200 OK` - Cart cleared successfully
- `401 Unauthorized` - Authentication required

---

## Wishlist APIs

### GET /api/v1/cart/wishlist/

Get user's wishlist with all products.

**Authentication:** Required

**Request:** No payload

**Response (200 OK):**
```json
{
  "id": 1,
  "user": 1,
  "products": [
    {
      "id": 1,
      "name": "ASUS ROG Laptop",
      "name_ar": "لابتوب ASUS ROG",
      "image": "https://api.asogx.com/media/products/asus-rog.jpg",
      "price": "3499.00",
      "original_price": "3999.00",
      "category": "Gaming Laptops",
      "discount": null,
      "discount_percentage": 12,
      "free_shipping": true,
      "fast_delivery": false,
      "in_stock": true
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Wishlist retrieved successfully
- `401 Unauthorized` - Authentication required

---

### POST /api/v1/cart/wishlist/add_product/

Add product to wishlist.

**Authentication:** Required

**Request Payload:**
```json
{
  "product_id": 1
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user": 1,
  "products": [
    {
      "id": 1,
      "name": "ASUS ROG Laptop",
      "name_ar": "لابتوب ASUS ROG",
      "image": "https://api.asogx.com/media/products/asus-rog.jpg",
      "price": "3499.00",
      "original_price": "3999.00",
      "category": "Gaming Laptops",
      "discount": null,
      "discount_percentage": 12,
      "free_shipping": true,
      "fast_delivery": false,
      "in_stock": true
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Response (200 OK) - Already in Wishlist:**
```json
{
  "message": "Product already in wishlist"
}
```

**Status Codes:**
- `201 Created` - Product added to wishlist
- `200 OK` - Product already in wishlist
- `404 Not Found` - Product not found
- `401 Unauthorized` - Authentication required

---

### DELETE /api/v1/cart/wishlist/remove_product/

Remove product from wishlist.

**Authentication:** Required

**Query Parameters:**
- `product_id` (required) - ID of the product to remove

**Request:** No payload

**Response (200 OK):**
```json
{
  "id": 1,
  "user": 1,
  "products": [],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Product removed successfully
- `404 Not Found` - Product not found
- `401 Unauthorized` - Authentication required

---

### GET /api/v1/cart/wishlist/check_product/

Check if a specific product is in user's wishlist.

**Authentication:** Required

**Query Parameters:**
- `product_id` (required) - ID of the product to check

**Request:** No payload

**Response (200 OK):**
```json
{
  "is_in_wishlist": true
}
```

**Status Codes:**
- `200 OK` - Check completed successfully
- `404 Not Found` - Product not found
- `401 Unauthorized` - Authentication required

---

## Order APIs

### GET /api/v1/orders/

List user's orders with optional filters.

**Authentication:** Required

**Query Parameters:**
- `status` (optional) - Filter by order status: `pending`, `processing`, `shipped`, `delivered`, `cancelled`
- `payment_status` (optional) - Filter by payment status: `pending`, `paid`, `failed`, `refunded`
- `page` (optional) - Page number for pagination
- `page_size` (optional) - Items per page

**Request:** No payload

**Response (200 OK):**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "order_number": "ABC123XYZ45",
      "user": 1,
      "user_email": "user@example.com",
      "status": "pending",
      "shipping_name": "John Doe",
      "shipping_email": "user@example.com",
      "shipping_phone": "+971501234567",
      "shipping_address": "123 Main Street, Apartment 4B",
      "shipping_city": "Dubai",
      "shipping_country": "UAE",
      "subtotal": "6998.00",
      "shipping_cost": "0.00",
      "total": "6998.00",
      "payment_method": "credit_card",
      "payment_status": "pending",
      "notes": "Please deliver in the morning",
      "items": [
        {
          "id": 1,
          "product": {
            "id": 1,
            "name": "ASUS ROG Laptop",
            "name_ar": "لابتوب ASUS ROG",
            "image": "https://api.asogx.com/media/products/asus-rog.jpg",
            "price": "3499.00",
            "original_price": "3999.00",
            "category": "Gaming Laptops",
            "discount": null,
            "discount_percentage": 12,
            "free_shipping": true,
            "fast_delivery": false,
            "in_stock": true
          },
          "product_name": "ASUS ROG Laptop",
          "product_price": "3499.00",
          "quantity": 2,
          "subtotal": "6998.00"
        }
      ],
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Orders retrieved successfully
- `401 Unauthorized` - Authentication required

---

### GET /api/v1/orders/{id}/

Get detailed order information.

**Authentication:** Required

**Request:** No payload

**Response (200 OK):**
```json
{
  "id": 1,
  "order_number": "ABC123XYZ45",
  "user": 1,
  "user_email": "user@example.com",
  "status": "pending",
  "shipping_name": "John Doe",
  "shipping_email": "user@example.com",
  "shipping_phone": "+971501234567",
  "shipping_address": "123 Main Street, Apartment 4B",
  "shipping_city": "Dubai",
  "shipping_country": "UAE",
  "subtotal": "6998.00",
  "shipping_cost": "0.00",
  "total": "6998.00",
  "payment_method": "credit_card",
  "payment_status": "pending",
  "notes": "Please deliver in the morning",
  "items": [
    {
      "id": 1,
      "product": {...},
      "product_name": "ASUS ROG Laptop",
      "product_price": "3499.00",
      "quantity": 2,
      "subtotal": "6998.00"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Order retrieved successfully
- `404 Not Found` - Order not found
- `401 Unauthorized` - Authentication required

---

### POST /api/v1/orders/

Create order from cart items.

**Authentication:** Required

**Request Payload:**
```json
{
  "shipping_name": "John Doe",
  "shipping_email": "user@example.com",
  "shipping_phone": "+971501234567",
  "shipping_address": "123 Main Street, Apartment 4B",
  "shipping_city": "Dubai",
  "shipping_country": "UAE",
  "payment_method": "credit_card",
  "notes": "Please deliver in the morning"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "order_number": "ABC123XYZ45",
  "user": 1,
  "user_email": "user@example.com",
  "status": "pending",
  "shipping_name": "John Doe",
  "shipping_email": "user@example.com",
  "shipping_phone": "+971501234567",
  "shipping_address": "123 Main Street, Apartment 4B",
  "shipping_city": "Dubai",
  "shipping_country": "UAE",
  "subtotal": "6998.00",
  "shipping_cost": "0.00",
  "total": "6998.00",
  "payment_method": "credit_card",
  "payment_status": "pending",
  "notes": "Please deliver in the morning",
  "items": [...],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Note:** Cart is automatically cleared after order creation.

**Status Codes:**
- `201 Created` - Order created successfully
- `400 Bad Request` - Cart is empty or validation errors
- `401 Unauthorized` - Authentication required

---

### PATCH /api/v1/orders/{id}/cancel/

Cancel an order.

**Authentication:** Required

**Request:** No payload (or empty body)

**Response (200 OK):**
```json
{
  "id": 1,
  "order_number": "ABC123XYZ45",
  "user": 1,
  "status": "cancelled",
  "shipping_name": "John Doe",
  "shipping_email": "user@example.com",
  "shipping_phone": "+971501234567",
  "shipping_address": "123 Main Street, Apartment 4B",
  "shipping_city": "Dubai",
  "shipping_country": "UAE",
  "subtotal": "6998.00",
  "shipping_cost": "0.00",
  "total": "6998.00",
  "payment_method": "credit_card",
  "payment_status": "pending",
  "items": [...],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Response (400 Bad Request) - Cannot Cancel:**
```json
{
  "error": "Cannot cancel order with status: delivered"
}
```

**Note:** Orders with status `delivered` or `cancelled` cannot be cancelled.

**Status Codes:**
- `200 OK` - Order cancelled successfully
- `400 Bad Request` - Order cannot be cancelled
- `404 Not Found` - Order not found
- `401 Unauthorized` - Authentication required

---

## Hero Cards APIs

### GET /api/v1/hero-cards/

List all active hero cards for homepage carousel.

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Summer Sale",
    "title_ar": "تخفيضات الصيف",
    "subtitle": "Up to 50% off on selected items",
    "subtitle_ar": "خصم حتى 50% على المنتجات المختارة",
    "image": "https://api.asogx.com/media/hero-cards/summer-sale.jpg",
    "link": "/products/deals/",
    "button_text": "Shop Now",
    "button_text_ar": "تسوق الآن",
    "order": 0,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Hero cards retrieved successfully

---

### GET /api/v1/hero-cards/{id}/

Get specific hero card details.

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Summer Sale",
  "title_ar": "تخفيضات الصيف",
  "subtitle": "Up to 50% off on selected items",
  "subtitle_ar": "خصم حتى 50% على المنتجات المختارة",
  "image": "https://api.asogx.com/media/hero-cards/summer-sale.jpg",
  "link": "/products/deals/",
  "button_text": "Shop Now",
  "button_text_ar": "تسوق الآن",
  "order": 0,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Hero card retrieved successfully
- `404 Not Found` - Hero card not found

---

## Homepage Sections APIs

### GET /api/v1/homepage-sections/

List all active homepage product sections.

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Featured Products",
    "title_ar": "المنتجات المميزة",
    "section_type": "featured",
    "product_ids": [1, 2, 3, 4],
    "max_products": 8,
    "products": [
      {
        "id": 1,
        "name": "ASUS ROG Laptop",
        "name_ar": "لابتوب ASUS ROG",
        "image": "https://api.asogx.com/media/products/asus-rog.jpg",
        "price": "3499.00",
        "original_price": "3999.00",
        "category": "Gaming Laptops",
        "discount": null,
        "discount_percentage": 12,
        "free_shipping": true,
        "fast_delivery": false,
        "in_stock": true
      }
    ],
    "order": 0,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
]
```

**Status Codes:**
- `200 OK` - Homepage sections retrieved successfully

---

### GET /api/v1/homepage-sections/{id}/

Get specific homepage section details.

**Authentication:** Not required

**Request:** No payload

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Featured Products",
  "title_ar": "المنتجات المميزة",
  "section_type": "featured",
  "product_ids": [1, 2, 3, 4],
  "max_products": 8,
  "products": [
    {
      "id": 1,
      "name": "ASUS ROG Laptop",
      "name_ar": "لابتوب ASUS ROG",
      "image": "https://api.asogx.com/media/products/asus-rog.jpg",
      "price": "3499.00",
      "original_price": "3999.00",
      "category": "Gaming Laptops",
      "discount": null,
      "discount_percentage": 12,
      "free_shipping": true,
      "fast_delivery": false,
      "in_stock": true
    }
  ],
  "order": 0,
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Status Codes:**
- `200 OK` - Homepage section retrieved successfully
- `404 Not Found` - Homepage section not found

---

## Error Responses

All endpoints may return error responses in the following formats:

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": {
    "field_name": ["Error detail 1", "Error detail 2"]
  }
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

Or:
```json
{
  "detail": "Given token not valid for any token type",
  "code": "token_not_valid",
  "messages": [
    {
      "token_class": "AccessToken",
      "token_type": "access",
      "message": "Token is invalid or expired"
    }
  ]
}
```

### 403 Forbidden
```json
{
  "message": "Permission denied. Admin access required."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

---

## Important Notes

### Authentication & Tokens
- **Access Token:** Valid for 60 minutes
- **Refresh Token:** Valid for 7 days
- Tokens must be included in Authorization header: `Authorization: Bearer <access_token>`
- Use `/api/v1/auth/refresh-token/` to get new access token before it expires

### Pagination
All list endpoints return paginated responses with this structure:
```json
{
  "count": 150,
  "next": "https://api.asogx.com/api/v1/products/?page=2",
  "previous": null,
  "results": [...]
}
```

### Media Files
- All image URLs use absolute paths in production: `https://api.asogx.com/media/...`
- Images are served from `/media/` directory
- Supported formats: JPG, JPEG, PNG, GIF, WEBP

### CORS
- Backend accepts requests from: `https://site.asogx.com`
- CORS headers are automatically included in responses

### Order Status Values
- `pending` - Order placed, awaiting processing
- `processing` - Order is being prepared
- `shipped` - Order has been shipped
- `delivered` - Order delivered to customer
- `cancelled` - Order cancelled

### Payment Status Values
- `pending` - Payment pending
- `paid` - Payment completed
- `failed` - Payment failed
- `refunded` - Payment refunded

### Currency
- All prices are in AED (UAE Dirham)
- Prices are returned as decimal strings (e.g., "99.99")
- User can set preferred currency in profile (for display purposes)

### Removed Features
- ❌ **Rating & Reviews:** These features were removed from the system
- Product responses do NOT include `rating` or `review_count` fields

---

**Document Version:** 2.0  
**Last Updated:** January 31, 2026  
**Backend Version:** prod branch  
**Database:** MySQL (storeDB)  
**Server:** https://api.asogx.com
