import { cn } from "@/lib/utils";

interface ProductDiscountBadgeProps {
  discountPercent: number;
  className?: string;
}

export function ProductDiscountBadge({
  discountPercent,
  className,
}: ProductDiscountBadgeProps) {
  if (discountPercent <= 0) return null;

  return (
    <span
      className={cn(
        "absolute left-2 top-2 rounded-none bg-red-600 px-2 py-1 text-xs font-semibold text-white",
        className
      )}
    >
      -{discountPercent}%
    </span>
  );
}
