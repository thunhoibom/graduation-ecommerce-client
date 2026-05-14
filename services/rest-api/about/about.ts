/**
 * About / Company Details REST API service
 *
 * Backend: GET /api/public/about
 * Returns: CompanyDetailsPojo — singleton company info (name, description, logo, banner, contact)
 */

import { api } from "../app-api";

export interface CompanyDetailsPojo {
  name?: string;
  description?: string;
  tagline?: string;
  bannerImageURL?: string;
  bannerImageURLs?: string[];
  logoImageURL?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: Record<string, string>;
  maintenanceMode?: boolean;
}

export async function getAbout(): Promise<CompanyDetailsPojo> {
  const { data } = await api.get<CompanyDetailsPojo>("/api/public/about");
  return data;
}
