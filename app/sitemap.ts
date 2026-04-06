import { MetadataRoute } from "next";
import { baseUrl } from "lib/utils";

// TODO: Replace with actual REST API calls when backend is ready
// import { getCollections } from "@/services/rest-api/collections/collections";
// import { getProducts } from "@/services/rest-api/products/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routesMap = [""].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // TODO: Fetch from REST API when ready
  // const [collections, products] = await Promise.all([...]);
  // const fetchedRoutes = [...collections, ...products].map(...);

  return [...routesMap];
}