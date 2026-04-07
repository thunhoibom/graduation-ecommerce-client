import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/services/rest-api/collections/collections";
import { Card, CardContent } from "@/components/ui/card";
import type { CollectionListItem } from "@/types/collection";

export async function CollectionsGrid() {
  const collections = await getCollections();

  if (!collections?.length) return null;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            Bộ sưu tập
          </h2>
          <Link
            href="/collection/all"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {collections.map((col: CollectionListItem) => (
            <Link key={col.id} href={`/collection/${col.slug}`} className="group">
              <Card className="overflow-hidden border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-shadow">
                <CardContent className="p-0 aspect-square relative bg-neutral-100 dark:bg-neutral-900">
                  {col.image?.url ? (
                    <Image
                      src={col.image.url}
                      alt={col.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-100 dark:bg-neutral-900">
                      <span className="text-3xl font-bold tracking-tight text-neutral-300 dark:text-neutral-700">
                        {col.name.charAt(0)}
                      </span>
                      <span className="text-xs text-neutral-400 dark:text-neutral-600">
                        {col.name}
                      </span>
                    </div>
                  )}
                </CardContent>
                <div className="border-t border-neutral-100 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                    {col.name}
                  </p>
                  {col.productCount !== undefined && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {col.productCount} sản phẩm
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
