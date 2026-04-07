/**
 * PersonPojo — mirrors backend PersonPojo schema
 * Source: /data/people endpoint, /account/profile response
 */

export interface PersonPojo {
  firstName: string;
  lastName: string;
  idNumber: string;
  email: string;
  phone1?: string;
  phone2?: string;
}

export interface AddressPojo {
  firstLine: string;
  secondLine?: string;
  municipality: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

export interface FullNamePojo {
  firstName: string;
  lastName: string;
}

// ─── Product Category ────────────────────────────────────────────────────────

export interface ProductCategoryPojo {
  code: string;
  name: string;
  parent?: ProductCategoryPojo;
}

// ─── Login / Register ────────────────────────────────────────────────────────

export interface LoginPayload {
  name: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  message?: string;
}

export interface RegistrationPayload {
  name: string;
  password: string;
  profile: PersonPojo;
}
