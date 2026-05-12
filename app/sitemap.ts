import { MetadataRoute } from "next";
import { baseUrl } from "lib/utils";
import { getBlogPosts } from "@/services/rest-api/blog/blog";

// TODO: Replace with actual REST API calls when backend is ready
// import { getCollections } from "@/services/rest-api/collections/collections";
// import { getProducts } from "@/services/rest-api/products/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = ["", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const result = await getBlogPosts({ page: 1, pageSize: 200 });
    for (const post of result.items ?? []) {
      if (!post.slug) continue;
      blogRoutes.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt ?? post.publishedAt ?? new Date().toISOString(),
      });
    }
  } catch {
    // Keep sitemap resilient even if blog API is unavailable.
  }

  return [...routesMap, ...blogRoutes];
}