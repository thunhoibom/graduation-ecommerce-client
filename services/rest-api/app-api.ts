import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// ─── Token helpers (must be before interceptor so it can use them) ────────────

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1] ?? null
  );
}

export function setAuthToken(token: string): void {
  if (typeof document === "undefined") return;
  const cleanToken = token.replace("Bearer ", "");
  document.cookie = `auth_token=${cleanToken}; path=/; max-age=86400; SameSite=Lax`;
}

export function clearAuthToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = "auth_token=; path=/; max-age=0";
}

function getSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("cart_session_token="))
      ?.split("=")[1] ?? null
  );
}

// ─── Request interceptor ──────────────────────────────────────────────────────

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach auth token if present
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach cart session token for cart/checkout endpoints
    const sessionToken = getSessionToken();
    const path = config.url ?? "";
    if (sessionToken && isCartEndpoint(path)) {
      config.headers["X-Session-Token"] = sessionToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

function isCartEndpoint(path: string): boolean {
  return (
    path.startsWith("/api/public/cart") ||
    path.startsWith("/api/public/checkout") ||
    path.startsWith("/api/public/discount") ||
    path.startsWith("/api/public/shipping")
  );
}

// ─── Response interceptor ─────────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export { api, BASE_URL };
export type { AxiosInstance };
