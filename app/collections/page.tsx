import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategoryTree } from "@/services/rest-api/collections/collections";
import { Badge } from "@/components/ui/badge";
import type { Collection } from "@/types/collection";

export const metadata: Metadata = {
  title: "Bộ sưu tập — Mono Studio",
  description: "Khám phá tất cả bộ sưu tập thời trang tại Mono Studio.",
};

// ISR — revalidate every hour
export const revalidate = 3600;

export default async function CollectionsPage() {
  let collections: Collection[] = [];
  try {
    collections = await getCategoryTree();
  } catch (error) {
    console.error("Failed to fetch collections:", error);
  }

  const totalProducts = (collections || []).reduce((sum, c) => sum + (c.productCount ?? 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
      {/* ── Hero banner ────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-neutral-50 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Mono Studio — 2026
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl">
              Bộ sưu tập
            </h1>
            <p className="mt-3 line-clamp-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400 md:text-lg">
              Mỗi bộ sưu tập là một tuyên ngôn về phong cách sống. Khám phá{" "}
              {collections.length} danh mục với {totalProducts} sản phẩm được
              tuyển chọn kỹ lưỡng.
            </p>
          </div>
        </div>
        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
      </section>

      {/* ── Category grid ───────────────────────────────────────────── */}
      {collections.length === 0 ? (
        <div className="py-16 text-center text-neutral-500">
          <p>Chưa có bộ sưu tập nào.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {collections.map((col) => (
            <CollectionCard key={col.code} collection={col} />
          ))}
        </div>
      )}
    </div>
  );
}

function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/collections/${collection.code}`} className="group block">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        {collection.imageUrl ?? collection.image?.url ? (
          <Image
            src={collection.imageUrl ?? collection.image!.url}
            alt={collection.name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2">
            <span className="text-3xl font-bold tracking-tight text-neutral-300 dark:text-neutral-700">
              {collection.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Product count badge — overlay bottom-right */}
        {collection.productCount !== undefined && (
          <div className="absolute bottom-2 right-2">
            <Badge
              variant="secondary"
              className="bg-white/90 text-neutral-900 dark:bg-black/70 dark:text-white"
            >
              {collection.productCount} sản phẩm
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2">
        <p className="text-sm font-medium text-neutral-900 dark:text-white">
          {collection.name}
        </p>
      </div>
    </Link>
  );
}
