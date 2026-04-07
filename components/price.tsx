import { cn } from "@/lib/utils";

interface PriceProps extends React.ComponentProps<"p"> {
  /** Amount in VND (integer) or formatted string */
  amount: number | string;
  currencyCode?: string;
  currencyCodeClassName?: string;
  /** Set true if amount is already formatted string */
  formatted?: boolean;
}

/**
 * Formats a VND amount for display.
 * Backend returns prices as integers (VND). This component formats them.
 */
function formatVND(amount: number | string): string {
  if (typeof amount === "string") {
    // Already formatted string — strip existing currency and reformat
    const numeric = parseFloat(amount.replace(/[^\d.]/g, ""));
    if (isNaN(numeric)) return amount;
    return new Intl.NumberFormat("vi-VN").format(numeric);
  }
  return new Intl.NumberFormat("vi-VN").format(amount);
}

export function Price({
  amount,
  className,
  currencyCode = "VND",
  currencyCodeClassName,
  formatted,
  ...props
}: PriceProps) {
  const displayAmount = formatted
    ? String(amount)
    : formatVND(amount);

  return (
    <p suppressHydrationWarning className={cn(className)} {...props}>
      {displayAmount}
      <span className={cn("ml-1", currencyCodeClassName)}>{currencyCode}</span>
    </p>
  );
}

export default Price;
