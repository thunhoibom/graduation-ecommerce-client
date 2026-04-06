/**
 * Common API types shared across all services
 */

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
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
