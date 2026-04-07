/**
 * Admin Dashboard REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * OpenAPI endpoints (from apidocs.md):
 *   GET /api/admin/dashboard/stats                  — overview stats
 *   GET /api/admin/dashboard/stats/top-products    — top selling products
 *   GET /api/admin/dashboard/stats/revenue         — revenue by period
 *   GET /api/admin/dashboard/stats/order-statuses   — order status breakdown
 *   GET /api/admin/dashboard/stats/low-stock       — low stock alerts
 */

import { api } from "./app-api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  totalRevenue: number;
  totalOrders: number;
  orderStatusBreakdown: OrderStatusCount[];
  revenueByPeriod: RevenueStat[];
  topProducts: TopProduct[];
  lowStockAlerts: LowStockAlert[];
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface RevenueStat {
  date: string;
  revenue: number;
  orderCount: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  unitsSold: number;
  revenue: number;
}

export interface LowStockAlert {
  variantId: number;
  productName: string;
  size: string;
  color: string;
  currentStock: number;
  criticalStock: number;
}

// ─── API calls ────────────────────────────────────────────────────────────────

/** GET /api/admin/dashboard/stats */
export async function getDashboardStats(): Promise<AdminDashboardStats> {
  const { data } = await api.get<AdminDashboardStats>("/api/admin/dashboard/stats");
  return data;
}

/** GET /api/admin/dashboard/stats/top-products */
export async function getTopProducts(limit = 10): Promise<TopProduct[]> {
  const { data } = await api.get<TopProduct[]>("/api/admin/dashboard/stats/top-products", {
    params: { limit },
  });
  return data ?? [];
}

/** GET /api/admin/dashboard/stats/revenue */
export async function getRevenueByPeriod(
  period: "day" | "week" | "month" = "day",
  days = 30
): Promise<RevenueStat[]> {
  const { data } = await api.get<RevenueStat[]>("/api/admin/dashboard/stats/revenue", {
    params: { period, days },
  });
  return data ?? [];
}

/** GET /api/admin/dashboard/stats/order-statuses */
export async function getOrderStatusBreakdown(): Promise<OrderStatusCount[]> {
  const { data } = await api.get<OrderStatusCount[]>(
    "/api/admin/dashboard/stats/order-statuses"
  );
  return data ?? [];
}

/** GET /api/admin/dashboard/stats/low-stock */
export async function getLowStockAlerts(): Promise<LowStockAlert[]> {
  const { data } = await api.get<LowStockAlert[]>("/api/admin/dashboard/stats/low-stock");
  return data ?? [];
}
