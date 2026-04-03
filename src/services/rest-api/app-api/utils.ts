import type { AxiosInstance, AxiosRequestConfig } from 'axios';

/** Create a typed API service bound to a base axios instance */
export function createApiService(
  instance: AxiosInstance,
  baseUrl: string,
) {
  const api = instance.create({ baseURL: baseUrl });

  return {
    get<T>(url: string, config?: AxiosRequestConfig) {
      return api.get<T>(url, config);
    },
    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
      return api.post<T>(url, data, config);
    },
    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
      return api.put<T>(url, data, config);
    },
    patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
      return api.patch<T>(url, data, config);
    },
    delete<T>(url: string, config?: AxiosRequestConfig) {
      return api.delete<T>(url, config);
    },
  };
}

export type ApiService = ReturnType<typeof createApiService>;
