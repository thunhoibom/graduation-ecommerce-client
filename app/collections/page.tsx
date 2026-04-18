import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/services/rest-api/collections/collections";

export const metadata: Metadata = {
  title: "Bộ sưu tập — Mono Studio",
  description: "Khám phá tất cả bộ sưu tập thời trang tại Mono Studio.",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          Bộ sưu tập
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {collections.length} danh mục
        </p>
      </div>

      {collections.length === 0 ? (
        <div className="py-16 text-center text-neutral-500">
          <p>Chưa có bộ sưu tập nào.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {collections.map((col) => (
            <Link
              key={col.code}
              href={`/collections/${col.code}`}
              className="group block"
            >
              <div className="relative aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                {col.imageUrl ?? col.image?.url ? (
                  <Image
                    src={col.imageUrl ?? col.image!.url}
                    alt={col.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-neutral-300 dark:text-neutral-700">
                    {col.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                  {col.name}
                </p>
                {col.productCount !== undefined && (
                  <p className="text-xs text-neutral-500">
                    {col.productCount} sản phẩm
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
