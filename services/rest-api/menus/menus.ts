/**
 * Page / CMS REST API service
 */

import { api } from "../app-api";
import type { Page } from "@/types/common";

/** GET /pages — list all CMS pages */
export async function getPages(): Promise<Page[]> {
  const { data } = await api.get<Page[]>("/api/pages");
  return data;
}

/** GET /pages/{slug} — single CMS page by slug */
export async function getPage(slug: string): Promise<Page> {
  const { data } = await api.get<Page>(`/api/pages/${slug}`);
  return data;
}
