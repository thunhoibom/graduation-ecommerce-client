export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-6 h-6 w-24 animate-pulse rounded-none bg-neutral-200 dark:bg-neutral-800" />
      <div className="mb-6 h-12 w-full animate-pulse rounded-none border border-neutral-200 dark:border-neutral-800" />
      <div className="mb-6 flex items-center justify-between">
        <div className="h-4 w-48 animate-pulse rounded-none bg-neutral-200 dark:bg-neutral-800" />
        <div className="h-9 w-40 animate-pulse rounded-none border border-neutral-200 dark:border-neutral-800" />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array(12)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="animate-pulse space-y-2"
            >
              <div className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-3 w-16 animate-pulse rounded-none bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-4 w-full animate-pulse rounded-none bg-neutral-100 dark:bg-neutral-800" />
              <div className="h-4 w-20 animate-pulse rounded-none bg-neutral-100 dark:bg-neutral-800" />
            </div>
          ))}
      </div>
    </div>
  );
}
