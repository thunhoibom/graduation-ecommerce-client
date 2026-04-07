import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getCollection,
  getCollectionProducts,
} from "@/services/rest-api/collections/collections";
import { ProductGrid } from "./_components/product-grid";
import { CollectionHeader } from "./_components/collection-header";
import type { ProductFilters } from "@/services/rest-api/products/products";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sortBy?: string; sortDir?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const collection = await getCollection(slug);
    return {
      title: collection.name,
      description: collection.description,
    };
  } catch {
    return { title: "Bộ sưu tập" };
  }
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageStr, sortBy, sortDir } = await searchParams;
  const page = pageStr ? parseInt(pageStr) : 1;

  let collection;
  try {
    collection = await getCollection(slug);
  } catch {
    notFound();
  }

  const filters: ProductFilters = {
    category: slug,
    page,
    pageSize: 24,
    sortBy: sortBy ?? "name",
    sortDir: (sortDir as "asc" | "desc") ?? "asc",
  };

  const { items: products, totalCount, pageIndex } = await getCollectionProducts(slug, filters);

  const totalPages = Math.ceil((totalCount ?? 0) / 24);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <CollectionHeader
        collection={collection}
        totalCount={totalCount ?? 0}
        sortBy={sortBy ?? "name"}
        sortDir={sortDir ?? "asc"}
      />
      <ProductGrid
        products={products}
        page={pageIndex ?? page}
        totalPages={totalPages}
        sortBy={sortBy ?? "name"}
        sortDir={sortDir ?? "asc"}
        collectionSlug={slug}
      />
    </div>
  );
}
