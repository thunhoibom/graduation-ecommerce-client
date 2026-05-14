import { formatMoney } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ResolvedProductCardPricing } from "@/lib/product-pricing";

interface ProductCardPriceProps {
  pricing: ResolvedProductCardPricing;
  className?: string;
  currentClassName?: string;
  originalClassName?: string;
}

export function ProductCardPrice({
  pricing,
  className,
  currentClassName,
  originalClassName,
}: ProductCardPriceProps) {
  const { currentPrice, originalPrice, hasDiscount } = pricing;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <p
        className={cn(
          "text-sm font-semibold text-neutral-900 dark:text-white",
          currentClassName
        )}
      >
        {formatMoney(currentPrice)}
      </p>
      {hasDiscount ? (
        <p
          className={cn(
            "text-xs text-neutral-500 line-through dark:text-neutral-400",
            originalClassName
          )}
        >
          {formatMoney(originalPrice)}
        </p>
      ) : null}
    </div>
  );
}
