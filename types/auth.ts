/**
 * Auth domain types — matches Spring Boot backend
 */

import type { PersonPojo } from "./person";

// ─── Registration ───────────────────────────────────────────────────────────────

/**
 * RegistrationPojo — matches backend RegistrationPojo schema
 * POST /public/register
 */
export interface RegisterRequest {
  name: string;       // username/login name
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    idNumber: string;
    phone1?: string;
    phone2?: string;
  };
}

// ─── Login ─────────────────────────────────────────────────────────────────────

/**
 * Login uses Spring Security form login (no dedicated REST endpoint).
 * The browser POSTs to /login with username + password.
 * On success, server sets JSESSIONID cookie.
 *
 * Frontend workaround: use a server action or API route to proxy login.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

// ─── Auth state ────────────────────────────────────────────────────────────────

export interface AuthState {
  user: PersonPojo | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
