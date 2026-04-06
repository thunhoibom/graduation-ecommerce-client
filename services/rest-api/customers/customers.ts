/**
 * Customer REST API service
 */

import { api } from "../app-api";
import type { Customer, Address } from "@/types/common";
import type { OrderSummary } from "@/types/order";
import type { PaginatedResponse } from "@/types/api";
import { setAuthToken } from "../app-api";

/** POST /customers/register — register new customer */
export async function register(payload: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<{ customer: Customer; token: string }> {
  const { data } = await api.post<{ customer: Customer; token: string }>(
    "/customers/register",
    payload
  );
  setAuthToken(data.token);
  return data;
}

/** POST /customers/login — customer login */
export async function login(payload: {
  email: string;
  password: string;
}): Promise<{ customer: Customer; token: string }> {
  const { data } = await api.post<{ customer: Customer; token: string }>(
    "/customers/login",
    payload
  );
  setAuthToken(data.token);
  return data;
}

/** GET /customers/me — get current customer profile */
export async function getCurrentCustomer(): Promise<Customer> {
  const { data } = await api.get<Customer>("/customers/me");
  return data;
}

/** PUT /customers/me — update current customer profile */
export async function updateProfile(
  payload: Partial<Omit<Customer, "id" | "createdAt">>
): Promise<Customer> {
  const { data } = await api.put<Customer>("/customers/me", payload);
  return data;
}

/** GET /customers/me/addresses — get saved addresses */
export async function getAddresses(): Promise<Address[]> {
  const { data } = await api.get<Address[]>("/customers/me/addresses");
  return data;
}

/** POST /customers/me/addresses — add new address */
export async function addAddress(
  address: Omit<Address, "id">
): Promise<Address> {
  const { data } = await api.post<Address>("/customers/me/addresses", address);
  return data;
}

/** PUT /customers/me/addresses/{id} — update address */
export async function updateAddress(
  id: number,
  address: Partial<Omit<Address, "id">>
): Promise<Address> {
  const { data } = await api.put<Address>(
    `/customers/me/addresses/${id}`,
    address
  );
  return data;
}

/** DELETE /customers/me/addresses/{id} — delete address */
export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/customers/me/addresses/${id}`);
}

/** GET /customers/me/orders — get customer's orders */
export async function getCustomerOrders(
  page = 1,
  pageSize = 10
): Promise<PaginatedResponse<OrderSummary>> {
  const { data } = await api.get<PaginatedResponse<OrderSummary>>(
    `/customers/me/orders?page=${page}&pageSize=${pageSize}`
  );
  return data;
}
