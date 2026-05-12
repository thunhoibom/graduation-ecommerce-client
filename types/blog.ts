export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  thumbnailUrl?: string;
  status?: BlogStatus;
  authorName?: string;
  authorId?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
