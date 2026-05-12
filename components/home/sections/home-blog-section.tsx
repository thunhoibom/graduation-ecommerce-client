/**
 * HomeBlogSection — Server Component
 * Latest published posts for the storefront homepage (mirrors Đáng chú ý / carousel pattern).
 */

import { getBlogPosts } from "@/services/rest-api/blog/blog";
import type { BlogPost } from "@/types/blog";
import { HomeBlogSectionClient } from "./home-blog-section-client";

export async function HomeBlogSection() {
  let posts: BlogPost[] = [];
  try {
    const data = await getBlogPosts({ page: 1, pageSize: 8 });
    posts = data.items ?? [];
  } catch {
    return null;
  }

  if (!posts.length) return null;

  return <HomeBlogSectionClient posts={posts} />;
}
