// ============================================================
// Shared API Types
// ============================================================

/** Backend pagination wrapper */
export interface DataPage<T> {
  items: T[];
  pageIndex: number;
  totalCount: number;
  pageSize: number;
}

/** Standard backend error response */
export interface AppError {
  code: string;
  message: string;
  detailMessage?: string;
  canRetry?: boolean;
}

/** Base response shape (most endpoints return data directly or wrapped) */
export type BaseJSONResponse<T> = T;

/** Pagination params passed to list endpoints via `allRequestParams` query */
export interface PaginationParams<T = Record<string, unknown>> {
  page?: number;
  limit?: number;
  sort?: string;
  keyword?: string;
  with?: string[];
  // Domain-specific filter fields (merged at top level)
  categoryCode?: string;
  status?: string;
}

export type ExtendingParams = Record<string, string | number | boolean | null | undefined>;

// ============================================================
// Domain Types
// ============================================================

// ---- Person / Customer ----
export interface PersonPojo {
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  phone1?: string;
  phone2?: string;
}

export interface AddressPojo {
  firstLine: string;
  secondLine?: string;
  municipality: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

export interface BillingCompanyPojo {
  idNumber?: string;
  name?: string;
}

// ---- User ----
export interface UserPojo {
  name?: string;
  password?: string;
  person?: PersonPojo;
  role?: string;
}

export interface RegistrationPojo {
  name: string;
  password: string;
  profile?: PersonPojo;
}

// ---- Auth ----
export interface AuthResponse {
  token?: string;
  user?: UserPojo;
  // Backend may return raw JWT; handle both cases
  [key: string]: unknown;
}

// ---- Product ----
export interface ImagePojo {
  code: string;
  filename: string;
  url: string;
}

export interface ProductCategoryPojo {
  code: string;
  name: string;
  parent?: ProductCategoryPojo;
}

export interface ProductPojo {
  id?: string;
  name: string;
  barcode: string;
  description?: string;
  price: number;
  currentStock?: number;
  criticalStock?: number;
  category?: ProductCategoryPojo;
  images?: ImagePojo[];
}

// ---- Product List ----
export interface ProductListPojo {
  name?: string;
  code: string;
  totalCount?: number;
}

// ---- Order ----
export interface OrderDetailPojo {
  units?: number;
  unitValue?: number;
  description?: string;
  product: ProductPojo;
}

export interface OrderPojo {
  buyOrder?: number;
  date?: string;
  details: OrderDetailPojo[];
  netValue?: number;
  taxValue?: number;
  transportValue?: number;
  totalValue?: number;
  totalItems?: number;
  status?: string;
  billingType?: string;
  paymentType: string;
  customer?: PersonPojo;
  salesperson?: PersonPojo;
  shipper?: string;
  billingCompany?: BillingCompanyPojo;
  billingAddress?: AddressPojo;
  shippingAddress?: AddressPojo;
}

// ---- Order Status ----
export interface TOrderStatusItem {
  code: number;
  name: string;
}
export interface OrderStatusPojo {
  code: number;
  name: string;
}

// ---- Checkout ----
export interface PaymentRedirectionDetailsPojo {
  url: string;
  token: string;
}

// ---- Receipt ----
export interface ReceiptDetailPojo {
  product?: ProductPojo;
  units?: number;
  unitValue?: number;
  description?: string;
}

export interface ReceiptPojo {
  buyOrder?: number;
  details?: ReceiptDetailPojo[];
  date?: string;
  status?: string;
  token?: string;
  totalValue?: number;
  taxValue?: number;
  transportValue?: number;
  totalItems?: number;
}

// ---- About ----
export interface CompanyDetailsPojo {
  name?: string;
  description?: string;
  bannerImageURL?: string;
  logoImageURL?: string;
}

// ---- Billing Type ----
export interface BillingTypePojo {
  name: string;
}

// ============================================================
// Fetch Params Types
// ============================================================

export type TFetchProductParams = Partial<PaginationParams>;
export type TFetchCategoryParams = Partial<PaginationParams>;
export type TFetchOrderParams = Partial<PaginationParams>;
export type TFetchCustomerParams = Partial<PaginationParams>;
