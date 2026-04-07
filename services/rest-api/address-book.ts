/**
 * Address Book REST API service
 * Connects to Spring Boot backend at http://localhost:8080
 *
 * OpenAPI endpoints (from apidocs.md):
 *   GET    /api/public/address-book              — list saved addresses
 *   POST   /api/public/address-book              — save new address
 *   GET    /api/public/address-book/{id}       — get single address
 *   PUT    /api/public/address-book/{id}        — replace address
 *   DELETE /api/public/address-book/{id}       — delete address
 *   PATCH  /api/public/address-book/{id}       — partial update address
 */

import { api } from "./app-api";
import type { AddressBookPojo } from "@/types/person";

/** GET /api/public/address-book — list all saved addresses */
export async function getAddressBook(): Promise<AddressBookPojo[]> {
  const { data } = await api.get<AddressBookPojo[]>("/api/public/address-book");
  return data ?? [];
}

/** POST /api/public/address-book — save new address */
export async function addAddress(
  address: AddressBookPojo
): Promise<AddressBookPojo> {
  const { data } = await api.post<AddressBookPojo>("/api/public/address-book", address);
  return data;
}

/** GET /api/public/address-book/{id} — get single address */
export async function getAddress(id: number): Promise<AddressBookPojo> {
  const { data } = await api.get<AddressBookPojo>(`/api/public/address-book/${id}`);
  return data;
}

/** PUT /api/public/address-book/{id} — replace address */
export async function updateAddress(
  id: number,
  address: AddressBookPojo
): Promise<AddressBookPojo> {
  const { data } = await api.put<AddressBookPojo>(
    `/api/public/address-book/${id}`,
    address
  );
  return data;
}

/** DELETE /api/public/address-book/{id} — delete address */
export async function deleteAddress(id: number): Promise<void> {
  await api.delete(`/api/public/address-book/${id}`);
}

/** PATCH /api/public/address-book/{id} — partial update address */
export async function patchAddress(
  id: number,
  fields: Partial<AddressBookPojo>
): Promise<AddressBookPojo> {
  const { data } = await api.patch<AddressBookPojo>(
    `/api/public/address-book/${id}`,
    fields
  );
  return data;
}
