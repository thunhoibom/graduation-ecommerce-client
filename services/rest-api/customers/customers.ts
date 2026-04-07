/**
 * Customer REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * OpenAPI endpoints (from apidocs.md):
 *   GET    /api/data/customers           — list customers (admin)
 *   POST   /api/data/customers          — register customer (admin)
 *   PUT    /api/data/customers          — update customer (admin)
 *   DELETE /api/data/customers          — deregister customer (admin)
 *
 *   POST /api/customers/register        — register new customer
 *   POST /api/customers/login            — customer login
 *   GET  /api/customers/me              — get current customer profile
 *   PUT  /api/customers/me             — update current customer profile
 *   GET  /api/customers/me/addresses    — get saved addresses
 *   POST /api/customers/me/addresses    — add new address
 *   PUT  /api/customers/me/addresses/{id} — update address
 *   DELETE /api/customers/me/addresses/{id} — delete address
 *   GET  /api/customers/me/orders      — get customer's orders
 */

import { api, setAuthToken } from "../app-api";
import type { PaginatedResponse } from "@/types/api";
import type { PersonPojo, AddressBookPojo } from "@/types/person";
import type { OrderPojo } from "@/types/order";

// ─── Public: Register & Login ─────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  customer: PersonPojo;
  token: string;
}

/** POST /api/customers/register */
export async function registerCustomer(payload: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>("/api/customers/register", payload);
  setAuthToken(data.token);
  return data;
}

/** POST /api/customers/login */
export async function loginCustomer(
  payload: LoginPayload
): Promise<AuthTokens> {
  const { data } = await api.post<AuthTokens>("/api/customers/login", payload, {
    withCredentials: true,
  });
  setAuthToken(data.token);
  return data;
}

// ─── Account: Profile ──────────────────────────────────────────────────────────

/** GET /api/customers/me — get current customer profile */
export async function getCurrentCustomer(): Promise<PersonPojo> {
  const { data } = await api.get<PersonPojo>("/api/customers/me");
  return data;
}

/** PUT /api/customers/me — update current customer profile */
export async function updateCustomerProfile(
  payload: Partial<PersonPojo>
): Promise<PersonPojo> {
  const { data } = await api.put<PersonPojo>("/api/customers/me", payload);
  return data;
}

// ─── Account: Addresses ────────────────────────────────────────────────────────

/** GET /api/customers/me/addresses */
export async function getCustomerAddresses(): Promise<AddressBookPojo[]> {
  const { data } = await api.get<AddressBookPojo[]>("/api/customers/me/addresses");
  return data ?? [];
}

/** POST /api/customers/me/addresses */
export async function addCustomerAddress(
  address: AddressBookPojo
): Promise<AddressBookPojo> {
  const { data } = await api.post<AddressBookPojo>(
    "/api/customers/me/addresses",
    address
  );
  return data;
}

/** PUT /api/customers/me/addresses/{id} */
export async function updateCustomerAddress(
  id: number,
  address: AddressBookPojo
): Promise<AddressBookPojo> {
  const { data } = await api.put<AddressBookPojo>(
    `/api/customers/me/addresses/${id}`,
    address
  );
  return data;
}

/** DELETE /api/customers/me/addresses/{id} */
export async function deleteCustomerAddress(id: number): Promise<void> {
  await api.delete(`/api/customers/me/addresses/${id}`);
}

// ─── Account: Orders ───────────────────────────────────────────────────────────

/** GET /api/customers/me/orders */
export async function getCustomerOrders(
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<OrderPojo>> {
  const { data } = await api.get<PaginatedResponse<OrderPojo>>(
    `/api/customers/me/orders?page=${page}&pageSize=${pageSize}`
  );
  return data;
}

// ─── Admin: Customers ─────────────────────────────────────────────────────────

/** GET /api/data/customers — list all customers (admin) */
export async function getCustomers(
  params: {
    page?: number;
    pageSize?: number;
    allRequestParams?: Record<string, string>;
  } = {}
): Promise<PaginatedResponse<PersonPojo>> {
  const { data } = await api.get<PaginatedResponse<PersonPojo>>(
    "/api/data/customers",
    {
      params: params.allRequestParams ?? {
        page: String(params.page ?? 1),
        pageSize: String(params.pageSize ?? 20),
      },
    }
  );
  return data;
}

/** POST /api/data/customers — create customer (admin) */
export async function createCustomer(
  payload: PersonPojo
): Promise<void> {
  await api.post("/api/data/customers", payload);
}

/** PUT /api/data/customers — update customer (admin) */
export async function updateCustomer(
  payload: PersonPojo
): Promise<void> {
  await api.put("/api/data/customers", payload);
}

/** DELETE /api/data/customers — deregister customer (admin) */
export async function deleteCustomer(): Promise<void> {
  await api.delete("/api/data/customers");
}
