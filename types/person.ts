/**
 * PersonPojo — mirrors backend PersonPojo schema
 * Source: /api/data/people, /api/account/profile
 */

export interface PersonPojo {
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  phone1?: string;
  phone2?: string;
}

// ─── Address ──────────────────────────────────────────────────────────────────

/** Raw address fields */
export interface AddressPojo {
  firstLine: string;
  secondLine?: string;
  municipality: string;
  city: string;
  postalCode?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Address book entry — mirrors backend AddressBookPojo schema
 * Used for: list, create, update addresses in the authenticated user's address book
 */
export interface AddressBookPojo {
  id?: number;
  label?: string;
  defaultShipping?: boolean;
  defaultBilling?: boolean;
  address: AddressPojo;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Product Category ────────────────────────────────────────────────────────

export interface ProductCategoryPojo {
  code: string;
  name: string;
  parent?: ProductCategoryPojo;
}

// ─── Cart Session ────────────────────────────────────────────────────────────

/** Mirrors backend CartSessionPojo */
export interface CartSessionPojo {
  id?: number;
  token: string;
  items?: CartItemPojo[];
  subtotal?: number;
  itemCount?: number;
  totalUnits?: number;
  appliedDiscountCode?: string;
  discountAmount?: number;
  totalAfterDiscount?: number;
  createdAt?: string;
  updatedAt?: string;
  expiresAt?: string;
  expired?: boolean;
}

/** Mirrors backend CartItemPojo */
export interface CartItemPojo {
  id?: number;
  sessionToken?: string;
  variantSku: string;
  quantity: number;
  variantSkuResolved?: string;
  variantSize?: string;
  variantColor?: string;
  productName: string;
  productBarcode: string;
  productBasePrice: number;
  priceModifier?: number;
  unitPrice: number;
  lineTotal: number;
  availableStock?: number;
  inStock?: boolean;
  active?: boolean;
  addedAt?: string;
  updatedAt?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  name: string;
  password: string;
}

/**
 * Response from POST /api/public/auth/login
 * ASSUMPTION: backend returns { token, ...optionalFields }
 */
export interface LoginResponse {
  token?: string;
  message?: string;
  [key: string]: unknown;
}

export interface RegistrationPayload {
  name: string;
  password: string;
  profile: PersonPojo;
}
