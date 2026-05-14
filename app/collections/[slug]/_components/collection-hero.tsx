import Image from "next/image";
import type { Collection } from "@/types/collection";

interface CollectionHeroProps {
  collection: Collection;
}

export function CollectionHero({ collection }: CollectionHeroProps) {
  const imageUrl = collection.imageUrl ?? collection.image?.url;
  if (!imageUrl) return null;

  return (
    <div className="relative mb-6 aspect-[21/9] max-h-[280px] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <Image
        src={imageUrl}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
        aria-hidden
      />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">
          Bộ sưu tập
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
          {collection.name}
        </p>
      </div>
    </div>
  );
}
