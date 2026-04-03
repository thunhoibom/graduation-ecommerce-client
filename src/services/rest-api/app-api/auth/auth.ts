import { appApiIns } from '../api-instance';
import {
  AuthResponse,
  PersonPojo,
  RegistrationPojo,
} from '../types';

// ============================================================
// Login — POST /public/login
// Backend returns "Bearer <token>" as raw text body on success
// ============================================================
export interface LoginBody {
  name: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const loginUser = (body: LoginBody) =>
  appApiIns.post<string>('/public/login', body);

// ============================================================
// Guest login — POST /public/guest
// ============================================================
export const loginAsGuest = () =>
  appApiIns.post<string>('/public/guest');

// ============================================================
// Register — POST /public/register
// ============================================================
export const registerUser = (body: RegistrationPojo) =>
  appApiIns.post<AuthResponse>('/public/register', body);

// ============================================================
// Profile — GET/PUT /account/profile
// ============================================================
export const fetchProfile = () =>
  appApiIns.get<PersonPojo>('/account/profile');

export const updateProfile = (body: PersonPojo) =>
  appApiIns.put<PersonPojo>('/account/profile', body);

// ============================================================
// Access — GET /access
// ============================================================
export interface TAuthorizedAccess {
  routes?: string[];
  permissions?: string[];
}

export const fetchAccess = () =>
  appApiIns.get<TAuthorizedAccess>('/access');

export const authApi = Object.freeze({
  login: loginUser,
  loginAsGuest,
  register: registerUser,
  fetchProfile,
  updateProfile,
  fetchAccess,
});
