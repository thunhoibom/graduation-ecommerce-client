// ============================================================
// Centralized route path definitions
// Follows PROMPT_CODE_SPECIFICATION.md naming conventions
// ============================================================

export const paths = {
  // Shop / Public
  home: '/',
  products: {
    root: '/products',
    detail: (barcode: string) => `/products/${barcode}`,
  },
  collections: {
    root: '/collections',
    detail: (slug: string) => `/collections/${slug}`,
  },
  cart: '/cart',
  checkout: {
    root: '/checkout',
    confirmation: '/checkout/confirmation',
  },

  // Auth
  auth: {
    login: '/login',
    register: '/register',
  },

  // Account
  account: {
    orders: '/orders',
    orderDetail: (buyOrder: string | number) => `/orders/${buyOrder}`,
    profile: '/profile',
  },

  // About
  about: '/about',
} as const;

export type Paths = typeof paths;
