import Axios from 'axios';
import type { AxiosError } from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export const appApiIns = Axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ============================================================
// Request interceptor: attach JWT
// ============================================================
appApiIns.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;

  const token = localStorage.getItem('mono_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================================
// Response interceptor: handle 401 → logout
// ============================================================
appApiIns.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (typeof window === 'undefined') return Promise.reject(error);

    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      localStorage.removeItem('mono_token');
      localStorage.removeItem('mono_user');

      // Redirect to login if not already there
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
