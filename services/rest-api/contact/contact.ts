/**
 * Public contact form — POST /api/public/contact
 */

import { api } from "../app-api";

export type ContactSubjectCode =
  | "order"
  | "product"
  | "return"
  | "cooperation"
  | "feedback"
  | "other";

export interface ContactInquiryPayload {
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubjectCode | string;
  message: string;
}

export interface ContactInquiryCreatedResponse {
  id: number;
}

export async function postContactInquiry(
  payload: ContactInquiryPayload
): Promise<ContactInquiryCreatedResponse> {
  const body = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone?.trim() ?? "",
    subject: payload.subject,
    message: payload.message.trim(),
  };
  const { data } = await api.post<ContactInquiryCreatedResponse>(
    "/api/public/contact",
    body
  );
  return data;
}
