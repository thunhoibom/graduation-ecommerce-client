import { api } from "../app-api";
import type { PaginatedResponse } from "@/types/api";
import type { BlogPost } from "@/types/blog";

export interface BlogFilters {
  query?: string;
  page?: number;
  pageSize?: number;
}

export async function getBlogPosts(filters: BlogFilters = {}): Promise<PaginatedResponse<BlogPost>> {
  const params: Record<string, string> = {};
  if (filters.query) params["title"] = filters.query;
  if (filters.page != null) params["pageIndex"] = String(Math.max(0, filters.page - 1));
  if (filters.pageSize != null) params["pageSize"] = String(filters.pageSize);
  params["sortBy"] = "publishedAt";
  params["order"] = "desc";

  const { data } = await api.get<PaginatedResponse<BlogPost>>("/api/public/blog", { params });
  return data;
}

export async function searchBlogPosts(filters: BlogFilters = {}): Promise<PaginatedResponse<BlogPost>> {
  const params: Record<string, string> = {};
  if (filters.query) params["q"] = filters.query;
  if (filters.page != null) params["pageIndex"] = String(Math.max(0, filters.page - 1));
  if (filters.pageSize != null) params["pageSize"] = String(filters.pageSize);
  const { data } = await api.get<PaginatedResponse<BlogPost>>("/api/public/blog/search", { params });
  return data;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  const { data } = await api.get<BlogPost>(`/api/public/blog/${slug}`);
  return data;
}

export async function getRelatedBlogPosts(slug: string, limit = 6): Promise<BlogPost[]> {
  const { data } = await api.get<BlogPost[]>(`/api/public/blog/${slug}/related`, {
    params: { limit },
  });
  return data;
}
