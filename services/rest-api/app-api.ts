/**
 * Central API client — Axios instance
 * Connects to Spring Boot backend at http://localhost:8080/api
 */

import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// ─── Request interceptor ───────────────────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token if present
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ──────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized — clear token, redirect to login
      clearAuthToken();
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Token helpers ─────────────────────────────────────────────────────────────

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1] ?? null;
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  document.cookie = "auth_token=; path=/; max-age=0";
}

// ─── Cart session helpers ──────────────────────────────────────────────────────

export function getCartId(): string | null {
  if (typeof window === "undefined") return null;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("cart_id="))
    ?.split("=")[1] ?? null;
}

export function setCartId(id: string): void {
  if (typeof window === "undefined") return;
  document.cookie = `cart_id=${id}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearCartId(): void {
  if (typeof window === "undefined") return;
  document.cookie = "cart_id=; path=/; max-age=0";
}

export { api, BASE_URL };
export type { AxiosInstance };