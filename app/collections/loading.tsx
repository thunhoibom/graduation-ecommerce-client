import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 lg:px-6">
      {/* Hero skeleton */}
      <section className="relative w-full overflow-hidden bg-neutral-50 dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          <div className="max-w-xl space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </div>
        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800" />
      </section>

      {/* Category grid skeleton */}
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-2 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
