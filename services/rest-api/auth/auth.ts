/**
 * Auth REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * Endpoints:
 *   POST /public/auth/register  — register new user account
 *   POST /public/auth/login     — login → JWT returned in Set-Cookie
 *   GET  /account/profile       — get authenticated user profile
 *   PUT  /account/profile       — update profile
 *   GET  /access               — list authorized routes
 */

import { api, setAuthToken, clearAuthToken, getAuthToken } from "../app-api";
import type { LoginPayload, LoginResponse, RegistrationPayload } from "@/types/person";
import type { PersonPojo } from "@/types/person";

// ─── Config ────────────────────────────────────────────────────────────────────

const AUTH_LOGIN_PATH = "/api/public/auth/login";
const AUTH_REGISTER_PATH = "/api/public/auth/register";
const AUTH_PROFILE_PATH = "/api/account/profile";

// ─── Login ─────────────────────────────────────────────────────────────────────

/** POST /public/auth/login */
export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(AUTH_LOGIN_PATH, payload, {
    withCredentials: true,
  });

  // Backend may return token in body or Set-Cookie
  if (data?.token) {
    setAuthToken(data.token);
  }
  return data;
}

// ─── Register ─────────────────────────────────────────────────────────────────

/** POST /public/auth/register */
export async function register(
  payload: RegistrationPayload
): Promise<void> {
  await api.post(AUTH_REGISTER_PATH, payload, { withCredentials: true });
}

// ─── Profile ──────────────────────────────────────────────────────────────────

/** GET /account/profile */
export async function getProfile(): Promise<PersonPojo> {
  const { data } = await api.get<PersonPojo>(AUTH_PROFILE_PATH);
  return data;
}

/** PUT /account/profile */
export async function updateProfile(
  payload: Partial<PersonPojo>
): Promise<PersonPojo> {
  const { data } = await api.put<PersonPojo>(AUTH_PROFILE_PATH, payload);
  return data;
}

// ─── Access ───────────────────────────────────────────────────────────────────

/** GET /access */
export async function getAuthorizedRoutes(): Promise<string[]> {
  const { data } = await api.get<{ routes?: string[] }>("/api/access");
  return data?.routes ?? [];
}

// ─── Logout ───────────────────────────────────────────────────────────────────

/** Client-side logout — clears JWT cookie */
export async function logout(): Promise<void> {
  clearAuthToken();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export { getAuthToken, setAuthToken, clearAuthToken };

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
