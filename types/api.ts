/**
 * Common API types shared across all services
 * Aligned with Spring Boot backend DataPagePojo schema
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Backend DataPagePojo shape:
 * { items: T[], pageIndex: number, totalCount: number, pageSize: number }
 */
export interface PaginatedResponse<T> {
  items: T[];
  pageIndex: number;
  totalCount: number;
  pageSize: number;
}

export interface ApiError {
  code?: string;
  message: string;
  detailMessage?: string;
  canRetry?: boolean;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface SearchParams extends PaginationParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  collections?: string[];
  tags?: string[];
  brand?: string;
  inStock?: boolean;
}

export interface SortOption {
  label: string;
  value: string;
}
